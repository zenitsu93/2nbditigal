import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import {
  buildYoutubeEmbedUrl,
  extractYoutubeVideoId,
  youtubeThumbnailUrl,
} from '../../utils/youtubeUrl';

type YoutubeLazyEmbedProps = {
  videoUrl: string;
  title?: string;
  className?: string;
};

/**
 * Miniature YouTube + bouton lecture ; l’iframe ne charge qu’après clic (pas d’autoplay au chargement).
 */
export default function YoutubeLazyEmbed({
  videoUrl,
  title = 'Vidéo',
  className = '',
}: YoutubeLazyEmbedProps) {
  const [playing, setPlaying] = useState(false);
  const videoId = useMemo(() => extractYoutubeVideoId(videoUrl), [videoUrl]);

  useEffect(() => {
    setPlaying(false);
  }, [videoUrl]);
  const embedSrc = useMemo(
    () => (playing && videoId ? buildYoutubeEmbedUrl(videoUrl, { autoplay: true }) : null),
    [playing, videoUrl, videoId]
  );

  if (!videoId) return null;

  return (
    <div className={`relative w-full overflow-hidden rounded-xl bg-black ${className}`}>
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        {embedSrc ? (
          <iframe
            key={embedSrc}
            src={embedSrc}
            title={title}
            className="absolute inset-0 h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="absolute inset-0 group flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label={`Lire la vidéo : ${title}`}
          >
            <img
              src={youtubeThumbnailUrl(videoId, 'maxres')}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = youtubeThumbnailUrl(videoId, 'hq');
              }}
            />
            <span
              className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/35 group-focus-visible:bg-black/35"
              aria-hidden
            />
            <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform group-hover:scale-105 group-active:scale-95 md:h-20 md:w-20">
              <Icon icon="solar:play-bold" className="ml-1 text-3xl md:text-4xl" aria-hidden />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
