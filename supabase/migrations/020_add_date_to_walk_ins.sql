-- Add date column to walk_ins table
ALTER TABLE walk_ins 
ADD COLUMN date DATE;

-- Set default value for existing records (use date from created_at)
UPDATE walk_ins 
SET date = DATE(created_at)
WHERE date IS NULL;

-- Make the column NOT NULL after populating existing records
ALTER TABLE walk_ins 
ALTER COLUMN date SET NOT NULL;

-- Set default value for new records
ALTER TABLE walk_ins 
ALTER COLUMN date SET DEFAULT CURRENT_DATE;

-- Add index for efficient date-based queries
CREATE INDEX idx_walk_ins_date ON walk_ins(date DESC);

-- Add composite index for date and community member status
CREATE INDEX idx_walk_ins_date_community ON walk_ins(date DESC, is_community_member);