/**
 * ResumeResponse class for handling transcript processing and response generation
 * This class takes user speech, processes it, and generates appropriate responses
 */
class ResumeResponse {
    constructor() {
        // Load resume data from external file
        if (typeof resumeData !== 'undefined') {
            this.resumeData = resumeData;
            // console.log('Resume data loaded successfully');
        } else {
            // console.error('Resume data not found! Make sure resume-data.js is loaded before index.js');
            this.resumeData = {
                name: "Error Loading Data",
                title: "Resume data could not be loaded"
            };
        }
        
        // Initialize QA pairs if available
        this.qaPairs = typeof getResumeQAPairs === 'function' ? getResumeQAPairs() : [];
        
        // Initialize embedding service
        this.embeddingService = null;
        
        // Start with Simple search mode indicator
        this.updateSearchModeIndicator(false);
        
        // Initialize the embedding service with a delay to ensure transformers is loaded
        setTimeout(() => {
            this.initializeEmbeddingService();
        }, 2000);
        
        // Common questions and their response templates
        this.responseTemplates = {
            greeting: () => `Hello! I'm ${this.resumeData.name}, ${this.resumeData.title}. How can I help you today?`,
            
            name: () => `My name is ${this.resumeData.name}.`,
            
            experience: () => {
                if (this.resumeData.experience && Array.isArray(this.resumeData.experience)) {
                    const experienceItems = this.resumeData.experience.map(exp => {
                        let text = `• ${exp.company}`;
                        if (exp.location) text += `, ${exp.location}`;
                        if (exp.period) text += ` (${exp.period})`;
                        if (exp.position) text += ` - ${exp.position}`;
                        return text;
                    });
                    return `My professional experience includes:\n${experienceItems.join('\n')}`;
                }
                return 'I have professional experience in the tech industry.';
            },
            
            skills: () => {
                if (this.resumeData.skills && Array.isArray(this.resumeData.skills)) {
                    return `My key skills include:\n${this.resumeData.skills.map(skill => 
                        `• ${skill}`).join('\n')}`;
                }
                return 'I have a variety of technical skills.';
            },
            
            education: () => {
                if (this.resumeData.education) {
                    if (Array.isArray(this.resumeData.education) && this.resumeData.education.length > 0) {
                        const edu = this.resumeData.education[0];
                        return `I studied at ${edu.institution} and earned a ${edu.degree}${edu.year ? ` in ${edu.year}` : ''}.`;
                    } else {
                        const edu = this.resumeData.education;
                        return `I have a ${edu.degree} from ${edu.school}${edu.year ? `, graduating in ${edu.year}` : ''}.`;
                    }
                }
                return 'I have a degree in a technology-related field.';
            },
            
            contact: () => {
                if (this.resumeData.contact) {
                    const contact = this.resumeData.contact;
                    let contactInfo = 'You can reach me at:';
                    if (contact.email) contactInfo += `\nEmail: ${contact.email}`;
                    if (contact.phone) contactInfo += `\nPhone: ${contact.phone}`;
                    if (contact.linkedin) {
                        const linkedinUrl = contact.linkedin.replace(/https?:\/\//, '');
                        contactInfo += `\nLinkedIn: ${linkedinUrl}`;
                    }
                    if (contact.github) {
                        const githubUrl = contact.github.replace(/https?:\/\//, '');
                        contactInfo += `\nGitHub: ${githubUrl}`;
                    }
                    if (contact.drupal) {
                        const drupalUrl = contact.drupal.replace(/https?:\/\//, '');
                        contactInfo += `\nDrupal: ${drupalUrl}`;
                    }
                    if (contact.website) {
                        const websiteUrl = contact.website.replace(/https?:\/\//, '');
                        contactInfo += `\nWebsite: ${websiteUrl}`;
                    }
                    return contactInfo;
                }
                return 'Contact information is not available.';
            },
            
            certifications: () => {
                if (this.resumeData.certifications && Array.isArray(this.resumeData.certifications)) {
                    return `My certifications include:\n${this.resumeData.certifications.map(cert => 
                        `• ${cert}`).join('\n')}`;
                }
                return 'I have various professional certifications.';
            },
            
            drupal: () => {
                if (this.resumeData.drupalContributions && Array.isArray(this.resumeData.drupalContributions)) {
                    return `My Drupal contributions include:\n${this.resumeData.drupalContributions.map(contrib => 
                        `• ${contrib}`).join('\n')}`;
                }
                return 'I have experience with Drupal.';
            },
            
            communityEngagement: () => {
                if (this.resumeData.communityEngagement) {
                    const ce = this.resumeData.communityEngagement;
                    let text = `I work as a ${ce.position} (${ce.period}).`;
                    if (ce.description) text += `\n\n${ce.description}`;
                    if (ce.achievements && Array.isArray(ce.achievements)) {
                        text += `\n\nKey achievements:\n${ce.achievements.map(achievement => 
                            `• ${achievement}`).join('\n')}`;
                    }
                    return text;
                }
                return 'I am engaged with the tech community.';
            },
            
            location: () => {
                return this.resumeData.location ? 
                    `I'm located in ${this.resumeData.location}.` : 
                    'I prefer not to disclose my exact location.';
            },
            
            summary: () => {
                return this.resumeData.summary || 
                    `I'm ${this.resumeData.name}, a ${this.resumeData.title} with experience in the tech industry.`;
            },
            
            default: () => "I'm not sure how to respond to that. Could you ask me about my experience, skills, education, certifications, or contact information?"
        };
    }
    
    /**
     * Initialize the embedding service
     */
    async initializeEmbeddingService() {
        try {
            // console.log("Initializing embedding service...");
            
            // Check if transformers.js is loaded first by checking the flag
            if (!window.transformersLoaded || typeof window.transformers === 'undefined') {
                // console.warn("Transformers.js library not loaded yet, will retry in 2 seconds");
                this.embeddingService = null;
                this.updateSearchModeIndicator(false);
                
                // Retry after a delay
                setTimeout(() => {
                    // console.log("Retrying embedding service initialization...");
                    this.initializeEmbeddingService();
                }, 2000);
                
                return false;
            }
            
            // Use the pre-calculated embedding service if available
            if (typeof PreCalculatedEmbeddingModelService !== 'undefined') {
                // console.log("Using PreCalculatedEmbeddingModelService");
                this.embeddingService = new PreCalculatedEmbeddingModelService();
            } else if (typeof EmbeddingModelService !== 'undefined') {
                // console.log("Using EmbeddingModelService");
                this.embeddingService = new EmbeddingModelService();
            } else {
                // console.warn("Embedding services not available");
                this.embeddingService = null;
                return false;
            }
            
            // Initialize the service
            const initialized = await this.embeddingService.initialize();
            // console.log(`Embedding service initialization ${initialized ? 'successful' : 'failed'}`);
            
            if (!initialized) {
                // console.warn("Embedding service initialization failed, will use fallback response method");
                this.embeddingService = null;
                this.updateSearchModeIndicator(false);
                return false;
            }
            
            // Update the status indicator to show advanced search is active
            this.updateSearchModeIndicator(true);
            return true;
        } catch (error) {
            // console.error("Error initializing embedding service:", error);
            this.embeddingService = null;
            return false;
        }
    }
    
    /**
     * Process the transcript and generate an appropriate response
     * @param {string} transcript - The user's speech transcript
     * @returns {Promise<string>} The response
     */
    generateResponse(transcript) {
        return new Promise(async (resolve, reject) => {
            try {
                // Check if embedding service is initialized and available
                if (this.embeddingService && this.embeddingService.initialized) {
                    try {
                        // console.log("Using embedding service for response");
                        
                        // Get raw search results first
                        const queryEmbedding = await this.embeddingService.getEmbedding(transcript);
                        const searchResults = this.embeddingService.vectorStore.search(queryEmbedding, 3);
                        
                        // console.log("Search results:", searchResults);
                        
                        // Check if we have any exact QA pair matches
                        // for (const result of searchResults) {
                        //     if (result.source === 'QA Pair' && result.text.startsWith('Q: ')) {
                        //         const parts = result.text.split('A: ');
                        //         if (parts.length === 2 && result.similarity > 0.75) {
                        //             console.log("Found direct QA match with similarity:", result.similarity);
                        //             resolve(parts[1].trim());
                        //             return;
                        //         }
                        //     }
                        // }
                        
                        // Use the raw result text if similarity is high enough
                        // if (searchResults.length > 0 && searchResults[0].similarity > 0.70) {
                            // console.log("Using raw search result with similarity:", searchResults[0].similarity);
                            const response = searchResults[0].text;
                            resolve(response);
                            return;
                        // }
                        
                        // Fall back to the embedding service's formatted response
                        // console.log("No high-confidence match, using formatted response");
                        // const response = await this.embeddingService.sendMessage(transcript);
                        // if (response) {
                        //     resolve(response);
                        //     return;
                        // } else {
                        //     console.warn("Embedding service returned empty response, falling back to basic response");
                        // }
                    } catch (embeddingError) {
                        // console.warn("Embedding service failed, falling back to basic response:", embeddingError);
                    }
                } else {
                    // console.log("Embedding service not available, using basic response generation");
                }
                
                // Fallback: Process the input to identify the intent
                const intent = this.identifyIntent(transcript.toLowerCase());
                // console.log("Identified intent:", intent);
                
                // Simulate processing delay
                setTimeout(() => {
                    let response;
                    
                    // Handle direct responses from QA pairs
                    if (typeof intent === 'object' && intent.type === 'direct') {
                        response = intent.response;
                    } else {
                        // Get the appropriate response based on intent template
                        if (this.responseTemplates[intent]) {
                            response = this.responseTemplates[intent]();
                        } else {
                            // Fallback if the intent doesn't match any template
                            response = this.responseTemplates.default();
                        }
                    }
                    
                    resolve(response);
                }, 500); // Slightly faster response time
            } catch (error) {
                // console.error('Error generating response:', error);
                try {
                    // Last fallback attempt
                    resolve("I'm sorry, I couldn't process that request. Please try asking in a different way.");
                } catch (finalError) {
                    reject(new Error("Failed to generate response"));
                }
            }
        });
    }
    
    /**
     * Identify the user's intent from their speech
     * @param {string} transcript - The lowercased transcript
     * @returns {string} The identified intent key
     */
    identifyIntent(transcript) {
        // First try to match with QA pairs if available
        if (this.qaPairs && this.qaPairs.length > 0) {
            // Check if transcript text looks like a question in our QA pairs
            for (const qaPair of this.qaPairs) {
                const questionWords = qaPair.question.toLowerCase().split(/\s+/);
                const match = questionWords.filter(word => 
                    word.length > 3 && transcript.includes(word.toLowerCase())
                );
                
                // If we have a strong match with a question, return its answer directly
                if (match.length >= 2 ||
                    (match.length === 1 && match[0].length > 5)) {
                    // console.log(`Matched QA pair: "${qaPair.question}"`);
                    // Return the answer as a custom intent
                    return { 
                        type: 'direct',
                        response: qaPair.answer
                    };
                }
            }
        }
        
        // Keyword-based intent matching
        if (this.containsAny(transcript, ['hi', 'hello', 'hey', 'greetings'])) {
            return 'greeting';
        }
        
        if (this.containsAny(transcript, ['name', 'called', 'who are you'])) {
            return 'name';
        }
        
        if (this.containsAny(transcript, ['summary', 'about you', 'about yourself', 'tell me about you', 'background'])) {
            return 'summary';
        }
        
        if (this.containsAny(transcript, ['experience', 'work history', 'worked', 'company', 'job', 'employment'])) {
            return 'experience';
        }
        
        if (this.containsAny(transcript, ['skills', 'abilities', 'capable', 'know how', 'proficient', 'good at', 'technologies'])) {
            return 'skills';
        }
        
        if (this.containsAny(transcript, ['education', 'school', 'college', 'university', 'degree', 'study', 'studied', 'graduated'])) {
            return 'education';
        }
        
        if (this.containsAny(transcript, ['contact', 'email', 'phone', 'reach', 'linkedin', 'connect', 'github'])) {
            return 'contact';
        }
        
        if (this.containsAny(transcript, ['certification', 'certified', 'license', 'credential'])) {
            return 'certifications';
        }
        
        if (this.containsAny(transcript, ['drupal', 'cms', 'contribution', 'open source', 'community'])) {
            return 'drupal';
        }
        
        if (this.containsAny(transcript, ['community', 'engagement', 'involvement', 'participate'])) {
            return 'communityEngagement';
        }
        
        if (this.containsAny(transcript, ['where', 'live', 'located', 'location', 'city', 'state'])) {
            return 'location';
        }
        
        // Default response if no clear intent is identified
        return 'default';
    }
    
    /**
     * Check if the text contains any of the keywords
     * @param {string} text - Text to check
     * @param {string[]} keywords - Keywords to look for
     * @returns {boolean} True if any keyword is found
     */
    containsAny(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }
    
    /**
     * Update the search mode indicator in the UI
     * @param {boolean} isAdvanced - Whether advanced search mode is active
     */
    updateSearchModeIndicator(isAdvanced) {
        try {
            const modeIndicator = document.getElementById('search-mode-indicator');
            if (modeIndicator) {
                if (isAdvanced) {
                    modeIndicator.textContent = 'vector';
                    modeIndicator.classList.add('vector');
                } else {
                    modeIndicator.textContent = 'word';
                    modeIndicator.classList.remove('vector');
                }
            }
        } catch (error) {
            // console.error('Error updating search mode indicator:', error);
        }
    }
}

// Export the class for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResumeResponse;
}