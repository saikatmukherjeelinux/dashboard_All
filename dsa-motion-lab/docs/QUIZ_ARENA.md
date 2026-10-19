# Quiz Arena

Quiz Arena is a separate application view beside **Learn algorithms**. It uses
all 100 existing topics and does not add algorithm navigation entries or replace
the explanations, interview Q&A, Python examples, or animations in the lessons.

## Content

- 200 questions: one intermediate and one advanced question for each topic.
- Exactly four distinct options per question, with one correct option.
- Question and option order shuffle when a fresh attempt starts; the saved
  order remains stable while reviewing or resuming that attempt.
- The existing authored interview explanations supply the reasoning, worked
  example, and complexity/trade-off discussion for each corresponding question.
  Four-option answers and distractors are authored separately.
- Answers remain hidden until the user selects an option. The selected option
  and the correct option are labeled with text as well as color.

## Interaction

1. Open Quiz Arena. Category, topic, and difficulty filters narrow the pool.
2. Select 10, 20, 50, or all matching questions. A smaller pool automatically
   limits the attempt size, so one topic at one level produces one question.
3. Press Start quiz. It replaces the saved attempt; changing filters alone does
   not affect an ongoing attempt.
4. Select an option to grade immediately. The first choice is locked for this
   attempt; clicking or revisiting cannot change the grade.
5. Read the correct answer and the detailed explanation, then continue.
6. The results screen lists every answer for review. Retry missed creates a
   fresh attempt using only the previously incorrect questions, with new orders.
7. Explore the matching lesson whenever needed, then return to resume the quiz.

Answered count, correct count, accuracy, and an accessible progress bar update
after each selection. Accuracy uses the answered denominator and one decimal
place where needed; 199/200 is shown as 99.5%, not rounded to a perfect score.
There is no timer. Previous navigation reviews answered items without regrading.

## Persistence and view separation

The versioned `dsa-quiz-session-v1` local-storage entry contains question IDs,
option permutations, first answers, position, filters, and completion state.
Correct answers and explanations come from the current authored bank, not from
stored user data. Corrupt, unknown, duplicate, or structurally invalid session
entries are rejected. Storage failures do not prevent in-memory practice.

`dsa-view-v1` remembers whether Learn or Quiz was open. Lesson completion remains
in its existing separate storage entry. Opening quiz mode pauses lesson playback
and hides the lesson sidebar; returning preserves its animation position except
that an interrupted regex worker must be rebuilt. Opening a matching lesson
from a quiz explanation intentionally selects that topic.

## Accessibility and responsive behavior

- Learn and Quiz are labeled tabs with keyboard arrow/Home/End navigation.
- Answer buttons support Tab/Enter and number shortcuts 1–4 in quiz mode.
  Shortcuts do not fire while typing in form controls.
- Correctness feedback uses visible words/icons and a short status message;
  the full explanation is a separately labeled region.
- Programmatic focus moves to a new question/results heading after navigation,
  and to feedback after answering.
- Hidden views are excluded from interaction. Controls, choices, explanations,
  and results wrap on narrow screens; the results review list scrolls locally.

## Source files

| File | Purpose |
|---|---|
| `assets/quiz-core.js` | Four-option content for the original 23 DSA lessons |
| `assets/quiz-strings.js` | Options for the 20 dedicated string lessons |
| `assets/quiz-regex.js` | Options for the 30 regex lessons |
| `assets/quiz-patterns.js` | Options for the 27 additional interview algorithms |
| `assets/quiz-engine.js` | Coverage validation, pool filtering, sampling, option shuffling, first-answer scoring, safe restoration |
| `assets/quiz.js` | Separate view, filters, question/feedback/results UI, navigation, persistence |
| `assets/quiz.css` | Quiz-specific presentation and responsive styles |

Option tuples are authored with the correct choice first. The engine shuffles
display positions and retains the original identity when grading. A letter such
as A is therefore not a stable answer key. When editing a question, review the
matching interview explanation so its correct option and reasoning agree.

## Verification

```sh
node tests/quiz-engine.cjs
node tests/quiz-browser.cjs
node tests/browser-smoke.cjs
```

The state suite validates all 200 entries, topic/level coverage, distinct
choices, explanation completeness, permutations, filter boundaries, immutable
updates, score locking, accuracy, retries, and malformed saved sessions.

With Playwright and Microsoft Edge, the browser suite answers every question,
checks exact displayed options and explanations, verifies all four correct
display positions occur, and checks mobile overflow after every answer. It also
tests filters, keyboard actions, lesson linking, score/results, retry-only-missed,
valid/corrupt/blocked persistence, and preservation of the profile/copyright.

This is a client-side learning quiz, not a proctored assessment: its authored
question bank and answer keys are part of the static app source.
