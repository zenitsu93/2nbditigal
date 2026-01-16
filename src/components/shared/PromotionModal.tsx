import { useEffect, useState, useCallback } from 'react';
import { Button } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { promotionsApi, Promotion } from '../../services/api/promotions';
import SpotlightCard from './SpotlightCard';

const STORAGE_KEY = 'dismissed_promotion_id';
const ANIMATION_DELAY = 2000;

/**
 * Composant modal pour afficher les promotions promotionnelles
 * S'affiche automatiquement au chargement de la page si une promotion active existe
 */
const PromotionModal = () => {
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * Formate une date au format français court
   */
  const formatDate = useCallback((dateString?: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'numeric', 
      year: 'numeric' 
    });
  }, []);

  /**
   * Ferme la modal et stocke l'ID dans sessionStorage
   */
  const handleClose = useCallback(() => {
    if (promotion) {
      sessionStorage.setItem(STORAGE_KEY, promotion.id.toString());
    }
    setShowModal(false);
  }, [promotion]);

  /**
   * Charge la promotion active depuis l'API
   */
  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const dismissedPromotionId = sessionStorage.getItem(STORAGE_KEY);
        const data = await promotionsApi.getActive();
        
        if (data && data.id.toString() !== dismissedPromotionId) {
          setPromotion(data);
          setTimeout(() => setShowModal(true), ANIMATION_DELAY);
        }
      } catch (error) {
        console.error('Error fetching promotion:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotion();
  }, []);

  if (loading || !promotion || !showModal) {
    return null;
  }

  const imageStyle = {
    marginTop: '0',
    marginLeft: '-2rem',
    marginRight: '-2rem',
    width: 'calc(100% + 4rem)'
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="promotion-title"
    >
      <div 
        className="max-w-sm w-full relative animate-slideInScale"
        onClick={(e) => e.stopPropagation()}
      >
        <SpotlightCard 
          className="custom-spotlight-card" 
          spotlightColor="rgba(204, 148, 69, 0.3)"
        >
          <div className="flex flex-col relative">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 z-20 text-[#cc9445] hover:text-[#d4af37] transition-colors bg-black/50 rounded-full p-1 shadow-lg hover:bg-black/70"
              aria-label="Fermer la promotion"
            >
              <Icon icon="solar:close-circle-bold" className="w-5 h-5" />
            </button>
            
            {/* Promotion Image */}
            {promotion.image && (
              <div 
                className="relative overflow-hidden h-32 mb-3" 
                style={imageStyle}
              >
                <img
                  src={promotion.image}
                  alt={promotion.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}
            
            {/* Promotion Content */}
            <div 
              className="flex flex-col px-6 pb-6 animate-fadeIn"
              style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
            >
              {/* Meta Information */}
              {(promotion.start_date || promotion.end_date) && (
                <div className="mb-1.5">
                  <span className="meta inline-flex items-center justify-center text-xs text-gray-400">
                    {promotion.start_date && formatDate(promotion.start_date)}
                    {promotion.start_date && promotion.end_date && (
                      <span className="separator inline-block w-1 h-1 rounded-full bg-[#cc9445] mx-2" />
                    )}
                    {promotion.end_date && formatDate(promotion.end_date)}
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className="flex items-center justify-center mb-1.5">
                <div className="p-1.5 bg-black/30 rounded-full">
                  <span className="text-2xl" role="img" aria-label="Célébration">🎉</span>
                </div>
              </div>
              
              {/* Title */}
              <h2 
                id="promotion-title"
                className="text-lg font-bold text-white mb-1.5 text-center"
              >
                {promotion.title}
              </h2>
              
              {/* Description */}
              <p className="text-gray-300 mb-3 text-center leading-relaxed text-sm line-clamp-2">
                {promotion.description}
              </p>
              
              {/* CTA Button - WhatsApp */}
              <div className="flex justify-center">
                <a
                  href={`https://wa.me/22677534419?text=${encodeURIComponent(`Je suis intéressé par ${promotion.title} et je voudrais en savoir plus`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleClose}
                  className="w-full sm:w-auto"
                >
                  <Button 
                    color="primary" 
                    size="sm" 
                    className="w-full sm:w-auto px-5 py-1.5"
                    style={{ margin: 'none' }}
                  >
                    {promotion.cta_text}
                    <Icon icon="solar:arrow-right-line-duotone" className="ml-1.5 w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
};

export default PromotionModal;
