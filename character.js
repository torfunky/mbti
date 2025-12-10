/**
 * Character class for managing visual character data and persistence
 */
export class Character {
  constructor() {
    this.listeners = [];
    this.data = {
      name: "", // Character name
      bodyType: Math.floor(Math.random() * 3), // Random starting body shape (1-3, but 0-indexed)
      feature01Type: Math.floor(Math.random() * 5), // Index of selected feature01
      feature02Type: Math.floor(Math.random() * 5), // Index of selected feature02
      feature03Type: Math.floor(Math.random() * 5), // Index of selected feature03
      feature04Type: Math.floor(Math.random() * 5), // Index of selected feature04
      feature05Type: Math.floor(Math.random() * 5), // Index of selected feature05
      colorType: Math.floor(Math.random() * 6) + 1, // Random starting color (1-6)
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
      this.notifyListeners("update", { property, value });
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
      name: "",
      bodyType: 0,
      feature01Type: 0,
      feature02Type: 0,
    };
    this.saveToSession();
    this.notifyListeners("reset");
  }

  /**
   * Save character data to session storage
   */
  saveToSession() {
    try {
      sessionStorage.setItem("mbti-character", JSON.stringify(this.data));
    } catch (error) {
      console.warn("Failed to save character to session storage:", error);
    }
  }

  /**
   * Load character data from session storage
   */
  loadFromSession() {
    try {
      const saved = sessionStorage.getItem("mbti-character");
      if (saved) {
        const parsedData = JSON.parse(saved);
        // Only load if we have actual saved character data
        if (parsedData && Object.keys(parsedData).length > 0) {
          this.data = { ...this.data, ...parsedData };
        }
      }
      // If no saved data, keep the random values from constructor
    } catch (error) {
      console.warn("Failed to load character from session storage:", error);
    }
  }

  /**
   * Clear character data from session storage
   */
  clearSession() {
    try {
      sessionStorage.removeItem("mbti-character");
    } catch (error) {
      console.warn("Failed to clear character from session storage:", error);
    }
  }

  /**
   * Randomize all character features
   */
  randomize() {
    this.data = {
      ...this.data,
      bodyType: Math.floor(Math.random() * 3), // 0-2 for 3 body shapes
      feature01Type: Math.floor(Math.random() * 5), // 0-4 for 5 features
      feature02Type: Math.floor(Math.random() * 5),
      feature03Type: Math.floor(Math.random() * 5),
      feature04Type: Math.floor(Math.random() * 5),
      feature05Type: Math.floor(Math.random() * 5),
      colorType: Math.floor(Math.random() * 6) + 1, // 1-6 for colors
    };
    this.saveToSession();
    this.notifyListeners("randomize", this.data);
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
    this.listeners.forEach((listener) => {
      try {
        listener(event, data);
      } catch (error) {
        console.error("Error in character event listener:", error);
      }
    });
  }
}

/**
 * Character asset configuration
 */
export const CHARACTER_ASSETS = {
  // Bodies organized by color and shape: XXBodyYY format
  // XX = color (01-06), YY = body shape (01-06)
  bodies: {
    shapes: 6, // Number of body shapes available (01-06)
    colors: 6, // Number of color variations (01-06)
    getFileName: (colorIndex, shapeIndex) => {
      const colorStr = String(colorIndex).padStart(2, "0");
      const shapeStr = String(shapeIndex).padStart(2, "0");
      return `${colorStr}Body${shapeStr}.png`;
    },
  },

  // Legacy body list for compatibility (will be updated to use random selection from new system)
  bodiesLegacy: ["01Body01.png", "01Body02.png", "01Body03.png"],

  feature01: [
    "Accesory01.png",
    "Accesory02.png",
    "Accesory03.png",
    "Accesory04.png",
    "Accesory05.png",
  ],

  feature02: [
    "eyes01.png",
    "eyes02.png",
    "eyes03.png",
    "eyes04.png",
    "eyes05.png",
  ],

  feature03: [
    "mouth01.png",
    "mouth02.png",
    "mouth03.png",
    "mouth04.png",
    "mouth05.png",
  ],

  feature04: [
    "feature04_01.png",
    "feature04_02.png",
    "feature04_03.png",
    "feature04_04.png",
    "feature04_05.png",
  ],

  feature05: [
    "base01.png",
    "base02.png",
    "base03.png",
    "base04.png",
    "base05.png",
  ],
};

/**
 * Character options data - built from asset configuration
 */
export const CHARACTER_OPTIONS = {
  bodyTypes: (() => {
    const bodyTypes = [];
    for (let shape = 1; shape <= CHARACTER_ASSETS.bodies.shapes; shape++) {
      bodyTypes.push({
        id: shape - 1,
        name: `Body Shape ${shape}`,
        shapeIndex: shape,
        getImageForColor: (colorIndex) => {
          const filename = CHARACTER_ASSETS.bodies.getFileName(
            colorIndex,
            shape
          );
          return `assets/character-assets/body/${filename}`;
        },
      });
    }
    return bodyTypes;
  })(),

  feature01Types: CHARACTER_ASSETS.feature01.map((filename, index) => ({
    id: index,
    name: `Feature 1 - ${index + 1}`,
    image: `assets/character-assets/feature01/${filename}`,
  })),

  feature02Types: CHARACTER_ASSETS.feature02.map((filename, index) => ({
    id: index,
    name: `Feature 2 - ${index + 1}`,
    image: `assets/character-assets/feature02/${filename}`,
  })),

  feature03Types: CHARACTER_ASSETS.feature03.map((filename, index) => ({
    id: index,
    name: `Feature 3 - ${index + 1}`,
    image: `assets/character-assets/feature03/${filename}`,
  })),

  feature04Types: CHARACTER_ASSETS.feature04.map((filename, index) => ({
    id: index,
    name: `Feature 4 - ${index + 1}`,
    image: `assets/character-assets/feature04/${filename}`,
  })),

  feature05Types: CHARACTER_ASSETS.feature05.map((filename, index) => ({
    id: index,
    name: `Feature 5 - ${index + 1}`,
    image: `assets/character-assets/feature05/${filename}`,
  })),

  colors: [
    { id: 1, name: "Color 1", value: "#FF6B6B" },
    { id: 2, name: "Color 2", value: "#4ECDC4" },
    { id: 3, name: "Color 3", value: "#45B7D1" },
    { id: 4, name: "Color 4", value: "#96CEB4" },
    { id: 5, name: "Color 5", value: "#FFEAA7" },
    { id: 6, name: "Color 6", value: "#DDA0DD" },
  ],
};
