// Embedding-based Model Service - Uses embeddings to retrieve relevant information
// instead of directly using an LLM

// Check if transformers library is available globally
function checkTransformersAvailable() {
    if (!window.transformersLoaded || typeof window.transformers === 'undefined') {
        // console.error('Transformers.js library not found. Make sure the script is loaded properly.');
        return false;
    }
    return true;
}

/**
 * Global manager for the embedding service
 */
window.EmbeddingManager = {
    // Will be populated when embedding service is loaded
    embeddingService: null,
    vectorStore: null,
    // Set this to true once we're sure the services are available
    isReady: false,
    // Listeners waiting for services to be ready
    readyListeners: [],
    
    // Call this when services are loaded
    setServices: function(embeddingService, vectorStore) {
        // console.log("Embedding services received");
        this.embeddingService = embeddingService;
        this.vectorStore = vectorStore;
        this.isReady = true;
        
        // Notify all listeners
        this.readyListeners.forEach(listener => listener(embeddingService, vectorStore));
        this.readyListeners = [];
    },
    
    // Register a callback to run when services are ready
    onReady: function(callback) {
        if (this.isReady) {
            callback(this.embeddingService, this.vectorStore);
        } else {
            this.readyListeners.push(callback);
        }
    }
};

/**
 * Embedding-based Model Service
 * This class provides a drop-in replacement for ARModelService that uses
 * embeddings to find relevant information instead of using an LLM directly
 */
class EmbeddingModelService {
    constructor() {
        this.embeddingService = null;
        this.vectorStore = null;
        this.initialized = false;
        this.initializationError = null;
        this.progressCallback = null;
        this.systemPrompt = this.getSystemPrompt();
        this.qaPairs = [];
    }
    
    /**
     * Get the system prompt (used for formatting responses)
     */
    getSystemPrompt() {
        return '';
    }
    
    /**
     * Set a callback for progress updates
     */
    setProgressCallback(callback) {
        this.progressCallback = callback;
    }
    
    /**
     * Initialize the embedding service and vector store
     */
    async initialize() {
        
        try {
            const initMsg = "Initializing Embedding Model Service...";
            // console.log(initMsg);
            
            // Create embedding service and vector store
            const embeddingService = new EmbeddingService();
            const vectorStore = new VectorStore();
            
            // Initialize the embedding model
            if (this.progressCallback) {
                this.progressCallback(10, "Initializing embedding model");
            }
            
            await embeddingService.initialize();
            
            if (this.progressCallback) {
                this.progressCallback(30, "Preparing resume data");
            }
            
            // Prepare resume chunks
            const resumeChunks = this.prepareResumeChunks();
            
            // Prepare QA pairs
            this.qaPairs = this.getResumeQAPairs();
            
            // Combine resume chunks and QA pairs for embedding
            const allDocuments = [...resumeChunks];
            
            // Add QA pairs as documents
            this.qaPairs.forEach(qa => {
                allDocuments.push({
                    text: `Q: ${qa.question} A: ${qa.answer}`,
                    source: "QA Pair"
                });
            });
            
            // Compute embeddings for all documents
            let processedCount = 0;
            
            for (const doc of allDocuments) {
                try {
                    const embedding = await embeddingService.getEmbedding(doc.text);
                    vectorStore.addDocument(doc.text, embedding, doc.source);
                    
                    // Update progress
                    processedCount++;
                    const progressPercent = 30 + Math.floor((processedCount / allDocuments.length) * 60);
                    
                    if (this.progressCallback) {
                        this.progressCallback(progressPercent, `Processing document ${processedCount}/${allDocuments.length}`);
                    }
                    
                    if (processedCount % 5 === 0 || processedCount === allDocuments.length) {
                    }
                } catch (error) {
                    // pass
                }
            }
            
            // Mark vector store as initialized
            vectorStore.setInitialized();
            
            // Store the services
            this.embeddingService = embeddingService;
            this.vectorStore = vectorStore;
            
            // Make services available globally
            window.EmbeddingManager.setServices(embeddingService, vectorStore);
            
            this.initialized = true;
            
            if (this.progressCallback) {
                this.progressCallback(100, "Initialization complete");
            }
            
            return true;
        } catch (error) {
            const errMsg = `Embedding Model Service initialization error: ${error.message}`;
            // console.error(errMsg);
            
            if (error.stack) {
                // console.error(`Stack trace: ${error.stack}`);
            }
            
            this.initializationError = error.message;
            
            return false;
        }
    }
    
