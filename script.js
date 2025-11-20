import { QUIZ_QUESTIONS, RESULT_OPTIONS, MBTI_TYPES } from "./quiz-data.js";
import { CharacterBuilder } from "./character-builder.js";
import { CHARACTER_OPTIONS } from "./character.js";

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
    this.chairCharacter = document.getElementById("chair-character");
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
    this.displayCharacterOnChair();
  }

  displayCharacterOnChair() {
    if (!this.chairCharacter || !this.characterBuilder) {
      return;
    }

    const character = this.characterBuilder.character;
    const bodyType = character.getProperty("bodyType");
    const feature01Type = character.getProperty("feature01Type");
    const feature02Type = character.getProperty("feature02Type");

    const bodyOption = CHARACTER_OPTIONS.bodyTypes[bodyType];
    const feature01Option = CHARACTER_OPTIONS.feature01Types[feature01Type];
    const feature02Option = CHARACTER_OPTIONS.feature02Types[feature02Type];

    // Clear and render character directly
    this.chairCharacter.innerHTML = "";

    if (bodyOption) {
      const bodyImg = document.createElement("img");
      bodyImg.src = bodyOption.image;
      bodyImg.className = "character-layer body";
      this.chairCharacter.appendChild(bodyImg);
    }

    if (feature01Option) {
      const feature01Img = document.createElement("img");
      feature01Img.src = feature01Option.image;
      feature01Img.className = "character-layer feature01";
      this.chairCharacter.appendChild(feature01Img);
    }

    if (feature02Option) {
      const feature02Img = document.createElement("img");
      feature02Img.src = feature02Option.image;
      feature02Img.className = "character-layer feature02";
      this.chairCharacter.appendChild(feature02Img);
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
      MBTI_TYPES[personalityType] || personalityType;

    // Create personality name from individual traits
    const traits = [
      this.scores.E >= this.scores.I ? RESULT_OPTIONS.E : RESULT_OPTIONS.I,
      this.scores.S >= this.scores.N ? RESULT_OPTIONS.S : RESULT_OPTIONS.N,
      this.scores.T >= this.scores.F ? RESULT_OPTIONS.T : RESULT_OPTIONS.F,
      this.scores.J >= this.scores.P ? RESULT_OPTIONS.J : RESULT_OPTIONS.P,
    ];

    // Display result image for the main personality type
    const resultImage = document.getElementById("result-image");
    const mainTrait = personalityType[0];
    if (RESULT_OPTIONS[mainTrait] && RESULT_OPTIONS[mainTrait].image) {
      resultImage.src = RESULT_OPTIONS[mainTrait].image;
      resultImage.alt = `${RESULT_OPTIONS[mainTrait].label} result image`;
      resultImage.style.display = "block";
    } else {
      resultImage.style.display = "none";
    }

    // Display score breakdown
    this.displayScoreBreakdown();

    // Show results screen
    this.showResultsScreen();
  }

  // displayTraitBreakdown removed: no longer needed

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

      // Calculate line start points (edge of pie chart)
      const pieRadius = 38; // Pie chart radius minus border
      const lineLength = 20;
      const labelDistance = 25;

      const trait1StartX = Math.cos(trait1Rad) * pieRadius;
      const trait1StartY = Math.sin(trait1Rad) * pieRadius;
      const trait1EndX = Math.cos(trait1Rad) * (pieRadius + lineLength);
      const trait1EndY = Math.sin(trait1Rad) * (pieRadius + lineLength);
      const trait1LabelX = Math.cos(trait1Rad) * (pieRadius + labelDistance);
      const trait1LabelY = Math.sin(trait1Rad) * (pieRadius + labelDistance);

      const trait2StartX = Math.cos(trait2Rad) * pieRadius;
      const trait2StartY = Math.sin(trait2Rad) * pieRadius;
      const trait2EndX = Math.cos(trait2Rad) * (pieRadius + lineLength);
      const trait2EndY = Math.sin(trait2Rad) * (pieRadius + lineLength);
      const trait2LabelX = Math.cos(trait2Rad) * (pieRadius + labelDistance);
      const trait2LabelY = Math.sin(trait2Rad) * (pieRadius + labelDistance);

      chartElement.innerHTML = `
        <div class="pie-chart-wrapper">
          <div class="pie-chart" 
               style="--percentage1-angle: ${angle1}deg;">
          </div>
          <svg class="pie-lines" width="140" height="140" style="position: absolute; top: 0; left: 0; pointer-events: none;">
            <line x1="${70 + trait1StartX}" y1="${70 + trait1StartY}" 
                  x2="${70 + trait1EndX}" y2="${70 + trait1EndY}" 
                  stroke="var(--key-color)" stroke-width="1.5"/>
            <line x1="${70 + trait2StartX}" y1="${70 + trait2StartY}" 
                  x2="${70 + trait2EndX}" y2="${70 + trait2EndY}" 
                  stroke="var(--key-color)" stroke-width="1.5"/>
          </svg>
          <div class="pie-chart-labels">
            <div class="pie-label trait1" style="
              left: ${70 + trait1LabelX}px; 
              top: ${70 + trait1LabelY}px;
              transform: translate(-50%, -50%);
            ">
              ${percentage1}% ${RESULT_OPTIONS[trait1].label}
            </div>
            <div class="pie-label trait2" style="
              left: ${70 + trait2LabelX}px; 
              top: ${70 + trait2LabelY}px;
              transform: translate(-50%, -50%);
            ">
              ${percentage2}% ${RESULT_OPTIONS[trait2].label}
            </div>
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
