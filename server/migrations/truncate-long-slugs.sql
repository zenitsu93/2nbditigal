-- Script pour raccourcir les slugs existants qui sont trop longs
-- Exécutez ce script dans Supabase Dashboard → SQL Editor après avoir exécuté add-slug-columns.sql

-- Fonction pour tronquer un slug à 60 caractères en préservant les mots
CREATE OR REPLACE FUNCTION truncate_slug(slug_text TEXT, max_len INT DEFAULT 60)
RETURNS TEXT AS $$
DECLARE
  truncated TEXT;
  last_dash INT;
BEGIN
  IF LENGTH(slug_text) <= max_len THEN
    RETURN slug_text;
  END IF;
  
  truncated := LEFT(slug_text, max_len);
  last_dash := LENGTH(truncated) - LENGTH(REVERSE(SPLIT_PART(REVERSE(truncated), '-', 1))) - 1;
  
  -- Si le dernier tiret est assez proche de la fin (dans les 70% de la longueur), couper là
  IF last_dash > max_len * 0.7 THEN
    truncated := LEFT(slug_text, last_dash);
  END IF;
  
  RETURN truncated;
END;
$$ LANGUAGE plpgsql;

-- Mettre à jour les slugs d'articles trop longs
UPDATE articles 
SET slug = truncate_slug(slug, 60)
WHERE LENGTH(slug) > 60;

-- Mettre à jour les slugs de projets trop longs
UPDATE projects 
SET slug = truncate_slug(slug, 60)
WHERE LENGTH(slug) > 60;

-- Vérifier qu'il n'y a pas de doublons après la troncature
-- Si des doublons existent, ajouter l'ID à la fin
UPDATE articles a1
SET slug = a1.slug || '-' || a1.id::text
WHERE EXISTS (
  SELECT 1 FROM articles a2 
  WHERE a2.slug = a1.slug 
  AND a2.id < a1.id
);

UPDATE projects p1
SET slug = p1.slug || '-' || p1.id::text
WHERE EXISTS (
  SELECT 1 FROM projects p2 
  WHERE p2.slug = p1.slug 
  AND p2.id < p1.id
);

-- Supprimer la fonction temporaire
DROP FUNCTION IF EXISTS truncate_slug(TEXT, INT);
