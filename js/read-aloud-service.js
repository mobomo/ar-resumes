// Read Aloud Service - Mobile-friendly text-to-speech implementation
// Based on the strategy from speak.html

// Cache for available voices
let cachedVoices = [];

// Initialize voices when the service is loaded
if (typeof window !== 'undefined' && window.speechSynthesis) {
    // Try to get voices immediately
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
        cachedVoices = voices;
        // console.log("Voices loaded immediately:", voices.length);
    }
    
    // Set up event listener for when voices change/become available
    window.speechSynthesis.onvoiceschanged = () => {
        const updatedVoices = window.speechSynthesis.getVoices();
        cachedVoices = updatedVoices;
        // console.log("Voices changed, now available:", updatedVoices.length);
    };
}

/**
 * Speaks long text reliably on mobile browsers by breaking it into smaller chunks
 * @param {string} text - The text to speak
 * @param {number} chunkLength - Optional custom chunk length (defaults based on device)
 * @param {Object} options - Additional options for speech
 * @returns {boolean} - Whether speech was successfully started
 */
export function speakLongText(text, chunkLength = null, options = {}) {
    const synth = window.speechSynthesis;
    if (!synth) {
        // console.error("Speech synthesis not available");
        return false;
    }

    // Cancel any ongoing speech
    synth.cancel();

    // Detect browser and device for optimal settings
    const browser = detectBrowser();
    
    // Set appropriate chunk length based on device if not specified
    if (chunkLength === null) {
        if (browser.isiOS) {
            chunkLength = 500; // Larger chunks for iOS
        } else if (browser.isMobile) {
            chunkLength = 500; // Larger chunks for other mobile
        } else if (browser.isChrome) {
            chunkLength = 600; // Larger chunks specifically for Chrome desktop
        } else {
            chunkLength = 700; // Largest chunks for other desktop browsers
        }
    }
    
    // Ensure chunk length is large enough to handle contact information with URLs
    chunkLength = Math.max(chunkLength, 500);
    
    // If the text contains contact information, use an even larger chunk size
    if (text.includes("Contact information:")) {
        chunkLength = Math.max(chunkLength, 1000);
        // console.log("Contact information detected, using larger chunk size:", chunkLength);
    }
    
    // console.log(`Speaking text with chunk length: ${chunkLength} for ${browser.isiOS ? 'iOS' : (browser.isMobile ? 'mobile' : 'desktop')}`);
    
    // Split text into manageable chunks, prioritizing natural speech pauses
    const chunks = [];
    
    // Simple approach: just use the original text
    let processedText = text;
    
    // Log the original text for debugging
    // console.log("Original text:", text.substring(0, 200) + (text.length > 200 ? "..." : ""));
    
    // First, try to split at sentence boundaries
    // Only consider periods, exclamation marks, and question marks followed by whitespace or end of string as sentence endings
    const sentenceRegex = /[^.!?]+[.!?]+(?=\s|$)/g;
    const sentences = [];
    let match;
    let lastIndex = 0;
    
    // Find all sentences that end with punctuation
    while ((match = sentenceRegex.exec(processedText)) !== null) {
        sentences.push(match[0]);
        lastIndex = match.index + match[0].length;
    }
    
    // Check if there's any remaining text after the last sentence
    if (lastIndex < processedText.length) {
        const remainingText = processedText.substring(lastIndex).trim();
        if (remainingText) {
            sentences.push(remainingText);
        }
    }
    
    // console.log("Sentences detected:", sentences.length);
    // if (sentences.length > 0) {
    //     console.log("Last sentence:", sentences[sentences.length - 1].substring(0, 100));
    // }
    
    // If we couldn't find any sentence boundaries, try to split at phrase boundaries (commas, semicolons)
    // then fall back to word boundaries
    if (sentences.length === 0) {
        // Try to split at phrase boundaries first
        // Only consider commas, semicolons, and colons followed by whitespace as phrase endings
        const phraseRegex = /[^,;:]+[,;:]+(?=\s|$)/g;
        const phrases = [];
        let phraseMatch;
        let phraseLastIndex = 0;
        
        // Find all phrases that end with punctuation
        while ((phraseMatch = phraseRegex.exec(text)) !== null) {
            phrases.push(phraseMatch[0]);
            phraseLastIndex = phraseMatch.index + phraseMatch[0].length;
        }
        
        // Check if there's any remaining text after the last phrase
        if (phraseLastIndex < text.length) {
            const remainingText = text.substring(phraseLastIndex).trim();
            if (remainingText) {
                phrases.push(remainingText);
            }
        }
        
        // console.log("Phrases detected:", phrases.length);
        // if (phrases.length > 0) {
        //     console.log("Last phrase:", phrases[phrases.length - 1].substring(0, 100));
        // }
        
        if (phrases.length > 0) {
            // Process phrases similar to sentences
            let currentChunk = '';
            
            for (const phrase of phrases) {
                // If this phrase would fit in the current chunk
                if (currentChunk.length + phrase.length <= chunkLength) {
                    currentChunk += phrase;
                } else {
                    // Start a new chunk
                    if (currentChunk) {
                        chunks.push(currentChunk);
                    }
                    
                    // If the phrase itself is too long, split it at word boundaries
                    if (phrase.length > chunkLength) {
                        const words = phrase.split(/\s+/);
                        let phraseChunk = '';
                        
                        for (const word of words) {
                            if (phraseChunk && (phraseChunk.length + word.length + 1) > chunkLength) {
                                chunks.push(phraseChunk);
                                phraseChunk = word;
                            } else {
                                phraseChunk += (phraseChunk ? ' ' : '') + word;
                            }
                        }
                        
                        // Add the last part of the split phrase
                        currentChunk = phraseChunk || '';
                    } else {
                        currentChunk = phrase;
                    }
                }
            }
            
            // Add the last chunk if there's anything left
            if (currentChunk) {
                chunks.push(currentChunk);
            }
        } else {
            // Fall back to word boundaries if no phrases found
            const words = text.split(/\s+/);
            let currentChunk = '';
            
            for (const word of words) {
                // If adding this word would exceed the chunk length and we already have content
                if (currentChunk && (currentChunk.length + word.length + 1) > chunkLength) {
                    chunks.push(currentChunk);
                    currentChunk = word;
                } else {
                    // Add a space before the word if it's not the first word in the chunk
                    currentChunk += (currentChunk ? ' ' : '') + word;
                }
            }
            
            // Add the last chunk if there's anything left
            if (currentChunk) {
                chunks.push(currentChunk);
            }
        }
    } else {
        // Process sentences, combining short ones and splitting long ones
        let currentChunk = '';
        
        for (const sentence of sentences) {
            // If this sentence would fit in the current chunk
            if (currentChunk.length + sentence.length <= chunkLength) {
                currentChunk += sentence;
            }
            // If this sentence alone exceeds the chunk length, we need to split it at phrase boundaries
            else if (sentence.length > chunkLength) {
                // First, add any accumulated chunk
                if (currentChunk) {
                    chunks.push(currentChunk);
                    currentChunk = '';
                }
                
                // Try to split the long sentence at phrase boundaries first
                // Only consider commas, semicolons, and colons followed by whitespace as phrase endings
                const phraseRegex = /[^,;:]+[,;:]+(?=\s|$)/g;
                const phrases = [];
                let phraseMatch;
                let phraseLastIndex = 0;
                
                // Find all phrases that end with punctuation
                while ((phraseMatch = phraseRegex.exec(sentence)) !== null) {
                    phrases.push(phraseMatch[0]);
                    phraseLastIndex = phraseMatch.index + phraseMatch[0].length;
                }
                
                // Check if there's any remaining text after the last phrase
                if (phraseLastIndex < sentence.length) {
                    const remainingText = sentence.substring(phraseLastIndex).trim();
                    if (remainingText) {
                        phrases.push(remainingText);
                    }
                }
                
                // console.log("Long sentence phrases detected:", phrases.length);
                
                if (phrases.length > 0) {
                    let sentenceChunk = '';
                    
                    for (const phrase of phrases) {
                        if (sentenceChunk && (sentenceChunk.length + phrase.length) > chunkLength) {
                            chunks.push(sentenceChunk);
                            sentenceChunk = phrase;
                        } else {
                            sentenceChunk += phrase;
                        }
                    }
                    
                    // Add the last part of the split sentence
                    if (sentenceChunk) {
                        // Push the last part directly to chunks if it's substantial
                        // This ensures we don't lose the last chunk
                        if (sentenceChunk.length > chunkLength / 2) {
                            chunks.push(sentenceChunk);
                            currentChunk = '';
                        } else {
                            currentChunk = sentenceChunk;
                        }
                    }
                } else {
                    // Fall back to word boundaries if no phrases found
                    const words = sentence.split(/\s+/);
                    let sentenceChunk = '';
                    
                    for (const word of words) {
                        if (sentenceChunk && (sentenceChunk.length + word.length + 1) > chunkLength) {
                            chunks.push(sentenceChunk);
                            sentenceChunk = word;
                        } else {
                            sentenceChunk += (sentenceChunk ? ' ' : '') + word;
                        }
                    }
                    
                    // Add the last part of the split sentence
                    if (sentenceChunk) {
                        // Push the last part directly to chunks if it's substantial
                        // This ensures we don't lose the last chunk
                        if (sentenceChunk.length > chunkLength / 2) {
                            chunks.push(sentenceChunk);
                            currentChunk = '';
                        } else {
                            currentChunk = sentenceChunk;
                        }
                    }
                }
            }
            // If adding this sentence would exceed the chunk length, start a new chunk
            else {
                if (currentChunk) {
                    chunks.push(currentChunk);
                }
                currentChunk = sentence;
            }
        }
        
        // Add the last chunk if there's anything left
        if (currentChunk) {
            chunks.push(currentChunk);
        }
    }
    
    // Optimize chunks to minimize pauses:
    // 1. Try to end chunks at natural pause points (periods, commas)
    // 2. Try to avoid breaking in the middle of phrases
    for (let i = 0; i < chunks.length - 1; i++) {
        const currentChunk = chunks[i];
        const nextChunk = chunks[i + 1];
        
        // If the current chunk doesn't end with a natural pause and the next chunk starts with a lowercase letter
        // (indicating it might be a continuation), try to rebalance
        if (!/[.!?,;:]$/.test(currentChunk.trim()) && /^[a-z]/.test(nextChunk.trim())) {
            // Find a good break point near the end of the current chunk
            const lastPeriodPos = currentChunk.lastIndexOf('.');
            const lastCommaPos = currentChunk.lastIndexOf(',');
            const lastSemicolonPos = currentChunk.lastIndexOf(';');
            
            // Find the best break point that's not too close to the beginning
            const minBreakPos = Math.floor(currentChunk.length * 0.5); // At least halfway through
            const breakCandidates = [lastPeriodPos, lastCommaPos, lastSemicolonPos]
                .filter(pos => pos > minBreakPos);
            
            if (breakCandidates.length > 0) {
                // Find the rightmost break point
                const breakPos = Math.max(...breakCandidates);
                
                // Move text after the break point to the next chunk
                const textToMove = currentChunk.substring(breakPos + 1);
                chunks[i] = currentChunk.substring(0, breakPos + 1);
                chunks[i + 1] = textToMove + (textToMove ? ' ' : '') + nextChunk;
            }
        }
    }
    
    // console.log(`Split into ${chunks.length} chunks`);
    
    // Try to select a male voice
    let selectedVoice = null;
    try {
        // Use our cached voices first, or try to get them directly
        const voices = cachedVoices.length > 0 ? cachedVoices : synth.getVoices();
        
        if (voices && voices.length > 0) {
            // console.log(`Available voices: ${voices.length}`);
            
            // Log all available voices for debugging
            // voices.forEach(voice => {
            //     console.log(`Voice: ${voice.name}, Lang: ${voice.lang}, Local: ${voice.localService}`);
            // });
            
            // First try to find a male voice
            const maleVoices = voices.filter(voice =>
                voice.name.toLowerCase().includes('male') ||
                voice.name.includes('Daniel') ||
                voice.name.includes('David') ||
                voice.name.includes('Google UK English Male') ||
                voice.name.includes('Microsoft David') ||
                voice.name.includes('Microsoft Mark') ||
                voice.name.includes('Microsoft Guy') ||
                voice.name.includes('Alex')
            );
            
            if (maleVoices.length > 0) {
                selectedVoice = maleVoices[0];
                // console.log(`Selected male voice: ${selectedVoice.name}`);
            } else {
                // If no male voice found, try to find an English voice
                const englishVoices = voices.filter(v =>
                    v.lang && (v.lang.startsWith('en-') || v.lang.startsWith('en_'))
                );
                
                if (englishVoices.length > 0) {
                    selectedVoice = englishVoices[0];
                    // console.log(`Selected English voice: ${selectedVoice.name}`);
                } else if (voices.length > 0) {
                    // Last resort: use the first available voice
                    selectedVoice = voices[0];
                    // console.log(`Selected first available voice: ${selectedVoice.name}`);
                }
            }
        } else {
            // console.log("No voices available yet, will use default voice");
            
            // Set up a listener for future voice loading if we don't have voices yet
            if (typeof window !== 'undefined' && window.speechSynthesis && !cachedVoices.length) {
                window.speechSynthesis.onvoiceschanged = () => {
                    cachedVoices = window.speechSynthesis.getVoices();
                    // console.log("Voices now available:", cachedVoices.length);
                };
            }
        }
    } catch (e) {
        // console.error("Error selecting voice:", e);
    }
    
    // Add the selected voice to options
    if (selectedVoice) {
        options.voice = selectedVoice;
    }
    
    // Start the keep-alive mechanism for mobile devices
    const keepAliveController = startKeepAlive(browser);
    
    // Track retry attempts for each chunk
    const retryAttempts = new Array(chunks.length).fill(0);
    const MAX_RETRIES = 3; // Maximum number of retries per chunk
    
    // Function to speak chunks sequentially with minimal pauses
    function speakChunks(index, isRetry = false) {
        if (index >= chunks.length) {
            // console.log("Reached end of chunk list - scheduling complete");
            // We don't clear keepAlive or call onComplete here
            // That will happen in the onend handler of the last chunk
            // This fixes the issue where the last chunk doesn't get spoken
            
            return; // Finished scheduling all chunks
        }
        
        // If we've exceeded max retries for this chunk, move to the next one
        if (retryAttempts[index] > MAX_RETRIES) {
            // console.warn(`Exceeded maximum retries (${MAX_RETRIES}) for chunk ${index+1}, skipping to next chunk`);
            speakChunks(index + 1);
            return;
        }
        
        // Increment retry counter if this is a retry attempt
        if (isRetry) {
            retryAttempts[index]++;
            // console.log(`Retry attempt ${retryAttempts[index]}/${MAX_RETRIES} for chunk ${index+1}`);
        }
        
        // console.log(`Speaking chunk ${index+1}/${chunks.length}:","${chunks[index].substring(0, 120)}..."`);
        
        // Use the chunk directly - no need for replacements with our simpler approach
        const chunkToSpeak = chunks[index];
        const utterance = new SpeechSynthesisUtterance(chunkToSpeak);
        
        // Apply voice settings if provided
        if (options.voice) utterance.voice = options.voice;
        
        // Set consistent properties for all devices
        utterance.lang = options.lang || 'en-US';
        utterance.rate = options.rate || 1.2;
        utterance.pitch = options.pitch || 0.9;
        utterance.volume = options.volume || 1.0;
        
        // When this chunk ends, move to the next one
        utterance.onend = () => {
            // console.log(`Chunk ${index+1}/${chunks.length} completed`);
            
            // Check if this is the last chunk
            const isLastChunk = (index === chunks.length - 1);
            
            if (isLastChunk) {
                // console.log("Last chunk completed, finalizing speech");
                keepAliveController.clearAll();
                
                // Explicitly call onComplete when the last chunk ends
                if (options.onComplete) {
                    options.onComplete();
                }
                return;
            }
            
            // Minimize pauses between chunks while maintaining reliability
            // Use minimal delays that still prevent Chrome from cutting off speech
            const nextChunkDelay = browser.isChrome ? 50 : 10;
            
            // Use a more sophisticated approach to minimize pauses:
            // Queue the next chunk immediately but with a tiny delay to prevent browser issues
            setTimeout(() => {
                // Pre-create the next utterance to have it ready
                if (index + 1 < chunks.length) {
                    // Create the next utterance in advance to minimize delay
                    // Use the chunk directly - no need for replacements with our simpler approach
                    const nextChunkToSpeak = chunks[index + 1];
                    const nextUtterance = new SpeechSynthesisUtterance(nextChunkToSpeak);
                    
                    // Apply the same voice settings
                    if (options.voice) nextUtterance.voice = options.voice;
                    nextUtterance.lang = options.lang || 'en-US';
                    nextUtterance.rate = options.rate || 1.0;
                    nextUtterance.pitch = options.pitch || 1.0;
                    nextUtterance.volume = options.volume || 1.0;
                    
                    // Set its priority to high (non-standard but supported in some browsers)
                    if (typeof nextUtterance.priority !== 'undefined') {
                        nextUtterance.priority = 'high';
                    }
                }
                
                // Move to the next chunk
                speakChunks(index + 1);
            }, nextChunkDelay);
        };
        
        // Handle errors by moving to the next chunk with better recovery
        utterance.onerror = (event) => {
            // console.error(`Error speaking chunk ${index+1}/${chunks.length}:`, event);
            
            // Check if this is the last chunk
            const isLastChunk = (index === chunks.length - 1);
            
            if (isLastChunk) {
                // console.log("Error on last chunk, finalizing speech");
                keepAliveController.clearAll();
                
                // Call onComplete even on error for the last chunk
                if (options.onComplete) {
                    options.onComplete();
                }
                return;
            }
            
            // Special handling for interrupted errors
            if (event.error === 'interrupted') {
                // console.log("Speech was interrupted, attempting recovery");
                
                // Cancel any ongoing speech and reset the synthesis engine
                window.speechSynthesis.cancel();
                
                // Use a longer timeout for interrupted errors to ensure the speech engine has time to reset
                setTimeout(() => {
                    // Try to resume from the current chunk again with retry flag
                    speakChunks(index, true);
                }, 500);
                return;
            }
            
            // If speech synthesis seems to be in a bad state, try to reset it
            if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
                window.speechSynthesis.cancel();
                
                // Give the speech synthesis a moment to reset
                setTimeout(() => {
                    // If we haven't exceeded max retries, try the current chunk again
                    if (retryAttempts[index] < MAX_RETRIES) {
                        speakChunks(index, true);
                    } else {
                        // Move to the next chunk if we've exceeded retries
                        speakChunks(index + 1);
                    }
                }, 300); // Longer timeout for recovery
            } else {
                // Just move to the next chunk if speech synthesis seems okay
                setTimeout(() => speakChunks(index + 1), 150);
            }
        };
        
        // Speak the current chunk
        synth.speak(utterance);
    }
    
    // Start with the first chunk (not a retry)
    speakChunks(0, false);
    return true;
}

