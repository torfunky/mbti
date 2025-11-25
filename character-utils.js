/**
 * Character utilities for generating and rendering random characters
 */
import { CHARACTER_OPTIONS } from "./character.js";

export class CharacterUtils {
  /**
   * Generate a random character with body type different from excluded types
   * @param {number|Array} excludeBodyTypes - Body type(s) to exclude from random selection
   * @returns {Object} Random character data
   */
  static generateRandomCharacter(excludeBodyTypes = -1) {
    // Normalize excludeBodyTypes to array
    const excludeArray = Array.isArray(excludeBodyTypes)
      ? excludeBodyTypes
      : [excludeBodyTypes];

    // Get available body types (excluding specified body types)
    const availableBodies = CHARACTER_OPTIONS.bodyTypes.filter(
      (_, index) => !excludeArray.includes(index)
    );

    // If no exclusion needed or all bodies would be excluded, use all bodies
    const bodiesToUse =
      availableBodies.length > 0
        ? availableBodies
        : CHARACTER_OPTIONS.bodyTypes;

    // Randomly select from available options
    const randomBody =
      bodiesToUse[Math.floor(Math.random() * bodiesToUse.length)];
    const randomFeature01 =
      CHARACTER_OPTIONS.feature01Types[
        Math.floor(Math.random() * CHARACTER_OPTIONS.feature01Types.length)
      ];
    const randomFeature02 =
      CHARACTER_OPTIONS.feature02Types[
        Math.floor(Math.random() * CHARACTER_OPTIONS.feature02Types.length)
      ];

    return {
      bodyType: randomBody.id,
      feature01Type: randomFeature01.id,
      feature02Type: randomFeature02.id,
    };
  }

  /**
   * Render a character in the specified container
   * @param {string} containerId - ID of the container element
   * @param {Object} characterData - Character data with bodyType, feature01Type, feature02Type
   */
  static renderCharacterInContainer(containerId, characterData) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Container with ID ${containerId} not found`);
      return;
    }

    console.log(
      `Rendering character in container ${containerId}:`,
      characterData
    );

    // Clear existing content
    container.innerHTML = "";

    try {
      // Create character layers
      const bodyImg = document.createElement("img");
      bodyImg.src = CHARACTER_OPTIONS.bodyTypes[characterData.bodyType].image;
      bodyImg.className = "character-layer body";
      bodyImg.alt = "Character body";
      bodyImg.onload = () =>
        console.log(`✅ Loaded body image: ${bodyImg.src}`);
      bodyImg.onerror = () =>
        console.error(`❌ Failed to load body image: ${bodyImg.src}`);
      container.appendChild(bodyImg);

      const feature01Img = document.createElement("img");
      feature01Img.src =
        CHARACTER_OPTIONS.feature01Types[characterData.feature01Type].image;
      feature01Img.className = "character-layer feature01";
      feature01Img.alt = "Character feature 1";
      feature01Img.onload = () =>
        console.log(`✅ Loaded feature01 image: ${feature01Img.src}`);
      feature01Img.onerror = () =>
        console.error(`❌ Failed to load feature01 image: ${feature01Img.src}`);
      container.appendChild(feature01Img);

      const feature02Img = document.createElement("img");
      feature02Img.src =
        CHARACTER_OPTIONS.feature02Types[characterData.feature02Type].image;
      feature02Img.className = "character-layer feature02";
      feature02Img.alt = "Character feature 2";
      feature02Img.onload = () =>
        console.log(`✅ Loaded feature02 image: ${feature02Img.src}`);
      feature02Img.onerror = () =>
        console.error(`❌ Failed to load feature02 image: ${feature02Img.src}`);
      container.appendChild(feature02Img);

      console.log(
        `Added ${container.children.length} images to container ${containerId}`
      );
    } catch (error) {
      console.error("Error rendering character:", error);
    }
  }

  /**
   * Generate and render two random characters for compatibility display
   * @param {number} userBodyType - User's body type to exclude from random generation
   */
  static generateCompatibilityCharacters(userBodyType = 0) {
    try {
      // Generate first character
      const compatibleCharacter = this.generateRandomCharacter(userBodyType);

      // Generate second character, excluding both user's body type AND first character's body type
      const excludeBodyTypes = [userBodyType, compatibleCharacter.bodyType];
      const incompatibleCharacter =
        this.generateRandomCharacter(excludeBodyTypes);

      // Render characters in their containers
      this.renderCharacterInContainer(
        "compatible-character",
        compatibleCharacter
      );
      this.renderCharacterInContainer(
        "incompatible-character",
        incompatibleCharacter
      );
    } catch (error) {
      console.error("Error generating compatibility characters:", error);
    }
  }
}
