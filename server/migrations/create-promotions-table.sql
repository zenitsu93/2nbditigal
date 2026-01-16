-- Table pour les popups/promotions promotionnelles
CREATE TABLE IF NOT EXISTS promotions (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(255),
  icon VARCHAR(100),
  cta_text VARCHAR(100) DEFAULT 'Nous contacter',
  cta_link VARCHAR(255) DEFAULT '/contact',
  active BOOLEAN DEFAULT TRUE,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(active);
CREATE INDEX IF NOT EXISTS idx_promotions_dates ON promotions(start_date, end_date);

-- Trigger pour mettre à jour updatedAt automatiquement
CREATE TRIGGER update_promotions_updated_at BEFORE UPDATE ON promotions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insérer une promotion exemple pour Odoo CRM
INSERT INTO promotions (title, description, image, icon, cta_text, cta_link, active)
VALUES (
  'Solution CRM Odoo',
  'Optimisez votre processus de recrutement avec notre solution CRM Odoo personnalisée. Contactez-nous pour découvrir comment nous pouvons transformer votre gestion des talents.',
  '/images/promotions/odoo-crm.jpg',
  'solar:users-group-two-rounded-line-duotone',
  'Découvrir la solution',
  '/contact?service=odoo-crm',
  TRUE
)
ON CONFLICT DO NOTHING;
