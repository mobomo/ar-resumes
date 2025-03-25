/**
 * Dan Narkiewicz's resume data in JSON format
 * Created based on resume documents from 2024
 */
const resumeData = {
    name: "Dan Narkiewicz",
    title: "Director of Technology",
    location: "",
    summary: "Strategic technology leader and long-term contributor to GSA, with repeated success dating back to 2013 delivering upon GSA initiatives in multiple capacities. Talented professional adept at navigating through ambiguity to design solutions that align technical requirements with business objectives. Strong knowledge and comfort with the entire SDLC including estimating, analysis, technical requirements, design, construction, and unit and integration testing. Accomplished team builder and mentor with flexibility to drive production in prime and subcontractor capacities. Consummate professional with advanced business and technical acumen necessary to translate technical concepts to non-technical audiences to build and maintain consensus. Technical SME with a concentration in backend engineering, a PHP expert with a strong programming background, and Drupal experience.",
    
    skills: {
        frameworks: "Drupal 7-11, WordPress, Symfony, Laravel, Express, Zope, Ruby on Rails, NodeJS, NextJS",
        dataStorage: "MySQL, Postgres, SQLite, Oracle, MongoDB, ZODB, ElasticSearch, SOLR, Redis, BerkleyDB, Amazon S3, Azure Blob Storage",
        systemArchitecture: "Amazon Web Services, AWS GovCloud, GSA Cloud.gov, Microsoft Azure, Docker, Kubernetes, Acquia SiteFactory, Azure Webapps",
        projectManagement: "Jira and YouTrack, Agile/Scrum with Git-Flow, Team Lead (2-20 members)",
        security: "FedRamp, FISMA, FIPS, NIST, OWASP",
        dataMigration: "SiteCore, Pangea, SiteLogic, Percussion, Drupal, WordPress"
    },
    
    certifications: [
        "Certified Scrum Master",
        "AWS Certified Developer",
        "Acquia Certified Site Builder -- Drupal 8",
        "Acquia Certified Developer -- Drupal 8"
    ],
    
    experience: [
        {
            company: "Mobomo, LLC",
            location: "",
            period: "May 2019 – Present",
            position: "DevOps Engineer",
            description: "Direct complex technical projects for critical contracts including GSA, serving as a singular point of contact to ensure seamless delivery of contract deliverables. Challenge talented teams to stretch the limits of design using a combination of knowledge, specialized skills, and organizational leadership, maximizing output through the removal of roadblocks, the accuracy of feature documentation, conflict resolution, amplification of all voices within meetings, and effective navigation through constantly changing landscapes.",
            projects: [
                {
                    name: "EngenderingIndustries.org, UA.edu, FHFA.gov",
                    achievements: [
                        "Designed and Implemented Kubernetes-based architecture for web application hosting, logging, monitoring, and scaling."
                    ]
                },
                {
                    name: "USA.gov Future Tech (GSA)",
                    achievements: [
                        "Generated alternate interface demos using: Drupal API access points, Amazon Alexa, Amazon Lex discussions, OpenAI ChatGPT."
                    ]
                },
                {
                    name: "USA.gov Revamp (GSA)",
                    achievements: [
                        "Migrated AWS Hosted Drupal 7 to Cloud.gov hosted Drupal 9-10, including setup for Drupal hosting on Cloud.gov and Cloud Foundry, Egress, WAF, SSP, and static site generation and hosted on S3"
                    ]
                },
                {
                    name: "USA.gov (GSA)",
                    achievements: [
                        "Combined leadership responsibilities with hands on technical contributions, including debugging complex multi-layered caching issues between Acquia, Akamai, and Varnish",
                        "Improved SEO through enhanced analytics processes, contributed to the security authorization process, and managed log shipping to Splunk and configuration management for the project"
                    ]
                },
                {
                    name: "GO.USA.gov shutdown (GSA)",
                    achievements: [
                        "Proposed and implemented sunset plan for shortened urls. Convinced GSA that there was no need to fully abandon the site and minimal-cost solution was attainable"
                    ]
                },
                {
                    name: "PMEL (NOAA)",
                    achievements: [
                        "Designed and implemented a FedRap-compliant Drupal 11 hosting architecture using Podman for Custom on-prem Redhat VM container hosts",
                        "Developed a custom deployment procedure enabling continuous blue-green deployments throughout the day",
                        "Performed complex migration consolidating down to a common set of content and media types during the process"
                    ]
                },
                {
                    name: "Voice of America (VOA)",
                    achievements: [
                        "Spearheaded a high-performance migration from Pangea CMS to Drupal, reducing process time from weeks to under eight hours through parallelization, container based scaling, and robust transformation logic",
                        "Directed the development and launch of Spanish, Persian, Mandarin, Russian, and Korean versions of www.voanews.com, ensuring completion ahead of schedule"
                    ]
                },
                {
                    name: "PRAC (Postal)",
                    achievements: [
                        "Served as DevOps Engineer and Drupal Developer, creating custom data visualizations on Azure, including systems architecture involving Drupal WebApp containers, Azure Function, Solr search, Azure Cache for Redis, Azure MySQL, Blob Storage Volumes, FrontDoor CDN, and Build/backup/deployment procedures",
                        "Developed an advanced faceted search tool for articles and PDFs to aggregate financial data related to the pandemic",
                        "Executed RTIS mapping to tie data to geographic locations across the US",
                        "Created automated accessibility testing framework to generate reports as part of deployment process",
                        "Implemented custom UI components which lead to the creation of three Drupal modules: USWDS CKEditor Integration, USWDS Layout Builder Configuration, USWDS Paragraph Components"
                    ]
                }
            ]
        },
        {
            company: "CTAC",
            location: "",
            period: "January 2013 – May 2019",
            position: "Senior Systems Analyst",
            description: "Facilitated delivery of numerous contracts across public and private sector clients, Contract Involvement Includes: USA.gov, HHS, GSA.gov, Business.USA.gov, Go.USA.gov, Benchmarks.USA.gov, Challenge.gov, twa800.sites.USA.gov, sites.USA.gov, App.USA.gov.",
            projects: [
                {
                    name: "General Services Administration",
                    position: "Technical Lead for GSA.gov Family",
                    achievements: [
                        "Led architecture and development for a Drupal multi-site installation supporting the flagship GSA site, enabling content section maintenance for multiple autonomous users",
                        "Designed and deployed a customer workflow, hierarchical role-based authentication system, and custom templating solutions for distributed responsibilities"
                    ]
                },
                {
                    name: "WordPress Developer, USA.gov GSA",
                    achievements: [
                        "Developed a WordPress multisite hosting platform to onboard ~40 individual websites, allowing site admins autonomy within a managed plugin framework",
                        "Integrated OMBMax SSO service for seamless authentication and authorization"
                    ]
                },
                {
                    name: "Drupal Developer for Business, USA.gov",
                    achievements: [
                        "Migrated Business.USA.gov to a Docker-based AWS infrastructure, developing a new Drupal-based continuous aggregation service to collect and load FBO items into ElasticSearch",
                        "Delivered a custom search API as a Drupal REST service paired with a Single Page Application (SPA) front-end"
                    ]
                },
                {
                    name: "NodeJS Developer, USA.gov GSA Apps",
                    achievements: [
                        "Created a Node.js application to manage Federal Mobile Application Galleries, including a scraper to gather app details from iTunes, Google Play, and Blackberry World",
                        "Designed an admin interface for managing mobile apps, generated a static site for public consumption, and developed a fuzzy-matching custom search feature using MongoDB"
                    ]
                },
                {
                    name: "Technical Lead, USA.gov Family GSA",
                    achievements: [
                        "Directed a team of 2-5 Drupal developers to create a scalable suite of Hub-Spoke websites hosted on AWS, with a centralized Drupal CMS Hub feeding child sites such as www.usa.gov, www.gobierno.usa.gov, and others",
                        "Integrated authentication/authorization via GSA SecureAuth and provided CDN integration with Akamai and CloudFront"
                    ]
                },
                {
                    name: "Go.USA.gov",
                    position: "Lead Developer",
                    achievements: [
                        "Served as Lead Developer for Go, a custom Drupal-based URL shortening service designed exclusively for government use",
                        "Built a Docker-based AWS hosting infrastructure to ensure scalability, reliability, and performance",
                        "Designed and implemented a custom MySQL link analytics system, enabling multi-year data aggregation across numerous parameters and time ranges, optimized for minimal storage requirements",
                        "Developed a high-performance, 508-compliant, multi-platform user interface to maximize accessibility and facilitate widespread viewing of analytics data"
                    ]
                }
            ]
        },
        {
            company: "Mobomo, LLC",
            location: "",
            period: "2023 – Present", 
            position: "Technical Director",
            description: "Promoted for exceptional leadership on multiple projects and ability to navigate across operations, from back-end to front-end, DevOps migrations, DevOps engineering, Drupal development, security tech writing. Charged with ensuring operational functionality across all contracts, solutioning at a high level as Drupal SME and systems architecture able to expand internal team capabilities."
        }
    ],
    
    education: [
        {
            institution: "William & Mary",
            location: "Williamsburg, VA",
            degree: "Bachelor of Science in Computer Science",
            year: "2001"
        }
    ],
    
    relevantExperience: {
        years: "11+",
        focus: "Backend engineering, PHP programming, Drupal development, DevOps, Systems Architecture"
    },
    
    keyAttributes: [
        "Strategic technology leader",
        "Technical requirements and business objectives alignment",
        "Full SDLC knowledge and experience",
        "Team building and mentoring",
        "Technical concepts translation to non-technical audiences",
        "Backend engineering expertise"
    ]
};

