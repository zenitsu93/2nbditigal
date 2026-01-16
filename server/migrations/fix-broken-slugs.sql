-- Script pour corriger les slugs mal générés dans la base de données
-- Exécutez ce script dans Supabase Dashboard → SQL Editor

-- Fonction améliorée pour générer un slug correct
CREATE OR REPLACE FUNCTION generate_slug_from_title(title_text TEXT, max_len INT DEFAULT 60)
RETURNS TEXT AS $$
DECLARE
  slug_result TEXT;
  last_dash INT;
BEGIN
  IF title_text IS NULL OR LENGTH(TRIM(title_text)) = 0 THEN
    RETURN '';
  END IF;
  
  -- Étape 1: Remplacer les apostrophes et guillemets par des espaces
  slug_result := REGEXP_REPLACE(title_text, E'[''""]', ' ', 'g');
  
  -- Étape 2: Convertir en minuscules
  slug_result := LOWER(slug_result);
  
  -- Étape 3: Normaliser les caractères accentués et supprimer les diacritiques
  slug_result := TRANSLATE(
    slug_result,
    'ÀÁÂÃÄÅàáâãäåÈÉÊËèéêëÌÍÎÏìíîïÒÓÔÕÖòóôõöÙÚÛÜùúûüÇçÑñ',
    'AAAAAAaaaaaaEEEEeeeeIIIIiiiiOOOOOoooooUUUUuuuuCcNn'
  );
  
  -- Étape 4: Supprimer les caractères spéciaux (garder seulement lettres, chiffres, espaces, tirets, underscores)
  slug_result := REGEXP_REPLACE(slug_result, '[^a-z0-9\s_-]', ' ', 'g');
  
  -- Étape 5: Remplacer les espaces multiples par un seul espace
  slug_result := REGEXP_REPLACE(slug_result, '\s+', ' ', 'g');
  
  -- Étape 6: Supprimer les espaces en début et fin
  slug_result := TRIM(slug_result);
  
  -- Étape 7: Remplacer les espaces par des tirets
  slug_result := REPLACE(slug_result, ' ', '-');
  
  -- Étape 8: Remplacer les tirets multiples par un seul
  slug_result := REGEXP_REPLACE(slug_result, '-+', '-', 'g');
  
  -- Étape 9: Supprimer les tirets en début et fin
  slug_result := REGEXP_REPLACE(slug_result, '^-+|-+$', '', 'g');
  
  -- Étape 10: Limiter la longueur
  IF LENGTH(slug_result) > max_len THEN
    slug_result := LEFT(slug_result, max_len);
    -- Couper au dernier tiret si possible
    last_dash := LENGTH(slug_result) - LENGTH(REVERSE(SPLIT_PART(REVERSE(slug_result), '-', 1))) - 1;
    IF last_dash > max_len * 0.7 THEN
      slug_result := LEFT(slug_result, last_dash);
    END IF;
    -- Supprimer le tiret final si présent
    slug_result := REGEXP_REPLACE(slug_result, '-+$', '');
  END IF;
  
  RETURN slug_result;
END;
$$ LANGUAGE plpgsql;

-- Corriger les slugs des articles
UPDATE articles 
SET slug = generate_slug_from_title(title, 60)
WHERE slug IS NULL 
   OR slug = '' 
   OR slug LIKE '%-%'  -- Contient des tirets (peut être mal formé)
   OR LENGTH(slug) > 70;  -- Trop long

-- Corriger les slugs des projets
UPDATE projects 
SET slug = generate_slug_from_title(title, 60)
WHERE slug IS NULL 
   OR slug = '' 
   OR slug LIKE '%-%'  -- Contient des tirets (peut être mal formé)
   OR LENGTH(slug) > 70;  -- Trop long

-- Gérer les doublons après correction
-- Pour les articles
UPDATE articles a1
SET slug = a1.slug || '-' || a1.id::text
WHERE EXISTS (
  SELECT 1 FROM articles a2 
  WHERE a2.slug = a1.slug 
  AND a2.id < a1.id
);

-- Pour les projets
UPDATE projects p1
SET slug = p1.slug || '-' || p1.id::text
WHERE EXISTS (
  SELECT 1 FROM projects p2 
  WHERE p2.slug = p1.slug 
  AND p2.id < p1.id
);

-- Exemple: Corriger spécifiquement l'article avec le titre "Pourquoi Odoo CRM..."
UPDATE articles 
SET slug = 'pourquoi-odoo-crm-est-loutil-quil-vous-faut-pour-arreter-de-perdre-des-clients'
WHERE title LIKE '%Pourquoi Odoo CRM%'
  AND slug LIKE '%ourquoi-doo%';

-- Supprimer la fonction temporaire (optionnel, vous pouvez la garder pour usage futur)
-- DROP FUNCTION IF EXISTS generate_slug_from_title(TEXT, INT);
