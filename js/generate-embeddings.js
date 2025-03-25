/**
 * Node.js script to generate pre-calculated embeddings for the webllm-app resume data
 * To run this script: node generate-embeddings.js
 */

// Check if running in Node.js environment
if (typeof window !== 'undefined') {
    console.error('This script is meant to be run with Node.js, not in a browser.');
    throw new Error('Unsupported environment: This script requires Node.js');
}

// Import required Node.js modules
import { pipeline } from '@xenova/transformers';
import fs from 'fs/promises';
import path from 'path';

// Import resume data from the resume-data.js file
async function loadResumeData() {
    try {
        // Read the resume-data.js file content
        const resumeDataPath = path.join(process.cwd(), 'resume-data.js');
        const fileContent = await fs.readFile(resumeDataPath, 'utf8');
        
        // Extract the resumeData object using regex to handle the variable assignment format
        const resumeDataMatch = fileContent.match(/const\s+resumeData\s*=\s*(\{[\s\S]*?\});\s*(?:\/\/|\/\*|$)/m);
        if (!resumeDataMatch || !resumeDataMatch[1]) {
            throw new Error('Could not find resumeData object in the file');
        }
        
        // Safely evaluate the resumeData object
        const resumeDataStr = resumeDataMatch[1];
        // Using eval is generally not recommended, but in this controlled script for a specific file it's acceptable
        // In a production environment, a safer JSON parsing approach would be preferred
        const resumeData = eval(`(${resumeDataStr})`);
        
        console.log('Successfully loaded resume data from resume-data.js');
        return resumeData;
    } catch (error) {
        console.error('Error loading resume data:', error);
        throw error;
    }
}

// Similarly, load the QA pairs function if it exists
async function loadQAPairsFunction() {
    try {
        // Read the resume-data.js file content to check if it contains getResumeQAPairs function
        const resumeDataPath = path.join(process.cwd(), 'resume-data.js');
        const fileContent = await fs.readFile(resumeDataPath, 'utf8');
        
        // Check if the file contains getResumeQAPairs function
        const qaPairsFunctionMatch = fileContent.match(/function\s+getResumeQAPairs\s*\(\)\s*\{[\s\S]*?return\s+(\[[\s\S]*?\]);\s*\}/m);
        
        if (qaPairsFunctionMatch && qaPairsFunctionMatch[1]) {
            // If found, evaluate the function body (the return value array)
            const qaPairsStr = qaPairsFunctionMatch[1];
            const qaPairs = eval(`(${qaPairsStr})`);
            console.log('Successfully loaded QA pairs from resume-data.js');
            return qaPairs;
        }
        
        // If not found in resume-data.js, use the hardcoded QA pairs below
        console.log('Using hardcoded QA pairs as they were not found in resume-data.js');
        return getResumeQAPairs();
    } catch (error) {
        console.error('Error loading QA pairs:', error);
        // Fallback to hardcoded QA pairs
        console.log('Falling back to hardcoded QA pairs');
        return getResumeQAPairs();
    }
}

/**
 * Get QA pairs from resume data - this is a fallback implementation 
 * if the function isn't found in resume-data.js
 */
