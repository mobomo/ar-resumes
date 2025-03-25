/**
 * AppStateManager class to handle the application state
 * Manages transitions between listening, responding, and default states
 */
class AppStateManager {
    constructor() {
        // Define application states
        this.AppState = {
            DEFAULT: 'default',       // Not listening, display shows previous response or is empty
            LISTENING: 'listening',   // Actively listening and building transcript
            RESPONDING: 'responding'  // Processing transcript and generating response
        };
        
        // Track app state
        this.state = {
            current: this.AppState.DEFAULT,
            currentResponsePromise: null,
            transcript: '',
            stateChangeTimeout: null  // For tracking delayed state changes
        };
        
        // DOM elements
        this.resultDiv = document.getElementById('result');
        this.micButton = document.getElementById('microphone');
        
        // Track current interim transcript
        this.currentInterimTranscript = '';
    }
    
    /**
     * Reset to default state
     */
    resetToDefaultState() {
        // console.log('Resetting to DEFAULT state');
        
        // Cancel any ongoing processing
        this.state.currentResponsePromise = null;
        this.state.transcript = '';
        this.state.current = this.AppState.DEFAULT;
        
        // Clear classes
        this.resultDiv.classList.remove('thinking', 'listening');
        
        // Clear "Listening" text if that's all that's displayed
        if (this.resultDiv.textContent.trim() === 'Listening') {
            this.resultDiv.textContent = '';
        }
        
        // If div is empty, add the empty class to show placeholder
        if (!this.resultDiv.textContent.trim()) {
            this.resultDiv.classList.add('empty');
        }
        
        // Reset ARIA label
        this.micButton.setAttribute('aria-label', 'Press to speak');
        
        // Reset the first transcript update flag
        this.isFirstTranscriptUpdate = false;
        
        return this.state.current;
    }
    
    /**
     * Transition to listening state
     */
    startListeningState() {
        // console.log('Transitioning to LISTENING state');
        
        // Update app state
        this.state.current = this.AppState.LISTENING;
        this.state.transcript = ''; // Don't include "Listening" in the actual transcript
        this.currentInterimTranscript = '';
        
        // Display "Listening" in the result div
        this.resultDiv.textContent = 'Listening';
        
        // Update classes
        this.resultDiv.classList.remove('thinking');
        this.resultDiv.classList.add('listening');
        this.resultDiv.classList.remove('empty'); // Remove empty since we're showing "Listening"
        
        // Update ARIA labels
        this.micButton.setAttribute('aria-label', 'Recording. Press to stop.');
        this.resultDiv.setAttribute('aria-label', 'Listening for speech input');
        
        // Flag to track if this is the first transcript update
        this.isFirstTranscriptUpdate = true;
        
        return this.state.current;
    }
    
    /**
     * Transition to responding state
     * @param {string} transcript - The transcript to process
     */
    startRespondingState(transcript) {
        // console.log('Transitioning to RESPONDING state');
        
        // Update app state
        this.state.current = this.AppState.RESPONDING;
        this.state.transcript = transcript;
        
        // Reset the first transcript update flag
        this.isFirstTranscriptUpdate = false;
        
        // Update UI - always clear any previous content including "Listening"
        this.resultDiv.textContent = "Thinking";
        this.resultDiv.classList.remove('empty', 'listening');
        this.resultDiv.classList.add('thinking');
        
        // Update ARIA labels
        this.micButton.setAttribute('aria-label', 'Press to cancel and speak again');
        this.resultDiv.setAttribute('aria-label', 'Processing your request, please wait');
        
        return this.state.current;
    }
    
    /**
     * Update transcript with interim results
     * @param {SpeechRecognitionEvent} event - The speech recognition event
     */
    updateTranscript(event) {
        // Only process results if we're in LISTENING state
        if (this.state.current !== this.AppState.LISTENING) return null;
        
        let interimTranscript = '';
        let hasContent = false;
        
        for (let i = 0; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            
            if (event.results[i].isFinal) {
                this.state.transcript += transcript + ' ';
                hasContent = true;
            } else {
                interimTranscript += transcript;
                if (transcript.trim()) {
                    hasContent = true;
                }
            }
        }
        
        // Store the current interim transcript so we can access it when button is released
        this.currentInterimTranscript = interimTranscript;
        
        // If this is the first update with actual content, clear the "Listening" text
        if (hasContent && this.isFirstTranscriptUpdate) {
            this.isFirstTranscriptUpdate = false;
            // Clear the result div before adding new content
            this.resultDiv.textContent = '';
        }
        
        // Remove empty class when we have speech
        if ((this.state.transcript || interimTranscript) && this.resultDiv.classList.contains('empty')) {
            this.resultDiv.classList.remove('empty');
        }
        
        // Only update the display if we have actual content or if we've already cleared "Listening"
        if (!this.isFirstTranscriptUpdate) {
            // Update the display with transcript plus any interim results
            this.resultDiv.textContent = this.state.transcript;
            
            // Add interim results with a different style
            if (interimTranscript) {
                // Clear any existing interim spans
                const existingInterim = this.resultDiv.querySelector('.interim');
                if (existingInterim) {
                    this.resultDiv.removeChild(existingInterim);
                }
                
                const interimSpan = document.createElement('span');
                interimSpan.className = 'interim';
                interimSpan.textContent = interimTranscript;
                this.resultDiv.appendChild(interimSpan);
            }
        }
        
        // Always scroll to bottom, even if we're still showing "Listening"
        this.resultDiv.scrollTop = this.resultDiv.scrollHeight;
        
        return {
            transcript: this.state.transcript,
            interimTranscript: this.currentInterimTranscript
        };
    }
    
