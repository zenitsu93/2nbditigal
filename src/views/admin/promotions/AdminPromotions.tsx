import { useEffect, useState } from 'react';
import { Button, Modal, TextInput, Textarea, Label, Badge, Checkbox } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { promotionsApi, Promotion } from '../../../services/api/promotions';
import { uploadApi } from '../../../services/api/upload';
import { getApiBaseUrl } from '../../../services/api/client';
import Toast from '../../../components/shared/Toast';
import { useToast } from '../../../hooks/useToast';
import ConfirmDialog from '../../../components/shared/ConfirmDialog';
import { useConfirmDialog } from '../../../hooks/useConfirmDialog';

const AdminPromotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    icon: '',
    cta_text: 'Nous contacter',
    cta_link: '/contact',
    active: true,
    start_date: '',
    end_date: '',
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const { toast, showToast, hideToast } = useToast();
  const { dialog, showConfirm, hideConfirm, handleConfirm } = useConfirmDialog();

  useEffect(() => {
    fetchPromotions();
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

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const data = await promotionsApi.getAll();
      setPromotions(data);
    } catch (error) {
      console.error('Error fetching promotions:', error);
      showToast('Erreur lors du chargement des promotions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (promotion?: Promotion) => {
    if (promotion) {
      setEditingPromotion(promotion);
      setFormData({
        title: promotion.title,
        description: promotion.description,
        image: promotion.image || '',
        icon: promotion.icon || '',
        cta_text: promotion.cta_text,
        cta_link: promotion.cta_link,
        active: promotion.active,
        start_date: promotion.start_date ? new Date(promotion.start_date).toISOString().split('T')[0] : '',
        end_date: promotion.end_date ? new Date(promotion.end_date).toISOString().split('T')[0] : '',
      });
    } else {
      setEditingPromotion(null);
      setFormData({
        title: '',
        description: '',
        image: '',
        icon: '',
        cta_text: 'Nous contacter',
        cta_link: '/contact',
        active: true,
        start_date: '',
        end_date: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPromotion(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const promotionData = {
        title: formData.title,
        description: formData.description,
        image: formData.image || undefined,
        icon: formData.icon || undefined,
        cta_text: formData.cta_text,
        cta_link: formData.cta_link,
        active: formData.active,
        start_date: formData.start_date || undefined,
        end_date: formData.end_date || undefined,
      };

      if (editingPromotion) {
        await promotionsApi.update(editingPromotion.id, promotionData);
        showToast('Promotion modifiée avec succès', 'success');
      } else {
        await promotionsApi.create(promotionData);
        showToast('Promotion créée avec succès', 'success');
      }
      handleCloseModal();
      setTimeout(() => {
        fetchPromotions();
      }, 500);
    } catch (error) {
      console.error('Error saving promotion:', error);
      showToast('Erreur lors de la sauvegarde', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    showConfirm({
      title: 'Supprimer la promotion',
      message: 'Êtes-vous sûr de vouloir supprimer cette promotion ?',
      onConfirm: async () => {
        try {
          await promotionsApi.delete(id);
          showToast('Promotion supprimée avec succès', 'success');
          fetchPromotions();
        } catch (error) {
          console.error('Error deleting promotion:', error);
          showToast('Erreur lors de la suppression', 'error');
        }
      },
    });
  };

  const handleToggleActive = async (promotion: Promotion) => {
    try {
      await promotionsApi.update(promotion.id, { active: !promotion.active });
      showToast(`Promotion ${!promotion.active ? 'activée' : 'désactivée'} avec succès`, 'success');
      fetchPromotions();
    } catch (error) {
      console.error('Error toggling promotion:', error);
      showToast('Erreur lors de la modification', 'error');
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-dark">Gestion des Promotions</h1>
        <Button onClick={() => handleOpenModal()} color="primary">
          <Icon icon="solar:add-circle-bold" className="mr-2" />
          Nouvelle Promotion
        </Button>
      </div>

      {promotions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Icon icon="solar:gift-line-duotone" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucune promotion pour le moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promotion) => (
            <div
              key={promotion.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            >
              {promotion.image && (
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={promotion.image}
                    alt={promotion.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge color={promotion.active ? 'success' : 'gray'}>
                      {promotion.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-dark mb-2">{promotion.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{promotion.description}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    color="primary"
                    onClick={() => handleOpenModal(promotion)}
                  >
                    <Icon icon="solar:pen-bold" className="mr-1" />
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    color={promotion.active ? 'warning' : 'success'}
                    onClick={() => handleToggleActive(promotion)}
                  >
                    <Icon icon={promotion.active ? 'solar:eye-closed-bold' : 'solar:eye-bold'} className="mr-1" />
                    {promotion.active ? 'Désactiver' : 'Activer'}
                  </Button>
                  <Button
                    size="sm"
                    color="failure"
                    onClick={() => handleDelete(promotion.id)}
                  >
                    <Icon icon="solar:trash-bin-trash-bold" className="mr-1" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal pour créer/modifier */}
      <Modal show={showModal} onClose={handleCloseModal} size="2xl">
        <div className="px-6 py-4 border-b sticky top-0 bg-white z-10">
          <h3 className="text-xl font-semibold text-gray-900">
            {editingPromotion ? 'Modifier la promotion' : 'Nouvelle promotion'}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[80vh]">
          <div className="px-6 py-4 overflow-y-auto flex-1">
            <div className="space-y-4">
            <div>
              <Label htmlFor="title">Titre *</Label>
              <TextInput
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="image">Image</Label>
              <div className="flex gap-2">
                <TextInput
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="URL de l'image"
                />
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    color="gray"
                    disabled={uploadingImage}
                  >
                    {uploadingImage ? 'Upload...' : 'Uploader'}
                  </Button>
                </label>
              </div>
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="mt-2 w-full h-48 object-cover rounded"
                />
              )}
            </div>

            <div>
              <Label htmlFor="cta_text">Texte du bouton</Label>
              <TextInput
                id="cta_text"
                value={formData.cta_text}
                onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                placeholder="Nous contacter"
              />
              <p className="text-xs text-gray-500 mt-1">
                Le bouton ouvrira WhatsApp au numéro +22677534419 avec le message de la promotion
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Date de début</Label>
                <TextInput
                  id="start_date"
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="end_date">Date de fin</Label>
                <TextInput
                  id="end_date"
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                />
                <Label htmlFor="active">Promotion active</Label>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-2">
            <Button type="button" color="gray" onClick={handleCloseModal}>
              Annuler
            </Button>
            <Button type="submit" color="primary">
              {editingPromotion ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>

      <Toast {...toast} onClose={hideToast} />
      <ConfirmDialog {...dialog} onClose={hideConfirm} onConfirm={handleConfirm} />
    </div>
  );
};

export default AdminPromotions;