function getResumeQAPairs() {
  return [
    {
        question: "What is your name?",
        answer: "Stephen Mustgrave"
    },
    {
        question: "What do you do?",
        answer: "I am a Drupal Community Engagement Specialist. Highly skilled and motivated web and software development professional who supports Drupal's open-source community."
    },
    {
        question: "What are your skills?",
        answer: "My key skills include: Drupal (Versions 11-7), PHP, JavaScript, SCSS/CSS, Twig, component based theme development leveraging third party libraries like USWDS, front-end development with responsive CSS3 design and preprocessors, 508 accessibility standards implementation, SEO best practices, Agile development methodologies, familiarity with Acquia, Azure, and AWS platforms."
    },
    {
        question: "Tell me about your Drupal contributions.",
        answer: "My Drupal contributions include: Sub-maintainer for Drupal core – Block Content, Text, and Telephone components, lead for Drupal core's initiative #needs-review-queue-initative, maintainer or co-maintainer of 40+ contrib modules, attendance at several DrupalCon and GovCon conferences, and delivering a training session at Drupal GovCon 2024 for component-based theming using USWDS."
    },
    {
        question: "Tell me about your experience.",
        answer: "I have worked at several companies, most recently at Mobomo since 09/2020. I've worked on projects for University of Alabama, Gulf Spill Restoration, Engendering Industries, and several federal agencies."
    },
    {
        question: "What company do you work for?",
        answer: "I currently work at Mobomo."
    },
    {
        question: "What certifications do you have?",
        answer: "I hold the following certifications: Acquia Certified Developer (7, 8, 9), Acquia Certified Site Builder (8, 9), Acquia Certified Front-End Specialist (Drupal 9), Certified ScrumMaster – 03-16-2021 (Scrum Alliance), DHS 508 Accessibly Certified (2018)."
    },
    {
        question: "Tell me about your community engagement.",
        answer: "I work as a Drupal Community Engagement Specialist (2024-current). To elevate my current company's status within the Drupal community I was given a unique role. Key achievements include: Maintained #4 status for over a year on a global ranking, part of DrupalCon Atlanta 2025 steering committee, mentored new users in learning about positive contribution, maintained 40+ modules used on thousands web sites, provided detailed reports to management on progress, helped plan any company involvement at Drupal conferences, promoted company brand."
    },
    {
        question: "What is your education?",
        answer: "I have a Bachelor of Science in Technology from Radford University, graduated in 05/2013. Concentration in Computer Science and Software Engineering, Minor in Applied Mathematics"
    },
    {
        question: "Where have you worked?",
        answer: "I have worked at Mobomo, CGI Federal, Unisys Corporation, Bluewater Federal Solutions, KForce."
    },
    {
        question: "How can I contact you?",
        answer: "You can reach me at: \nEmail: smustgrave@gmail.com \nPhone: (757)635-2922 \nLinkedIn: https:/www.linkedin.com/in/stephen-mustgrave \nDrupal.org: https://www.drupal.org/u/smustgrave"
    },
    {
        question: "What federal agencies have you worked with?",
        answer: "I've worked with several federal agencies including the Office of Naval Research, Federal Energy Regulatory Commission, Centers of Medicare and Medicaid Services, United States Customs and Border Protection, Federal Emergency Management Agency, and Transportation Security Administration."
    },
    {
        question: "What is your experience with Drupal?",
        answer: "I have over 10 years of experience with Drupal versions 7 through 11. I'm a sub-maintainer for Drupal core components, maintain over 40 contrib modules, and have led numerous Drupal migration projects from version 7 to 8/9/10."
    },
    {
        question: "Do you have experience with accessibility standards?",
        answer: "Yes, I'm DHS 508 Accessibility Certified (2018) and have implemented accessibility standards across numerous government websites. I regularly perform 508 compliance testing and collaborate with accessibility teams."
    },
    {
        question: "What's your approach to component-based theming?",
        answer: "I leverage component-based theme development using third-party libraries like USWDS. For example, on the University of Alabama DDRC project, I architected a site using a component-based USWDS theme. For the Engendering Industries project, I implemented a USWDS-based sub-theme with a component-based structure following atomic design principles."
    },
    {
        question: "How do you handle Drupal migrations?",
        answer: "I've led numerous migrations, including Drupal 7 to 10 for Gulf Spill Restoration, Sitecore to Drupal for the Office of Naval Research, and Drupal 7 to 8 for Louisville KY's website. My approach includes proper planning, team coordination, custom migration scripts, and thorough testing."
    },
    {
        question: "What's your experience with search functionality in Drupal?",
        answer: "I have extensive experience implementing search functionality. For the Pandemic Oversight project, I implemented search API and Solr indexing. For Louisville KY, I set up Solr services and views. For FERC, I conducted SEO audits to improve search performance."
    },
    {
        question: "How do you approach technical leadership on Drupal projects?",
        answer: "As a Tech Lead on several projects, I focus on clear communication with clients and team members, well-defined tickets and proper sprint planning, setting up consistent development environments, architecture planning with a focus on user experience, and ensuring best practices for SEO, accessibility, and security."
    },
    {
        question: "What Drupal version are you currently working with the most?",
        answer: "I'm currently working the most with Drupal 10, particularly on migration projects like Gulf Spill Restoration."
    },
    {
        question: "Have you presented at any Drupal events?",
        answer: "Yes, I delivered a training session at Drupal GovCon 2024 focused on component-based theming using USWDS."
    },
    {
        question: "What's your favorite Drupal module?",
        answer: "While I maintain over 40 modules, I spend significant time with Block Content as a core sub-maintainer."
    },
    {
        question: "Do you work remotely or in-office?",
        answer: "I work Remotely. I'm based in Springfield, VA and work with Mobomo, which is located in Tysons Corner, VA."
    },
    {
        question: "What types of clients do you typically work with?",
        answer: "I primarily work with government agencies, including federal agencies like NOAA and FERC, as well as educational institutions like the University of Alabama."
    },
    {
        question: "How long have you been a Drupal core contributor?",
        answer: "I've been deeply involved with Drupal core as a sub-maintainer for the Block Content, Text, and Telephone components, and I lead the #needs-review-queue-initiative."
    }
  ];
}

