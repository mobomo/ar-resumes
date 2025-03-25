// Import modules
import { speakLongText, stopSpeaking } from './read-aloud-service.js';

document.addEventListener('DOMContentLoaded', () => {
    const micButton = document.getElementById('microphone');
    const resultDiv = document.getElementById('result');
    const fullnameElement = document.getElementById('fullname');
    
    // Make text-to-speech functions globally available
    window.speakText = speakLongText;
    window.stopSpeaking = stopSpeaking;
    
    // Set the full name from resume data if available
    function setFullName() {
        if (typeof resumeData !== 'undefined' && resumeData.name) {
            fullnameElement.textContent = resumeData.name;
            document.title = `${resumeData.name} - Interactive Resume`;
        } else {
            // Set a default name if resume data is not available yet
            fullnameElement.textContent = "Resume";
            
            // Try again after resume data is loaded
            setTimeout(() => {
                if (typeof resumeData !== 'undefined' && resumeData.name) {
                    fullnameElement.textContent = resumeData.name;
                    document.title = `${resumeData.name} - Interactive Resume`;
                }
            }, 500);
        }
    }
    
    // Call the function to set the full name
    setFullName();
    
    // Safely start recognition, handling "already started" errors
    function safelyStartRecognition() {
        try {
            recognition.start();
            isRecording = true;
            micButton.classList.add('recording');
            // console.log('Recognition started successfully');
        } catch (error) {
            // Already running error is expected and can be ignored
            if (error.name === 'InvalidStateError' && error.message.includes('already started')) {
                // console.log('Recognition already running, continuing');
                isRecording = true;
                micButton.classList.add('recording');
            } else {
                // For other errors, try to restart
                // console.error('Error starting speech recognition:', error);
                try {
                    // Try to stop first in case it's in a bad state
                    recognition.stop();
                    setTimeout(() => {
                        // Then try to restart
                        recognition.start();
                        isRecording = true;
                        micButton.classList.add('recording');
                        // console.log('Successfully restarted recognition after error');
                    }, 100);
                } catch (restartError) {
                    // console.error('Failed to restart recognition:', restartError);
                    resetToDefaultState();
                }
            }
        }
    }
    
    // Reset to default state and clean up recognition
    function resetToDefaultState() {
        appStateManager.resetToDefaultState();
        
        // Make sure we're not recording
        if (isRecording) {
            try {
                recognition.stop();
                isRecording = false;
                micButton.classList.remove('recording');
            } catch (e) {
                // console.error('Error stopping recognition:', e);
            }
        }
        
        // Cancel any ongoing speech
        stopSpeaking();
    }
    
    // Transition to listening state
    function startListeningState() {
        appStateManager.startListeningState();
        
        // Cancel any ongoing speech
        stopSpeaking();
        
        // Start recording safely
        safelyStartRecognition();
    }
    
    // Process transcript and generate response
    function processTranscript(transcript) {
        const userInput = transcript.trim();
        
        // If we don't have any text, just return to default state
        if (!userInput) {
            resetToDefaultState();
            return;
        }
        
        // console.log('Processing transcript:', userInput);
        
        // Transition to responding state
        appStateManager.startRespondingState(userInput);
        
        // Generate response
        const responsePromise = generateResponse(userInput)
            .then(response => {
                appStateManager.displayResponse(response);
                
                // Read the response aloud
                speakResponse(response);
            })
            .catch(error => {
                appStateManager.displayError(error);
            });
        
        appStateManager.setCurrentResponsePromise(responsePromise);
    }
    
    // Speak response aloud
    function speakResponse(response) {
        // Use the read-aloud service to speak the response
        speakLongText(response, 120, { // Reduced chunk size for better handling
            rate: 1.0, // Slower rate for better completion
            pitch: 1.0,
            volume: 1.0,
            onComplete: () => {
                // console.log('Finished speaking response');
            }
        });
    }
    
    // Create a single instance of ResumeResponse to use throughout the app
    const resumeResponder = new ResumeResponse();
    
    // Generate response function that uses the ResumeResponse class
    function generateResponse(input) {
        return resumeResponder.generateResponse(input);
    }
    
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        resultDiv.textContent = 'Speech recognition not supported in this browser. Try Chrome or Edge.';
        micButton.disabled = true;
        return;
    }
    
    // Create speech recognition object
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // Configure speech recognition
    recognition.continuous = false; // Changed to false to prevent repeating
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    let isRecording = false;
    
    // Delay before changing to responding state (in milliseconds)
    const STATE_CHANGE_DELAY = 300;
    
    // Track current interim transcript
    let currentInterimTranscript = '';
    
    // Handle results
    recognition.onresult = (event) => {
        // Use AppStateManager to update transcript
        appStateManager.updateTranscript(event);
    };
    
    // Network retry count
    let networkRetryCount = 0;
    const MAX_NETWORK_RETRIES = 3;
    
    // Error handling
    recognition.onerror = (event) => {
        // Use AppStateManager to handle recognition errors
        const result = appStateManager.handleRecognitionError(event, {
            networkRetryCount,
            MAX_NETWORK_RETRIES,
            isRecording,
            processTranscript,
            resetToDefaultState
        });
        
        // Update network retry count if it changed
        if (result.newNetworkRetryCount !== undefined) {
            networkRetryCount = result.newNetworkRetryCount;
        }
        
        // Update recording state if needed
        if (result.shouldRestart) {
            isRecording = true;
        }
        
        // If error was handled completely, return early
        if (result.handled) {
            return;
        }
    };
    
    // When recognition ends (can happen automatically)
    recognition.onend = () => {
        // console.log('Recognition ended, current state:', appStateManager.getCurrentState());
        
        // Only handle if we're in LISTENING state
        if (appStateManager.getCurrentState() === appStateManager.AppState.LISTENING) {
            if (isRecording) {
                // If we're still supposed to be recording, restart safely
                // console.log('Still in recording mode, restarting recognition');
                safelyStartRecognition();
            } else {
                // Recognition ended and we're not recording
                // This can happen right after button release or on a recognition error
                // console.log('Recognition ended while in LISTENING state (not recording)');
                
                // Check if there's already a scheduled state change
                if (!appStateManager.hasScheduledStateChange()) {
                    // If we have transcript and are still in LISTENING state,
                    // we should process it (this is a backup path for any missed button events)
                    const fullTranscript = appStateManager.getFullTranscript();
                    if (fullTranscript.trim() &&
                        appStateManager.getCurrentState() === appStateManager.AppState.LISTENING) {
                        // console.log('Processing transcript from onend handler (backup path)');
                        // Use delayed state change
                        appStateManager.scheduleStateChange(
                            fullTranscript, 
                            STATE_CHANGE_DELAY, 
                            processTranscript
                        );
                    }
                } else {
                    // console.log('State change already scheduled, not processing from onend');
                }
            }
        }
    };
    
    // Push-to-talk behavior
    micButton.addEventListener('mousedown', (e) => {
        // Cancel any scheduled state change
        appStateManager.cancelScheduledStateChange();
        
        // If we're in RESPONDING state, abort the current processing and start fresh
        if (appStateManager.getCurrentState() === appStateManager.AppState.RESPONDING) {
            // console.log('Aborting current response generation and starting fresh');
            // Cancel any ongoing response processing
            appStateManager.setCurrentResponsePromise(null);
            // Cancel any ongoing speech
            stopSpeaking();
            // Reset the state and start listening
            resetToDefaultState();
            // Small delay to ensure clean state transition
            setTimeout(() => {
                startListeningState();
            }, 50);
            return;
        }
        
        // If already in LISTENING state, just continue recording
        if (appStateManager.getCurrentState() === appStateManager.AppState.LISTENING) {
            // console.log('Already in LISTENING state, continuing');
            // Make sure recording is active
            if (!isRecording) {
                safelyStartRecognition();
            }
            return;
        }
        
        // Start listening
        startListeningState();
    });
    
    micButton.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent text selection and context menu
        
        // Cancel any scheduled state change
        appStateManager.cancelScheduledStateChange();
        
        // If we're in RESPONDING state, abort the current processing and start fresh
        if (appStateManager.getCurrentState() === appStateManager.AppState.RESPONDING) {
            // console.log('Aborting current response generation and starting fresh');
            // Cancel any ongoing response processing
            appStateManager.setCurrentResponsePromise(null);
            // Cancel any ongoing speech
            stopSpeaking();
            // Reset the state and start listening
            resetToDefaultState();
            // Small delay to ensure clean state transition
            setTimeout(() => {
                startListeningState();
            }, 50);
            return;
        }
        
        // If already in LISTENING state, just continue recording
        if (appStateManager.getCurrentState() === appStateManager.AppState.LISTENING) {
            // console.log('Already in LISTENING state, continuing');
            // Make sure recording is active
            if (!isRecording) {
                safelyStartRecognition();
            }
            return;
        }
        
        // Start listening
        startListeningState();
    });
    
    // Keyboard accessibility for the microphone button
    micButton.addEventListener('keydown', (e) => {
        // Start on Space or Enter
        if (e.code === 'Space' || e.code === 'Enter') {
            e.preventDefault(); // Prevent page scroll on Space
            
            // Cancel any scheduled state change
            appStateManager.cancelScheduledStateChange();
            
            // If we're in RESPONDING state, abort the current processing and start fresh
            if (appStateManager.getCurrentState() === appStateManager.AppState.RESPONDING) {
                // console.log('Aborting current response generation and starting fresh');
                // Cancel any ongoing response processing
                appStateManager.setCurrentResponsePromise(null);
                // Cancel any ongoing speech
                stopSpeaking();
                // Reset the state and start listening
                resetToDefaultState();
                // Small delay to ensure clean state transition
                setTimeout(() => {
                    startListeningState();
                    
                    // Update ARIA for screen readers
                    micButton.setAttribute('aria-label', 'Recording. Press Space or Enter to stop.');
                }, 50);
                return;
            }
            
            // If already in LISTENING state, just continue recording
            if (appStateManager.getCurrentState() === appStateManager.AppState.LISTENING) {
                // console.log('Already in LISTENING state, continuing');
                // Make sure recording is active
                if (!isRecording) {
                    safelyStartRecognition();
                }
                // Update ARIA for screen readers
                micButton.setAttribute('aria-label', 'Recording. Press Space or Enter to stop.');
                return;
            }
            
            // Start listening
            startListeningState();
            
            // Update ARIA for screen readers
            micButton.setAttribute('aria-label', 'Recording. Press Space or Enter to stop.');
        }
    });
    
    micButton.addEventListener('keyup', (e) => {
        // Stop on Space or Enter
        if ((e.code === 'Space' || e.code === 'Enter') &&
            appStateManager.getCurrentState() === appStateManager.AppState.LISTENING) {
            // console.log('Key released, stopping recording');
            
            // Stop recording immediately
            isRecording = false;
            micButton.classList.remove('recording');
            recognition.stop();
            
            // Reset ARIA label
            micButton.setAttribute('aria-label', 'Press to speak');
            
            // Get the full transcript, including any interim results
            const fullTranscript = appStateManager.getFullTranscript();
            
            // Process the transcript if we have any, with a delay
            if (fullTranscript.trim()) {
                // Use delayed state change
                appStateManager.scheduleStateChange(
                    fullTranscript, 
                    STATE_CHANGE_DELAY, 
                    processTranscript
                );
            } else {
                // If no speech was detected, return to default state
                resetToDefaultState();
            }
        }
    });
    
    micButton.addEventListener('mouseup', (e) => {
        // If we're in LISTENING state, transition to RESPONDING state
        if (appStateManager.getCurrentState() === appStateManager.AppState.LISTENING) {
            // console.log('Button released, stopping recording');
            
            // Stop recording immediately
            isRecording = false;
            micButton.classList.remove('recording');
            recognition.stop();
            
            // Get the full transcript, including any interim results
            const fullTranscript = appStateManager.getFullTranscript();
            
            // Process the transcript if we have any, with a delay
            if (fullTranscript.trim()) {
                // Use delayed state change
                appStateManager.scheduleStateChange(
                    fullTranscript, 
                    STATE_CHANGE_DELAY, 
                    processTranscript
                );
            } else {
                // If no speech was detected, return to default state
                resetToDefaultState();
            }
        }
    });
    
    micButton.addEventListener('mouseleave', (e) => {
        // Same as mouseup - if we're listening, process what we have
        if (appStateManager.getCurrentState() === appStateManager.AppState.LISTENING) {
            // console.log('Mouse left button area, stopping recording');
            
            // Stop recording immediately
            isRecording = false;
            micButton.classList.remove('recording');
            recognition.stop();
            
            // Get the full transcript, including any interim results
            const fullTranscript = appStateManager.getFullTranscript();
            
            // Process the transcript if we have any, with a delay
            if (fullTranscript.trim()) {
                // Use delayed state change
                appStateManager.scheduleStateChange(
                    fullTranscript, 
                    STATE_CHANGE_DELAY, 
                    processTranscript
                );
            } else {
                // If no speech was detected, return to default state
                resetToDefaultState();
            }
        }
    });
    
    micButton.addEventListener('touchend', (e) => {
        e.preventDefault();
        
        // If we're in LISTENING state, transition to RESPONDING state
        if (appStateManager.getCurrentState() === appStateManager.AppState.LISTENING) {
            // console.log('Touch ended, stopping recording');
            
            // Stop recording immediately
            isRecording = false;
            micButton.classList.remove('recording');
            recognition.stop();
            
            // Get the full transcript, including any interim results
            const fullTranscript = appStateManager.getFullTranscript();
            
            // Process the transcript if we have any, with a delay
            if (fullTranscript.trim()) {
                // Use delayed state change
                appStateManager.scheduleStateChange(
                    fullTranscript, 
                    STATE_CHANGE_DELAY, 
                    processTranscript
                );
            } else {
                // If no speech was detected, return to default state
                resetToDefaultState();
            }
        }
    });
    
    
    // App is fully initialized and ready
    // console.log('Speech-to-text app initialized successfully');
});