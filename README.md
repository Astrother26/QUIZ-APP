
## **Project Overview**

<img width="1882" height="910" alt="image" src="https://github.com/user-attachments/assets/ebb35a48-6d9f-4807-9195-00612abee38d" />


**Name:** The Ultimate Trivia Quiz
**Purpose:** A React-based trivia quiz app that allows users to select categories, number of questions, difficulty, type of questions, and a countdown timer. The app fetches questions from [Open Trivia Database](https://opentdb.com/) or falls back to sample questions if API fails.
**Features:**

* Select quiz configuration: category, number of questions, difficulty, type, and timer.
* Countdown timer for the quiz.
* Navigation between questions with previous/next buttons.
* Immediate selection of answers.
* Results page with detailed statistics, grading, and Q\&A review.
* Retry quiz or go back to setup.

---

## **Technologies Used**

* **Frontend:**

  * React (Functional Components + Hooks)
  * React Router DOM for routing between pages (`/`, `/quiz`, `/results`)
  * CSS (flexbox, gradients, backdrop-filter for blur)
* **Data:**

  * Open Trivia Database API (`https://opentdb.com/api.php`)
  * Local fallback questions (`sampleQuestions.js`)
* **Utilities:**

  * `shuffle` for randomizing answer options.
  * `calculateGrade`, `calculateScore`, `getLetter`, `timeConverter` utilities.
* **Tools:**

  * NPM/Yarn for dependency management.
  * Browser for running the app locally.

---

## **Project Structure**

```
EcoThriftQuiz/
├── src/
│   ├── components/
│   │   ├── QuizSetup.js        // Quiz configuration page
│   │   ├── QuizGame.js         // Quiz gameplay page
│   │   ├── ResultsPage.js      // Results & QnA review page
│   │   ├── LoadingSpinner.js   // Spinner while loading
│   ├── data/
│   │   └── sampleQuestions.js  // Fallback questions
│   ├── styles/
│   │   └── Quiz.css            // Global & component styles
│   ├── utils/
│   │   ├── calculateGrade.js
│   │   ├── calculateScore.js
│   │   ├── getLetter.js
│   │   ├── shuffle.js
│   │   └── timeConverter.js
│   ├── App.js                  // Root component with routing
│   └── index.js                // App entry point
├── package.json
└── README.md
```

---

## **How It Works**

1. **Setup Page (`QuizSetup.js`):**

   * Fetches quiz categories from API.
   * Allows user to configure quiz options.
   * Starts quiz by navigating to `/quiz`.

2. **Quiz Page (`QuizGame.js`):**

   * Fetches questions from Open Trivia API or uses sample questions.
   * Displays question, options, and timer.
   * Tracks user selections.
   * Updates progress bar.
   * Navigates to results when finished or time runs out.

3. **Results Page (`ResultsPage.js`):**

   * Displays statistics: correct answers, total questions, percentage, grade, time taken.
   * Motivational remarks based on performance.
   * QnA review shows user answers vs correct answers.
   * Buttons for "Play Again" or "Back to Home".

4. **Utilities (`utils` folder):**

   * `shuffle`: Randomizes answer options.
   * `calculateGrade`: Generates grade & remarks based on percentage.
   * `calculateScore`: Calculates percentage score.
   * `getLetter`: Converts index to A/B/C/D.
   * `timeConverter`: Converts milliseconds to hh\:mm\:ss format.

---

## **How to Run the Project**

1. **Clone the repository**

```bash
git clone <repo-url>
cd QUIZ-APP
```

2. **Install dependencies**

```bash
npm install
```


3. **Start the development server**

```bash
npm start
```

* App will run at `http://localhost:3000`.

4. **Build for production**

```bash
npm run build
```

---

## **How to Use**

1. Go to homepage → Configure your quiz.
2. Select category, number of questions, difficulty, type, and timer.
3. Click **Play Now** → Quiz starts.
4. Answer questions → Use **Next/Previous** buttons.
5. After the last question or when timer ends → Redirects to Results page.
6. Review stats, grades, and correct answers.
7. Use **Play Again** or **Back to Home** to restart.

---

## **Notes / Suggestions**

* Timer is currently in seconds. Could add visual countdown bar.
* For mobile responsiveness, consider media queries in `Quiz.css`.
* Sample questions are used if API fails → good fallback.
* Grading system is customizable in `calculateGrade.js`.