/**
 * Convert a resume JSON object to markdown format
 * This function dynamically walks through the resume data structure
 * and generates appropriate markdown based on the content type
 */
function convertResumeToMarkdown(resumeData) {
  let markdown = '';

  // Helper function to process arrays into lists
  const arrayToList = (arr, ordered = false) => {
    if (!arr || arr.length === 0) return '';
    
    return arr.map((item, index) =>
      ordered ? `${index + 1}. ${item}` : `* ${item}`
    ).join('\n');
  };

  // Helper function to process objects with string values
  const objectToList = (obj) => {
    if (!obj) return '';
    
    return Object.entries(obj).map(([key, value]) =>
      `* **${capitalizeFirstLetter(key)}:** ${value}`
    ).join('\n');
  };

  // Helper to capitalize first letter of a string
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Process each key in the resume data
  for (const key in resumeData) {
    if (Object.prototype.hasOwnProperty.call(resumeData, key)) {
      const value = resumeData[key];
      
      // Format the section header based on the key
      const sectionTitle = key === 'name' ? '' : `## ${capitalizeFirstLetter(key.replace(/([A-Z])/g, ' $1').trim())}\n\n`;
      
      // Handle different types of data
      if (key === 'name') {
        markdown += `# ${value}\n\n`;
      }
      // Handle title
      else if (key === 'title') {
        markdown += `*${value}*\n\n`;
      }
      // Handle summary
      else if (key === 'summary') {
        markdown += `${sectionTitle}${value}\n\n`;
      }
      // Handle skills object
      else if (key === 'skills') {
        markdown += `${sectionTitle}`;
        Object.entries(value).forEach(([skillKey, skillValue]) => {
          markdown += `* **${capitalizeFirstLetter(skillKey)}:** ${skillValue}\n`;
        });
        markdown += '\n';
      }
      // Handle certifications array
      else if (key === 'certifications') {
        markdown += `${sectionTitle}${arrayToList(value)}\n\n`;
      }
      // Handle experience array
      else if (key === 'experience') {
        markdown += `${sectionTitle}`;
        value.forEach(job => {
          markdown += `### ${job.position} at ${job.company}\n`;
          markdown += `*${job.period}*\n\n`;
          if (job.description) {
            markdown += `${job.description}\n\n`;
          }
          if (job.projects && job.projects.length > 0) {
            job.projects.forEach(project => {
              markdown += `#### ${project.name}\n`;
              if (project.position) {
                markdown += `*${project.position}*\n\n`;
              }
              if (project.achievements && project.achievements.length > 0) {
                markdown += `${arrayToList(project.achievements)}\n\n`;
              }
            });
          }
        });
      }
      // Handle education array
      else if (key === 'education') {
        markdown += `${sectionTitle}`;
        value.forEach(edu => {
          markdown += `### ${edu.degree}\n`;
          markdown += `*${edu.institution}, ${edu.location} (${edu.year})*\n\n`;
        });
      }
      // Special handling for relevantExperience
      else if (key === 'relevantExperience') {
        markdown += `${sectionTitle}`;
        markdown += `${value.years} years of experience with focus on ${value.focus}\n\n`;
      }
      // Special handling for contact info
      else if (key === 'contact') {
        markdown += `${sectionTitle}`;
        
        Object.entries(value).forEach(([contactKey, contactValue]) => {
          if (contactKey === 'email') {
            markdown += `* **Email:** [${contactValue}](mailto:${contactValue})\n`;
          } else if (contactKey === 'phone') {
            markdown += `* **Phone:** ${contactValue}\n`;
          } else if (typeof contactValue === 'string' && contactValue.startsWith('http')) {
            markdown += `* **${capitalizeFirstLetter(contactKey)}:** [${contactValue}](${contactValue})\n`;
          } else {
            markdown += `* **${capitalizeFirstLetter(contactKey)}:** ${contactValue}\n`;
          }
        });
        
        markdown += '\n';
      }
      // Handle keyAttributes array
      else if (key === 'keyAttributes') {
        markdown += `${sectionTitle}${arrayToList(value)}\n\n`;
      }
      // Handle other objects
      else {
        markdown += `${sectionTitle}${objectToList(value)}\n\n`;
      }
    }
  }
  
  return markdown;
}


