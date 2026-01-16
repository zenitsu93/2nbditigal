/**
 * Génère un slug à partir d'un titre
 * @param {string} title - Le titre à convertir en slug
 * @param {number} maxLength - Longueur maximale du slug (défaut: 60)
 * @returns {string} Le slug généré
 */
export function generateSlug(title, maxLength = 60) {
  if (!title) return '';
  
  let slug = title
    .trim()
    // Remplacer les apostrophes et guillemets par des espaces
    .replace(/[''""]/g, ' ')
    // Convertir en minuscules AVANT de normaliser
    .toLowerCase()
    // Normaliser les caractères accentués
    .normalize('NFD')
    // Supprimer les diacritiques (accents)
    .replace(/[\u0300-\u036f]/g, '')
    // Remplacer les caractères spéciaux par des espaces (sauf tirets et underscores)
    .replace(/[^a-z0-9\s_-]/g, ' ')
    // Remplacer les espaces multiples par un seul espace
    .replace(/\s+/g, ' ')
    .trim()
    // Remplacer les espaces par des tirets
    .replace(/\s/g, '-')
    // Remplacer les tirets multiples par un seul
    .replace(/-+/g, '-')
    // Supprimer les tirets en début et fin
    .replace(/^-+|-+$/g, '');
  
  // Limiter la longueur en coupant au dernier tiret avant la limite
  if (slug.length > maxLength) {
    slug = slug.substring(0, maxLength);
    // Couper au dernier tiret pour éviter de couper un mot
    const lastDash = slug.lastIndexOf('-');
    if (lastDash > maxLength * 0.7) { // Si le dernier tiret est assez proche de la fin
      slug = slug.substring(0, lastDash);
    }
    // Supprimer le tiret final si présent
    slug = slug.replace(/-+$/, '');
  }
  
  return slug;
}

/**
 * Génère un slug unique en ajoutant un suffixe numérique si nécessaire
 * @param {string} title - Le titre à convertir en slug
 * @param {Function} checkExists - Fonction pour vérifier si le slug existe déjà
 * @returns {Promise<string>} Le slug unique généré
 */
export async function generateUniqueSlug(title, checkExists) {
  let baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;
  
  while (await checkExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

export default generateSlug;