/**
 * Stops any ongoing speech immediately
 * Call this when user presses microphone button or performs any action
 * that should interrupt speech immediately
 */
export function stopSpeaking() {
    if (window.speechSynthesis) {
        // Cancel any ongoing speech synthesis
        window.speechSynthesis.cancel();
        
        // Clear any active keep-alive intervals that might be running
        if (window._speechKeepAliveControllers) {
            window._speechKeepAliveControllers.forEach(controller => {
                if (controller && typeof controller.clearAll === 'function') {
                    controller.clearAll();
                }
            });
            window._speechKeepAliveControllers = [];
        }
        
        // console.log("Speech interrupted by user action");
    }
}

// Add page unload handler to stop speech when user navigates away
if (typeof window !== 'undefined') {
    // Store the original function reference if it exists
    const originalBeforeUnload = window.onbeforeunload;
    
    window.onbeforeunload = function(event) {
        // Stop any ongoing speech
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        
        // Call the original handler if it exists
        if (typeof originalBeforeUnload === 'function') {
            return originalBeforeUnload(event);
        }
    };
    
    // Also handle the visibilitychange event for when the page is hidden
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden') {
            // Stop speech when the page is hidden (user switches tabs or minimizes)
            stopSpeaking();
        }
    });
}

/**
 * Detects browser and device information
 * @returns {Object} Browser and device information
 */
