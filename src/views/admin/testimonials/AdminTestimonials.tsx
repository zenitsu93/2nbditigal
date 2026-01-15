import { useEffect, useState, useRef } from 'react';
import { Button, Modal, TextInput, Textarea, Label, Rating, RatingStar } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { testimonialsApi, Testimonial } from '../../../services/api/testimonials';
import { uploadApi } from '../../../services/api/upload';
import { getApiBaseUrl } from '../../../services/api/client';
import Toast from '../../../components/shared/Toast';
import { useToast } from '../../../hooks/useToast';
import ConfirmDialog from '../../../components/shared/ConfirmDialog';
import { useConfirmDialog } from '../../../hooks/useConfirmDialog';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    image: '',
    content: '',
    rating: 5,
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast, showToast, hideToast } = useToast();
  const { dialog, showConfirm, hideConfirm, handleConfirm } = useConfirmDialog();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Veuillez sélectionner un fichier image', 'error');
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
      showToast('Image uploadée avec succès', 'success');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      const errorMessage = error?.message || 'Erreur lors de l\'upload de l\'image';
      showToast(errorMessage, 'error');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const data = await testimonialsApi.getAll();
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        name: testimonial.name,
        role: testimonial.role,
        company: testimonial.company,
        image: testimonial.image || '',
        content: testimonial.content,
        rating: testimonial.rating,
      });
    } else {
      setEditingTestimonial(null);
      setFormData({
        name: '',
        role: '',
        company: '',
        image: '',
        content: '',
        rating: 5,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTestimonial(null);
    setFormData({
      name: '',
      role: '',
      company: '',
      image: '',
      content: '',
      rating: 5,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const testimonialData = {
        name: formData.name,
        role: formData.role,
        company: formData.company,
        image: formData.image || undefined,
        content: formData.content,
        rating: formData.rating,
      };

      if (editingTestimonial) {
        await testimonialsApi.update(editingTestimonial.id, testimonialData);
        showToast('Témoignage modifié avec succès', 'success');
      } else {
        await testimonialsApi.create(testimonialData);
        showToast('Témoignage créé avec succès', 'success');
      }
      handleCloseModal();
      fetchTestimonials();
    } catch (error: any) {
      console.error('Error saving testimonial:', error);
      const errorMessage = error?.message || 'Erreur lors de la sauvegarde';
      showToast(errorMessage, 'error');
    }
  };

  const handleDelete = async (id: number) => {
    showConfirm(
      'Supprimer le témoignage',
      'Êtes-vous sûr de vouloir supprimer ce témoignage ? Cette action est irréversible.',
      async () => {
        try {
          await testimonialsApi.delete(id);
          showToast('Témoignage supprimé avec succès', 'success');
          fetchTestimonials();
        } catch (error) {
          console.error('Error deleting testimonial:', error);
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
        <h1 className="text-3xl font-bold text-dark">Gestion des Témoignages</h1>
        <Button color="primary" onClick={() => handleOpenModal()}>
          <Icon icon="solar:add-circle-line-duotone" className="mr-2" />
          Ajouter un témoignage
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Photo</th>
                <th scope="col" className="px-6 py-3">Nom</th>
                <th scope="col" className="px-6 py-3">Rôle</th>
                <th scope="col" className="px-6 py-3">Entreprise</th>
                <th scope="col" className="px-6 py-3">Note</th>
                <th scope="col" className="px-6 py-3">Contenu</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((testimonial) => (
                <tr key={testimonial.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{testimonial.id}</td>
                  <td className="px-6 py-4">
                    {testimonial.image ? (
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <Icon icon="solar:user-circle-line-duotone" className="text-2xl text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium">{testimonial.name}</td>
                  <td className="px-6 py-4">{testimonial.role}</td>
                  <td className="px-6 py-4">{testimonial.company}</td>
                  <td className="px-6 py-4">
                    <Rating size="sm">
                      {[...Array(5)].map((_, i) => (
                        <RatingStar key={i} filled={i < testimonial.rating} />
                      ))}
                    </Rating>
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate">
                    {testimonial.content}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        size="xs"
                        color="light"
                        onClick={() => handleOpenModal(testimonial)}
                      >
                        <Icon icon="solar:pen-line-duotone" />
                      </Button>
                      <Button
                        size="xs"
                        color="failure"
                        onClick={() => handleDelete(testimonial.id)}
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
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
          <div className="px-6 py-4 border-b flex-shrink-0">
            <h3 className="text-xl font-semibold text-gray-900">
              {editingTestimonial ? 'Modifier le témoignage' : 'Ajouter un témoignage'}
            </h3>
          </div>
          <div className="px-6 py-4 overflow-y-auto flex-1">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom *</Label>
                <TextInput
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="role">Rôle *</Label>
                <TextInput
                  id="role"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Ex: Directeur Général, CEO, etc."
                />
              </div>
              <div>
                <Label htmlFor="company">Entreprise *</Label>
                <TextInput
                  id="company"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="image">Photo</Label>
                <div className="space-y-2">
                  {formData.image && (
                    <div className="relative overflow-hidden rounded-lg border">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                      />
                      <Button
                        type="button"
                        size="xs"
                        color="failure"
                        className="absolute top-2 right-2 z-10"
                        onClick={() => setFormData({ ...formData, image: '' })}
                      >
                        <Icon icon="solar:trash-bin-trash-line-duotone" />
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                    <Button
                      type="button"
                      color="light"
                      className="w-full"
                      disabled={uploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {uploadingImage ? (
                        <>
                          <Icon icon="solar:refresh-line-duotone" className="animate-spin mr-2" />
                          Upload en cours...
                        </>
                      ) : (
                        <>
                          <Icon icon="solar:gallery-add-line-duotone" className="mr-2" />
                          {formData.image ? 'Changer la photo' : 'Uploader une photo'}
                        </>
                      )}
                    </Button>
                  </div>
                  <TextInput
                    id="image-url"
                    placeholder="Ou entrez une URL d'image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="content">Témoignage *</Label>
                <Textarea
                  id="content"
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Le témoignage du client..."
                />
              </div>
              <div>
                <Label htmlFor="rating">Note (1-5) *</Label>
                <div className="flex items-center gap-4">
                  <Rating size="lg">
                    {[...Array(5)].map((_, i) => (
                      <RatingStar
                        key={i}
                        filled={i < formData.rating}
                        onClick={() => setFormData({ ...formData, rating: i + 1 })}
                        className="cursor-pointer"
                      />
                    ))}
                  </Rating>
                  <span className="text-sm text-gray-600">{formData.rating}/5</span>
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t flex justify-end gap-3 flex-shrink-0">
            <Button type="submit" color="primary">
              {editingTestimonial ? 'Modifier' : 'Créer'}
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

export default AdminTestimonials;
