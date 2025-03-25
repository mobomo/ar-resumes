/**
 * Perry Brown's resume data in JSON format
 */
const resumeData = {
    name: "Perry Brown",
    title: "Senior Drupal Developer",
    location: "Not Specified",
    summary: "Senior Drupal Developer with 17+ years of experience delivering scalable, accessible, and secure Drupal solutions. Expertise in enterprise content architecture, CI/CD pipelines, and accessibility compliance (Section 508, WCAG 2.1). Proven ability to support CMS migrations, editorial training, and long-term maintenance, ensuring data integrity and operational efficiency.",
    
    skills: [
        "DevOps Solutions: Containerization (Docker, DDEV, Lando), Pantheon, Acquia Cloud Platform",
        "Automation Tools: PHP, YAML, JavaScript, Bash, Shell, Git, Composer, Gulp, Webpack",
        "Deployment & Monitoring: New Relic, Blackfire.io, Lighthouse, Google Analytics",
        "Frameworks & Libraries: Bootstrap, USWDS, Vue.js",
        "CMS Platforms: Drupal 6–10, WordPress",
        "Languages: PHP, JavaScript, JSON, YAML, HTML, CSS/Sass, Twig",
        "CI/CD Processes: CircleCI, GitHub Actions",
        "Accessibility Tools: Section 508, WCAG 2.1 compliance tools (Axe DevTools)",
        "Database Platforms: Relational Databases (MySQL), Event/Streaming Databases (Redis, Solr, Elasticsearch)",
        "Design Tools: Adobe XD, Sketch, InVision, Fabricator",
        "Testing Frameworks: Cypress, Storybook, Playwright",
        "Container Orchestration: Docker, On-Premise Kubernetes, Rancher",
        "Version Control: Git (GitHub, GitLab), Bitbucket",
        "Miscellaneous: Service Workers, Tailwind CSS, Gridsome, 11ty"
    ],
    
    certifications: [
        "CSM – Certified Scrum Master, Scrum Alliance",
        "Acquia Certified Drupal 10 Site Builder"
    ],
    
    experience: [
        {
            company: "Mobomo",
            location: "Not Specified",
            period: "05/2023 – Present",
            position: "Senior Drupal Developer",
            description: "Responsible for delivering Drupal project outcomes for high-profile clients, collaborating with geographically dispersed teams. Translated Adobe XD design comps into functional Twig templates using semantic HTML and responsive web design principles for Drupal 10 websites. Leveraged the USWDS framework to ensure Section 508 and WCAG 2.1 compliance, aligning with 21st Century IDEA requirements for accessible and user-friendly government digital services.",
            projects: [
                {
                    name: "National Aeronautics and Space Administration (NASA)",
                    achievements: [
                        "Audited and rearchitected a custom site crawler using modern PHP and DDEV for efficient microsite migration to align with NASA.gov's updated design system",
                        "Enabled high-level content auditing for seamless transitions, improving migration workflows for sites where Google Analytics was not an available resource",
                        "Managed a repository of 80,000+ tagged images in the 3D Photo Journal to ensure alignment with the new design system",
                        "Collaborated with the team to port incompatible content, enhancing usability and system compatibility"
                    ]
                },
                {
                    name: "NOAA Gulf Spill Restoration (GSR)",
                    achievements: [
                        "Leading the migration to Drupal 11, resolving compatibility issues with contributed modules and themes (e.g., upgrading from Bootstrap 3 to 5)",
                        "Serve as Drupal SME with GSR stakeholders, collaborating and consulting during client meetings to prioritize enhancements, manage backlogs, and oversee seamless deployments with the Web Operations Center (WOC)"
                    ]
                },
                {
                    name: "USAID Engendering Industries",
                    achievements: [
                        "Sole developer responsible for theming, feature enhancements, and Drupal core/module updates",
                        "Improved site's quiz taxonomy organization to align with evolving stakeholder needs",
                        "Collaborated with Engendering Industries' stakeholders to ensure new features and enhancements achieve organizational objectives"
                    ]
                },
                {
                    name: "Pandemic Response Accountability Committee (PRAC)",
                    achievements: [
                        "Streamlined Drupal build process during the transition to Drupal 10.3, resolving CKEditor 4 to CKEditor5 upgrade blockers",
                        "Automated the integration of custom modules and external JavaScript packages via Composer"
                    ]
                }
            ]
        },
        {
            company: "Freelance",
            location: "Not Specified",
            period: "01/2008 – 05/2023",
            position: "Drupal Developer",
            description: "Cultivated relationships with organizations seeking website development expertise, enhancing the digital experience of client organizations' customer base, and optimizing their website architecture to reduce maintenance costs.",
            projects: [
                {
                    name: "Reynoldsburg Church of Christ",
                    period: "01/2008 – 05/2023",
                    achievements: [
                        "Built original site in Drupal 6 with Bootstrap subtheme and managed Patheon hosting between 2008 and 2023",
                        "Performed appropriate upgrades (D7, 8, 9) as versions were released",
                        "Served as site administrator and content editor (producing and editing all content)"
                    ]
                },
                {
                    name: "Oak Ridge National Laboratory (NGEE Arctic)",
                    url: "https://ngee-arctic.ornl.gov/",
                    period: "07/2022 – 01/2023",
                    achievements: [
                        "Migrated a 10-year-old Drupal 7 site to a re-architected Drupal 9 site by performing a full content audit, creating content types, paragraphs, views, and taxonomies",
                        "Built a new Bootstrap theme to mimic the existing Drupal 7 theme",
                        "Achieved 100% effective accuracy rate in completion of the project and improved web page loading times by 25%",
                        "Provided an integrated content editing workflow which improved content editors' experience by reducing the number of tabs needed for creating/editing a page's content by 80%"
                    ]
                },
                {
                    name: "Centers for Medicare & Medicaid Services",
                    url: "https://www.medicaid.gov/",
                    period: "02/2022 - 05/2022",
                    achievements: [
                        "Reduced the number of accessibility errors by 22% on the existing website, according to the WCAG AA and Section 508 standards",
                        "Used tools including Chrome Accessibility Developer Tools extension, axe DevTools, WAVE website audit tool, and Site Improve to identify and resolve accessibility issues",
                        "Created front-end Drupal 9 Twig templates, leveraging CSS, HTML and JavaScript, resulting in a 17% reduction in First Input Delay and a 9% improvement in Cumulative Layout Shift",
                        "Tested for cross-browser compatibility and responsiveness, optimizing for maximum performance on all platforms",
                        "Improved site users' experience by synthesizing performance testing and user feedback, improving the average customer feedback score by 8%",
                        "Increased efficiency of content editors by creating a more integrated content editing workflow, reducing clicks by 30%",
                        "Built and maintained a Drupal 9 site to prototype new UX, architecture and CMS best practices"
                    ]
                },
                {
                    name: "Oak Ridge National Laboratory (SPRUCE)",
                    url: "https://mnspruce.ornl.gov",
                    period: "03/2021 – 09/2021",
                    achievements: [
                        "Migrated Drupal 7 site to Drupal 8, architecting all content types, views, paragraphs, and taxonomies",
                        "Selected contributed modules to deliver the required functionality and user/editor experience",
                        "Designed theme based on US Web Design System (USWDS) components",
                        "Upgraded dev branch of repo to Drupal 9 in anticipation of server upgrades and Drupal 8 EoL",
                        "Conducted editor training on rearchitected workflows to improve usability and information architecture"
                    ]
                },
                {
                    name: "Columbus College of Art and Design",
                    url: ["https://www.ccad.edu/virtual-chroma", "https://www.ccad.edu/virtual-mfa"],
                    period: "01/2020 – 06/2020",
                    achievements: [
                        "Contracted to architect the Creative Work content type, multiple views, and web forums",
                        "Created two 'microsite' themes for virtual art exhibitions: Virtual MFA and CSCA award winning Virtual Chroma"
                    ]
                },
                {
                    name: "Arizona State University",
                    url: "https://corporate.asu.edu",
                    period: "12/2018 – 01/2019",
                    achievements: [
                        "Charged with developing majority of site based on an InVision prototype and launching site in a six week time frame",
                        "Responsible for architecting all content types, views, and web forms",
                        "Created Stark-based subtheme",
                        "Selected all of the contributed modules to deliver required functionality and user/editor experience",
                        "Launched site on time, within budget, and to all specifications"
                    ]
                },
                {
                    name: "Ologie (St. Lawrence University)",
                    url: "https://campaign.stlawu.edu",
                    period: "09/2018 – 10/2018",
                    achievements: [
                        "Designed local Columbus Ologie site in Sketch, working on location with Ologie development team",
                        "Developed front and backend of Header component (used on virtually every page)",
                        "Styled Laurentian Voice section, built the Share Your Voice form",
                        "Developed the front- and back-end of the Events content type and several related views",
                        "Launched site in less than 6 weeks, adhering to deadline and complying with all specifications"
                    ]
                },
                {
                    name: "Ohio State University",
                    url: "https://legal.osu.edu",
                    period: "04/2016 – 06/2016",
                    achievements: [
                        "Oversaw entire Drupal 8 build",
                        "Worked with UX design from local Columbus agency Fine Citizens in a design system similar to Pattern Lab called Fabricator",
                        "Architected all content types, views, paragraphs, and taxonomies",
                        "Created the Stable-based subtheme",
                        "Selected all contributed modules to deliver the required functionality and user/editor experience"
                    ]
                }
            ]
        }
    ],
    
    education: [
        {
            institution: "Ohio Valley University",
            degree: "Bachelor of Arts Degree in Bible/Biblical Studies",
            year: "1992"
        },
        {
            institution: "Ohio Valley University",
            degree: "Associate of Arts Degree in Liberal Arts and Sciences/Liberal Studies",
            year: "1990"
        }
    ],
    
    contact: {
        // Note: Contact information not provided in the resume
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
            
            if (exp.description) {
              markdown += `${exp.description}\n\n`;
            }
            
            if (exp.achievements && exp.achievements.length > 0) {
              markdown += `${arrayToList(exp.achievements)}\n\n`;
            }
            
            if (exp.projects && exp.projects.length > 0) {
              exp.projects.forEach((project) => {
                markdown += `#### ${project.name}${project.position ? ` - ${project.position}` : ''}\n`;
                
                if (project.period) {
                  markdown += `*${project.period}*\n\n`;
                }
                
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
        // Special handling for contact info
        if (key === 'contact') {
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
        answer: "Perry Brown"
    },
    {
        question: "What do you do?",
        answer: "I am a Senior Drupal Developer with 17+ years of experience delivering scalable, accessible, and secure Drupal solutions."
    },
    {
        question: "What are your skills?",
        answer: "My skills include DevOps solutions with containerization tools (Docker, DDEV, Lando), automation tools (PHP, YAML, JavaScript, Bash, Git, Composer), deployment and monitoring tools, knowledge of frontend frameworks (Bootstrap, USWDS, Vue.js), experience with Drupal 6-10, strong programming abilities in PHP, JavaScript, HTML, CSS/Sass, and Twig, and expertise in accessibility compliance (Section 508, WCAG 2.1)."
    },
    {
        question: "What certifications do you have?",
        answer: "I am a Certified Scrum Master (CSM) from Scrum Alliance and an Acquia Certified Drupal 10 Site Builder."
    },
    {
        question: "Where do you currently work?",
        answer: "I currently work at Mobomo as a Senior Drupal Developer since May 2023."
    },
    {
        question: "Tell me about your experience at Mobomo.",
        answer: "At Mobomo, I deliver Drupal project outcomes for high-profile clients, collaborate with geographically dispersed teams, and leverage the USWDS framework to ensure accessibility compliance. I've worked on projects for NASA, NOAA Gulf Spill Restoration, USAID Engendering Industries, and the Pandemic Response Accountability Committee."
    },
    {
        question: "What projects have you worked on at NASA?",
        answer: "For NASA, I audited and rearchitected a custom site crawler using modern PHP and DDEV for efficient microsite migration to align with NASA.gov's updated design system. I managed a repository of 80,000+ tagged images in the 3D Photo Journal and collaborated with the team to port incompatible content."
    },
    {
        question: "What is your experience with accessibility standards?",
        answer: "I have extensive experience implementing Section 508 and WCAG 2.1 compliance. For example, at Centers for Medicare & Medicaid Services, I reduced accessibility errors by 22% using tools like Chrome Accessibility Developer Tools, axe DevTools, WAVE, and Site Improve. I also leverage the USWDS framework to ensure compliance with 21st Century IDEA requirements."
    },
    {
        question: "Tell me about your freelance work.",
        answer: "As a freelance Drupal Developer from 2008 to 2023, I worked with various organizations including Reynoldsburg Church of Christ, Oak Ridge National Laboratory, Centers for Medicare & Medicaid Services, Columbus College of Art and Design, Arizona State University, Ologie, and Ohio State University."
    },
    {
        question: "What is your experience with Drupal migrations?",
        answer: "I have extensive experience with Drupal migrations. I led the NOAA Gulf Spill Restoration migration to Drupal 11, migrated NGEE Arctic from Drupal 7 to Drupal 9, and SPRUCE from Drupal 7 to Drupal 8/9. I specialize in content auditing, creating content types, views, paragraphs, and taxonomies, and ensuring smooth transitions."
    },
    {
        question: "What is your education background?",
        answer: "I have a Bachelor of Arts Degree in Bible/Biblical Studies and an Associate of Arts Degree in Liberal Arts and Sciences/Liberal Studies from Ohio Valley University, graduating in 1992 and 1990 respectively."
    },
    {
        question: "What frontend frameworks are you experienced with?",
        answer: "I'm experienced with Bootstrap, USWDS (U.S. Web Design System), and Vue.js. I've implemented these frameworks across various projects, including USWDS for government websites to ensure accessibility compliance."
    },
    {
        question: "How do you improve content editor experience?",
        answer: "I focus on creating integrated content editing workflows that reduce complexity. For example, at Oak Ridge National Laboratory, I reduced the number of tabs needed for creating/editing content by 80%. At Centers for Medicare & Medicaid Services, I reduced clicks between content creation and publishing by 30%."
    },
    {
        question: "What is your approach to Drupal theming?",
        answer: "I specialize in translating design comps into functional Twig templates using semantic HTML and responsive web design principles. I've created themes based on Bootstrap, USWDS, and Stable, and have experience with design systems like Fabricator."
    },
    {
        question: "What is your experience with government websites?",
        answer: "I have extensive experience with government websites, having worked with NASA, NOAA, Centers for Medicare & Medicaid Services, and USAID. I ensure compliance with government standards, particularly Section 508 accessibility requirements and 21st Century IDEA guidelines."
    },
    {
        question: "What DevOps tools are you familiar with?",
        answer: "I'm familiar with containerization tools like Docker, DDEV, and Lando, cloud platforms like Pantheon and Acquia, CI/CD tools like CircleCI and GitHub Actions, and monitoring tools like New Relic, Blackfire.io, and Lighthouse."
    }
  ];
}
