// my_experiences.ts
import { checkInternalToken } from './utils.ts';
import { findUserIdByOpenId, fetchExperiencesWithTopics } from './db.ts';
import { Request, Response, ExperienceData } from './types.ts';

export async function myExperiencesHandler(req: Request, res: Response): Promise<Response | any> {
  try {
    // Extract openid from query params or body
    const openid = req.query.openid?.trim() || req.body.openid?.trim() || null;

    // Extract internal token from query params, header, or body
    const internalToken = req.query.internal_token ||
      req.headers['x-internal-token'] ||
      req.body.internal_token ||
      null;

    // Validate openid
    if (!openid) {
      return res.status(400).json({ error: 'missing openid' });
    }

    // Check internal token
    if (!checkInternalToken(internalToken)) {
      return res.status(401).json({ error: 'unauthorized' });
    }


    // Find user by openid
    const userLookup = await findUserIdByOpenId(openid);
    if (userLookup.error) {
      return res.status(500).json({
        error: 'user lookup error',
        details: userLookup.error.message
      });
    }
    if (userLookup.notFound) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userLookup.id;

    // Fetch experiences with topics
    const expResult = await fetchExperiencesWithTopics(userId);
    if (expResult.error) {
      return res.status(500).json({
        error: 'experiences lookup error',
        details: expResult.error.message
      });
    }

    // Normalize response data
    const normalized = (expResult.data || []).map((e: ExperienceData) => ({
      id: e.id,
      topic_id: e.topic_id,
      created_at: e.created_at,
      updated_at: e.updated_at,
      time_ago: e.time_ago,
      topic: e.topics ?? null
    }));

    return res.status(200).json({ data: normalized });
  } catch (err) {
    console.error('unexpected error', err);
    return res.status(500).json({
      error: 'unexpected error',
      details: String(err)
    });
  }
}
