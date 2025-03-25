/**
 * Stephen Mustgrave's resume data in JSON format
 */
const resumeData = {
    name: "Stephen Mustgrave",
    title: "Drupal Developer",
    location: "Springfield, VA",
    summary: "Highly skilled and motivated web and software development professional with over 10 years of experience in designing, implementing, integrating, and maintaining enterprise-level Drupal applications. Advanced knowledge in the software development life cycle with exposure to a wide range of technologies and tools. Proven ability to work well within team environments as well as independently. Extremely motivated to expand my skillset and continue to support Drupal's open-source community.",
    
    skills: [
        "Drupal: Versions 11-7",
        "Languages: PHP, JavaScript, SCSS/CSS, Twig",
        "Component based theme development leveraging third party libraries like USWDS",
        "Front-end Development: Responsive CSS3 design, preprocessors like LESS and SASS, and 508 accessibility standards",
        "Deep understanding and implementation of best SEO practices in Drupal",
        "Agile Development: Familiar with Agile methodologies",
        "Familiar with Acquia, Azure, and AWS platforms",
        "Communication: Strong verbal communication skills with clients and team members",
        "Self-motivation: Constantly seeking to improve and learn more within the field"
    ],
    
    drupalContributions: [
        "Sub-maintainer for Drupal core – Block Content, Text, and Telephone components",
        "Lead for Drupal core's initiative #needs-review-queue-initative",
        "Maintainer or Co-maintainer of 40+ contrib modules",
        "Attended several DrupalCon and GovCon conferences",
        "Training session at Drupal GovCon 2024 for component-based theming using USWDS"
    ],
    
    communityEngagement: {
        position: "Drupal Community Engagement Specialist",
        period: "2024-current",
        description: "To elevate my current company's status within the Drupal community I was given a unique role.",
        achievements: [
            "Maintained #4 status for over a year on a global ranking",
            "Part of DrupalCon Atlanta 2025 steering committee",
            "Mentored new users in learning about positive contribution",
            "Maintained 40+ modules used on thousands web sites",
            "Provide detailed reports to management on progress",
            "Helped plan any company involvement at Drupal conferences",
            "Promote company brand"
        ]
    },
    
    certifications: [
        "Acquia Certified Developer (7, 8, 9)",
        "Acquia Certified Site Builder (8, 9)",
        "Acquia Certified Front-End Specialist (Drupal 9)",
        "Certified ScrumMaster – 03-16-2021 (Scrum Alliance)",
        "DHS 508 Accessibly Certified (2018)"
    ],
    
    experience: [
        {
            company: "Mobomo",
            location: "Tysons Corner, VA",
            period: "09/2020 – Current",
            projects: [
                {
                    name: "University of Alabama - DDRC",
                    position: "Tech Lead",
                    achievements: [
                        "Architected a brand-new website using a component based USWDS theme",
                        "Helped lead several requirement gathering calls with our UX developer",
                        "Planned out tickets for myself and other devs several sprints in advance, with timelines in mind",
                        "Built the content types and backend UI with user input and ease-of-use in mind",
                        "Frontend components were built to match approved Figma designs"
                    ]
                },
                {
                    name: "Gulf Spill Restoration",
                    position: "Tech Lead",
                    url: "https://www.gulfspillrestoration.noaa.gov/",
                    achievements: [
                        "Led the migration from Drupal 7 to Drupal 10 for a site with less than 100 pages and approximately 5,000 files",
                        "Managed a team of four, coordinated with the PM to ensure tickets were well-defined, and scoped out all aspects of the migration",
                        "Upgraded the theme from Bootstrap 3 to Bootstrap 5",
                        "Set up a Tugboat service environment for QA when the agency DevOps team was unresponsive. Developed custom scripts to organize and clean up legacy files"
                    ]
                },
                {
                    name: "Engendering Industries",
                    position: "Tech Lead",
                    url: "https://www.engenderingindustries.org/",
                    achievements: [
                        "Took over a delayed project, reorganized the JIRA board, and restructured the team",
                        "Implemented a consistent local environment for consistency among developers",
                        "Used a USWDS-based sub-theme and component-based structure following atomic design principles",
                        "Regularly communicated with clients to gather requirements and manage expectations",
                        "Handled the entire Drupal application setup, including search features, content types, and best practice modules for SEO, accessibility, and security"
                    ]
                },
                {
                    name: "Federal Energy Regulatory Commission",
                    position: "Tech Lead",
                    url: "https://ferc.gov/",
                    achievements: [
                        "Briefly involved in this O&M project, focusing on client satisfaction and site maintenance",
                        "Prepared for Drupal 10, conducted SEO, 508, and security audits, and set up OAuth authentication with Azure"
                    ]
                },
                {
                    name: "Office of Naval Research",
                    position: "Lead Drupal Developer",
                    url: "https://www.nre.navy.mil/",
                    achievements: [
                        "Led the migration and redesign from Sitecore to Drupal",
                        "Handled migration, site building, backend development, and frontend theming",
                        "Developed custom scripts for SEO and 508 compliances",
                        "Organized weekly client calls and internal team communications",
                        "Created a compartmentalized site structure to manage content and media access permissions"
                    ]
                },
                {
                    name: "Louisville KY",
                    position: "Lead Drupal Developer / Tech Lead",
                    url: "https://louisvilleky.gov/",
                    achievements: [
                        "Led the migration and redesign from Drupal 7 to Drupal 8",
                        "Oversaw project progress and task allocation",
                        "Prioritized tasks to meet tight deadlines, assisted in QA testing, and developed a toolkit using a REST API",
                        "Set up Solr services and views, performed configurations, and engaged in client communication"
                    ]
                },
                {
                    name: "Pandemic Oversight",
                    position: "Regular developer / Lead Drupal Developer",
                    url: "https://www.pandemicoversight.gov/",
                    achievements: [
                        "Worked as a contractor to develop and redesign the Pandemic Resource Accountability Committee website",
                        "Implemented custom feed importers, search API, and Solr indexing",
                        "Developed custom layouts and performed 508 testing on key pages"
                    ]
                }
            ]
        },
        {
            company: "CGI Federal",
            location: "FAIRFAX, VA",
            period: "04/2019 – 04/2020",
            position: "Drupal Developer",
            projects: [
                {
                    name: "Centers of Medicare and Medicaid Services (CMS)",
                    url: ["https://www.cms.gov/", "https://www.medicare.gov/"],
                    achievements: [
                        "Planned, designed, and migrated CMS's public-facing website to Drupal 8. Identified best Drupal practices, wrote custom patches, and created import scripts",
                        "Led daily scrum calls, provided team demos, and managed Acquia Cloud deployments",
                        "Collaborated with the 508-compliance team to ensure all code met accessibility standards"
                    ]
                }
            ]
        },
        {
            company: "Unisys Corporation",
            location: "Reston, VA",
            period: "04/2016 – 04/2019",
            position: "Lead Software Developer",
            projects: [
                {
                    name: "United States Customs and Border Protection (CBP)",
                    url: "https://www.cbp.gov/",
                    achievements: [
                        "Maintained and updated CBP's Drupal 7 site, prepared for Drupal 8 migration, and ensured compliance with DHS standards",
                        "Managed monthly updates, attended client meetings, and advised on site capabilities",
                        "Utilized Atlassian tools for issue tracking, documentation, and troubleshooting"
                    ]
                }
            ]
        },
        {
            company: "Bluewater Federal Solutions",
            location: "Chantilly, VA",
            period: "01/2015 – 04/2016",
            position: "Software Developer",
            projects: [
                {
                    name: "Federal Emergency Management Agency (FEMA)",
                    url: "https://www.fema.gov/",
                    achievements: [
                        "Updated and maintained Drupal 7 web applications, redesigned sites with responsive themes, and ensured DHS 508 compliance",
                        "Performed monthly security updates, created custom JavaScript functions, and assisted in testing and verification"
                    ]
                }
            ]
        },
        {
            company: "KForce",
            location: "Reston, VA",
            period: "05/2014 – 12/2014",
            position: "Software Developer",
            projects: [
                {
                    name: "General Dynamics",
                    achievements: [
                        "Assisted in developing a large-scale Java application for the Transportation Security Administration (TSA)",
                        "Developed JSPs, an encryption tool with a GUI, and utilized JavaScript, jQuery, CSS, Ajax, JDBC, and Hibernate",
                        "Followed Agile development practices and used JUnit for testing"
                    ],
                    notes: "My time at KForce was a contract to hire position for BlueWater Federal Solutions."
                }
            ]
        }
    ],
    
    education: [
        {
            institution: "Radford University",
            degree: "Bachelor of Science in Technology",
            concentration: "Concentration in Computer Science and Software Engineering, Minor in Applied Mathematics",
            year: "2013"
        }
    ],
    
    contact: {
        email: "smustgrave@gmail.com",
        phone: "(757)635-2922",
        linkedin: "https://www.linkedin.com/in/stephen-mustgrave",
        drupal: "https://www.drupal.org/u/smustgrave"
    }
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
      } else if (typeof value === 'string') {
        markdown += `${sectionTitle}${value}\n\n`;
      } else if (Array.isArray(value)) {
        // Special handling for experience array
        if (key === 'experience') {
          markdown += `${sectionTitle}`;
          
          value.forEach((exp) => {
            markdown += `### ${exp.company}${exp.location ? ` - ${exp.location}` : ''}\n`;
            markdown += `**${exp.period}**${exp.position ? ` - ${exp.position}` : ''}\n\n`;
            
            if (exp.achievements && exp.achievements.length > 0) {
              markdown += `${arrayToList(exp.achievements)}\n\n`;
            }
            
            if (exp.projects && exp.projects.length > 0) {
              exp.projects.forEach((project) => {
                markdown += `#### ${project.name}${project.position ? ` - ${project.position}` : ''}\n`;
                
                if (project.url) {
                  if (typeof project.url === 'string') {
                    markdown += `[${project.url}](${project.url})\n\n`;
                  } else if (Array.isArray(project.url)) {
                    project.url.forEach(url => {
                      markdown += `[${url}](${url})\n`;
                    });
                    markdown += '\n';
                  }
                }
                
                if (project.description) {
                  markdown += `${project.description}\n\n`;
                }
                
                if (project.achievements && project.achievements.length > 0) {
                  markdown += `${arrayToList(project.achievements)}\n\n`;
                }
                
                if (project.technologies && project.technologies.length > 0) {
                  markdown += `**Technologies:** ${project.technologies.join(', ')}\n\n`;
                }
                
                if (project.notes) {
                  markdown += `> Note: ${project.notes}\n\n`;
                }
              });
            }
          });
        } 
        // Special handling for education array
        else if (key === 'education') {
          markdown += `${sectionTitle}`;
          
          value.forEach((edu) => {
            markdown += `### ${edu.institution}\n`;
            markdown += `**${edu.degree}**${edu.year ? ` - ${edu.year}` : ''}\n\n`;
            
            if (edu.concentration) {
              markdown += `${edu.concentration}\n\n`;
            }
            
            if (edu.notes) {
              markdown += `${edu.notes}\n\n`;
            }
          });
        }
        // General array handling
        else {
          markdown += `${sectionTitle}${arrayToList(value)}\n\n`;
        }
      } 
      // Handle objects
      else if (typeof value === 'object' && value !== null) {
        // Special handling for communityEngagement
        if (key === 'communityEngagement') {
          markdown += `${sectionTitle}`;
          markdown += `### ${value.position} (${value.period})\n\n`;
          
          if (value.description) {
            markdown += `${value.description}\n\n`;
          }
          
          if (value.achievements && value.achievements.length > 0) {
            markdown += `${arrayToList(value.achievements)}\n\n`;
          }
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
        // Handle other objects
        else {
          markdown += `${sectionTitle}${objectToList(value)}\n\n`;
        }
      }
    }
  }
  
  return markdown;
}