    /**
     * Get the current status of the service
     */
    getStatus() {
        return {
            initialized: this.initialized,
            error: this.initializationError
        };
    }
    
    /**
     * Send a message and get a response based on embeddings
     */
    async sendMessage(message, streamCallback = null, customParams = null) {
        if (!this.initialized) {
            throw new Error("Model not initialized");
        }
        
        try {
            // Log the incoming message
            // console.log("Processing message:", message);
            
            // Compute embedding for the query
            const queryEmbedding = await this.embeddingService.getEmbedding(message);
            
            // Search for relevant documents
            const topK = customParams?.topK || 3;
            const results = this.vectorStore.search(queryEmbedding, topK);
            
            // console.log("Search results:", results);
            
            // If there's a callback for search results, call it
            if (customParams?.onSearchResults && typeof customParams.onSearchResults === 'function') {
                customParams.onSearchResults(results);
            }
            
            // Format the response
            let response = this.formatResponse(message, results);
            
            // If streaming is requested, simulate streaming
            if (streamCallback) {
                await this.simulateStreaming(response, streamCallback);
            }
            
            return response;
        } catch (error) {
            // console.error("Error generating response:", error);
            throw error;
        }
    }
    
    /**
     * Format a response based on the query and search results
     */
    formatResponse(query, results) {
        // If no results found
        if (!results || results.length === 0) {
            return "I don't have specific information about that in my resume.";
        }
        
        // Get the highest similarity score for debugging
        const topSimilarity = results.length > 0 ? results[0].similarity : 0;
        const similarityPercent = Math.round(topSimilarity * 100);
        
        // Check if any result is a direct QA pair match
        const qaMatches = results.filter(r => r.source === "QA Pair" && r.similarity > 0.75);
        
        if (qaMatches.length > 0) {
            // Extract the answer part from the QA pair
            const bestMatch = qaMatches[0];
            const answerPart = bestMatch.text.split("A: ")[1];
            const qaMatchPercent = Math.round(bestMatch.similarity * 100);
            
            return answerPart;
        }
        
        // Otherwise, construct a response from the top results
        let responseText = "";
        
        // Group results by source
        const sourceGroups = {};
        results.forEach(result => {
            if (!sourceGroups[result.source]) {
                sourceGroups[result.source] = [];
            }
            sourceGroups[result.source].push(result.text);
        });
        
        // Construct response from grouped results
        for (const source in sourceGroups) {
            if (source !== "section_title") {
                const texts = sourceGroups[source];
                // Just include the text without the source prefix
                responseText += `${texts.join(" ")} `;
            }
        }
        
        // Clean up the response
        responseText = responseText.trim();
        
        // If response is too long, summarize it
        if (responseText.length > 200) {
            const sentences = responseText.match(/[^.!?]+[.!?]+/g) || [responseText];
            responseText = sentences.slice(0, 3).join(" ");
        }
        
        // Return the clean response text without the similarity score
        return responseText;
    }
    
    /**
     * Simulate streaming for compatibility with the original model service
     */
    async simulateStreaming(text, callback) {
        const words = text.split(" ");
        
        for (let i = 0; i < words.length; i++) {
            const word = words[i] + (i < words.length - 1 ? " " : "");
            callback(word);
            
            // Add a small delay to simulate typing
            await new Promise(resolve => setTimeout(resolve, 30));
        }
    }
    
