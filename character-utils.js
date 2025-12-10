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
      feature03Type: CHARACTER_OPTIONS.feature03Types
        ? CHARACTER_OPTIONS.feature03Types[
            Math.floor(Math.random() * CHARACTER_OPTIONS.feature03Types.length)
          ].id
        : 0,
      feature04Type: CHARACTER_OPTIONS.feature04Types
        ? CHARACTER_OPTIONS.feature04Types[
            Math.floor(Math.random() * CHARACTER_OPTIONS.feature04Types.length)
          ].id
        : 0,
      feature05Type: CHARACTER_OPTIONS.feature05Types
        ? CHARACTER_OPTIONS.feature05Types[
            Math.floor(Math.random() * CHARACTER_OPTIONS.feature05Types.length)
          ].id
        : 0,
      colorType: Math.floor(Math.random() * 6) + 1, // Random color 1-6
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
      // Create colored body layer
      const bodyOption = CHARACTER_OPTIONS.bodyTypes[characterData.bodyType];
      if (bodyOption) {
        const bodyImg = document.createElement("img");
        // Use colored body if colorType is available, otherwise fallback to regular image
        bodyImg.src =
          characterData.colorType && bodyOption.getImageForColor
            ? bodyOption.getImageForColor(characterData.colorType)
            : bodyOption.image || bodyOption.getImageForColor(1); // fallback to color 1
        bodyImg.className = "character-layer body";
        bodyImg.alt = "Character body";
        bodyImg.onload = () =>
          console.log(`✅ Loaded body image: ${bodyImg.src}`);
        bodyImg.onerror = () =>
          console.error(`❌ Failed to load body image: ${bodyImg.src}`);
        container.appendChild(bodyImg);
      }

      // Add all feature layers
      const features = [
        {
          type: "feature01Type",
          options: CHARACTER_OPTIONS.feature01Types,
          class: "feature01",
        },
        {
          type: "feature02Type",
          options: CHARACTER_OPTIONS.feature02Types,
          class: "feature02",
        },
        {
          type: "feature03Type",
          options: CHARACTER_OPTIONS.feature03Types,
          class: "feature03",
        },
        {
          type: "feature04Type",
          options: CHARACTER_OPTIONS.feature04Types,
          class: "feature04",
        },
        {
          type: "feature05Type",
          options: CHARACTER_OPTIONS.feature05Types,
          class: "feature05",
        },
      ];

      features.forEach(({ type, options, class: className }) => {
        if (
          characterData[type] !== undefined &&
          options &&
          options[characterData[type]]
        ) {
          const featureImg = document.createElement("img");
          featureImg.src = options[characterData[type]].image;
          featureImg.className = `character-layer ${className}`;
          featureImg.alt = `Character ${className}`;
          featureImg.onload = () =>
            console.log(`✅ Loaded ${className} image: ${featureImg.src}`);
          featureImg.onerror = () =>
            console.error(
              `❌ Failed to load ${className} image: ${featureImg.src}`
            );
          container.appendChild(featureImg);
        }
      });

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
