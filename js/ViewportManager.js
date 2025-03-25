/**
 * ViewportManager class to handle mobile viewport height issues
 * Sets a CSS custom property to fix the 100vh problem on mobile devices
 */
class ViewportManager {
    constructor() {
        // Set the height initially
        this.setMobileViewportHeight();
        
        // Set up event listeners
        this.initEventListeners();
    }
    
    /**
     * Set up event listeners for viewport changes
     */
    initEventListeners() {
        // Reset the height on resize and orientation change
        window.addEventListener('resize', this.setMobileViewportHeight);
        window.addEventListener('orientationchange', this.setMobileViewportHeight);
    }
    
    /**
     * Fix for mobile viewport height issues
     * Sets a CSS custom property that can be used instead of vh units
     */
    setMobileViewportHeight() {
        // First get the viewport height and multiply it by 1% to get a value for a vh unit
        let vh = window.innerHeight * 0.01;
        // Then set the value in the --vh custom property to the root of the document
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
}

// Create and export a singleton instance
const viewportManager = new ViewportManager();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = viewportManager;
}