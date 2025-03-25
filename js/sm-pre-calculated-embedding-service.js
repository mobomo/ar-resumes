// Pre-calculated Embedding Service
// This service loads pre-calculated embeddings instead of computing them on-the-fly

// No need to import, the classes are already available globally from the embedding-model-service.js

/**
 * Pre-Calculated Embedding Model Service
 * This is a modified version of EmbeddingModelService that uses pre-calculated embeddings
 */
class PreCalculatedEmbeddingModelService extends EmbeddingModelService {
    constructor() {
        super();
        this.embeddingData = null;
        this.embeddingMap = new Map();
        this.usePreCalculatedEmbeddings = true;
    }
    
    /**
     * Override the initialize method to load pre-calculated embeddings
     */
    async initialize() {
        try {
            const initMsg = "Initializing Pre-Calculated Embedding Model Service...";
            // console.log(initMsg);
            
            if (this.usePreCalculatedEmbeddings) {
                // Try to load pre-calculated embeddings
                
                if (this.progressCallback) {
                    this.progressCallback(10, "Loading pre-calculated embeddings");
                }
                
                try {
                    // Try to load pre-calculated embeddings from the data directory
                    // console.log("Attempting to load pre-calculated embeddings...");
                    let embeddingsLoaded = false;
                    
                    try {
                        const response = await fetch('js/data/sm-pre-calculated-embeddings.json');
                        
                        if (response.ok) {
                            // Parse the JSON
                            this.embeddingData = await response.json();
                            // console.log(`Successfully loaded ${this.embeddingData.length} pre-calculated embeddings`);
                            embeddingsLoaded = true;
                        } else {
                            // console.warn(`Failed to load pre-calculated embeddings: ${response.status}`);
                        }
                    } catch (loadError) {
                        // console.warn("Could not load pre-calculated embeddings:", loadError);
                    }
                    
                    // If embeddings weren't loaded, create minimal ones
                    if (!embeddingsLoaded) {
                        // console.log("Creating minimal embeddings from resume data");
                        this.embeddingData = [];
                        
                        // Add basic resume information as dummy embeddings
                        // In a real implementation, these would be actual embeddings
                        if (window.resumeData) {
                            const dummyEmbedding = new Array(384).fill(0).map(() => Math.random() * 2 - 1);
                            
                            // Add name
                            if (resumeData.name) {
                                this.embeddingData.push({
                                    text: `My name is ${resumeData.name}.`,
                                    embedding: dummyEmbedding,
                                    source: "Basic Info"
                                });
                            }
                            
                            // Add summary
                            if (resumeData.summary) {
                                this.embeddingData.push({
                                    text: resumeData.summary,
                                    embedding: dummyEmbedding,
                                    source: "Summary"
                                });
                            }
                            
                            // Add skills
                            if (resumeData.skills && resumeData.skills.length > 0) {
                                this.embeddingData.push({
                                    text: `My skills include: ${resumeData.skills.join(", ")}`,
                                    embedding: dummyEmbedding,
                                    source: "Skills"
                                });
                            }
                            
                            // console.log(`Created ${this.embeddingData.length} minimal embeddings`);
                        }
                    }
                    
                    // Create a map for quick lookup
                    this.embeddingData.forEach(item => {
                        this.embeddingMap.set(item.text, {
                            embedding: item.embedding,
                            source: item.source
                        });
                    });
                    
                    // Create vector store and add documents
                    const vectorStore = new VectorStore();
                    
                    if (this.progressCallback) {
                        this.progressCallback(40, "Loading embeddings into vector store");
                    }
                    
                    // Add all documents to the vector store
                    for (let i = 0; i < this.embeddingData.length; i++) {
                        const doc = this.embeddingData[i];
                        vectorStore.addDocument(doc.text, doc.embedding, doc.source);
                        
                        if (this.progressCallback && i % 10 === 0) {
                            const progress = 40 + Math.floor((i / this.embeddingData.length) * 50);
                            this.progressCallback(progress, `Loading embeddings: ${i}/${this.embeddingData.length}`);
                        }
                    }
                    
                    // Mark vector store as initialized
                    vectorStore.setInitialized();
                    
                    // Store the services
                    this.vectorStore = vectorStore;
                    
                    // Make vector store available globally
                    window.EmbeddingManager.setServices(this, vectorStore);
                    
                    this.initialized = true;
                    
                    if (this.progressCallback) {
                        this.progressCallback(100, "Initialization complete");
                    }
                    
                    // Extract QA pairs for reference
                    this.qaPairs = [];
                    this.embeddingData.forEach(doc => {
                        if (doc.source === 'QA Pair' && doc.text.startsWith('Q: ')) {
                            const parts = doc.text.split('A: ');
                            if (parts.length === 2) {
                                this.qaPairs.push({
                                    question: parts[0].substring(3).trim(),
                                    answer: parts[1].trim()
                                });
                            }
                        }
                    });
                    
                    return true;
                } catch (error) {
                    
                    // Initialize the embedding service for fallback
                    this.embeddingService = new EmbeddingService();
                    await this.embeddingService.initialize();
                    
                    // Fall back to the original initialization method
                    const result = await super.initialize();
                    
                    // Ensure we have the embeddingService from the parent class
                    if (result && !this.embeddingService) {
                        this.embeddingService = super.embeddingService;
                    }
                    
                    return result;
                }
            } else {
                // Initialize the embedding service for direct use
                this.embeddingService = new EmbeddingService();
                await this.embeddingService.initialize();
                
                // Use the original initialization method
                const result = await super.initialize();
                
                // Ensure we have the embeddingService from the parent class
                if (result && !this.embeddingService) {
                    this.embeddingService = super.embeddingService;
                }
                
                return result;
            }
        } catch (error) {
            // console.error('Pre-Calculated Embedding Service initialization error:', error);
            this.initializationError = error.message;
            return false;
        }
    }
    
