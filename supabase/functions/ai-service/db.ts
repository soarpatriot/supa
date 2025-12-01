import { Notebook, StoredFlashcard, Flashcard } from "./types.ts";

const DB_URL = Deno.env.get("SUPABASE_DB_URL") || "postgresql://postgres:postgres@127.0.0.1:54322/postgres";

async function query(sql: string, params: any[] = []) {
  const client = await (await import("https://deno.land/x/postgres@v0.17.0/mod.ts")).Pool.prototype.connect.call(
    new (await import("https://deno.land/x/postgres@v0.17.0/mod.ts")).Pool(DB_URL, 3, true)
  );

  try {
    const result = await client.queryObject(sql, params);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getNotebookByNotebooklmId(notebooklmId: string): Promise<Notebook | null> {
  const rows = await query(
    "SELECT * FROM notebooks WHERE notebooklm_id = $1",
    [notebooklmId]
  );
  return rows.length > 0 ? rows[0] as Notebook : null;
}

export async function createNotebook(notebooklmId: string, title: string, content: string, description?: string): Promise<Notebook> {
  const rows = await query(
    "INSERT INTO notebooks (notebooklm_id, title, content, description) VALUES ($1, $2, $3, $4) RETURNING *",
    [notebooklmId, title, content, description]
  );
  return rows[0] as Notebook;
}

export async function updateNotebook(notebooklmId: string, title: string, content: string, description?: string): Promise<Notebook> {
  const rows = await query(
    "UPDATE notebooks SET title = $2, content = $3, description = $4, updated_at = NOW() WHERE notebooklm_id = $1 RETURNING *",
    [notebooklmId, title, content, description]
  );
  return rows[0] as Notebook;
}

export async function getFlashcardsByNotebookId(notebookId: number): Promise<StoredFlashcard[]> {
  const rows = await query(
    "SELECT * FROM flashcards WHERE notebook_id = $1 ORDER BY created_at ASC",
    [notebookId]
  );
  return rows as StoredFlashcard[];
}

export async function saveFlashcards(notebookId: number, cards: Flashcard[]): Promise<StoredFlashcard[]> {
  // Delete existing flashcards for this notebook
  await query("DELETE FROM flashcards WHERE notebook_id = $1", [notebookId]);

  // Insert new flashcards
  const savedCards: StoredFlashcard[] = [];
  for (const card of cards) {
    const rows = await query(
      "INSERT INTO flashcards (notebook_id, front, back) VALUES ($1, $2, $3) RETURNING *",
      [notebookId, card.front, card.back]
    );
    savedCards.push(rows[0] as StoredFlashcard);
  }

  return savedCards;
}