/**
 * Convert resume data to a series of question-answer pairs for reference
 * @returns {Array<Object>} Array of Q&A pairs
 */
function getResumeQAPairs() {
  return [
    {
        question: "What is your name?",
        answer: "Dan Narkiewicz"
    },
    {
        question: "What positions have you held?",
        answer: "I've held positions as Director of Technology, Technical Director, DevOps Engineer, and Senior Systems Analyst."
    },
    {
        question: "What are your certifications?",
        answer: "I hold certifications including Certified Scrum Master, AWS Certified Developer, Acquia Certified Site Builder for Drupal 8, and Acquia Certified Developer for Drupal 8."
    },
    {
        question: "What technologies are you proficient in?",
        answer: "I'm proficient in Drupal 7-11, WordPress, various PHP frameworks (Symfony, Laravel), NodeJS, NextJS, databases (MySQL, MongoDB, ElasticSearch, SOLR), and cloud platforms (AWS, Azure, Cloud.gov)."
    },
    {
        question: "What is your experience with Drupal?",
        answer: "I have extensive experience with Drupal from versions 7 through 11, including migrations, customizations, multi-site implementations, and integration with various services. I've worked on numerous government sites using Drupal and have certifications from Acquia for Drupal 8."
    },
    {
        question: "What government agencies have you worked with?",
        answer: "I've worked with GSA, NOAA (PMEL), Voice of America (VOA), PRAC, HHS, and collaborated on projects for numerous government websites including USA.gov, GSA.gov, Business.USA.gov, Go.USA.gov, and others."
    },
    {
        question: "What DevOps experience do you have?",
        answer: "I have extensive DevOps experience including AWS and Azure cloud architecture, Docker and Kubernetes implementations, blue-green deployments, CI/CD pipelines, and FedRAMP compliant hosting solutions."
    },
    {
        question: "What is your experience with cloud technologies?",
        answer: "I have deep experience with Amazon Web Services, AWS GovCloud, GSA Cloud.gov, Microsoft Azure, Docker, Kubernetes, Acquia SiteFactory, and Azure Webapps. I've designed and implemented cloud architectures for government agencies and migrated applications to cloud environments."
    },
    {
        question: "What security standards are you familiar with?",
        answer: "I'm familiar with FedRAMP, FISMA, FIPS, NIST, and OWASP security standards and have implemented systems compliant with these requirements."
    },
    {
        question: "What was your role at Mobomo?",
        answer: "At Mobomo, I've served as both a DevOps Engineer and Technical Director, directing complex technical projects for critical contracts including GSA, and leading talented teams through challenging implementations."
    },
    {
        question: "What was your contribution to USA.gov?",
        answer: "For USA.gov, I migrated from AWS Hosted Drupal 7 to Cloud.gov hosted Drupal 9-10, debugged complex multi-layered caching issues between Acquia, Akamai, and Varnish, improved SEO through analytics processes, contributed to security authorization, and managed log shipping to Splunk and configuration management."
    },
    {
        question: "What was your experience at CTAC?",
        answer: "At CTAC (2013-2019), I served as a Senior Systems Analyst facilitating numerous contracts across public and private sectors. I led projects for GSA.gov, WordPress and Drupal development for USA.gov, Node.js development for federal mobile applications, and created a custom URL shortening service."
    }
  ];
}
