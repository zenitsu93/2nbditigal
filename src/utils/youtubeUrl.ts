/** Accepte les URLs sans schéma (ex. youtube.com/shorts/...) et les URLs //... */
const normalizeUrlForParsing = (input: string): string => {
  const t = input.trim();
  if (!t) return t;
  if (/^https?:\/\//i.test(t)) return t;
  if (t.startsWith('//')) return `https:${t}`;
  return `https://${t}`;
};

export const extractYoutubeVideoId = (url: string): string | null => {
  if (!url) return null;

  const trimmed = url.trim();
  if (!trimmed) return null;

  const simpleIdRegex = /^[a-zA-Z0-9_-]{11}$/;
  if (simpleIdRegex.test(trimmed)) return trimmed;

  try {
    const parsed = new URL(normalizeUrlForParsing(trimmed));
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase();

    if (host === 'youtu.be') {
      const id = parsed.pathname.split('/').filter(Boolean)[0];
      return id && simpleIdRegex.test(id) ? id : null;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      if (parsed.pathname === '/watch') {
        const id = parsed.searchParams.get('v');
        return id && simpleIdRegex.test(id) ? id : null;
      }

      if (parsed.pathname.startsWith('/embed/')) {
        const id = parsed.pathname.split('/')[2];
        return id && simpleIdRegex.test(id) ? id : null;
      }

      if (parsed.pathname.startsWith('/shorts/')) {
        const id = parsed.pathname.split('/')[2];
        return id && simpleIdRegex.test(id) ? id : null;
      }
    }
  } catch {
    return null;
  }

  return null;
};

export type YoutubeEmbedOptions = {
  /** Lecture automatique (ex. après clic utilisateur sur la miniature) */
  autoplay?: boolean;
};

/**
 * URL d’embed sans lecture auto par défaut (pas de loop).
 */
export const buildYoutubeEmbedUrl = (url: string, options?: YoutubeEmbedOptions): string | null => {
  const videoId = extractYoutubeVideoId(url);
  if (!videoId) return null;

  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    autoplay: options?.autoplay ? '1' : '0',
  });

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
};

export const youtubeThumbnailUrl = (videoId: string, quality: 'maxres' | 'hq' = 'maxres'): string =>
  quality === 'maxres'
    ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
    : `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
