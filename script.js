import { QUIZ_QUESTIONS, RESULT_OPTIONS } from "./quiz-data.js";

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
    this.setupEventListeners();
    this.showStartScreen();
  }

  initializeElements() {
    this.startScreen = document.getElementById("start-screen");
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

  setupEventListeners() {
    this.startBtn.addEventListener("click", () => this.startQuiz());
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

  showQuizScreen() {
    this.hideAllScreens();
    this.quizScreen.classList.add("active");
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
    this.questionImg.alt = `Illustration for question ${
      this.currentQuestionIndex + 1
    }`;

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
    this.personalityCode.textContent = personalityType;

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

    // Display trait descriptions under the section where each letter is shown
    const traitDescriptions = document.getElementById("trait-descriptions");
    traitDescriptions.innerHTML = traits
      .map(
        (trait) =>
          `<div class=\"trait-card\"><div class=\"trait-label\" tabindex=\"0\">${trait.label}</div><div class=\"trait-desc\">${trait.description}</div></div>`
      )
      .join("");

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
      const scoreElement = document.createElement("div");
      scoreElement.className = "score-item";

      const total = this.scores[trait1] + this.scores[trait2];
      const percentage1 =
        total > 0 ? Math.round((this.scores[trait1] / total) * 100) : 50;
      const percentage2 = 100 - percentage1;

      scoreElement.innerHTML = `
        <div class="score-label">
          <span>${RESULT_OPTIONS[trait1].label} vs ${RESULT_OPTIONS[trait2].label}</span>
        </div>
        <div class="score-bar">
          <div class="score-fill" style="width: ${percentage1}%"></div>
          <div class="score-fill-secondary" style="width: ${percentage2}%"></div>
        </div>
        <div class="score-percentages">
          <span>${percentage1}% ${RESULT_OPTIONS[trait1].label}</span>
          <span>${percentage2}% ${RESULT_OPTIONS[trait2].label}</span>
        </div>
      `;

      this.scoresList.appendChild(scoreElement);
    });
  }

  restartQuiz() {
    this.showStartScreen();
  }
}

// Initialize the quiz when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new MBTIQuiz();
});