    /**
     * Prepare resume chunks for embedding
     */
    prepareResumeChunks() {
        const chunks = [];
        
        // Add basic information
        if (resumeData.name && resumeData.title) {
            chunks.push({
                text: `My name is ${resumeData.name}. I am a ${resumeData.title}.`,
                source: "Basic Info"
            });
        }
        
        // Add summary if available
        if (resumeData.summary) {
            chunks.push({
                text: resumeData.summary,
                source: "Summary"
            });
        }
        
        // Add skills
        if (resumeData.skills && resumeData.skills.length > 0) {
            // Add overall skills chunk
            chunks.push({
                text: `My skills include: ${resumeData.skills.join(", ")}`,
                source: "Skills"
            });
            
            // Add individual skills as separate chunks for better retrieval
            resumeData.skills.forEach(skill => {
                chunks.push({
                    text: skill,
                    source: "Skill"
                });
            });
        }
        
        // Add Drupal contributions
        if (resumeData.drupalContributions && resumeData.drupalContributions.length > 0) {
            // Add overall contributions chunk
            chunks.push({
                text: `My Drupal contributions include: ${resumeData.drupalContributions.join(", ")}`,
                source: "Drupal Contributions"
            });
            
            // Add individual contributions as separate chunks
            resumeData.drupalContributions.forEach(contribution => {
                chunks.push({
                    text: contribution,
                    source: "Drupal Contribution"
                });
            });
        }
        
        // Add community engagement
        if (resumeData.communityEngagement) {
            const ce = resumeData.communityEngagement;
            chunks.push({
                text: `I work as a ${ce.position} (${ce.period}). ${ce.description || ''}`,
                source: "Community Engagement"
            });
            
            if (ce.achievements && ce.achievements.length > 0) {
                ce.achievements.forEach(achievement => {
                    chunks.push({
                        text: achievement,
                        source: "Community Engagement Achievement"
                    });
                });
            }
        }
        
        // Add experience
        if (resumeData.experience && resumeData.experience.length > 0) {
            resumeData.experience.forEach(exp => {
                // Add basic company info
                const position = exp.position || '';
                const companyInfo = `I worked as ${position} at ${exp.company} during ${exp.period}.`;
                chunks.push({
                    text: companyInfo,
                    source: `Experience at ${exp.company}`
                });
                
                // Add achievements directly on the experience object
                if (exp.achievements && exp.achievements.length > 0) {
                    exp.achievements.forEach(achievement => {
                        chunks.push({
                            text: achievement,
                            source: `Experience at ${exp.company}`
                        });
                    });
                }
                
                // Add projects within the experience
                if (exp.projects && exp.projects.length > 0) {
                    exp.projects.forEach(project => {
                        // Project basic info
                        const projectInfo = `Project: ${project.name} - ${project.position || ''}`;
                        chunks.push({
                            text: projectInfo,
                            source: `Project at ${exp.company}`
                        });
                        
                        // Project URL if available
                        if (project.url) {
                            const urls = Array.isArray(project.url) ? project.url : [project.url];
                            urls.forEach(url => {
                                chunks.push({
                                    text: `URL for ${project.name}: ${url}`,
                                    source: `Project at ${exp.company}`
                                });
                            });
                        }
                        
                        // Project achievements
                        if (project.achievements && project.achievements.length > 0) {
                            project.achievements.forEach(achievement => {
                                chunks.push({
                                    text: achievement,
                                    source: `Project ${project.name} at ${exp.company}`
                                });
                            });
                        }
                        
                        // Project notes if available
                        if (project.notes) {
                            chunks.push({
                                text: project.notes,
                                source: `Project ${project.name} at ${exp.company}`
                            });
                        }
                    });
                }
            });
        }
        
        // Add education
        if (resumeData.education && resumeData.education.length > 0) {
            resumeData.education.forEach(edu => {
                let educationText = `I have a ${edu.degree} from ${edu.institution}`;
                if (edu.year) educationText += `, graduated in ${edu.year}`;
                if (edu.concentration) educationText += `. ${edu.concentration}`;
                if (edu.notes) educationText += `. ${edu.notes}`;
                
                chunks.push({
                    text: educationText,
                    source: "Education"
                });
            });
        }
        
        // Add certifications
        if (resumeData.certifications && resumeData.certifications.length > 0) {
            // Add overall certifications chunk
            chunks.push({
                text: `My certifications include: ${resumeData.certifications.join(", ")}`,
                source: "Certifications"
            });
            
            // Add individual certifications as separate chunks
            resumeData.certifications.forEach(certification => {
                chunks.push({
                    text: certification,
                    source: "Certification"
                });
            });
        }
        
        // Add contact information
        if (resumeData.contact) {
            const contactInfo = [];
            if (resumeData.contact.email) contactInfo.push(`Email: ${resumeData.contact.email}`);
            if (resumeData.contact.phone) contactInfo.push(`Phone: ${resumeData.contact.phone}`);
            if (resumeData.contact.linkedin) contactInfo.push(`LinkedIn: ${resumeData.contact.linkedin}`);
            if (resumeData.contact.drupal) contactInfo.push(`Drupal.org: ${resumeData.contact.drupal}`);
            
            if (contactInfo.length > 0) {
                chunks.push({
                    text: `Contact information: ${contactInfo.join(", ")}`,
                    source: "Contact"
                });
            }
        }
        
        return chunks;
    }
    
