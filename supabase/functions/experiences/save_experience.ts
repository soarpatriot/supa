// save_experience.ts
import { findOrCreateUser, saveExperience } from './db.ts';
import { parseRequest, checkInternalToken } from './utils.ts';

/**
 * Extract and validate internal token from request
 */
function extractInternalToken(req) {
  return req.query.internal_token || req.headers['x-internal-token'] || null;
}

/**
 * Validate required fields in request body
 */
function validateRequiredFields(body) {
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
function parseTopicId(topicId) {
  const parsed = parseInt(topicId, 10);
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
function validateAnswers(answers) {
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
function validateAndParseRequest(body) {
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
      topicId: topicIdCheck.value,
      answers: body.answers
    }
  };
}

/**
 * Handle user creation/retrieval
 */
async function getUserId(openid) {
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
 * @param {Object} req - Request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.openid - User's WeChat openid
 * @param {number} req.body.topic_id - Topic ID
 * @param {Array} req.body.answers - Array of answer objects
 * @param {Object} res - Response object
 * @returns {Promise<Object>} Response with saved experience data
 *
 * @example Request:
 * {
 *   "openid": "user_openid_123",
 *   "topic_id": 2,
 *   "answers": [
 *     {
 *       "question_id": 3,
 *       "check": 18
 *     },
 *     {
 *       "question_id": 4,
 *       "check": [19, 20]
 *     }
 *   ]
 * }
 *
 * @example Response:
 * {
 *   "success": true,
 *   "data": {
 *     "experience_id": 123,
 *     "replies_count": 3
 *   }
 * }
 */
export async function saveExperienceHandler(req, res) {
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

    const { openid, topicId, answers } = validation.data;

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

  } catch (error) {
    console.error('Unexpected error in saveExperienceHandler:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
}