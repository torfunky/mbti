/**
 * Character class for managing visual character data and persistence
 */
export class Character {
  constructor() {
    this.listeners = [];
    this.data = {
      name: '',           // Character name
      bodyType: 0,        // Index of selected body type
      feature01Type: 0,   // Index of selected feature01
      feature02Type: 0,   // Index of selected feature02
    };
    
    // Load existing character from session storage if available
    this.loadFromSession();
  }

  /**
   * Update character property
   * @param {string} property - Property name (bodyType, faceType, etc.)
   * @param {*} value - New value
   */
  updateProperty(property, value) {
    if (this.data.hasOwnProperty(property)) {
      this.data[property] = value;
      this.saveToSession();
      this.notifyListeners('update', { property, value });
    }
  }

  /**
   * Get character property
   * @param {string} property - Property name
   * @returns {*} Property value
   */
  getProperty(property) {
    return this.data[property];
  }

  /**
   * Get all character data
   * @returns {Object} Complete character data
   */
  getAllData() {
    return { ...this.data };
  }

  /**
   * Reset character to defaults
   */
  reset() {
    this.data = {
      name: '',
      bodyType: 0,
      feature01Type: 0,
      feature02Type: 0,
    };
    this.saveToSession();
    this.notifyListeners('reset');
  }

  /**
   * Save character data to session storage
   */
  saveToSession() {
    try {
      sessionStorage.setItem('mbti-character', JSON.stringify(this.data));
    } catch (error) {
      console.warn('Failed to save character to session storage:', error);
    }
  }

  /**
   * Load character data from session storage
   */
  loadFromSession() {
    try {
      const saved = sessionStorage.getItem('mbti-character');
      if (saved) {
        const parsedData = JSON.parse(saved);
        this.data = { ...this.data, ...parsedData };
      }
    } catch (error) {
      console.warn('Failed to load character from session storage:', error);
    }
  }

  /**
   * Clear character data from session storage
   */
  clearSession() {
    try {
      sessionStorage.removeItem('mbti-character');
    } catch (error) {
      console.warn('Failed to clear character from session storage:', error);
    }
  }

  /**
   * Add event listener for character changes
   * @param {Function} callback - Callback function (event, data) => void
   */
  addEventListener(callback) {
    this.listeners.push(callback);
  }

  /**
   * Remove event listener
   * @param {Function} callback - Callback to remove
   */
  removeEventListener(callback) {
    const index = this.listeners.indexOf(callback);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Notify all listeners of character changes
   * @param {string} event - Event type
   * @param {*} data - Event data
   */
  notifyListeners(event, data = null) {
    this.listeners.forEach(listener => {
      try {
        listener(event, data);
      } catch (error) {
        console.error('Error in character event listener:', error);
      }
    });
  }
}

/**
 * Character asset configuration
 */
export const CHARACTER_ASSETS = {
  bodies: [
    'blob01.png',
    'blob02.png',
    'blob03.png',
    'blob04.png',
    'blob05.png'  
],
  
  // Add your feature01 image filenames here  
  feature01: [
    'eye01.png',
    'eye02.png',
    'eye03.png',
    'eye04.png'
],
  
  // Add your feature02 image filenames here
  feature02: [
    'mouth01.png', 
    'mouth02.png',
    'mouth03.png',
    'mouth04.png',
    'mouth05.png'  ]
};

/**
 * Character options data - built from asset configuration
 */
export const CHARACTER_OPTIONS = {
  bodyTypes: CHARACTER_ASSETS.bodies.map((filename, index) => ({
    id: index,
    name: `Body ${index + 1}`,
    image: `character-assets/body/${filename}`
  })),
  
  feature01Types: CHARACTER_ASSETS.feature01.map((filename, index) => ({
    id: index, 
    name: `Feature 1 - ${index + 1}`,
    image: `character-assets/feature01/${filename}`
  })),
  
  feature02Types: CHARACTER_ASSETS.feature02.map((filename, index) => ({
    id: index,
    name: `Feature 2 - ${index + 1}`, 
    image: `character-assets/feature02/${filename}`
  }))
};