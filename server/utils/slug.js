/**
 * Génère un slug à partir d'un titre
 * @param {string} title - Le titre à convertir en slug
 * @returns {string} Le slug généré
 */
export function generateSlug(title) {
  if (!title) return '';
  
  return title
    .toLowerCase()
    .normalize('NFD') // Décompose les caractères accentués
    .replace(/[\u0300-\u036f]/g, '') // Supprime les diacritiques
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Supprime les caractères spéciaux
    .replace(/\s+/g, '-') // Remplace les espaces par des tirets
    .replace(/-+/g, '-') // Remplace les tirets multiples par un seul
    .replace(/^-|-$/g, ''); // Supprime les tirets en début et fin
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
