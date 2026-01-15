import { useEffect, useState, useRef } from 'react';
import { Button, Modal, TextInput, Textarea, Label, Badge } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { servicesApi, Service } from '../../../services/api/services';
import { uploadApi } from '../../../services/api/upload';
import { getApiBaseUrl } from '../../../services/api/client';
import Toast from '../../../components/shared/Toast';
import { useToast } from '../../../hooks/useToast';
import ConfirmDialog from '../../../components/shared/ConfirmDialog';
import { useConfirmDialog } from '../../../hooks/useConfirmDialog';

const AdminServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    features: '',
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast, showToast, hideToast } = useToast();
  const { dialog, showConfirm, hideConfirm, handleConfirm } = useConfirmDialog();

  useEffect(() => {
    fetchServices();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier que c'est une image
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
      // Réinitialiser l'input pour permettre de re-uploader le même fichier
      e.target.value = '';
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await servicesApi.getAll();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        description: service.description,
        image: service.image || '',
        features: service.features.join(', '),
      });
    } else {
      setEditingService(null);
      setFormData({
        title: '',
        description: '',
        image: '',
        features: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      image: '',
      features: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const featuresArray = formData.features
        .split(',')
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      const serviceData = {
        title: formData.title,
        description: formData.description,
        image: formData.image || undefined,
        features: featuresArray,
      };

      if (editingService) {
        await servicesApi.update(editingService.id, serviceData);
        showToast('Service modifié avec succès', 'success');
      } else {
        await servicesApi.create(serviceData);
        showToast('Service créé avec succès', 'success');
      }
      handleCloseModal();
      fetchServices();
    } catch (error: any) {
      console.error('Error saving service:', error);
      const errorMessage = error?.message || 'Erreur lors de la sauvegarde';
      showToast(errorMessage, 'error');
    }
  };

  const handleDelete = async (id: number) => {
    showConfirm(
      'Supprimer le service',
      'Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.',
      async () => {
        try {
          await servicesApi.delete(id);
          showToast('Service supprimé avec succès', 'success');
          fetchServices();
        } catch (error) {
          console.error('Error deleting service:', error);
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
        <h1 className="text-3xl font-bold text-dark">Gestion des Services</h1>
        <Button color="primary" onClick={() => handleOpenModal()}>
          <Icon icon="solar:add-circle-line-duotone" className="mr-2" />
          Ajouter un service
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
                <th scope="col" className="px-6 py-3">Description</th>
                <th scope="col" className="px-6 py-3">Caractéristiques</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{service.id}</td>
                  <td className="px-6 py-4">
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">Aucune image</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium">{service.title}</td>
                  <td className="px-6 py-4 max-w-xs truncate">
                    {service.description}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {service.features.slice(0, 2).map((feature, idx) => (
                        <Badge key={idx} color="light" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {service.features.length > 2 && (
                        <Badge color="light" className="text-xs">
                          +{service.features.length - 2}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        size="xs"
                        color="light"
                        onClick={() => handleOpenModal(service)}
                      >
                        <Icon icon="solar:pen-line-duotone" />
                      </Button>
                      <Button
                        size="xs"
                        color="failure"
                        onClick={() => handleDelete(service.id)}
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
            {editingService ? 'Modifier le service' : 'Ajouter un service'}
          </h3>
        </div>
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
              <div>
                <Label htmlFor="image">Image *</Label>
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
                          {formData.image ? 'Changer l\'image' : 'Uploader une image'}
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
                <Label htmlFor="features">Caractéristiques (séparées par des virgules)</Label>
                <TextInput
                  id="features"
                  placeholder="Feature 1, Feature 2, Feature 3"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t flex justify-end gap-3 flex-shrink-0">
            <Button type="submit" color="primary">
              {editingService ? 'Modifier' : 'Créer'}
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

export default AdminServices;