    /**
     * Override the getEmbedding method to use pre-calculated embeddings when available
     */
    async getEmbedding(text) {
        if (!this.initialized) {
            throw new Error('Embedding service not initialized');
        }
        
        try {
            // Log the request for debugging
            // console.log(`Getting embedding for text: "${text.substring(0, 30)}..."`);
            
            // Check if we have a pre-calculated embedding
            if (this.usePreCalculatedEmbeddings && this.embeddingMap.has(text)) {
                // console.log('Using pre-calculated embedding');
                return this.embeddingMap.get(text).embedding;
            }
            
            // console.log('Pre-calculated embedding not found, computing on the fly');
            
            // If we don't have a pre-calculated embedding, compute it on the fly
            if (!this.embeddingService) {
                                // Initialize the embedding service on demand
                                this.embeddingService = new EmbeddingService();
                                await this.embeddingService.initialize();
                                // console.log('On-demand embedding service initialized');
                            }
            
            if (!this.embeddingService) {
                throw new Error('Failed to initialize embedding service');
            }
            
            // Use the embedding service to compute the embedding
            // console.log('Computing embedding on the fly');
            const embedding = await this.embeddingService.getEmbedding(text);
            // console.log('Embedding computed successfully');
            return embedding;
        } catch (error) {
            // console.error('Error in getEmbedding:', error);
            throw error;
        }
    }
    
    /**
     * Override the sendMessage method to handle pre-calculated embeddings
     */
    async sendMessage(message, streamCallback = null, customParams = null) {
        if (!this.initialized) {
            throw new Error("Model not initialized");
        }
        
        try {
            // Log the incoming message
            // console.log("Processing message:", message);
            
            let queryEmbedding;
            
            // Check if we have a pre-calculated embedding for this message
            if (this.usePreCalculatedEmbeddings && this.embeddingMap.has(message)) {
                // console.log('Using pre-calculated embedding for query');
                queryEmbedding = this.embeddingMap.get(message).embedding;
            } else {
                // console.log('Computing embedding for query on the fly');
                // Get embedding for the query
                queryEmbedding = await this.getEmbedding(message);
            }
            
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
}

// Make the service class globally available
// Make the service class globally available
window.PreCalculatedModelService = PreCalculatedEmbeddingModelService;

// The service class is already made available globally above