    /**
     * Get QA pairs from resume data
     */
    getResumeQAPairs() {
        // Use the global getResumeQAPairs function if available
        if (typeof getResumeQAPairs === 'function') {
            // console.log("Using global getResumeQAPairs function");
            return getResumeQAPairs();
        }
        
        // console.log("Creating custom QA pairs from resume data");
        
        // Otherwise, create QA pairs based on the current resume data
        const qaPairs = [
            {
                question: "What is your name?",
                answer: resumeData?.name || "John Doe"
            },
            {
                question: "What do you do?",
                answer: resumeData?.title ?
                    `I am a ${resumeData.title}${resumeData.summary ? `. ${resumeData.summary}` : ''}.` :
                    "I am a software professional."
            }
        ];
        
        // Add skills
        if (resumeData?.skills && resumeData.skills.length > 0) {
            qaPairs.push({
                question: "What are your skills?",
                answer: `My key skills include: ${resumeData.skills.join(", ")}.`
            });
        }
        
        // Add Drupal contributions
        if (resumeData?.drupalContributions && resumeData.drupalContributions.length > 0) {
            qaPairs.push({
                question: "Tell me about your Drupal contributions.",
                answer: `My Drupal contributions include: ${resumeData.drupalContributions.join(", ")}.`
            });
            
            qaPairs.push({
                question: "What is your experience with Drupal?",
                answer: "I have over 10 years of experience with Drupal versions 7 through 11. I'm a sub-maintainer for Drupal core components, maintain over 40 contrib modules, and have led numerous Drupal migration projects."
            });
        }
        
        // Add community engagement
        if (resumeData?.communityEngagement) {
            const ce = resumeData.communityEngagement;
            qaPairs.push({
                question: "Tell me about your community engagement.",
                answer: `I work as a ${ce.position} (${ce.period}). ${ce.description || ''} ${ce.achievements ? `Key achievements include: ${ce.achievements.join(", ")}.` : ''}`
            });
        }
        
        // Add current employment
        if (resumeData?.experience && resumeData.experience.length > 0) {
            qaPairs.push({
                question: "Where do you work?",
                answer: `I currently work at ${resumeData.experience[0].company}.`
            });
            
            // Create a comprehensive experience answer
            const expCompanies = resumeData.experience.map(exp => exp.company).join(", ");
            qaPairs.push({
                question: "Tell me about your experience.",
                answer: `I have worked at several companies, including ${expCompanies}. Most recently at ${resumeData.experience[0].company} since ${resumeData.experience[0].period}.`
            });
            
            // Add notable projects
            if (resumeData.experience[0].projects && resumeData.experience[0].projects.length > 0) {
                const projects = resumeData.experience[0].projects.map(p => p.name).join(", ");
                qaPairs.push({
                    question: "What projects have you worked on?",
                    answer: `I've worked on numerous projects, including ${projects}.`
                });
            }
        }
        
        // Add federal experience
        qaPairs.push({
            question: "What federal agencies have you worked with?",
            answer: "I've worked with several federal agencies including the Office of Naval Research, Federal Energy Regulatory Commission, Centers of Medicare and Medicaid Services, United States Customs and Border Protection, Federal Emergency Management Agency, and Transportation Security Administration."
        });
        
        // Add education
        if (resumeData?.education && resumeData.education.length > 0) {
            const edu = resumeData.education[0];
            qaPairs.push({
                question: "What is your education?",
                answer: `I have a ${edu.degree} from ${edu.institution}${edu.year ? `, graduated in ${edu.year}` : ''}.${edu.concentration ? ` ${edu.concentration}` : ''}`
            });
        }
        
        // Add certifications
        if (resumeData?.certifications && resumeData.certifications.length > 0) {
            qaPairs.push({
                question: "What certifications do you have?",
                answer: `I hold the following certifications: ${resumeData.certifications.join(", ")}.`
            });
            
            // Add accessibility specific question
            qaPairs.push({
                question: "Do you have experience with accessibility standards?",
                answer: "Yes, I'm DHS 508 Accessibility Certified (2018) and have implemented accessibility standards across numerous government websites. I regularly perform 508 compliance testing and collaborate with accessibility teams."
            });
        }
        
        // Add contact information
        if (resumeData?.contact) {
            const contactInfo = [];
            if (resumeData.contact.email) contactInfo.push(`Email: ${resumeData.contact.email}`);
            if (resumeData.contact.phone) contactInfo.push(`Phone: ${resumeData.contact.phone}`);
            if (resumeData.contact.linkedin) contactInfo.push(`LinkedIn: ${resumeData.contact.linkedin}`);
            if (resumeData.contact.drupal) contactInfo.push(`Drupal.org: ${resumeData.contact.drupal}`);
            
            if (contactInfo.length > 0) {
                qaPairs.push({
                    question: "How can I contact you?",
                    answer: `You can reach me at: \n${contactInfo.join("\n")}`
                });
            }
        }
        
        return qaPairs;
    }
}

