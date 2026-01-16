import { useEffect, useState } from 'react';
import { Button, Modal, TextInput, Textarea, Label, Badge } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { projectsApi, Project } from '../../../services/api/projects';
import { uploadApi } from '../../../services/api/upload';
import { getApiBaseUrl } from '../../../services/api/client';
import Toast from '../../../components/shared/Toast';
import { useToast } from '../../../hooks/useToast';
import ConfirmDialog from '../../../components/shared/ConfirmDialog';
import { useConfirmDialog } from '../../../hooks/useConfirmDialog';

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    video: '',
    category: '',
    tags: '',
    date: new Date().toISOString().split('T')[0],
  });

  // Récupérer les catégories existantes depuis les projets pour suggestions
  const existingCategories = Array.from(
    new Set(projects.map(project => project.category).filter(Boolean))
  ).sort();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const { toast, showToast, hideToast } = useToast();
  const { dialog, showConfirm, hideConfirm, handleConfirm } = useConfirmDialog();

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier que c'est une image
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image');
      return;
    }

    try {
      setUploadingImage(true);
      const result = await uploadApi.uploadFile(file);
      // L'URL de Supabase Storage est déjà complète, pas besoin d'ajouter apiBaseUrl
      const fullUrl = result.url.startsWith('http://') || result.url.startsWith('https://') 
        ? result.url 
        : (getApiBaseUrl() ? `${getApiBaseUrl()}${result.url}` : result.url);
      setFormData({ ...formData, image: fullUrl });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      const errorMessage = error?.message || 'Erreur lors de l\'upload de l\'image';
      alert(errorMessage);
    } finally {
      setUploadingImage(false);
      // Réinitialiser l'input pour permettre de re-uploader le même fichier
      e.target.value = '';
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier que c'est une vidéo
    if (!file.type.startsWith('video/')) {
      alert('Veuillez sélectionner un fichier vidéo');
      return;
    }

    try {
      setUploadingVideo(true);
      const result = await uploadApi.uploadFile(file);
      // L'URL de Supabase Storage est déjà complète, pas besoin d'ajouter apiBaseUrl
      const fullUrl = result.url.startsWith('http://') || result.url.startsWith('https://') 
        ? result.url 
        : (getApiBaseUrl() ? `${getApiBaseUrl()}${result.url}` : result.url);
      setFormData({ ...formData, video: fullUrl });
    } catch (error: any) {
      console.error('Error uploading video:', error);
      const errorMessage = error?.message || 'Erreur lors de l\'upload de la vidéo';
      alert(errorMessage);
    } finally {
      setUploadingVideo(false);
      // Réinitialiser l'input pour permettre de re-uploader le même fichier
      e.target.value = '';
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectsApi.getAll();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description,
        image: project.image || '',
        video: project.video || '',
        category: project.category,
        tags: project.tags.join(', '),
        date: new Date(project.date).toISOString().split('T')[0],
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        description: '',
        image: '',
        video: '',
        category: '',
        tags: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProject(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tagsArray = formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      if (editingProject) {
        await projectsApi.update(editingProject.id, {
          ...formData,
          tags: tagsArray,
        });
        showToast('Projet modifié avec succès', 'success');
      } else {
        await projectsApi.create({
          title: formData.title,
          description: formData.description,
          image: formData.image || undefined,
          video: formData.video || undefined,
          category: formData.category,
          tags: tagsArray,
          date: formData.date,
        });
        showToast('Projet créé avec succès', 'success');
      }
      handleCloseModal();
      // Attendre un peu pour que le cache soit invalidé
      setTimeout(() => {
        fetchProjects();
      }, 500);
    } catch (error) {
      console.error('Error saving project:', error);
      showToast('Erreur lors de la sauvegarde', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    showConfirm(
      'Supprimer le projet',
      'Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.',
      async () => {
        try {
          await projectsApi.delete(id);
          showToast('Projet supprimé avec succès', 'success');
          fetchProjects();
        } catch (error) {
          console.error('Error deleting project:', error);
          showToast('Erreur lors de la suppression', 'error');
        }
      },
      {
        variant: 'error',
        confirmText: 'Supprimer',
        cancelText: 'Annuler',
      }
    );
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div>
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={hideToast}
      />
      <ConfirmDialog
        show={dialog.show}
        title={dialog.title}
        message={dialog.message}
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
        variant={dialog.variant}
        onConfirm={handleConfirm}
        onCancel={hideConfirm}
        loading={dialog.loading}
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-dark">Gestion des Projets</h1>
        <Button color="primary" onClick={() => handleOpenModal()}>
          <Icon icon="solar:add-circle-line-duotone" className="mr-2" />
          Ajouter un projet
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Image</th>
                <th scope="col" className="px-6 py-3">Titre</th>
                <th scope="col" className="px-6 py-3">Catégorie</th>
                <th scope="col" className="px-6 py-3">Tags</th>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{project.id}</td>
                  <td className="px-6 py-4">
                    {project.image && (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium">{project.title}</td>
                  <td className="px-6 py-4">
                    <Badge color="primary">{project.category}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {project.tags.slice(0, 2).map((tag, idx) => (
                        <Badge key={idx} color="light" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 2 && (
                        <Badge color="light" className="text-xs">
                          +{project.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(project.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        size="xs"
                        color="light"
                        onClick={() => handleOpenModal(project)}
                      >
                        <Icon icon="solar:pen-line-duotone" />
                      </Button>
                      <Button
                        size="xs"
                        color="failure"
                        onClick={() => handleDelete(project.id)}
                      >
                        <Icon icon="solar:trash-bin-trash-line-duotone" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal show={showModal} onClose={handleCloseModal} size="4xl">
        <div className="px-6 py-4 border-b sticky top-0 bg-white z-10">
          <h3 className="text-xl font-semibold text-gray-900">
            {editingProject ? 'Modifier le projet' : 'Ajouter un projet'}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[80vh]">
          <div className="px-6 py-4 overflow-y-auto flex-1">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titre *</Label>
                <TextInput
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="image">Image</Label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        color="light"
                        onClick={() => document.getElementById('image-upload')?.click()}
                        disabled={uploadingImage}
                        className="shrink-0"
                      >
                        <Icon icon="solar:upload-line-duotone" className="mr-2" />
                        {uploadingImage ? 'Upload...' : 'Uploader'}
                      </Button>
                      <TextInput
                        id="image"
                        placeholder="Ou entrez une URL"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="flex-1 min-w-0"
                      />
                    </div>
                    {formData.image && (
                      <div className="mt-2">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-full max-h-48 object-cover rounded border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="video">Vidéo</Label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      id="video-upload"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        color="light"
                        onClick={() => document.getElementById('video-upload')?.click()}
                        disabled={uploadingVideo}
                        className="shrink-0"
                      >
                        <Icon icon="solar:upload-line-duotone" className="mr-2" />
                        {uploadingVideo ? 'Upload...' : 'Uploader'}
                      </Button>
                      <TextInput
                        id="video"
                        placeholder="Ou entrez une URL"
                        value={formData.video}
                        onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                        className="flex-1 min-w-0"
                      />
                    </div>
                    {formData.video && (
                      <div className="mt-2">
                        <video
                          src={formData.video}
                          controls
                          className="w-full max-h-48 rounded border"
                        >
                          Votre navigateur ne supporte pas la lecture de vidéos.
                        </video>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Catégorie *</Label>
                  <TextInput
                    id="category"
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Ex: E-commerce, Application Mobile..."
                  />
                  {existingCategories.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Catégories existantes: {existingCategories.join(', ')}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <TextInput
                    id="date"
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
                <TextInput
                  id="tags"
                  placeholder="React, E-commerce, Stripe"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t bg-white sticky bottom-0 flex justify-end gap-3">
            <Button type="submit" color="primary">
              {editingProject ? 'Modifier' : 'Créer'}
            </Button>
            <Button color="light" onClick={handleCloseModal}>
              Annuler
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminProjects;

