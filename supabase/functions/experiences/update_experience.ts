// update_experience.ts
import { updateExperiencePaid } from './db.ts';
import { checkInternalToken } from './utils.ts';
import { Request, Response } from './types.ts';

/**
 * Extract and validate internal token from request
 */
function extractInternalToken(req: Request): string | null {
  const tokenFromQuery = req.query.internal_token as string | undefined;
  const tokenFromHeader = req.headers['x-internal-token'] as string | undefined;
  return tokenFromQuery || tokenFromHeader || null;
}

/**
 * Update experience handler
 *
 * Updates an experience's paid status to true
 *
 * @param {Request} req - Request object with experience ID in params
 * @param {Response} res - Response object
 * @returns {Promise<Response>} Response with updated experience data
 */
export async function updateExperienceHandler(req: Request, res: Response): Promise<Response | any> {
  try {
    // Validate internal token
    const internalToken = extractInternalToken(req);
    if (!checkInternalToken(internalToken)) {
      return res.status(403).json({
        error: 'Forbidden: Invalid or missing internal token'
      });
    }

    // Get experience ID from params
    const experienceId = req.params.id;
    if (!experienceId) {
      return res.status(400).json({
        error: 'Bad Request: experience ID is required'
      });
    }

    // Parse experience ID
    const parsedId = parseInt(experienceId, 10);
    if (isNaN(parsedId)) {
      return res.status(400).json({
        error: 'Bad Request: experience ID must be a valid number'
      });
    }

    // Update experience paid status
    const updateResult = await updateExperiencePaid(parsedId);
    if (updateResult.error) {
      console.error('Error updating experience:', updateResult.error);
      return res.status(500).json({
        error: 'Internal Server Error: Failed to update experience',
        details: updateResult.error.message
      });
    }

    if (updateResult.notFound) {
      return res.status(404).json({
        error: 'Not Found: Experience not found'
      });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      data: updateResult.data
    });

  } catch (error: any) {
    console.error('Unexpected error in updateExperienceHandler:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
}
