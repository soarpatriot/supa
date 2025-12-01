-- Create notebooks table to store NotebookLM content
CREATE TABLE notebooks (
    id SERIAL PRIMARY KEY,
    notebooklm_id VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on notebooklm_id for faster lookups
CREATE INDEX idx_notebooks_notebooklm_id ON notebooks(notebooklm_id);

-- Create index on created_at for sorting
CREATE INDEX idx_notebooks_created_at ON notebooks(created_at DESC);
