import { oneExperienceById } from './db.ts';
import { Request, Response, Answer, Question, Reply, Topic, Summary, ExperienceBase } from './types.ts';

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
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @returns {Promise<Response>} Response with complete experience data
 */
export async function oneExperiencesHandler(req: Request, res: Response): Promise<Response | any> {
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
    const repliedAnswerIds = new Set<number>((replies as Reply[])?.map(r => r.answer_id) ?? []);

    // Transform data
    const questions = transformQuestions(rawQuestions, repliedAnswerIds);
    const summary = calculateSummary(questions);
    const response = buildResponse(experienceBase, topic, questions, replies, summary);

    res.status(200).json(response);

  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * Transform raw answer data with selection status
 */
function transformAnswers(answers: any[], repliedAnswerIds: Set<number>): Answer[] {
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
function transformQuestions(rawQuestions: any[], repliedAnswerIds: Set<number>): Question[] {
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
function isQuestionCorrect(question: Question): boolean {
  if (!question.answers) return false;

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
    return selectedAnswers.length > 0 && (selectedAnswers[0].correct ?? false);
  }
}

/**
 * Calculate summary statistics for the experience
 */
function calculateSummary(questions: Question[]): Summary {
  const totalQuestions = questions.length;
  let answeredQuestions = 0;
  let correctAnswers = 0;
  let incorrectAnswers = 0;

  for (const question of questions) {
    const hasSelectedAnswer = question.answers?.some(a => a.selected) ?? false;

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
function transformTopic(topic: any): Topic | null {
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
function buildResponse(
  experienceBase: any,
  topic: any,
  questions: Question[],
  replies: any[],
  summary: Summary
) {
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