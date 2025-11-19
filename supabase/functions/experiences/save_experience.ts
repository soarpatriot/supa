// save_experience.ts
import { findOrCreateUser, saveExperience } from './db.ts';
import { checkInternalToken } from './utils.ts';
import { Request, Response, SaveExperienceBody, SaveExperienceAnswer, ValidationResult, UserResult } from './types.ts';

/**
 * Extract and validate internal token from request
 */
function extractInternalToken(req: Request): string | null {
  const tokenFromQuery = req.query.internal_token as string | undefined;
  const tokenFromHeader = req.headers['x-internal-token'] as string | undefined;
  return tokenFromQuery || tokenFromHeader || null;
}

/**
 * Validate required fields in request body
 */
function validateRequiredFields(body: SaveExperienceBody): ValidationResult {
  if (!body || !body.topic_id || !body.answers || !body.openid) {
    return {
      valid: false,
      error: 'Bad Request: topic_id, openid and answers are required'
    };
  }
  return { valid: true };
}

/**
 * Parse and validate topic_id
 */
function parseTopicId(topicId: string | number): ValidationResult {
  const parsed = typeof topicId === 'number' ? topicId : parseInt(topicId, 10);
  if (isNaN(parsed)) {
    return {
      valid: false,
      error: 'Bad Request: topic_id must be a valid number'
    };
  }
  return { valid: true, value: parsed };
}

/**
 * Validate answers array structure
 */
function validateAnswers(answers: any): ValidationResult {
  if (!Array.isArray(answers) || answers.length === 0) {
    return {
      valid: false,
      error: 'Bad Request: answers must be a non-empty array'
    };
  }

  for (const answer of answers) {
    if (!answer.question_id || !answer.check) {
      return {
        valid: false,
        error: 'Bad Request: each answer must have question_id and check'
      };
    }
  }

  return { valid: true };
}

/**
 * Validate request body and extract data
 */
function validateAndParseRequest(body: SaveExperienceBody): ValidationResult {
  // Validate required fields
  const requiredCheck = validateRequiredFields(body);
  if (!requiredCheck.valid) {
    return { valid: false, error: requiredCheck.error };
  }

  // Parse and validate topic_id
  const topicIdCheck = parseTopicId(body.topic_id);
  if (!topicIdCheck.valid) {
    return { valid: false, error: topicIdCheck.error };
  }

  // Validate answers
  const answersCheck = validateAnswers(body.answers);
  if (!answersCheck.valid) {
    return { valid: false, error: answersCheck.error };
  }

  return {
    valid: true,
    data: {
      openid: body.openid,
      topicId: topicIdCheck.value!,
      answers: body.answers
    }
  };
}

/**
 * Handle user creation/retrieval
 */
async function getUserId(openid: string): Promise<UserResult> {
  const userResult = await findOrCreateUser(openid);

  if (userResult.error) {
    console.error('Error finding/creating user:', userResult.error);
    return {
      success: false,
      error: 'Internal Server Error: Failed to process user'
    };
  }

  return {
    success: true,
    userId: userResult.id
  };
}

/**
 * Save experience handler
 *
 * Creates a new experience record with user answers to topic questions
 *
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @returns {Promise<Response>} Response with saved experience data
 */
export async function saveExperienceHandler(req: Request, res: Response): Promise<Response | any> {
  try {
    // Validate internal token
    const internalToken = extractInternalToken(req);
    if (!checkInternalToken(internalToken)) {
      return res.status(403).json({
        error: 'Forbidden: Invalid or missing internal token'
      });
    }

    // Validate and parse request
    const validation = validateAndParseRequest(req.body);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const { openid, topicId, answers } = validation.data!;

    // Get or create user
    const userResult = await getUserId(openid);
    if (!userResult.success) {
      return res.status(500).json({ error: userResult.error });
    }

    // Save experience
    const saveResult = await saveExperience(userResult.userId, topicId, answers);
    if (saveResult.error) {
      console.error('Error saving experience:', saveResult.error);
      return res.status(500).json({
        error: 'Internal Server Error: Failed to save experience',
        details: saveResult.error.message
      });
    }

    // Return success response
    return res.status(201).json({
      success: true,
      data: saveResult.data
    });

  } catch (error: any) {
    console.error('Unexpected error in saveExperienceHandler:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
}