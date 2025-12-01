-- Create flashcards table to store generated flashcards
CREATE TABLE flashcards (
    id SERIAL PRIMARY KEY,
    notebook_id INTEGER NOT NULL,
    front VARCHAR(1000) NOT NULL,
    back TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_flashcards_notebook
        FOREIGN KEY (notebook_id)
        REFERENCES notebooks(id)
        ON DELETE CASCADE
);

-- Create index on notebook_id for faster lookups
CREATE INDEX idx_flashcards_notebook_id ON flashcards(notebook_id);

-- Create index on created_at for sorting
CREATE INDEX idx_flashcards_created_at ON flashcards(created_at DESC);