function detectBrowser() {
    const ua = navigator.userAgent;
    const isAndroid = /Android/.test(ua);
    const isiOS = /iPad|iPhone|iPod/.test(ua);
    const isMobile = /Mobi|Android/i.test(ua);
    const isChrome = /Chrome/.test(ua) && !/Edg/.test(ua) && !/OPR/.test(ua);
    
    return {
        isChrome: isChrome,
        isFirefox: /Firefox/.test(ua),
        isSafari: /Safari/.test(ua) && !/Chrome/.test(ua),
        isEdge: /Edg/.test(ua),
        isOpera: /OPR/.test(ua),
        isAndroid: isAndroid,
        isiOS: isiOS,
        isMobile: isMobile,
        // Add specific combinations for easier checks
        isChromeAndroid: isChrome && isAndroid,
        isChromeIOS: isChrome && isiOS,
        isChromeMobile: isChrome && isMobile
    };
}

/**
 * Creates and manages keep-alive intervals for speech synthesis
 * @param {Object} browser - Browser detection object
 * @returns {Object} Controller with methods to manage keep-alive intervals
 */
function startKeepAlive(browser) {
    const intervals = [];
    
    // Set appropriate keep-alive interval based on device
    // Use shorter intervals for all browsers to prevent Chrome from cutting off speech
    let keepAliveInterval = 800; // Default: 800ms for desktop (reduced from 1s)
    
    if (browser.isMobile) {
        keepAliveInterval = 600; // 600ms for mobile generally (reduced from 800ms)
        
        if (browser.isiOS) {
            keepAliveInterval = 400; // 400ms for iOS (reduced from 500ms)
        }
    }
    
    // Use even shorter intervals for Chrome which is more prone to interruptions
    if (browser.isChrome) {
        keepAliveInterval = Math.max(300, keepAliveInterval - 200);
    }
    
    // console.log(`Setting keep-alive interval to ${keepAliveInterval}ms for ${browser.isiOS ? 'iOS' : (browser.isMobile ? 'mobile' : 'desktop')}`);
    
    // Standard interval-based keep-alive for all browsers
    const intervalId = setInterval(() => {
        if (window.speechSynthesis.speaking) {
            // console.log(`Running speech keep-alive for ${browser.isiOS ? 'iOS' : (browser.isMobile ? 'mobile' : 'desktop')}`);
            
            // For Chrome, use a more gentle approach that's less likely to interrupt speech
            if (browser.isChrome) {
                // Create a tiny utterance to keep the speech engine alive without pausing current speech
                const keepAliveUtterance = new SpeechSynthesisUtterance('');
                keepAliveUtterance.volume = 0; // Silent
                keepAliveUtterance.rate = 16; // Fast as possible
                window.speechSynthesis.speak(keepAliveUtterance);
            } else {
                // For other browsers, use the traditional pause/resume approach
                window.speechSynthesis.pause();
                window.speechSynthesis.resume();
            }
        } else {
            clearInterval(intervalId);
            const index = intervals.indexOf(intervalId);
            if (index > -1) {
                intervals.splice(index, 1);
            }
        }
    }, keepAliveInterval);
    
    intervals.push(intervalId);
    
    // Add a second, staggered keep-alive for more reliability
    // This creates an overlapping pattern of keep-alives
    const staggeredIntervalId = setInterval(() => {
        if (window.speechSynthesis.speaking) {
            // For Chrome, use the silent utterance approach
            if (browser.isChrome) {
                const keepAliveUtterance = new SpeechSynthesisUtterance('');
                keepAliveUtterance.volume = 0;
                keepAliveUtterance.rate = 16;
                window.speechSynthesis.speak(keepAliveUtterance);
            }
        } else {
            clearInterval(staggeredIntervalId);
            const index = intervals.indexOf(staggeredIntervalId);
            if (index > -1) {
                intervals.splice(index, 1);
            }
        }
    }, keepAliveInterval * 1.5); // Stagger the second interval
    
    intervals.push(staggeredIntervalId);
    
    // Create the controller object
    const controller = {
        clearInterval: (id) => {
            clearInterval(id);
            const index = intervals.indexOf(id);
            if (index > -1) {
                intervals.splice(index, 1);
            }
        },
        clearAll: () => {
            intervals.forEach(id => clearInterval(id));
            intervals.length = 0;
        }
    };
    
    // Store the controller in a global array for access by stopSpeaking
    if (typeof window !== 'undefined') {
        if (!window._speechKeepAliveControllers) {
            window._speechKeepAliveControllers = [];
        }
        window._speechKeepAliveControllers.push(controller);
    }
    
    return controller;
}