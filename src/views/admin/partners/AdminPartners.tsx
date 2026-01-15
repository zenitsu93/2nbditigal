import { useEffect, useState } from 'react';
import { Button, Modal, TextInput, Label } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { partnersApi, Partner } from '../../../services/api/partners';
import { uploadApi } from '../../../services/api/upload';
import { getApiBaseUrl } from '../../../services/api/client';
import Toast from '../../../components/shared/Toast';
import { useToast } from '../../../hooks/useToast';
import ConfirmDialog from '../../../components/shared/ConfirmDialog';
import { useConfirmDialog } from '../../../hooks/useConfirmDialog';

const AdminPartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    website: '',
  });
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const { toast, showToast, hideToast } = useToast();
  const { dialog, showConfirm, hideConfirm, handleConfirm } = useConfirmDialog();

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const data = await partnersApi.getAll();
      setPartners(data);
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (partner?: Partner) => {
    if (partner) {
      setEditingPartner(partner);
      setFormData({
        name: partner.name,
        logo: partner.logo,
        website: partner.website || '',
      });
    } else {
      setEditingPartner(null);
      setFormData({
        name: '',
        logo: '',
        website: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPartner(null);
    setFormData({
      name: '',
      logo: '',
      website: '',
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Veuillez sélectionner un fichier image', 'error');
      return;
    }

    try {
      setUploadingLogo(true);
      const result = await uploadApi.uploadFile(file);
      // L'URL de Supabase Storage est déjà complète, pas besoin d'ajouter apiBaseUrl
      const fullUrl = result.url.startsWith('http://') || result.url.startsWith('https://') 
        ? result.url 
        : (getApiBaseUrl() ? `${getApiBaseUrl()}${result.url}` : result.url);
      setFormData({ ...formData, logo: fullUrl });
      showToast('Logo uploadé avec succès', 'success');
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      const errorMessage = error?.message || 'Erreur lors de l\'upload du logo';
      showToast(errorMessage, 'error');
    } finally {
      setUploadingLogo(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      showToast('Le nom du partenaire est requis', 'error');
      return;
    }
    
    if (!formData.logo.trim()) {
      showToast('Le logo est requis', 'error');
      return;
    }

    try {
      if (editingPartner) {
        await partnersApi.update(editingPartner.id, {
          ...formData,
          website: formData.website || undefined,
        });
        showToast('Partenaire modifié avec succès', 'success');
      } else {
        await partnersApi.create({
          ...formData,
          website: formData.website || undefined,
        });
        showToast('Partenaire créé avec succès', 'success');
      }
      handleCloseModal();
      fetchPartners();
    } catch (error: any) {
      console.error('Error saving partner:', error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Erreur lors de la sauvegarde';
      showToast(errorMessage, 'error');
    }
  };

  const handleDelete = async (id: number) => {
    showConfirm(
      'Supprimer le partenaire',
      'Êtes-vous sûr de vouloir supprimer ce partenaire ? Cette action est irréversible.',
      async () => {
        try {
          await partnersApi.delete(id);
          showToast('Partenaire supprimé avec succès', 'success');
          fetchPartners();
        } catch (error) {
          console.error('Error deleting partner:', error);
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
        <h1 className="text-3xl font-bold text-dark">Gestion des Partenaires</h1>
        <Button color="primary" onClick={() => handleOpenModal()}>
          <Icon icon="solar:add-circle-line-duotone" className="mr-2" />
          Ajouter un partenaire
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Logo</th>
                <th scope="col" className="px-6 py-3">Nom</th>
                <th scope="col" className="px-6 py-3">Site Web</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((partner) => (
                <tr key={partner.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{partner.id}</td>
                  <td className="px-6 py-4">
                    {partner.logo && (
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="w-16 h-16 object-contain rounded"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium">{partner.name}</td>
                  <td className="px-6 py-4">
                    {partner.website ? (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {partner.website}
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        size="xs"
                        color="light"
                        onClick={() => handleOpenModal(partner)}
                      >
                        <Icon icon="solar:pen-line-duotone" />
                      </Button>
                      <Button
                        size="xs"
                        color="failure"
                        onClick={() => handleDelete(partner.id)}
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

      <Modal show={showModal} onClose={handleCloseModal} size="2xl">
        <div className="px-6 py-4 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            {editingPartner ? 'Modifier le partenaire' : 'Ajouter un partenaire'}
          </h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom du partenaire *</Label>
                <TextInput
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="logo">Logo</Label>
                <div className="space-y-2">
                  <input
                    type="file"
                    id="logo-upload"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      color="light"
                      onClick={() => document.getElementById('logo-upload')?.click()}
                      disabled={uploadingLogo}
                      className="shrink-0"
                    >
                      <Icon icon="solar:upload-line-duotone" className="mr-2" />
                      {uploadingLogo ? 'Upload...' : 'Uploader'}
                    </Button>
                    <TextInput
                      id="logo"
                      placeholder="Ou entrez une URL"
                      value={formData.logo}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                      className="flex-1 min-w-0"
                    />
                  </div>
                  {formData.logo && (
                    <div className="mt-2">
                      <img
                        src={formData.logo}
                        alt="Preview"
                        className="w-32 h-32 object-contain rounded border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="website">Site Web (URL)</Label>
                <TextInput
                  id="website"
                  type="url"
                  placeholder="https://example.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t flex justify-end gap-3">
            <Button type="submit" color="primary">
              {editingPartner ? 'Modifier' : 'Créer'}
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

export default AdminPartners;

