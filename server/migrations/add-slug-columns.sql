-- Migration pour ajouter les colonnes slug aux tables articles et projects
-- Exécutez ce script dans Supabase Dashboard → SQL Editor

-- Ajouter la colonne slug à la table articles
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS slug VARCHAR(255);

-- Ajouter la colonne slug à la table projects
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS slug VARCHAR(255);

-- Créer des index uniques sur les slugs
CREATE UNIQUE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);

-- Générer des slugs pour les articles existants (basés sur le titre)
UPDATE articles 
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          REGEXP_REPLACE(
            TRANSLATE(title, 'ÀÁÂÃÄÅàáâãäåÈÉÊËèéêëÌÍÎÏìíîïÒÓÔÕÖòóôõöÙÚÛÜùúûüÇç', 'AAAAAAaaaaaaEEEEeeeeIIIIiiiiOOOOOoooooUUUUuuuuCc'),
            '[^a-z0-9\s-]', '', 'g'
          ),
          '\s+', '-', 'g'
        ),
        '-+', '-', 'g'
      ),
      '^-|-$', '', 'g'
    ),
    '^', '', 'g'
  )
) || '-' || id::text
WHERE slug IS NULL OR slug = '';

-- Générer des slugs pour les projets existants (basés sur le titre)
UPDATE projects 
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          REGEXP_REPLACE(
            TRANSLATE(title, 'ÀÁÂÃÄÅàáâãäåÈÉÊËèéêëÌÍÎÏìíîïÒÓÔÕÖòóôõöÙÚÛÜùúûüÇç', 'AAAAAAaaaaaaEEEEeeeeIIIIiiiiOOOOOoooooUUUUuuuuCc'),
            '[^a-z0-9\s-]', '', 'g'
          ),
          '\s+', '-', 'g'
        ),
        '-+', '-', 'g'
      ),
      '^-|-$', '', 'g'
    ),
    '^', '', 'g'
  )
) || '-' || id::text
WHERE slug IS NULL OR slug = '';
