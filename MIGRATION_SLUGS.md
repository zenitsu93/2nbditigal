# Migration des slugs pour les articles et projets

Cette migration ajoute le support des slugs (URLs SEO-friendly) pour les articles et projets.

## Étapes de migration

### 1. Exécuter la migration SQL

Connectez-vous à votre dashboard Supabase et exécutez le script SQL suivant dans l'éditeur SQL :

```sql
-- Migration pour ajouter les colonnes slug aux tables articles et projects

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
```

### 2. Redéployer l'application

Après avoir exécuté la migration SQL, redéployez votre application sur Vercel.

## Fonctionnalités

### URLs SEO-friendly

Les URLs changent de :
- `/actualites/1` → `/actualites/mon-article-titre`
- `/realisations/1` → `/realisations/mon-projet-titre`

### Compatibilité rétroactive

Le système supporte toujours les anciennes URLs avec des IDs numériques pour la compatibilité avec les liens existants.

### Génération automatique

- Les slugs sont générés automatiquement à partir du titre lors de la création
- Les slugs sont mis à jour automatiquement si le titre change
- Les slugs sont uniques (un suffixe numérique est ajouté si nécessaire)

## Notes importantes

- Les slugs existants ne seront pas modifiés lors de la mise à jour d'un article/projet
- Si vous modifiez manuellement un slug dans l'admin, il sera utilisé tel quel
- Les slugs sont en minuscules et ne contiennent que des lettres, chiffres et tirets
