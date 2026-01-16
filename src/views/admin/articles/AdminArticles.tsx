import { useEffect, useState } from 'react';
import { Button, Modal, TextInput, Textarea, Label, Badge, Select, Checkbox } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { articlesApi, Article } from '../../../services/api/articles';
import { uploadApi } from '../../../services/api/upload';
import { getApiBaseUrl } from '../../../services/api/client';
import Toast from '../../../components/shared/Toast';
import { useToast } from '../../../hooks/useToast';
import ConfirmDialog from '../../../components/shared/ConfirmDialog';
import { useConfirmDialog } from '../../../hooks/useConfirmDialog';

const AdminArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    video: '',
    author: '',
    category: '',
    tags: '',
    published: false,
    date: new Date().toISOString().split('T')[0],
  });

  // Récupérer les catégories existantes depuis les articles pour suggestions
  const existingCategories = Array.from(
    new Set(articles.map(article => article.category).filter(Boolean))
  ).sort();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const { toast, showToast, hideToast } = useToast();
  const { dialog, showConfirm, hideConfirm, handleConfirm } = useConfirmDialog();

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      e.target.value = '';
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      e.target.value = '';
    }
  };

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const data = await articlesApi.getAll();
      setArticles(data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (article?: Article) => {
    if (article) {
      setEditingArticle(article);
      setFormData({
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        image: article.image || '',
        video: article.video || '',
        author: article.author,
        category: article.category,
        tags: article.tags.join(', '),
        published: article.published,
        date: new Date(article.date).toISOString().split('T')[0],
      });
    } else {
      setEditingArticle(null);
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        video: '',
        author: '',
        category: '',
        tags: '',
        published: false,
        date: new Date().toISOString().split('T')[0],
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingArticle(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tagsArray = formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      if (editingArticle) {
        await articlesApi.update(editingArticle.id, {
          ...formData,
          tags: tagsArray,
        });
        showToast('Article modifié avec succès', 'success');
      } else {
        await articlesApi.create({
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
          image: formData.image || undefined,
          video: formData.video || undefined,
          author: formData.author,
          category: formData.category,
          tags: tagsArray,
          published: formData.published,
          date: formData.date,
        });
        showToast('Article créé avec succès', 'success');
      }
      handleCloseModal();
      fetchArticles();
    } catch (error) {
      console.error('Error saving article:', error);
      showToast('Erreur lors de la sauvegarde', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    showConfirm(
      'Supprimer l\'article',
      'Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.',
      async () => {
        try {
          await articlesApi.delete(id);
          showToast('Article supprimé avec succès', 'success');
          fetchArticles();
        } catch (error) {
          console.error('Error deleting article:', error);
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
        <h1 className="text-3xl font-bold text-dark">Gestion des Articles</h1>
        <Button color="primary" onClick={() => handleOpenModal()}>
          <Icon icon="solar:add-circle-line-duotone" className="mr-2" />
          Ajouter un article
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
                <th scope="col" className="px-6 py-3">Auteur</th>
                <th scope="col" className="px-6 py-3">Catégorie</th>
                <th scope="col" className="px-6 py-3">Statut</th>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{article.id}</td>
                  <td className="px-6 py-4">
                    {article.image && (
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium max-w-xs truncate">
                    {article.title}
                  </td>
                  <td className="px-6 py-4">{article.author}</td>
                  <td className="px-6 py-4">
                    <Badge color="primary">{article.category}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    {article.published ? (
                      <Badge color="success">Publié</Badge>
                    ) : (
                      <Badge color="warning">Brouillon</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(article.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        size="xs"
                        color="light"
                        onClick={() => handleOpenModal(article)}
                      >
                        <Icon icon="solar:pen-line-duotone" />
                      </Button>
                      <Button
                        size="xs"
                        color="failure"
                        onClick={() => handleDelete(article.id)}
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
            {editingArticle ? 'Modifier l\'article' : 'Ajouter un article'}
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
                <Label htmlFor="excerpt">Extrait *</Label>
                <Textarea
                  id="excerpt"
                  required
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="content">Contenu * (Markdown supporté)</Label>
                <Textarea
                  id="content"
                  required
                  rows={12}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Vous pouvez utiliser le format Markdown pour formater votre contenu. Exemples :&#10;&#10;# Titre principal&#10;## Sous-titre&#10;**Texte en gras**&#10;*Texte en italique*&#10;- Liste à puces&#10;1. Liste numérotée&#10;[Lien](https://example.com)&#10;![Image](url)&#10;```code```"
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 Le contenu supporte le format Markdown. Vous pouvez utiliser des titres, listes, liens, images, code, etc.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="image">Image</Label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      id="image-upload-article"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        color="light"
                        onClick={() => document.getElementById('image-upload-article')?.click()}
                        disabled={uploadingImage}
                      >
                        <Icon icon="solar:upload-line-duotone" className="mr-2" />
                        {uploadingImage ? 'Upload...' : 'Uploader'}
                      </Button>
                      <TextInput
                        id="image"
                        placeholder="Ou entrez une URL"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                    {formData.image && (
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded"
                      />
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="video">Vidéo</Label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      id="video-upload-article"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        color="light"
                        onClick={() => document.getElementById('video-upload-article')?.click()}
                        disabled={uploadingVideo}
                      >
                        <Icon icon="solar:upload-line-duotone" className="mr-2" />
                        {uploadingVideo ? 'Upload...' : 'Uploader'}
                      </Button>
                      <TextInput
                        id="video"
                        placeholder="Ou entrez une URL"
                        value={formData.video}
                        onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                    {formData.video && (
                      <video
                        src={formData.video}
                        controls
                        className="w-full h-32 rounded"
                      >
                        Votre navigateur ne supporte pas la lecture de vidéos.
                      </video>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="author">Auteur *</Label>
                  <TextInput
                    id="author"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Catégorie *</Label>
                  <TextInput
                    id="category"
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Ex: Technologie, Développement, Design..."
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
                  placeholder="Web, React, Trends"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>
              <div>
                <Checkbox
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                />
                <Label htmlFor="published" className="ml-2">
                  Publié
                </Label>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t bg-white sticky bottom-0 flex justify-end gap-3">
            <Button type="submit" color="primary">
              {editingArticle ? 'Modifier' : 'Créer'}
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

export default AdminArticles;

