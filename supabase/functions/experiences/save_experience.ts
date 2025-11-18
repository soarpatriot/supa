// save_experience.ts
import { findOrCreateUser, saveExperience } from './db.ts';
import { parseRequest, checkInternalToken } from './utils.ts';

export async function saveExperienceHandler(req, res) {
  try {
    // Parse request for openid and token from Express request

    const internalToken = req.query.internal_token || req.headers['x-internal-token'] || null;

    // Check internal token if enforcement is enabled
    if (!checkInternalToken(internalToken)) {
      return res.status(403).json({
        error: 'Forbidden: Invalid or missing internal token'
      });
    }



    // Parse request body
    const body = req.body;

    if (!body || !body.topic_id || !body.answers || !body.openid) {
      return res.status(400).json({
        error: 'Bad Request: topic_id, openid and answers are required'
      });
    }

    const openid = body.openid;
    const topicId = parseInt(body.topic_id, 10);
    const answers = body.answers;

    // Validate topic_id
    if (isNaN(topicId)) {
      return res.status(400).json({
        error: 'Bad Request: topic_id must be a valid number'
      });
    }

    // Validate answers array
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        error: 'Bad Request: answers must be a non-empty array'
      });
    }

    // Validate each answer item
    for (const answer of answers) {
      if (!answer.question_id || !answer.check) {
        return res.status(400).json({
          error: 'Bad Request: each answer must have question_id and check'
        });
      }
    }

    // 1. Find or create user by openid
    const userResult = await findOrCreateUser(openid);
    if (userResult.error) {
      console.error('Error finding/creating user:', userResult.error);
      return res.status(500).json({
        error: 'Internal Server Error: Failed to process user'
      });
    }

    const userId = userResult.id;

    // 2. Save experience and replies
    const saveResult = await saveExperience(userId, topicId, answers);
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