    /**
     * Get the current full transcript (final + interim)
     * @returns {string} The full transcript
     */
    getFullTranscript() {
        return this.state.transcript + this.currentInterimTranscript;
    }
    
    /**
     * Set the current response promise
     * @param {Promise} promise - The response promise
     */
    setCurrentResponsePromise(promise) {
        this.state.currentResponsePromise = promise;
    }
    
    /**
     * Schedule a delayed state change to responding state
     * @param {string} transcript - The transcript to process
     * @param {number} delay - The delay in milliseconds before changing state
     * @param {Function} processTranscriptCallback - Function to call after the delay
     * @returns {number} The timeout ID
     */
    scheduleStateChange(transcript, delay, processTranscriptCallback) {
        // Cancel any existing scheduled state change
        this.cancelScheduledStateChange();
        
        // Store the full transcript for use when the timeout fires
        const fullTranscript = transcript;
        
        // Schedule the state change
        this.state.stateChangeTimeout = setTimeout(() => {
            // Only proceed if we're still in LISTENING state
            if (this.state.current === this.AppState.LISTENING) {
                // Call the callback to process the transcript
                if (processTranscriptCallback && typeof processTranscriptCallback === 'function') {
                    processTranscriptCallback(fullTranscript);
                }
            }
            
            // Clear the timeout reference
            this.state.stateChangeTimeout = null;
        }, delay);
        
        return this.state.stateChangeTimeout;
    }
    
    /**
     * Cancel any scheduled state change
     */
    cancelScheduledStateChange() {
        if (this.state.stateChangeTimeout) {
            clearTimeout(this.state.stateChangeTimeout);
            this.state.stateChangeTimeout = null;
            return true;
        }
        return false;
    }
    
    /**
     * Check if there's a pending state change
     * @returns {boolean} True if there's a scheduled state change
     */
    hasScheduledStateChange() {
        return this.state.stateChangeTimeout !== null;
    }
    
    /**
     * Display the response in the UI
     * @param {string} response - The response text to display
     */
    displayResponse(response) {
        // Only update UI if we're still in responding state
        if (this.state.current === this.AppState.RESPONDING) {
            // Display the response
            this.resultDiv.classList.remove('thinking');
            
            // Handle URLs correctly - use innerHTML for formatted text
            // First, create a safe version of the response with line breaks
            // console.log("Original response:", response);
            
            // Process URLs first to preserve them
            const processedResponse = response.replace(
                /(https?:\/\/[^\s,]+)|(www\.[^\s,]+)|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
                match => {
                    // Add a span with nowrap to prevent URL breaking
                    return `<span style="white-space: nowrap;">${match}</span>`;
                }
            );
            
            // console.log("Processed response for URLs:", processedResponse);
            
            // Then sanitize
            const safeResponse = processedResponse
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;')
                // Restore the URL spans we added above
                .replace(/&lt;span style=&quot;white-space: nowrap;&quot;&gt;(.*?)&lt;\/span&gt;/g, 
                         '<span style="white-space: nowrap;">$1</span>')
               .replace(/\n/g, '<br>');
           
           // console.log("Safe response with preserved URLs:", safeResponse);
           
           this.resultDiv.innerHTML = safeResponse;
            
            // Return to default state
            this.state.current = this.AppState.DEFAULT;
        }
    }
    
    /**
     * Display an error message in the UI
     * @param {Error} error - The error object
     */
    displayError(error) {
        // Only update UI if we're still in responding state
        if (this.state.current === this.AppState.RESPONDING) {
            // console.error('Error generating response:', error);
            this.resultDiv.classList.remove('thinking');
            this.resultDiv.innerHTML = "Sorry, I couldn't generate a response.";
            
            // Return to default state
            this.state.current = this.AppState.DEFAULT;
        }
    }
    
