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
    this.showStartScreen();
  }

  initializeElements() {
    this.startScreen = document.getElementById("start-screen");
    this.characterBuilderScreen = document.getElementById(
      "character-builder-screen"
    );
    this.quizScreen = document.getElementById("quiz-screen");
    this.resultsScreen = document.getElementById("results-screen");
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
      const chartElement = document.createElement("div");
      chartElement.className = "pie-chart-item";

      const total = this.scores[trait1] + this.scores[trait2];
      const percentage1 =
        total > 0 ? Math.round((this.scores[trait1] / total) * 100) : 50;
      const percentage2 = 100 - percentage1;

      // Determine dominant trait and percentage
      const dominantTrait = percentage1 >= percentage2 ? trait1 : trait2;
      const dominantPercentage = Math.max(percentage1, percentage2);
      const anglePercentage = (dominantPercentage / 100) * 360;

      const angle1 = (percentage1 / 100) * 360;

      // Calculate center angles for each section
      const trait1CenterAngle = angle1 / 2; // Center of first section
      const trait2CenterAngle = angle1 + (360 - angle1) / 2; // Center of second section

      // Convert to radians and adjust so 0° is at top
      const trait1Rad = ((trait1CenterAngle - 90) * Math.PI) / 180;
      const trait2Rad = ((trait2CenterAngle - 90) * Math.PI) / 180;

      // Get CSS custom properties for scalable dimensions
      const computedStyle = getComputedStyle(document.documentElement);
      const wrapperSize =
        parseInt(computedStyle.getPropertyValue("--pie-wrapper-size")) || 100;
      const chartSize =
        parseInt(computedStyle.getPropertyValue("--pie-chart-size")) || 60;
      const center = wrapperSize / 2;
      const pieRadius = chartSize / 2 - 2; // Pie chart radius minus border

      const trait1StartX = Math.cos(trait1Rad) * pieRadius;
      const trait1StartY = Math.sin(trait1Rad) * pieRadius;
      const trait2StartX = Math.cos(trait2Rad) * pieRadius;
      const trait2StartY = Math.sin(trait2Rad) * pieRadius;

      // Handle label positioning and visibility (scale with wrapper size)
      const verticalOffset = wrapperSize * 0.36; // Distance from center (32% of wrapper)
      let trait1LabelX, trait1LabelY, trait2LabelX, trait2LabelY;
      let showTrait1 = percentage1 > 0;
      let showTrait2 = percentage2 > 0;

      if (percentage1 === 100 || percentage2 === 100) {
        // For 100% cases, center the label with no line
        if (percentage1 === 100) {
          trait1LabelX = 0; // Center horizontally
          trait1LabelY = 0; // Center vertically
        }
        if (percentage2 === 100) {
          trait2LabelX = 0; // Center horizontally
          trait2LabelY = 0; // Center vertically
        }
      } else {
        // Normal flip-flop positioning - separate labels vertically
        trait1LabelX = Math.cos(trait1Rad) * (pieRadius + 25);
        trait1LabelY = -verticalOffset; // Above pie chart
        trait2LabelX = Math.cos(trait2Rad) * (pieRadius + 25);
        trait2LabelY = verticalOffset; // Below pie chart
      }

      // Calculate line end points only for visible labels (and not for 100% cases)
      let linesHTML = "";
      let labelsHTML = "";

      if (showTrait1) {
        // Only add line if it's not a 100% case
        if (percentage1 !== 100) {
          const trait1EndX = trait1LabelX - Math.cos(trait1Rad) * 8;
          const trait1EndY = trait1LabelY - Math.sin(trait1Rad) * 8;

          linesHTML += `<line x1="${center + trait1StartX}" y1="${
            center + trait1StartY
          }" 
                             x2="${center + trait1EndX}" y2="${
            center + trait1EndY
          }" 
                             stroke="var(--key-color)" stroke-width="1.5"/>`;
        }

        labelsHTML += `<div class="pie-label trait1" style="
                         left: ${center + trait1LabelX}px; 
                         top: ${center + trait1LabelY}px;
                         transform: translate(-50%, -50%);
                       ">
                         ${percentage1}% ${RESULT_OPTIONS[trait1].label}
                       </div>`;
      }

      if (showTrait2) {
        // Only add line if it's not a 100% case
        if (percentage2 !== 100) {
          const trait2EndX = trait2LabelX - Math.cos(trait2Rad) * 8;
          const trait2EndY = trait2LabelY - Math.sin(trait2Rad) * 8;

          linesHTML += `<line x1="${center + trait2StartX}" y1="${
            center + trait2StartY
          }" 
                             x2="${center + trait2EndX}" y2="${
            center + trait2EndY
          }" 
                             stroke="var(--key-color)" stroke-width="1.5"/>`;
        }

        labelsHTML += `<div class="pie-label trait2" style="
                         left: ${center + trait2LabelX}px; 
                         top: ${center + trait2LabelY}px;
                         transform: translate(-50%, -50%);
                       ">
                         ${percentage2}% ${RESULT_OPTIONS[trait2].label}
                       </div>`;
      }

      chartElement.innerHTML = `
        <div class="pie-chart-wrapper">
          <div class="pie-chart" 
               style="--percentage1-angle: ${angle1}deg;">
          </div>
          <svg class="pie-lines" width="140" height="140" style="position: absolute; top: 0; left: 0; pointer-events: none;">
            ${linesHTML}
          </svg>
          <div class="pie-chart-labels">
            ${labelsHTML}
          </div>
        </div>
      `;
      this.scoresList.appendChild(chartElement);
    });
  }

  restartQuiz() {
    // Reset character data
    if (this.characterBuilder && this.characterBuilder.getCharacter()) {
      this.characterBuilder.getCharacter().reset();
    }
    this.userCharacter = null;
    this.showStartScreen();
  }
}

// Initialize the quiz when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new MBTIQuiz();
});
