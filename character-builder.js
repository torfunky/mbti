import { Character, CHARACTER_OPTIONS } from "./character.js";
export class CharacterBuilder {
  constructor() {
    this.character = new Character();

    // Sync initial selections with character data
    this.currentSelections = {
      bodyType: this.character.getProperty("bodyType"),
      feature01Type: this.character.getProperty("feature01Type"),
      feature02Type: this.character.getProperty("feature02Type"),
      feature03Type: this.character.getProperty("feature03Type"),
      feature04Type: this.character.getProperty("feature04Type"),
      feature05Type: this.character.getProperty("feature05Type"),
      colorType: this.character.getProperty("colorType"),
    };

    this.initializeElements();
    this.setupEventListeners();
    this.updateCharacterPreview();

    this.character.addEventListener((event, data) => {
      this.updateCharacterPreview();
    });
  }

  initializeElements() {
    this.characterBuilderScreen = document.getElementById(
      "character-builder-screen"
    );
    this.characterDisplay = document.getElementById("character-display");
    this.backToStartBtn = document.getElementById("back-to-start-btn");
    this.startQuizBtn = document.getElementById("start-quiz-btn");
    this.randomizeBtn = document.getElementById("randomize-btn");
    this.nameInput = document.getElementById("character-name-input");

    this.featureArrows = document.querySelectorAll(".feature-arrow");

    this.colorOptions = document.querySelectorAll(".color-option");
  }

  /**
   * Force refresh of character builder display
   */
  refreshDisplay() {
    // Update current selections to match character data
    this.currentSelections = {
      bodyType: this.character.getProperty("bodyType"),
      feature01Type: this.character.getProperty("feature01Type"),
      feature02Type: this.character.getProperty("feature02Type"),
      feature03Type: this.character.getProperty("feature03Type"),
      feature04Type: this.character.getProperty("feature04Type"),
      feature05Type: this.character.getProperty("feature05Type"),
      colorType: this.character.getProperty("colorType"),
    };

    this.updateCharacterPreview();
  }

  /**
   * Setup event listeners for character builder interactions
   */
  setupEventListeners() {
    this.backToStartBtn.addEventListener("click", () => {
      this.onBackToStart();
    });

    this.startQuizBtn.addEventListener("click", () => {
      this.onStartQuiz();
    });

    this.randomizeBtn.addEventListener("click", () => {
      this.randomizeCharacter();
    });

    this.setupArrowListeners();
    this.setupColorListeners();
    this.setupNameInput();
  }

  /**
   * Setup arrow navigation event listeners
   */
  setupArrowListeners() {
    this.featureArrows.forEach((arrow) => {
      arrow.addEventListener("click", () => {
        const featureType = arrow.dataset.feature;
        const direction = arrow.classList.contains("prev") ? -1 : 1;
        this.navigateFeature(featureType, direction);
      });
    });
  }

  /**
   * Setup color picker event listeners
   */
  setupColorListeners() {
    this.colorOptions.forEach((colorOption) => {
      colorOption.addEventListener("click", () => {
        this.colorOptions.forEach((opt) => opt.classList.remove("active"));

        colorOption.classList.add("active");

        const colorValue = parseInt(colorOption.dataset.color);
        this.currentSelections.colorType = colorValue;
        this.character.updateProperty("colorType", colorValue);
      });
    });
  }

  /**
   * Setup name input event listeners
   */
  setupNameInput() {
    this.nameInput.addEventListener("input", (e) => {
      this.character.updateProperty("name", e.target.value);
    });

    this.nameInput.addEventListener("blur", () => {
      // Save when user finishes typing
      this.character.saveToSession();
    });
  }

  /**
   * Navigate feature in specified direction
   * @param {string} type - Feature type (bodyType, feature01Type, feature02Type)
   * @param {number} direction - Direction (-1 for previous, 1 for next)
   */
  navigateFeature(type, direction) {
    // Add transition effect
    this.characterDisplay.classList.add("transitioning");

    const options = this.getOptionsForType(type);
    const currentIndex = this.currentSelections[type];
    const newIndex =
      (currentIndex + direction + options.length) % options.length;

    this.currentSelections[type] = newIndex;
    this.character.updateProperty(type, newIndex);

    // Remove transition class after animation
    setTimeout(() => {
      this.characterDisplay.classList.remove("transitioning");
    }, 300);
  }

  /**
   * Get character options for specific type
   * @param {string} type - Option type
   * @returns {Array} Array of options
   */
  getOptionsForType(type) {
    switch (type) {
      case "bodyType":
        return CHARACTER_OPTIONS.bodyTypes;
      case "feature01Type":
        return CHARACTER_OPTIONS.feature01Types;
      case "feature02Type":
        return CHARACTER_OPTIONS.feature02Types;
      case "feature03Type":
        return CHARACTER_OPTIONS.feature03Types;
      case "feature04Type":
        return CHARACTER_OPTIONS.feature04Types;
      case "feature05Type":
        return CHARACTER_OPTIONS.feature05Types;
      default:
        return [];
    }
  }