/**
 * Convert resume data to a series of question-answer pairs for fine-tuning
 * @returns {Array<Object>} Array of Q&A pairs
 */
function getResumeQAPairs() {
  return [
    {
        question: "What is your name?",
        answer: "Stephen Mustgrave"
    },
    {
      question: "Who are you?",
      answer: "I'm Stephen Mustgrave, Software Engineer and Drupal Community Engagement Specialist."
    },
    {
        question: "What do you do?",
        answer: "I am a Drupal Community Engagement Specialist. Highly skilled and motivated web and software development professional who supports Drupal's open-source community."
    },
    {
        question: "What are your skills?",
        answer: "My key skills include: Drupal (Versions 11-7), PHP, JavaScript, SCSS/CSS, Twig, component-based theme development leveraging third-party libraries like USWDS, front-end development with responsive CSS3 design and preprocessors, 508 accessibility standards implementation, SEO best practices, Agile development methodologies, familiarity with Acquia, Azure, and AWS platforms."
    },
    {
        question: "What industries have you worked in?",
        answer: "I've worked in government (federal agencies), higher education, and nonprofit sectors, providing Drupal solutions tailored to their needs."
    },
    {
        question: "How do you stay updated with Drupal trends and best practices?",
        answer: "I stay updated by actively participating in the Drupal community, attending DrupalCons and GovCons, maintaining modules, contributing to core initiatives, and following Drupal issue queues and blog posts."
    },
    {
        question: "What are some challenges you've faced in Drupal development, and how did you overcome them?",
        answer: "One challenge was migrating legacy sites from Drupal 7 to 10, ensuring compatibility while maintaining content structure and SEO rankings. I overcame this by using automated migration scripts, detailed planning, and close collaboration with stakeholders."
    },
    {
        question: "What’s your experience with headless Drupal or decoupled architectures?",
        answer: "I have experience implementing headless Drupal solutions using JSON:API and GraphQL, integrating with React and Vue frontends."
    },
    {
        question: "What’s your experience with DevOps and CI/CD for Drupal projects?",
        answer: "I’ve set up automated deployments using Acquia, AWS, and Azure. I've also used tools like Tugboat for staging and QA, and GitLab CI/CD pipelines for automated testing and deployments."
    },
    {
        question: "How do you ensure security in Drupal projects?",
        answer: "I follow best practices like using secure authentication (OAuth, SAML), enforcing strict permissions, performing regular security audits, applying Drupal security patches, and following OWASP guidelines."
    },
    {
        question: "What do you enjoy most about working with Drupal?",
        answer: "I love the open-source nature of Drupal, the strong community, and the flexibility it provides for building enterprise-level applications while adhering to best practices."
    },
    {
        question: "What is your approach to performance optimization in Drupal?",
        answer: "I optimize performance by implementing caching strategies (Redis, Varnish, Drupal's internal caching), optimizing database queries, lazy loading assets, and performing regular profiling using tools like XHProf."
    },
    {
        question: "What are your long-term career goals?",
        answer: "I aim to continue growing as a technical leader in the Drupal community, contribute to core initiatives, and mentor the next generation of Drupal developers."
    },
    {
        question: "What is your experience with multilingual Drupal sites?",
        answer: "I have configured and maintained multilingual Drupal sites using the core translation modules, ensuring seamless localization and compliance with accessibility standards."
    }
  ];
}
