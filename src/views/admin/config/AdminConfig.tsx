import { useEffect, useState } from 'react';
import { Label, TextInput } from 'flowbite-react';
import { Button } from 'src/components/shared/SiteButton';
import { Icon } from '@iconify/react';
import CardBox from '../../../components/shared/CardBox';
import { configApi } from '../../../services/api/config';
import Toast from '../../../components/shared/Toast';
import { useToast } from '../../../hooks/useToast';
import YoutubeLazyEmbed from '../../../components/shared/YoutubeLazyEmbed';
import { extractYoutubeVideoId } from '../../../utils/youtubeUrl';

const AdminConfig = () => {
  const [loading, setLoading] = useState(true);
  const [presentationVideo, setPresentationVideo] = useState('');
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const config = await configApi.getAll();
      setPresentationVideo(config.presentation_video || '');
    } catch (error: any) {
      console.error('Error fetching config:', error);
      showToast('Erreur lors du chargement de la configuration', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUrlChange = async (url: string) => {
    const trimmedUrl = url.trim();
    if (trimmedUrl && !extractYoutubeVideoId(trimmedUrl)) {
      showToast('Veuillez entrer un lien YouTube valide', 'error');
      return;
    }

    try {
      await configApi.update('presentation_video', trimmedUrl);
      setPresentationVideo(trimmedUrl);
      showToast('Configuration mise à jour avec succès', 'success');
    } catch (error: any) {
      console.error('Error updating config:', error);
      showToast('Erreur lors de la mise à jour', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-8">Configuration du site</h1>

      <CardBox className="p-6 mb-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-dark mb-2">
            <Icon icon="solar:video-frame-play-vertical-line-duotone" className="inline-block mr-2" />
            Vidéo de présentation
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Collez un lien YouTube. Sur l’accueil, la miniature s’affiche d’abord ; la lecture démarre lorsque le visiteur clique sur lecture.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="video-url" className="mb-2 block">
              Lien YouTube
            </Label>
            <div className="flex gap-2">
              <TextInput
                id="video-url"
                type="text"
                value={presentationVideo}
                onChange={(e) => setPresentationVideo(e.target.value)}
                onBlur={(e) => handleVideoUrlChange(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=XXXXXXXXXXX"
                className="flex-1"
              />
              <Button
                color="light"
                onClick={() => handleVideoUrlChange(presentationVideo)}
              >
                <Icon icon="solar:check-circle-line-duotone" className="mr-2" />
                Enregistrer
              </Button>
            </div>
          </div>

          {presentationVideo && (
            <div className="mt-4 border-t pt-4">
              <Label className="mb-2 block">Aperçu</Label>
              <div className="rounded-lg overflow-hidden border border-gray-200 bg-black">
                {extractYoutubeVideoId(presentationVideo) ? (
                  <YoutubeLazyEmbed
                    key={presentationVideo}
                    videoUrl={presentationVideo}
                    title="Aperçu vidéo YouTube"
                    className="!rounded-none shadow-none"
                  />
                ) : (
                  <div className="p-4 text-sm text-yellow-200 bg-yellow-900/40">
                    Lien YouTube invalide. Exemple attendu: https://www.youtube.com/watch?v=XXXXXXXXXXX
                  </div>
                )}
                <div className="p-2 bg-gray-100 text-xs text-gray-600 break-all">
                  <div className="mb-1"><strong>URL:</strong> {presentationVideo}</div>
                  {extractYoutubeVideoId(presentationVideo) && (
                    <div className="text-green-600">Lien YouTube valide</div>
                  )}
                  {!extractYoutubeVideoId(presentationVideo) && (
                    <div className="text-yellow-600">Lien YouTube invalide</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardBox>

      <Toast message={toast.message} type={toast.type} show={toast.show} onClose={hideToast} />
    </div>
  );
};

export default AdminConfig;
