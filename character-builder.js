import { Character, CHARACTER_OPTIONS } from './character.js';

/**
 * CharacterBuilder class for managing the character creation UI
 */
export class CharacterBuilder {
  constructor() {
    this.character = new Character();
    this.currentSelections = {
      bodyType: 0,
      feature01Type: 0,
      feature02Type: 0,
    };
    
    this.initializeElements();
    this.setupEventListeners();
    this.updateCharacterPreview();
    
    // Listen to character changes
    this.character.addEventListener((event, data) => {
      this.updateCharacterPreview();
    });
  }

  /**
   * Initialize DOM elements
   */
  initializeElements() {
    this.characterBuilderScreen = document.getElementById('character-builder-screen');
    this.characterDisplay = document.getElementById('character-display');
    this.backToStartBtn = document.getElementById('back-to-start-btn');
    this.startQuizBtn = document.getElementById('start-quiz-btn');
    this.nameInput = document.getElementById('character-name-input');
    
    // Feature arrow buttons
    this.featureArrows = document.querySelectorAll('.feature-arrow');
  }

  /**
   * Setup event listeners for character builder interactions
   */
  setupEventListeners() {
    // Navigation buttons
    this.backToStartBtn.addEventListener('click', () => {
      this.onBackToStart();
    });
    
    this.startQuizBtn.addEventListener('click', () => {
      this.onStartQuiz();
    });
    
    // Feature arrow navigation
    this.setupArrowListeners();
    
    // Name input handling
    this.setupNameInput();
  }

  /**
   * Setup arrow navigation event listeners
   */
  setupArrowListeners() {
    this.featureArrows.forEach(arrow => {
      arrow.addEventListener('click', () => {
        const featureType = arrow.dataset.feature;
        const direction = arrow.classList.contains('prev') ? -1 : 1;
        this.navigateFeature(featureType, direction);
      });
    });
  }

  /**
   * Setup name input event listeners
   */
  setupNameInput() {
    this.nameInput.addEventListener('input', (e) => {
      this.character.updateProperty('name', e.target.value);
    });
    
    this.nameInput.addEventListener('blur', () => {
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
    const options = this.getOptionsForType(type);
    const currentIndex = this.currentSelections[type];
    const newIndex = (currentIndex + direction + options.length) % options.length;
    
    this.currentSelections[type] = newIndex;
    this.character.updateProperty(type, newIndex);
  }

  /**
   * Get character options for specific type
   * @param {string} type - Option type
   * @returns {Array} Array of options
   */
  getOptionsForType(type) {
    switch (type) {
      case 'bodyType':
        return CHARACTER_OPTIONS.bodyTypes;
      case 'feature01Type':
        return CHARACTER_OPTIONS.feature01Types;
      case 'feature02Type':
        return CHARACTER_OPTIONS.feature02Types;
      default:
        return [];
    }
  }

  /**
   * Update character preview display
   */
  updateCharacterPreview() {
    const bodyType = this.character.getProperty('bodyType');
    const feature01Type = this.character.getProperty('feature01Type');
    const feature02Type = this.character.getProperty('feature02Type');
    
    const bodyOption = CHARACTER_OPTIONS.bodyTypes[bodyType];
    const feature01Option = CHARACTER_OPTIONS.feature01Types[feature01Type];
    const feature02Option = CHARACTER_OPTIONS.feature02Types[feature02Type];
    
    // Render actual character images
    this.characterDisplay.innerHTML = `
      <div class="character-composite">
        <div class="character-layers">
          ${bodyOption ? `<img src="${bodyOption.image}" alt="${bodyOption.name}" class="character-layer body" />` : ''}
          ${feature01Option ? `<img src="${feature01Option.image}" alt="${feature01Option.name}" class="character-layer feature01" />` : ''}
          ${feature02Option ? `<img src="${feature02Option.image}" alt="${feature02Option.name}" class="character-layer feature02" />` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Show character builder screen
   */
  show() {
    this.characterBuilderScreen.classList.add('active');
    // Load current character state
    this.currentSelections.bodyType = this.character.getProperty('bodyType');
    this.currentSelections.feature01Type = this.character.getProperty('feature01Type');
    this.currentSelections.feature02Type = this.character.getProperty('feature02Type');
    
    // Load saved name
    const savedName = this.character.getProperty('name');
    if (savedName) {
      this.nameInput.value = savedName;
    }
    
    this.updateCharacterPreview();
  }

  /**
   * Hide character builder screen
   */
  hide() {
    this.characterBuilderScreen.classList.remove('active');
  }

  /**
   * Handle back to start button click
   */
  onBackToStart() {
    // This will be handled by the main quiz controller
    // Emit custom event for external handling
    document.dispatchEvent(new CustomEvent('characterBuilder:backToStart'));
  }

  /**
   * Handle start quiz button click
   */
  onStartQuiz() {
    // This will be handled by the main quiz controller
    // Emit custom event for external handling
    document.dispatchEvent(new CustomEvent('characterBuilder:startQuiz', {
      detail: { character: this.character.getAllData() }
    }));
  }

  /**
   * Get current character instance
   * @returns {Character} Current character
   */
  getCharacter() {
    return this.character;
  }
}