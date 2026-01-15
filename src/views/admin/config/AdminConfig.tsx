import { useEffect, useState } from 'react';
import { Button, Label, TextInput } from 'flowbite-react';
import { Icon } from '@iconify/react';
import CardBox from '../../../components/shared/CardBox';
import { configApi } from '../../../services/api/config';
import { uploadApi } from '../../../services/api/upload';
import { getApiBaseUrl } from '../../../services/api/client';
import Toast from '../../../components/shared/Toast';
import { useToast } from '../../../hooks/useToast';

const AdminConfig = () => {
  const [loading, setLoading] = useState(true);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [presentationVideo, setPresentationVideo] = useState('');
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const config = await configApi.getAll();
      setPresentationVideo(config.presentation_video || '/videos/presentation.mp4');
    } catch (error: any) {
      console.error('Error fetching config:', error);
      showToast('Erreur lors du chargement de la configuration', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      showToast('Veuillez sélectionner un fichier vidéo', 'error');
      return;
    }

    try {
      setUploadingVideo(true);
      const result = await uploadApi.uploadFile(file);
      // L'URL de Supabase Storage est déjà complète, pas besoin d'ajouter apiBaseUrl
      const fullUrl = result.url.startsWith('http://') || result.url.startsWith('https://') 
        ? result.url 
        : (getApiBaseUrl() ? `${getApiBaseUrl()}${result.url}` : result.url);
      
      // Mettre à jour la configuration
      await configApi.update('presentation_video', fullUrl);
      setPresentationVideo(fullUrl);
      showToast('Vidéo uploadée et configurée avec succès', 'success');
    } catch (error: any) {
      console.error('Error uploading video:', error);
      const errorMessage = error?.message || 'Erreur lors de l\'upload de la vidéo';
      showToast(errorMessage, 'error');
    } finally {
      setUploadingVideo(false);
      e.target.value = '';
    }
  };

  const handleVideoUrlChange = async (url: string) => {
    try {
      await configApi.update('presentation_video', url);
      setPresentationVideo(url);
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
            Cette vidéo sera affichée sur la page d'accueil du site.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="video-url" className="mb-2 block">
              URL de la vidéo
            </Label>
            <div className="flex gap-2">
              <TextInput
                id="video-url"
                type="text"
                value={presentationVideo}
                onChange={(e) => setPresentationVideo(e.target.value)}
                onBlur={(e) => handleVideoUrlChange(e.target.value)}
                placeholder="/videos/presentation.mp4"
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

          <div className="border-t pt-4">
            <Label htmlFor="video-upload" className="mb-2 block">
              Ou uploader une nouvelle vidéo
            </Label>
            <input
              type="file"
              id="video-upload"
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
            />
            <div className="flex gap-2">
              <Button
                color="light"
                onClick={() => document.getElementById('video-upload')?.click()}
                disabled={uploadingVideo}
              >
                <Icon icon="solar:upload-line-duotone" className="mr-2" />
                {uploadingVideo ? 'Upload en cours...' : 'Choisir une vidéo'}
              </Button>
              <span className="text-sm text-gray-500 self-center">
                Formats acceptés: MP4, WebM, OGG, MOV (max 50MB)
              </span>
            </div>
          </div>

          {presentationVideo && (
            <div className="mt-4 border-t pt-4">
              <Label className="mb-2 block">Aperçu</Label>
              <div className="rounded-lg overflow-hidden border border-gray-200 bg-black">
                <video
                  key={presentationVideo}
                  src={presentationVideo}
                  controls
                  className="w-full max-h-96"
                  preload="metadata"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    const video = e.currentTarget;
                    const error = video.error;
                    console.error('Erreur de chargement vidéo:', {
                      code: error?.code,
                      message: error?.message,
                      url: presentationVideo
                    });
                    // Ne pas afficher de toast pour éviter le spam, juste logger
                  }}
                  onLoadedMetadata={() => {
                    console.log('Vidéo chargée avec succès:', presentationVideo);
                  }}
                >
                  <source src={presentationVideo} type="video/mp4" />
                  <source src={presentationVideo} type="video/webm" />
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
                <div className="p-2 bg-gray-100 text-xs text-gray-600 break-all">
                  <div className="mb-1"><strong>URL:</strong> {presentationVideo}</div>
                  {presentationVideo.startsWith('http') && (
                    <div className="text-green-600">✓ URL complète détectée</div>
                  )}
                  {!presentationVideo.startsWith('http') && (
                    <div className="text-yellow-600">⚠ URL relative - peut nécessiter un serveur pour servir les fichiers</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardBox>

      <Toast toast={toast} onClose={hideToast} />
    </div>
  );
};

export default AdminConfig;
