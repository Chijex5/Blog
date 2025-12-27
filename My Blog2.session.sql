CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  image VARCHAR(1000),
  read_time VARCHAR(50) NOT NULL,
  date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  updated_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMP,
  views_count INTEGER NOT NULL DEFAULT 0,
  
  CONSTRAINT valid_slug CHECK (slug ~* '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_created_by ON blog_posts(created_by);
CREATE INDEX idx_blog_posts_date ON blog_posts(date DESC);
CREATE INDEX idx_blog_posts_tags ON blog_posts USING GIN(tags);
CREATE INDEX idx_blog_posts_is_published ON blog_posts(is_published);