  /**
   * Update character preview display
   */
  updateCharacterPreview() {
    const bodyType = this.character.getProperty("bodyType");
    const feature01Type = this.character.getProperty("feature01Type");
    const feature02Type = this.character.getProperty("feature02Type");
    const feature03Type = this.character.getProperty("feature03Type");
    const feature04Type = this.character.getProperty("feature04Type");
    const feature05Type = this.character.getProperty("feature05Type");
    const colorType = this.character.getProperty("colorType");

    const bodyOption = CHARACTER_OPTIONS.bodyTypes[bodyType];
    const feature01Option = CHARACTER_OPTIONS.feature01Types[feature01Type];
    const feature02Option = CHARACTER_OPTIONS.feature02Types[feature02Type];
    const feature03Option = CHARACTER_OPTIONS.feature03Types[feature03Type];
    const feature04Option = CHARACTER_OPTIONS.feature04Types[feature04Type];
    const feature05Option = CHARACTER_OPTIONS.feature05Types[feature05Type];

    // Get the colored body image based on current color selection
    const bodyImageSrc = bodyOption
      ? bodyOption.getImageForColor(colorType)
      : "";

    // Render actual character images with colored body (no CSS filters needed)
    this.characterDisplay.innerHTML = `
      <div class="character-composite">
        <div class="character-layers">
          ${
            bodyOption
              ? `<img src="${bodyImageSrc}" alt="${bodyOption.name}" class="character-layer body" />`
              : ""
          }
          ${
            feature01Option
              ? `<img src="${feature01Option.image}" alt="${feature01Option.name}" class="character-layer feature01" />`
              : ""
          }
          ${
            feature02Option
              ? `<img src="${feature02Option.image}" alt="${feature02Option.name}" class="character-layer feature02" />`
              : ""
          }
          ${
            feature03Option
              ? `<img src="${feature03Option.image}" alt="${feature03Option.name}" class="character-layer feature03" />`
              : ""
          }
          ${
            feature04Option
              ? `<img src="${feature04Option.image}" alt="${feature04Option.name}" class="character-layer feature04" />`
              : ""
          }
          ${
            feature05Option
              ? `<img src="${feature05Option.image}" alt="${feature05Option.name}" class="character-layer feature05" />`
              : ""
          }
        </div>
      </div>
    `;

    // Update active color in UI
    this.updateActiveColor(colorType);
  }

  /**
   * Update active color in UI
   * @param {number} colorType - Active color type
   */
  updateActiveColor(colorType) {
    this.colorOptions.forEach((option) => {
      option.classList.remove("active");
      if (parseInt(option.dataset.color) === colorType) {
        option.classList.add("active");
      }
    });
  }

  /**
   * Show character builder screen
   */
  show() {
    this.characterBuilderScreen.classList.add("active");
    // Load current character state
    this.currentSelections.bodyType = this.character.getProperty("bodyType");
    this.currentSelections.feature01Type =
      this.character.getProperty("feature01Type");
    this.currentSelections.feature02Type =
      this.character.getProperty("feature02Type");
    this.currentSelections.feature03Type =
      this.character.getProperty("feature03Type");
    this.currentSelections.feature04Type =
      this.character.getProperty("feature04Type");
    this.currentSelections.feature05Type =
      this.character.getProperty("feature05Type");
    this.currentSelections.colorType = this.character.getProperty("colorType");

    // Load saved name
    const savedName = this.character.getProperty("name");
    if (savedName) {
      this.nameInput.value = savedName;
    }

    this.updateCharacterPreview();
  }

  /**
   * Hide character builder screen
   */
  hide() {
    this.characterBuilderScreen.classList.remove("active");
  }

  /**
   * Handle back to start button click
   */
  onBackToStart() {
    // This will be handled by the main quiz controller
    // Emit custom event for external handling
    document.dispatchEvent(new CustomEvent("characterBuilder:backToStart"));
  }

  /**
   * Handle start quiz button click
   */
  onStartQuiz() {
    // This will be handled by the main quiz controller
    // Emit custom event for external handling
    document.dispatchEvent(
      new CustomEvent("characterBuilder:startQuiz", {
        detail: { character: this.character.getAllData() },
      })
    );
  }

  /**
   * Randomize character features
   */
  randomizeCharacter() {
    // Add transition class for smooth animation
    this.characterDisplay.classList.add("transitioning");

    // Randomize character data
    this.character.randomize();

    // Update current selections to match
    this.currentSelections.bodyType = this.character.getProperty("bodyType");
    this.currentSelections.feature01Type =
      this.character.getProperty("feature01Type");
    this.currentSelections.feature02Type =
      this.character.getProperty("feature02Type");
    this.currentSelections.feature03Type =
      this.character.getProperty("feature03Type");
    this.currentSelections.feature04Type =
      this.character.getProperty("feature04Type");
    this.currentSelections.feature05Type =
      this.character.getProperty("feature05Type");
    this.currentSelections.colorType = this.character.getProperty("colorType");

    // Update the preview after a brief delay for animation
    setTimeout(() => {
      this.updateCharacterPreview();
      this.characterDisplay.classList.remove("transitioning");
    }, 150);
  }

  /**
   * Get current character instance
   * @returns {Character} Current character
   */
  getCharacter() {
    return this.character;
  }
}
