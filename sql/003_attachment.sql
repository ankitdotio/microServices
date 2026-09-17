CREATE TABLE IF NOT EXISTS attachments(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid() ,
    task_id UUID NOT NULL,
    image_url TEXT NOT NULL,
    public_id TEXT NOT NULL,
    uploaded_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attachments_task ON attachments (task_id);