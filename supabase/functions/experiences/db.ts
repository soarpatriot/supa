// db.ts
import { createClient } from 'npm:@supabase/supabase-js@2.33.0';
import { getEnv } from './utils.ts';
export function initSupabase() {
  const url = getEnv('SUPABASE_URL');
  const key = getEnv('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: {
      persistSession: false
    }
  });
}
export async function findUserIdByOpenId(openid) {
  const supabase = initSupabase();
  if (!supabase) {
    return { error: new Error('Supabase client not initialized') };
  }
  const { data, error } = await supabase.from('users').select('id').eq('open_id', openid).limit(1).maybeSingle();
  if (error) return {
    error
  };
  if (!data) return {
    notFound: true
  };
  return {
    id: data.id
  };
}

export async function findOrCreateUser(openid) {
  const supabase = initSupabase();
  if (!supabase) {
    return { error: new Error('Supabase client not initialized') };
  }

  // First, try to find the user
  const { data: existingUser, error: findError } = await supabase
    .from('users')
    .select('id')
    .eq('open_id', openid)
    .limit(1)
    .maybeSingle();

  if (findError) {
    return { error: findError };
  }

  // If user exists, return their id
  if (existingUser) {
    return { id: existingUser.id };
  }

  // If user doesn't exist, create them
  const now = new Date().toISOString();
  const { data: newUser, error: createError } = await supabase
    .from('users')
    .insert({
      open_id: openid,
      created_at: now,
      updated_at: now
    })
    .select('id')
    .single();

  if (createError) {
    return { error: createError };
  }

  return { id: newUser.id };
}
// Helper function to generate Chinese time ago description
function getChineseTimeAgo(dateString: string): string {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now.getTime() - past.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) {
    return '刚刚';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`;
  } else if (diffHours < 24) {
    return `${diffHours}小时前`;
  } else if (diffDays < 30) {
    return `${diffDays}天前`;
  } else if (diffMonths < 12) {
    return `${diffMonths}个月前`;
  } else {
    return `${diffYears}年前`;
  }
}

export async function fetchExperiencesWithTopics(userId) {
  const supabase = initSupabase();
  if (!supabase) {
    return { error: new Error('Supabase client not initialized') };
  }
  const { data, error } = await supabase
    .from('experiences')
    .select('id, topic_id, created_at, updated_at, topics(id, name, description, cover_url)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  // Add time_ago to each experience
  const dataWithTimeAgo = data?.map(exp => ({
    ...exp,
    time_ago: getChineseTimeAgo(exp.created_at)
  }));

  return {
    data: dataWithTimeAgo,
    error
  };
}

export async function oneExperienceById(id) {
  const supabase = initSupabase();
  if (!supabase) {
    return { error: new Error('Supabase client not initialized') };
  }
  //topic:topics(*, questions:questions(*, answers:answers(*)))`
  const { data, error } = await supabase.from('experiences').select(`*, replies:replies(*), 
        topic:topics(*),
        assets:topics(assets:assets(*)),
        questions:topics(questions:questions(*, answers:answers(*)))`).eq('id', id).limit(1).maybeSingle();
  return {
    data,
    error
  };
}

export async function saveExperience(userId, topicId, answers) {
  const supabase = initSupabase();
  if (!supabase) {
    return { error: new Error('Supabase client not initialized') };
  }

  const now = new Date().toISOString();

  // 1. Create the experience record
  const { data: experience, error: experienceError } = await supabase
    .from('experiences')
    .insert({
      user_id: userId,
      topic_id: topicId,
      created_at: now,
      updated_at: now
    })
    .select('id')
    .single();

  if (experienceError) {
    return { error: experienceError };
  }

  const experienceId = experience.id;

  // 2. Prepare replies data (flatten the answers array)
  const repliesData = [];

  for (const answerItem of answers) {
    const checks = Array.isArray(answerItem.check) ? answerItem.check : [answerItem.check];

    for (const answerId of checks) {
      repliesData.push({
        experience_id: experienceId,
        answer_id: answerId,
        created_at: now,
        updated_at: now
      });
    }
  }

  // 3. Insert all replies
  if (repliesData.length > 0) {
    const { error: repliesError } = await supabase
      .from('replies')
      .insert(repliesData);

    if (repliesError) {
      // Rollback: delete the experience if replies fail
      await supabase.from('experiences').delete().eq('id', experienceId);
      return { error: repliesError };
    }
  }

  return {
    data: {
      experience_id: experienceId,
      replies_count: repliesData.length
    }
  };
}

export async function updateExperiencePaid(experienceId) {
  const supabase = initSupabase();
  if (!supabase) {
    return { error: new Error('Supabase client not initialized') };
  }

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('experiences')
    .update({
      paid: true,
      updated_at: now
    })
    .eq('id', experienceId)
    .select('id, topic_id, user_id, paid, created_at, updated_at')
    .maybeSingle();

  if (error) {
    return { error };
  }

  if (!data) {
    return { notFound: true };
  }

  return { data };
}