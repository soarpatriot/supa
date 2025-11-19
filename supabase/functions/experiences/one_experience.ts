import { oneExperienceById } from './db.ts';


/**
 * Fetch a complete experience with all related data
 *
 * Retrieves:
 * - Experience details
 * - Associated topic with full details
 * - All questions for the topic
 * - All answers for each question
 * - User's replies (selected answers)
 *
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Promise<Object>} Response with complete experience data
 *
 * @example Request:
 * {
 *   "action": "fetchExperience",
 *   "experience_id": "123"
 * }
 *
 * @example Response:
 * {
 *   "success": true,
 *   "data": {
 *     "id": 123,
 *     "topic_id": 2,
 *     "user_id": 456,
 *     "created_at": "2024-01-01T00:00:00.000Z",
 *     "topic": {
 *       "id": 2,
 *       "name": "考试脑科学",
 *       "description": "...",
 *       "cover_url": "..."
 *     },
 *     "questions": [
 *       {
 *         "id": 3,
 *         "content": "Question text",
 *         "has_multiple_answers": false,
 *         "answers": [
 *           {
 *             "id": 17,
 *             "content": "Answer 1",
 *             "correct": false,
 *             "selected": false
 *           },
 *           {
 *             "id": 18,
 *             "content": "Answer 2",
 *             "correct": true,
 *             "selected": true
 *           }
 *         ]
 *       }
 *     ],
 *     "replies": [
 *       {
 *         "id": 1,
 *         "experience_id": 123,
 *         "answer_id": 18,
 *         "question_id": 3
 *       }
 *     ],
 *     "summary": {
 *       "total_questions": 6,
 *       "answered_questions": 6,
 *       "correct_answers": 4,
 *       "incorrect_answers": 2,
 *       "score_percentage": 66.67
 *     }
 *   }
 * }
 */
export async function oneExperiencesHandler(req, res) {
  try {
    const { data, error } = await oneExperienceById(req.params.id);

    if (error) {
      console.error('Supabase query error', error);
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    // Extract base experience data
    const { topic, questions: questionsData, replies, ...experienceBase } = data;

    // Get questions from the nested structure
    const rawQuestions = questionsData?.questions ?? [];

    // Create a set of reply answer_ids for quick lookup
    const repliedAnswerIds = new Set(replies?.map(r => r.answer_id) ?? []);

    // Transform data
    const questions = transformQuestions(rawQuestions, repliedAnswerIds);
    const summary = calculateSummary(questions);
    const response = buildResponse(experienceBase, topic, questions, replies, summary);

    res.status(200).json(response);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}




/**
 * Transform raw answer data with selection status
 */
function transformAnswers(answers, repliedAnswerIds) {
  return (answers ?? []).map(answer => ({
    id: answer.id,
    content: answer.content,
    correct: answer.correct ?? false,
    selected: repliedAnswerIds.has(answer.id)
  }));
}

/**
 * Transform raw questions data with answers
 */
function transformQuestions(rawQuestions, repliedAnswerIds) {
  return rawQuestions.map(question => {
    const answers = transformAnswers(question.answers, repliedAnswerIds);

    return {
      id: question.id,
      content: question.content,
      has_multiple_answers: question.has_multiple_answers ?? false,
      answers
    };
  });
}

/**
 * Check if a question is answered correctly
 */
function isQuestionCorrect(question) {
  const selectedAnswers = question.answers.filter(a => a.selected);
  const correctAnswersForQuestion = question.answers.filter(a => a.correct);

  if (question.has_multiple_answers) {
    // All selected must be correct AND all correct must be selected
    const allSelectedAreCorrect = selectedAnswers.every(a => a.correct);
    const allCorrectAreSelected = correctAnswersForQuestion.every(ca =>
      selectedAnswers.some(sa => sa.id === ca.id)
    );
    return allSelectedAreCorrect && allCorrectAreSelected;
  } else {
    // Single answer: check if the selected answer is correct
    return selectedAnswers.length > 0 && selectedAnswers[0].correct;
  }
}

/**
 * Calculate summary statistics for the experience
 */
function calculateSummary(questions) {
  const totalQuestions = questions.length;
  let answeredQuestions = 0;
  let correctAnswers = 0;
  let incorrectAnswers = 0;

  for (const question of questions) {
    const hasSelectedAnswer = question.answers.some(a => a.selected);

    if (hasSelectedAnswer) {
      answeredQuestions++;

      if (isQuestionCorrect(question)) {
        correctAnswers++;
      } else {
        incorrectAnswers++;
      }
    }
  }

  const scorePercentage = totalQuestions > 0
    ? parseFloat((correctAnswers / totalQuestions * 100).toFixed(2))
    : 0;

  return {
    total_questions: totalQuestions,
    answered_questions: answeredQuestions,
    correct_answers: correctAnswers,
    incorrect_answers: incorrectAnswers,
    score_percentage: scorePercentage
  };
}

/**
 * Transform topic data
 */
function transformTopic(topic) {
  if (!topic) return null;

  return {
    id: topic.id,
    name: topic.name,
    description: topic.description ?? '',
    cover_url: topic.cover_url ?? ''
  };
}

/**
 * Build the response object
 */
function buildResponse(experienceBase, topic, questions, replies, summary) {
  return {
    data: {
      id: experienceBase.id,
      topic_id: experienceBase.topic_id,
      user_id: experienceBase.user_id,
      created_at: experienceBase.created_at,
      topic: transformTopic(topic),
      questions,
      replies: replies ?? [],
      summary
    }
  };
}