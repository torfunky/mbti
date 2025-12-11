import { QUIZ_QUESTIONS, RESULT_OPTIONS, MBTI_TYPES } from "./quiz-data.js";
import { CharacterBuilder } from "./character-builder.js";
import { CHARACTER_OPTIONS } from "./character.js";
import { CharacterUtils } from "./character-utils.js";

class MBTIQuiz {
  constructor() {
    this.currentQuestionIndex = 0;
    this.answers = [];
    this.scores = {
      E: 0,
      I: 0,
      S: 0,
      N: 0,
      T: 0,
      F: 0,
      J: 0,
      P: 0,
    };

    this.initializeElements();
    this.initializeCharacterBuilder();
    this.setupEventListeners();
    this.clearNameAndResetCharacter();
    this.showStartScreen();
  }

  initializeElements() {
    this.startScreen = document.getElementById("start-screen");
    this.characterBuilderScreen = document.getElementById(
      "character-builder-screen"
    );
    this.quizScreen = document.getElementById("quiz-screen");
    this.resultsScreen = document.getElementById("results-screen");
    this.allTypesScreen = document.getElementById("all-types-screen");
    this.questionCounter = document.getElementById("question-counter");
    this.progressCircles = document.getElementById("progress-circles");
    this.questionImg = document.getElementById("question-img");
    this.questionTitle = document.getElementById("question-title");
    this.answersList = document.getElementById("answers-list");
    this.prevBtn = document.getElementById("prev-btn");
    this.nextBtn = document.getElementById("next-btn");
    this.personalityCode = document.getElementById("personality-code");
    this.scoresList = document.getElementById("scores-list");
    this.startBtn = document.getElementById("start-btn");
    this.restartBtn = document.getElementById("restart-btn");
    this.seeAllTypesBtn = document.getElementById("see-all-types-btn");
    this.backToResultsBtn = document.getElementById("back-to-results-btn");
    this.restartFromAllTypesBtn = document.getElementById(
      "restart-from-all-types-btn"
    );
    this.shareBtn = document.getElementById("share-btn");
    this.allTypesContainer = document.getElementById("all-types-container");
  }

  initializeCharacterBuilder() {
    this.characterBuilder = new CharacterBuilder();

    // Listen for character builder events
    document.addEventListener("characterBuilder:backToStart", () => {
      this.showStartScreen();
    });

    document.addEventListener("characterBuilder:startQuiz", (event) => {
      this.userCharacter = event.detail.character;
      this.startQuiz();
    });
  }

