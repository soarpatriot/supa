export interface Request {
    query: Record<string, any>;
    headers: Record<string, string | string[] | undefined>;
    body: any;
    params: Record<string, string>;
}

export interface Response {
    status(code: number): this;
    json(body: any): this;
}

// Domain Entities

export interface Topic {
    id: number;
    name: string;
    description?: string;
    cover_url?: string;
}

export interface Answer {
    id: number;
    content: string;
    correct?: boolean;
    selected?: boolean;
}

export interface Question {
    id: number;
    content: string;
    has_multiple_answers?: boolean;
    answers?: Answer[];
}

export interface Reply {
    id: number;
    experience_id: number;
    answer_id: number;
    question_id?: number;
}

export interface ExperienceBase {
    id: number;
    topic_id: number;
    user_id: number;
    created_at: string;
    updated_at?: string;
}

export interface Summary {
    total_questions: number;
    answered_questions: number;
    correct_answers: number;
    incorrect_answers: number;
    score_percentage: number;
}

// DTOs / Specific usages

export interface SaveExperienceAnswer {
    question_id: number;
    check: number | number[];
}

export interface SaveExperienceBody {
    openid: string;
    topic_id: string | number;
    answers: SaveExperienceAnswer[];
    internal_token?: string;
}

export interface ValidationResult {
    valid: boolean;
    error?: string;
    value?: number;
    data?: {
        openid: string;
        topicId: number;
        answers: SaveExperienceAnswer[];
    };
}

export interface UserResult {
    success?: boolean;
    error?: any;
    id?: string | number;
    userId?: string | number;
    notFound?: boolean;
}

export interface ExperienceData extends ExperienceBase {
    topics: any; // Using any here as the structure comes from DB join
}
