import { oneExperienceById } from './db.ts';

export async function oneExperiencesHandler(req, res) {
  try{

    // Nested select to cascade: experiences -> topic -> questions -> answers
    // Adjust column names if your schema uses different names
    const { data, error } = await oneExperienceById(req.params.id);
    if (error) {
      console.error('Supabase query error', error);
      return res.status(500).json({ error: error.message });
    }
    if (!data) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    // Normalize response: extract topic, questions
    const topic = data.topic ?? null;
    const questions = topic?.questions ?? [];

    res.status(200).json({ experience: data, });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
    
  }
}