  setupEventListeners() {
    this.startBtn.addEventListener("click", () => this.showCharacterBuilder());
    this.prevBtn.addEventListener("click", () => this.previousQuestion());
    this.nextBtn.addEventListener("click", () => this.nextQuestion());
    this.restartBtn.addEventListener("click", () => this.restartQuiz());
    this.seeAllTypesBtn.addEventListener("click", () => this.showAllTypes());
    this.backToResultsBtn.addEventListener("click", () => this.showResults());
    this.restartFromAllTypesBtn.addEventListener("click", () =>
      this.restartQuiz()
    );
    this.shareBtn.addEventListener("click", () => this.printResult());

    // Color picker event listeners
    const colorOptions = document.querySelectorAll(".color-option");
    colorOptions.forEach((colorOption) => {
      colorOption.addEventListener("click", () => {
        // Remove active class from all color options
        colorOptions.forEach((opt) => opt.classList.remove("active"));
        // Add active class to clicked option
        colorOption.classList.add("active");

        // Update character builder if it exists
        if (this.characterBuilder) {
          const colorValue = parseInt(colorOption.dataset.color);
          this.characterBuilder
            .getCharacter()
            .updateProperty("colorType", colorValue);
        }
      });
    });

    // Keyboard navigation for accessibility
    this.prevBtn.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.key === " ") && !this.prevBtn.disabled) {
        this.previousQuestion();
      }
    });
    this.nextBtn.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.key === " ") && !this.nextBtn.disabled) {
        this.nextQuestion();
      }
    });
  }

  clearNameAndResetCharacter() {
    // Clear name input on page load/refresh
    const nameInput = document.getElementById("character-name-input");
    if (nameInput) {
      nameInput.value = "";
    }

    // Reset character to random state
    if (this.characterBuilder && this.characterBuilder.getCharacter()) {
      this.characterBuilder.getCharacter().reset();
      this.characterBuilder.refreshDisplay();
    }
  }

  async printResult() {
    try {
      // Get the name from character builder or use default
      const name =
        this.characterBuilder?.getCharacter()?.getProperty("name") || "friend";

      // Create a temporary container for the image
      const container = document.createElement("div");
      container.style.cssText = `
        position: fixed;
        top: -9999px;
        left: -9999px;
        width: 700px;
        height: 1100px;
        background: var(--main-theme-1);
        border-radius: 40px;
        box-sizing: border-box;
        font-family: inherit;
        overflow: hidden;
      `;

      // Create header
      const header = document.createElement("h2");
      header.textContent = `Hello ${name}, you are...`;
      header.style.cssText = `
        font-size: 2.6rem;
        font-weight: 700;
        color: var(--main-theme-3);
        text-align: center;
        margin: 0;
        font-family: var(--font-pally);
        text-transform: none !important;
        letter-spacing: 0.05em;
        line-height: 1.1;
        position: absolute;
        top: 50px;
        left: 0;
        width: 100%;
        padding: 0 30px;
        box-sizing: border-box;
      `;

      // Create separate containers for personality code and character
      const personalityCodeElement =
        document.querySelector("#personality-code");
      const characterDisplayElement = document.querySelector(
        "#user-character-display"
      );

      // Clone personality code
      const clonedPersonalityCode = personalityCodeElement.cloneNode(true);
      // Create MBTI type display (separate from personality code)
      const mbtiTypeDisplay = document.createElement("div");
      mbtiTypeDisplay.textContent = this.getPersonalityType() + ":";
      mbtiTypeDisplay.style.cssText = `
        position: absolute;
        top: 140px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--main-theme-3);
        background: var(--main-theme-2);
        padding: 2px 2px;
        white-space: nowrap;
        font-family: var(--font-pally);
        text-transform: uppercase;
        letter-spacing: 0.1em;
        text-align: center;
        z-index: 3;
      `;

      const personalityCodeContainer = document.createElement("div");
      personalityCodeContainer.style.cssText = `
        position: absolute;
        top: 175px;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        z-index: 3;
      `;
      personalityCodeContainer.appendChild(clonedPersonalityCode);

      // Clone character display
      const clonedCharacterDisplay = characterDisplayElement.cloneNode(true);
      const characterContainer = document.createElement("div");
      characterContainer.style.cssText = `
        position: absolute;
        top: 240px;
        left: 50%;
        transform: translateX(-50%) scale(1.1);
        z-index: 2;
      `;

      // Fix character layer aspect ratio for export
      const characterLayers =
        clonedCharacterDisplay.querySelectorAll(".character-layer");
      characterLayers.forEach((layer) => {
        layer.style.cssText += `
          width: 170px !important;
          height: auto !important;
          object-fit: contain !important;
          object-position: center !important;
        `;
      });
      characterContainer.appendChild(clonedCharacterDisplay);

      // Clone the rest of the results content (scores, description, compatibility)
      const resultsContent = document.querySelector(".result-content");
      const clonedContent = resultsContent.cloneNode(true);

      // Remove personality code and character display from cloned content since we're handling them separately
      const personalityTypeSection =
        clonedContent.querySelector(".personality-type");
      const personalityImageSection =
        clonedContent.querySelector(".personality-image");
      if (personalityTypeSection) personalityTypeSection.remove();
      if (personalityImageSection) personalityImageSection.remove();

      clonedContent.style.cssText = `
        position: absolute;
        top: 480px;
        left: 50%;
        transform: translateX(-50%) scale(1.2);
        margin: 0;
        padding: 0 30px;
        width: calc(100% - 60px);
        box-sizing: border-box;
        max-width: none;
        max-height: none;
        z-index: 1;
      `;

      // Create footer
      const footer = document.createElement("footer");
      footer.textContent =
        "quiz and dev by reiley nymeyer • design by phoebe zheng • results copy by haysie chung";
      footer.style.cssText = `
        position: absolute;
        bottom: 15px;
        left: 0;
        width: 100%;
        text-align: center;
        font-size: 0.8rem;
        color: var(--main-theme-3);
        font-family: var(--font-pally);
        padding: 0 30px;
        box-sizing: border-box;
        line-height: 1.2;
      `;

      // Create inner content box
      const contentBox = document.createElement("div");
      contentBox.style.cssText = `
        position: absolute;
        top: 50px;
        left: 50px;
        width: calc(100% - 100px);
        height: calc(100% - 100px);
        background: var(--main-theme-2);
        border: 4px solid var(--main-theme-3);
        border-radius: 20px;
        box-sizing: border-box;
        overflow: hidden;
      `;

      contentBox.appendChild(header);
      contentBox.appendChild(mbtiTypeDisplay);
      contentBox.appendChild(personalityCodeContainer);
      contentBox.appendChild(characterContainer);
      contentBox.appendChild(clonedContent);
      contentBox.appendChild(footer);
      container.appendChild(contentBox);
      document.body.appendChild(container);

      // Generate the image
      const canvas = await html2canvas(container, {
        width: 700,
        height: 1100,
        scale: 1,
        backgroundColor: "white",
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: false,
        imageTimeout: 0,
        logging: false,
      });

      // Remove temporary container
      document.body.removeChild(container);

      // Convert to blob and download
      canvas.toBlob(async (blob) => {
        // Download for user
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "image.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Save to project folder and run python script
        try {
          const formData = new FormData();
          formData.append("image", blob, "image.png");

          const response = await fetch("/save-and-print", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            console.log("Image saved and python script executed successfully");
          } else {
            console.error("Failed to save image and run python script");
          }
        } catch (error) {
          console.error("Error saving image to project folder:", error);
        }
      }, "image/png");
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Error generating image. Please try again.");
    }
  }

  showStartScreen() {
    this.hideAllScreens();
    this.startScreen.classList.add("active");
  }

  showCharacterBuilder() {
    this.hideAllScreens();
    this.characterBuilderScreen.classList.add("active");
    this.characterBuilder.show();
  }

  showQuizScreen() {
    this.hideAllScreens();
    this.quizScreen.classList.add("active");
  }

  showAllTypes() {
    this.hideAllScreens();
    this.allTypesScreen.classList.add("active");
    this.displayAllTypes();
  }

  addCharacterToQuestionBox() {
    if (!this.characterBuilder) {
      return;
    }

    // Remove existing mini character if any
    const existingChar = document.querySelector(
      ".question-text .mini-character"
    );
    if (existingChar) {
      existingChar.remove();
    }

    const character = this.characterBuilder.character;
    const bodyType = character.getProperty("bodyType");
    const colorType = character.getProperty("colorType");
    const feature01Type = character.getProperty("feature01Type");
    const feature02Type = character.getProperty("feature02Type");
    const feature03Type = character.getProperty("feature03Type");
    const feature04Type = character.getProperty("feature04Type");
    const feature05Type = character.getProperty("feature05Type");

    const bodyOption = CHARACTER_OPTIONS.bodyTypes[bodyType];
    const feature01Option = CHARACTER_OPTIONS.feature01Types[feature01Type];
    const feature02Option = CHARACTER_OPTIONS.feature02Types[feature02Type];
    const feature03Option = CHARACTER_OPTIONS.feature03Types[feature03Type];
    const feature04Option = CHARACTER_OPTIONS.feature04Types[feature04Type];
    const feature05Option = CHARACTER_OPTIONS.feature05Types[feature05Type];

    // Create mini character container
    const miniChar = document.createElement("div");
    miniChar.className = "mini-character";

    // Add colored body layer
    if (bodyOption) {
      const bodyImg = document.createElement("img");
      bodyImg.src = bodyOption.getImageForColor(colorType);
      bodyImg.className = "character-layer body";
      miniChar.appendChild(bodyImg);
    }

    // Add all feature layers
    const features = [
      { option: feature01Option, class: "feature01" },
      { option: feature02Option, class: "feature02" },
      { option: feature03Option, class: "feature03" },
      { option: feature04Option, class: "feature04" },
      { option: feature05Option, class: "feature05" },
    ];

    features.forEach(({ option, class: className }) => {
      if (option) {
        const img = document.createElement("img");
        img.src = option.image;
        img.className = `character-layer ${className}`;
        miniChar.appendChild(img);
      }
    });

    // Add to question text box
    const questionTextH2 = document.querySelector(".question-text h2");
    if (questionTextH2) {
      questionTextH2.appendChild(miniChar);
    }
  }

  showResultsScreen() {
    this.hideAllScreens();
    this.resultsScreen.classList.add("active");
  }

  hideAllScreens() {
    document.querySelectorAll(".screen").forEach((screen) => {
      screen.classList.remove("active");
    });
  }

  startQuiz() {
    this.currentQuestionIndex = 0;
    this.answers = [];
    this.resetScores();
    this.showQuizScreen();
    this.displayQuestion();
  }

  resetScores() {
    this.scores = {
      E: 0,
      I: 0,
      S: 0,
      N: 0,
      T: 0,
      F: 0,
      J: 0,
      P: 0,
    };
  }

  renderProgressCircles() {
    // Clear previous
    this.progressCircles.innerHTML = "";
    for (let i = 0; i < QUIZ_QUESTIONS.length; i++) {
      const circle = document.createElement("div");
      circle.className = "progress-circle";
      if (this.answers[i] !== undefined) {
        circle.classList.add("filled");
      }
      if (i === this.currentQuestionIndex) {
        circle.classList.add("current");
      }
      this.progressCircles.appendChild(circle);
    }
  }

  selectAnswer(answerIndex) {
    // Remove previous selection
    document.querySelectorAll(".answer-btn").forEach((btn) => {
      btn.classList.remove("selected");
    });

    // Find the button that matches the selected answerIndex in the shuffled order
    const answersWithIndex = this.shuffledAnswers[this.currentQuestionIndex];
    const btnIdx = answersWithIndex.findIndex(
      (a) => a.origIndex === answerIndex
    );
    if (btnIdx !== -1) {
      document
        .querySelectorAll(".answer-btn")
        [btnIdx].classList.add("selected");
    }

    // Store the answer
    this.answers[this.currentQuestionIndex] = answerIndex;

    // Enable next button
    this.nextBtn.disabled = false;
  }

  updateNavigationButtons() {
    // Previous button
    const isFirst = this.currentQuestionIndex === 0;
    this.prevBtn.disabled = isFirst;
    if (!isFirst) {
      this.prevBtn.classList.add("filled");
    } else {
      this.prevBtn.classList.remove("filled");
    }

    // Next button
    const hasAnswer = this.answers[this.currentQuestionIndex] !== undefined;
    this.nextBtn.disabled = !hasAnswer;
    if (hasAnswer) {
      this.nextBtn.classList.add("filled");
    } else {
      this.nextBtn.classList.remove("filled");
    }
  }

  displayQuestion() {
    const question = QUIZ_QUESTIONS[this.currentQuestionIndex];

    // Update question counter
    this.questionCounter.textContent = `Question ${
      this.currentQuestionIndex + 1
    } of ${QUIZ_QUESTIONS.length}`;

    // Render progress circles
    this.renderProgressCircles();

    // Update question content
    this.questionTitle.textContent = question.question;
    this.questionImg.src = question.image;
    this.questionImg.alt = "";

    // Add character to question box
    this.addCharacterToQuestionBox();

    // Clear previous answers
    this.answersList.innerHTML = "";

    // Shuffle answers, but keep the order consistent for the current question
    if (!this.shuffledAnswers) this.shuffledAnswers = {};
    if (!this.shuffledAnswers[this.currentQuestionIndex]) {
      const answersWithIndex = question.answers.map((a, i) => ({
        ...a,
        origIndex: i,
      }));
      for (let i = answersWithIndex.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answersWithIndex[i], answersWithIndex[j]] = [
          answersWithIndex[j],
          answersWithIndex[i],
        ];
      }
      this.shuffledAnswers[this.currentQuestionIndex] = answersWithIndex;
    }
    const answersWithIndex = this.shuffledAnswers[this.currentQuestionIndex];

    answersWithIndex.forEach((answer, btnIdx) => {
      const answerBtn = document.createElement("button");
      answerBtn.className = "answer-btn";
      answerBtn.textContent = answer.text;
      answerBtn.addEventListener("click", () =>
        this.selectAnswer(answer.origIndex)
      );

      // Check if this answer was previously selected
      if (this.answers[this.currentQuestionIndex] === answer.origIndex) {
        answerBtn.classList.add("selected");
      }

      this.answersList.appendChild(answerBtn);
    });

    // Update navigation buttons
    this.updateNavigationButtons();
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.displayQuestion();
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      this.currentQuestionIndex++;
      this.displayQuestion();
    } else {
      // Quiz is complete, calculate results
      this.calculateResults();
      this.showResults();
    }
  }

  calculateResults() {
    // Reset scores
    this.resetScores();

    // Calculate scores based on answers
    this.answers.forEach((answerIndex, questionIndex) => {
      if (answerIndex !== undefined) {
        const question = QUIZ_QUESTIONS[questionIndex];
        const selectedAnswer = question.answers[answerIndex];

        // Add scores for this answer
        Object.entries(selectedAnswer.scores).forEach(([trait, score]) => {
          this.scores[trait] += score;
        });
      }
    });
  }

  getPersonalityType() {
    const type =
      (this.scores.E >= this.scores.I ? "E" : "I") +
      (this.scores.S >= this.scores.N ? "S" : "N") +
      (this.scores.T >= this.scores.F ? "T" : "F") +
      (this.scores.J >= this.scores.P ? "J" : "P");

    return type;
  }

  showResults() {
    const personalityType = this.getPersonalityType();

    // Display personality type
    this.personalityCode.textContent =
      MBTI_TYPES[personalityType]?.label || personalityType;

    // Display MBTI type label under character
    const mbtiTypeLabel = document.getElementById("mbti-type-label");
    if (mbtiTypeLabel) {
      mbtiTypeLabel.textContent = personalityType;
    }

    // Create personality name from individual traits
    const traits = [
      this.scores.E >= this.scores.I ? RESULT_OPTIONS.E : RESULT_OPTIONS.I,
      this.scores.S >= this.scores.N ? RESULT_OPTIONS.S : RESULT_OPTIONS.N,
      this.scores.T >= this.scores.F ? RESULT_OPTIONS.T : RESULT_OPTIONS.F,
      this.scores.J >= this.scores.P ? RESULT_OPTIONS.J : RESULT_OPTIONS.P,
    ];

    // Display user's character in results
    if (this.userCharacter) {
      let userBodyType = 0;
      let userFeature01Type = 0;
      let userFeature02Type = 0;
      let userFeature03Type = 0;
      let userFeature04Type = 0;
      let userFeature05Type = 0;
      let userColorType = 1;

      if (typeof this.userCharacter.getProperty === "function") {
        userBodyType = this.userCharacter.getProperty("bodyType");
        userFeature01Type = this.userCharacter.getProperty("feature01Type");
        userFeature02Type = this.userCharacter.getProperty("feature02Type");
        userFeature03Type = this.userCharacter.getProperty("feature03Type");
        userFeature04Type = this.userCharacter.getProperty("feature04Type");
        userFeature05Type = this.userCharacter.getProperty("feature05Type");
        userColorType = this.userCharacter.getProperty("colorType");
      } else if (this.userCharacter.bodyType !== undefined) {
        userBodyType = this.userCharacter.bodyType;
        userFeature01Type = this.userCharacter.feature01Type;
        userFeature02Type = this.userCharacter.feature02Type;
        userFeature03Type = this.userCharacter.feature03Type;
        userFeature04Type = this.userCharacter.feature04Type;
        userFeature05Type = this.userCharacter.feature05Type;
        userColorType = this.userCharacter.colorType;
      } else if (this.userCharacter.data) {
        userBodyType = this.userCharacter.data.bodyType;
        userFeature01Type = this.userCharacter.data.feature01Type;
        userFeature02Type = this.userCharacter.data.feature02Type;
        userFeature03Type = this.userCharacter.data.feature03Type;
        userFeature04Type = this.userCharacter.data.feature04Type;
        userFeature05Type = this.userCharacter.data.feature05Type;
        userColorType = this.userCharacter.data.colorType;
      }

      const userCharacterData = {
        bodyType: userBodyType,
        feature01Type: userFeature01Type,
        feature02Type: userFeature02Type,
        feature03Type: userFeature03Type,
        feature04Type: userFeature04Type,
        feature05Type: userFeature05Type,
        colorType: userColorType,
      };

      CharacterUtils.renderCharacterInContainer(
        "user-character-display",
        userCharacterData
      );
    }

    // Display compatibility information
    const compatibleElement = document.getElementById("compatible-type");
    const incompatibleElement = document.getElementById("incompatible-type");

    if (MBTI_TYPES[personalityType]?.compatible) {
      // Remove percentage by splitting on comma and taking first part
      const compatibleType =
        MBTI_TYPES[personalityType].compatible.split(",")[0];
      // Get the label from MBTI_TYPES if it exists
      const compatibleLabel =
        MBTI_TYPES[compatibleType]?.label || compatibleType;
      compatibleElement.textContent = compatibleLabel;
    } else {
      compatibleElement.textContent = "Not available";
    }

    if (MBTI_TYPES[personalityType]?.incompatible) {
      // Remove percentage by splitting on comma and taking first part
      const incompatibleType =
        MBTI_TYPES[personalityType].incompatible.split(",")[0];
      // Get the label from MBTI_TYPES if it exists
      const incompatibleLabel =
        MBTI_TYPES[incompatibleType]?.label || incompatibleType;
      incompatibleElement.textContent = incompatibleLabel;
    } else {
      incompatibleElement.textContent = "Not available";
    }

    // Generate random characters for compatibility boxes
    try {
      // Get user's body type - handle different possible userCharacter formats
      let userBodyType = 0;
      if (this.userCharacter) {
        if (typeof this.userCharacter.getProperty === "function") {
          userBodyType = this.userCharacter.getProperty("bodyType");
        } else if (this.userCharacter.bodyType !== undefined) {
          userBodyType = this.userCharacter.bodyType;
        } else if (
          this.userCharacter.data &&
          this.userCharacter.data.bodyType !== undefined
        ) {
          userBodyType = this.userCharacter.data.bodyType;
        }
      }
      CharacterUtils.generateCompatibilityCharacters(userBodyType);
    } catch (error) {
      console.error("Error generating compatibility characters:", error);
    }

    // Display score breakdown
    this.displayScoreBreakdown();

    // Show results screen
    this.showResultsScreen();
  }

  displayScoreBreakdown() {
    this.scoresList.innerHTML = "";

    const scorePairs = [
      ["E", "I"],
      ["S", "N"],
      ["T", "F"],
      ["J", "P"],
    ];

    scorePairs.forEach(([trait1, trait2]) => {
      const barElement = document.createElement("div");
      barElement.className = "progress-bar-item";

      const total = this.scores[trait1] + this.scores[trait2];
      const percentage1 =
        total > 0 ? Math.round((this.scores[trait1] / total) * 100) : 50;
      const percentage2 = 100 - percentage1;

      // Generate labels, hiding 0% values
      let label1HTML =
        percentage1 > 0
          ? `<div class="pie-label" style="left: ${
              percentage1 / 2
            }%;">${percentage1}%</div>`
          : "";
      let label2HTML =
        percentage2 > 0
          ? `<div class="pie-label" style="left: ${
              percentage1 + percentage2 / 2
            }%;">${percentage2}%</div>`
          : "";

      barElement.innerHTML = `
        <div class="progress-label-left">${RESULT_OPTIONS[trait1].label}</div>
        <div class="progress-bar-wrapper">
          <div class="progress-bar" style="--percentage1: ${percentage1}%;"></div>
          ${label1HTML}
          ${label2HTML}
        </div>
        <div class="progress-label-right">${RESULT_OPTIONS[trait2].label}</div>
      `;

      this.scoresList.appendChild(barElement);
    });

    // Add MBTI description
    this.displayMBTIDescription();
  }

  displayMBTIDescription() {
    const personalityType = this.getPersonalityType();
    const descriptionContainer = document.getElementById(
      "mbti-description-text"
    );

    if (descriptionContainer) {
      const typeData = MBTI_TYPES[personalityType];
      descriptionContainer.innerHTML = `
        <p><strong>PRO:</strong> ${typeData?.pros || "Not available"}</p>
        <p><strong>CON:</strong> ${typeData?.cons || "Not available"}</p>
        <p><strong>➼ </strong> ${typeData?.fact || "Not available"}</p>
      `;
    }
  }

  restartQuiz() {
    // Reset quiz state
    this.currentQuestionIndex = 0;
    this.answers = [];
    this.scores = {
      E: 0,
      I: 0,
      S: 0,
      N: 0,
      T: 0,
      F: 0,
      J: 0,
      P: 0,
    };

    // Reset and randomize character
    if (this.characterBuilder && this.characterBuilder.getCharacter()) {
      this.characterBuilder.getCharacter().reset();
      // Clear the name input
      const nameInput = document.getElementById("character-name-input");
      if (nameInput) {
        nameInput.value = "";
      }
      // Force refresh of character builder display
      this.characterBuilder.refreshDisplay();
    }

    this.userCharacter = null;
    this.showStartScreen();
  }

  displayAllTypes() {
    this.allTypesContainer.innerHTML = "";

    Object.entries(MBTI_TYPES).forEach(([type, data]) => {
      const typeCard = document.createElement("div");
      typeCard.className = "type-card";

      typeCard.innerHTML = `
        <img src="assets/mbti-types/${data.image}" alt="${type}" />
        <p>${data.label}</p>
      `;

      // Add click handler to show individual type details (optional)
      typeCard.addEventListener("click", () => {
        // You can add individual type detail functionality here if needed
        console.log(`Clicked on ${type}`);
      });

      this.allTypesContainer.appendChild(typeCard);
    });
  }
}

// Initialize the quiz when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new MBTIQuiz();
});