/**
 * Embedding Service class
 * This is a simplified version of the embedding service from embeddings-rag
 */
class EmbeddingService {
    constructor() {
        this.model = null;
        this.modelName = 'Xenova/all-MiniLM-L6-v2';
        this.pipeline = null;
        this.initialized = false;
    }

    /**
     * Initialize the embedding model
     */
    async initialize() {
        try {
            // Check if transformers library is available globally
            if (!checkTransformersAvailable()) {
                throw new Error('Transformers.js library not found');
            }
            
            // Access the global transformers object
            const { pipeline, env } = window.transformers;
            
            // Configure transformers.js to use local caching
            env.allowLocalModels = true;
            env.useBrowserCache = true;
            env.cacheDir = './cache'; // Use the cache directory
            // console.log('Using cache directory:', env.cacheDir);
            
            // console.log('Creating feature extraction pipeline...');
            
            // Use Web Worker to avoid blocking the main thread
            this.pipeline = await pipeline('feature-extraction', this.modelName, {
                quantized: false, // Use non-quantized model for better compatibility
                progress_callback: (progress) => {
                    // console.log(`Loading model: ${Math.round(progress.progress * 100)}%`);
                }
            });
            
            this.initialized = true;
            // console.log(`Embedding model initialized: ${this.modelName}`);
            return true;
        } catch (error) {
            // console.error("Error initializing embedding model:", error);
            this.initialized = false;
            return false;
        }
    }

    /**
     * Compute embedding for a text string
     */
    async getEmbedding(text) {
        if (!this.initialized) {
            throw new Error('Embedding service not initialized');
        }

        try {
            // Get embedding from model
            const result = await this.pipeline(text, {
                pooling: 'mean',
                normalize: true
            });
            
            // Extract the embedding data
            return Array.from(result.data);
        } catch (error) {
            // console.error('Error computing embedding:', error);
            throw error;
        }
    }

    /**
     * Check if the service is initialized
     */
    isInitialized() {
        return this.initialized;
    }
}

/**
 * Vector Store class
 * This is a simplified version of the vector store from embeddings-rag
 */
class VectorStore {
    constructor() {
        this.documents = [];
        this.initialized = false;
    }

    /**
     * Add a document with its embedding to the store
     */
    addDocument(text, embedding, source) {
        this.documents.push({
            text,
            embedding,
            source
        });
    }

    /**
     * Calculate cosine similarity between two vectors
     */
    cosineSimilarity(vecA, vecB) {
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        
        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        
        if (normA === 0 || normB === 0) {
            return 0;
        }
        
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    /**
     * Search for the most similar documents to the query embedding
     */
    search(queryEmbedding, topK = 3) {
        if (!this.initialized || this.documents.length === 0) {
            throw new Error("Vector store not initialized or empty");
        }

        // Calculate similarity for each document
        const results = this.documents.map(doc => ({
            text: doc.text,
            source: doc.source,
            similarity: this.cosineSimilarity(queryEmbedding, doc.embedding)
        }));

        // Sort by similarity (descending) and return top K
        return results
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, topK);
    }

    /**
     * Get the number of documents in the store
     */
    get documentCount() {
        return this.documents.length;
    }

    /**
     * Mark the store as initialized
     */
    setInitialized() {
        this.initialized = true;
    }

    /**
     * Check if the store is initialized
     */
    isInitialized() {
        return this.initialized;
    }

    /**
     * Clear all documents from the store
     */
    clear() {
        this.documents = [];
        this.initialized = false;
    }
}

// Make the service classes globally available
window.ModelService = EmbeddingModelService;
window.EmbeddingService = EmbeddingService;
window.VectorStore = VectorStore;