/**
 * Prepare resume chunks for embedding - implements the exact same logic as the browser
 */
function prepareResumeChunks() {
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
 * Embedding Service for computing embeddings - implements the same logic as browser
 */
class EmbeddingService {
    constructor() {
        this.modelName = 'Xenova/all-MiniLM-L6-v2';
        this.pipeline = null;
        this.initialized = false;
    }

    /**
     * Initialize the embedding model
     */
    async initialize() {
        try {
            console.log(`Initializing embedding model: ${this.modelName}`);
            
            // Configure transformers.js to use the same settings
            process.env.TRANSFORMERS_CACHE = './cache'; // Local cache
            console.log('Cache directory:', process.env.TRANSFORMERS_CACHE);
            
            // Initialize the pipeline with the same parameters as browser
            this.pipeline = await pipeline('feature-extraction', this.modelName, {
                quantized: false, // Use non-quantized model for better compatibility
            });
            
            this.initialized = true;
            console.log('Embedding model initialized successfully');
            return true;
        } catch (error) {
                        throw error;
        }
    }

    /**
     * Compute embedding for a text string - same as browser implementation
     */
    async getEmbedding(text) {
        if (!this.initialized) {
            throw new Error('Embedding service not initialized');
        }

        try {
            // Get embedding from model using the exact same parameters
            const result = await this.pipeline(text, {
                pooling: 'mean',
                normalize: true
            });
            
            // Extract the embedding data
            return Array.from(result.data);
        } catch (error) {
            console.error('Error computing embedding:', error);
            throw error;
        }
    }
}

/**
 * Main function to generate embeddings
 */
async function generateEmbeddings() {
    try {
        // Load resume data and QA pairs from files
        const resumeData = await loadResumeData();
        const qaPairs = await loadQAPairsFunction();
        
        // Create embedding service
        const embeddingService = new EmbeddingService();
        await embeddingService.initialize();
        console.log('Embedding model initialized');
        
        // Make resumeData available for the prepareResumeChunks function
        global.resumeData = resumeData;
        
        // Prepare all documents
        const resumeChunks = prepareResumeChunks();
        console.log(`Prepared ${resumeChunks.length} resume chunks`);
        console.log(`Prepared ${qaPairs.length} QA pairs`);
        
        // Combine resume chunks and QA pairs for embedding
        const allDocuments = [...resumeChunks];
        
        // Add QA pairs as documents
        qaPairs.forEach(qa => {
            allDocuments.push({
                text: `Q: ${qa.question} A: ${qa.answer}`,
                source: "QA Pair"
            });
        });
        
        console.log(`Found ${allDocuments.length} total documents to process`);
        
        // Calculate embeddings for all chunks
        const embeddedChunks = [];
        let count = 0;
        
        for (const chunk of allDocuments) {
            try {
                // Calculate embedding
                const embedding = await embeddingService.getEmbedding(chunk.text);
                
                // Store chunk with its embedding
                embeddedChunks.push({
                    text: chunk.text,
                    source: chunk.source,
                    embedding: embedding
                });
                
                // Update progress
                count++;
                if (count % 5 === 0 || count === allDocuments.length) {
                    console.log(`Processed ${count}/${allDocuments.length} documents`);
                }
            } catch (error) {
                console.error(`Error embedding document "${chunk.text.substring(0, 30)}...": ${error.message}`);
            }
        }
        
        // Create output directory if it doesn't exist
        const outputDir = path.join('data');
        try {
            await fs.mkdir(outputDir, { recursive: true });
        } catch (err) {
            console.log(`Directory ${outputDir} already exists or could not be created.`);
        }
        
        // Save embeddings to a JSON file
        const outputFile = path.join(outputDir, 'pre-calculated-embeddings.json');
        await fs.writeFile(outputFile, JSON.stringify(embeddedChunks, null, 2));
        
        console.log(`Successfully saved ${embeddedChunks.length} embedded documents to ${outputFile}`);
    } catch (error) {
        console.error('Error in generateEmbeddings:', error);
        throw error;
    }
}

// Run the generation process
generateEmbeddings().catch(error => {
    console.error('Error generating embeddings:', error);
    process.exit(1);
});