    /**
     * Handle recognition error with appropriate UI updates
     * @param {SpeechRecognitionErrorEvent} event - The error event
     * @param {Object} options - Additional options
     * @param {number} options.networkRetryCount - Number of network retries
     * @param {number} options.MAX_NETWORK_RETRIES - Maximum number of network retries
     * @param {boolean} options.isRecording - Whether recording is active
     * @param {Function} options.processTranscript - Function to process transcript
     * @param {Function} options.resetToDefaultState - Function to reset to default state
     * @returns {Object} Information about how the error was handled
     */
    handleRecognitionError(event, options) {
        // console.error('Speech recognition error:', event.error);
        
        const {
            networkRetryCount,
            MAX_NETWORK_RETRIES,
            isRecording,
            processTranscript,
            resetToDefaultState
        } = options;
        
        let newNetworkRetryCount = networkRetryCount;
        let shouldRestart = false;
        
        // Only handle errors if we're in LISTENING state
        if (this.state.current === this.AppState.LISTENING) {
            // Handle network errors with special logic
            if (event.error === 'network') {
                if (networkRetryCount < MAX_NETWORK_RETRIES) {
                    newNetworkRetryCount++;
                    // console.log(`Network error, retry ${newNetworkRetryCount}/${MAX_NETWORK_RETRIES}...`);
                    
                    // Show unobtrusive status message
                    const tempMsg = document.createElement('div');
                    tempMsg.classList.add('status-message');
                    tempMsg.textContent = `Reconnecting... (${newNetworkRetryCount}/${MAX_NETWORK_RETRIES})`;
                    this.resultDiv.appendChild(tempMsg);
                    
                    // Recognition will end after error, and onend event will handle restart
                    shouldRestart = true;
                    
                    // The message will be replaced when recognition restarts
                    setTimeout(() => {
                        if (tempMsg.parentNode === this.resultDiv) {
                            this.resultDiv.removeChild(tempMsg);
                        }
                    }, 3000);
                    
                    return { newNetworkRetryCount, shouldRestart, handled: true };
                } else {
                    // Max retries reached, show error
                    newNetworkRetryCount = 0; // Reset for next time
                    const errorDiv = document.createElement('div');
                    errorDiv.classList.add('error');
                    errorDiv.textContent = `Network connection issue. Please check your internet connection and try again.`;
                    this.resultDiv.appendChild(document.createElement('br'));
                    this.resultDiv.appendChild(errorDiv);
                    
                    // Process any transcript we might have
                    const fullTranscript = this.getFullTranscript();
                    if (fullTranscript.trim()) {
                        // console.log('Processing partial transcript after max network retries');
                        processTranscript(fullTranscript);
                    } else {
                        resetToDefaultState();
                    }
                    return { newNetworkRetryCount, shouldRestart: false, handled: true };
                }
            } else {
                // Reset network retry count for non-network errors
                newNetworkRetryCount = 0;
            }
            
            // Show error message to user for other error types
            const errorDiv = document.createElement('div');
            errorDiv.classList.add('error');
            errorDiv.textContent = `Error: ${event.error}.`;
            this.resultDiv.appendChild(document.createElement('br'));
            this.resultDiv.appendChild(errorDiv);
            
            // For other recoverable errors, try to restart if we're supposed to be recording
            if (isRecording && 
                (event.error === 'service-not-allowed' || 
                 event.error === 'audio-capture' ||
                 event.error === 'aborted')) {
                
                errorDiv.textContent += ' Attempting to restart...';
                
                // Recognition will end after error, and onend event will handle restart
                // console.log('Recoverable error, will attempt restart in onend handler');
                
                // Keep isRecording true so onend handler will restart
                shouldRestart = true;
            } else {
                // For non-recoverable errors
                errorDiv.textContent += ' Please try again.';
                
                const fullTranscript = this.getFullTranscript();
                // If we have any transcript, process it
                if (fullTranscript.trim()) {
                    // console.log('Processing partial transcript after error');
                    processTranscript(fullTranscript);
                } else {
                    // Otherwise return to default state
                    resetToDefaultState();
                }
            }
        }
        
        return { newNetworkRetryCount, shouldRestart, handled: false };
    }
    
    /**
     * Get the current state
     * @returns {string} The current state (default, listening, responding)
     */
    getCurrentState() {
        return this.state.current;
    }
}

// Create and export a singleton instance
const appStateManager = new AppStateManager();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = appStateManager;
}