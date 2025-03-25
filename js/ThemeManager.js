/**
 * ThemeManager class to handle dark/light mode
 * Manages theme preferences, system preferences, and accessibility
 */
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        
        // Initialize the theme toggle
        this.init();
    }
    
    /**
     * Initialize the theme manager
     */
    init() {
        // Check for saved user preference
        const savedTheme = localStorage.getItem('theme');
        
        // Check if user has a system preference
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Set initial theme based on saved preference or system preference
        if (savedTheme === 'dark' || (savedTheme === null && prefersDarkMode)) {
            document.documentElement.classList.add('dark-mode');
        }
        
        // Toggle theme when button is clicked
        this.themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark-mode');
            
            // Save preference
            const isDarkMode = document.documentElement.classList.contains('dark-mode');
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
            
            // Announce theme change for screen readers
            this.announceThemeChange(isDarkMode);
        });
        
        // Handle system preference changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // Only auto-switch if the user hasn't set a preference
            if (!localStorage.getItem('theme')) {
                if (e.matches) {
                    document.documentElement.classList.add('dark-mode');
                } else {
                    document.documentElement.classList.remove('dark-mode');
                }
            }
        });
    }
    
    /**
     * Announce theme change for screen readers
     * @param {boolean} isDarkMode - Whether dark mode is active
     */
    announceThemeChange(isDarkMode) {
        const themeStatus = document.createElement('div');
        themeStatus.className = 'sr-only';
        themeStatus.setAttribute('aria-live', 'polite');
        themeStatus.textContent = `${isDarkMode ? 'Dark' : 'Light'} mode activated`;
        document.body.appendChild(themeStatus);
        
        // Remove announcement after it's read
        setTimeout(() => {
            document.body.removeChild(themeStatus);
        }, 1000);
    }
    
    /**
     * Get the current theme
     * @returns {string} 'dark' or 'light'
     */
    getCurrentTheme() {
        return document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light';
    }
}

// Create and export a singleton instance
const themeManager = new ThemeManager();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = themeManager;
}