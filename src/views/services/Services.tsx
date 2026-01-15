import { useEffect, useState } from 'react';
import CardBox from '../../components/shared/CardBox';
import TiltedCard from '../../components/shared/TiltedCard';
import { Badge, Button } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router';
import { servicesApi, Service } from '../../services/api/services';

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedFeatures, setExpandedFeatures] = useState<Set<number>>(new Set());
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await servicesApi.getAll();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="text-gray-500">Chargement des services...</div>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-4xl font-bold text-primary mb-3 sm:mb-4">Nos Services</h1>
        <p className="text-base sm:text-lg text-dark/70 max-w-3xl mx-auto px-4">
          Nous accompagnons les entreprises dans leur transformation digitale avec une gamme complète de services allant du développement de solutions digitales à la formation, en passant par le conseil stratégique et l'intelligence artificielle.
        </p>
      </div>

      {/* Services Grid - Widget Style */}
      {services.length === 0 ? (
        <CardBox className="py-12 mb-12">
          <div className="text-center">
            <p className="text-lg text-dark/70 mb-2">Aucun service disponible pour le moment.</p>
            <p className="text-sm text-dark/50">Il n'y a aucun service à présenter.</p>
          </div>
        </CardBox>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service) => (
            <div key={service.id} className="h-[400px]">
              <TiltedCard
                imageSrc={service.image}
                altText={service.title}
                captionText={service.title}
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                rotateAmplitude={14}
                scaleOnHover={1.08}
                showMobileWarning={false}
                showTooltip={true}
                displayOverlayContent={true}
                overlayContent={
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent rounded-xl flex flex-col justify-end p-6">
                    <h3 className="text-2xl font-bold text-primary drop-shadow-lg mb-3">
                      {service.title}
                    </h3>
                    <div className="mb-4">
                      <p className={`text-sm text-white/90 ${expandedDescriptions.has(service.id) ? '' : 'line-clamp-2'}`}>
                        {service.description}
                      </p>
                      {service.description && service.description.length > 100 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (expandedDescriptions.has(service.id)) {
                              setExpandedDescriptions(prev => {
                                const newSet = new Set(prev);
                                newSet.delete(service.id);
                                return newSet;
                              });
                            } else {
                              setExpandedDescriptions(prev => new Set(prev).add(service.id));
                            }
                          }}
                          className="text-xs text-white/80 hover:text-white mt-2 font-medium underline transition-colors"
                        >
                          {expandedDescriptions.has(service.id) ? 'Voir moins' : 'Voir plus'}
                        </button>
                      )}
                    </div>
                    
                    {/* Features */}
                    {service.features && service.features.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {(expandedFeatures.has(service.id) 
                            ? service.features 
                            : service.features.slice(0, 3)
                          ).map((feature, index) => (
                            <Badge key={index} className="text-xs bg-white/20 text-white border-white/30">
                              {feature}
                            </Badge>
                          ))}
                          {service.features.length > 3 && !expandedFeatures.has(service.id) && (
                            <Badge 
                              className="text-xs bg-white/20 text-white border-white/30 cursor-pointer hover:bg-white/30 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedFeatures(prev => new Set(prev).add(service.id));
                              }}
                            >
                              +{service.features.length - 3} autres
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* CTA Button */}
                    <Link to="/contact" className="mt-auto">
                      <Button color="primary" className="w-full text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2.5">
                        Demander un devis
                        <Icon icon="solar:arrow-right-line-duotone" className="ml-2" height={16} width={16} />
                      </Button>
                    </Link>
                  </div>
                }
              >
                {!service.image && (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <Icon icon="solar:gallery-add-line-duotone" className="text-6xl text-primary/50 mb-4" />
                    <p className="text-lg text-primary/70 font-semibold mb-2">
                      {service.title}
                    </p>
                    <p className="text-sm text-primary/60">
                      Image à ajouter
                    </p>
                  </div>
                )}
              </TiltedCard>
            </div>
          ))}
        </div>
      )}

      {/* CTA Section */}
      <CardBox className="bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/20">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Icon icon="solar:question-circle-line-duotone" className="text-4xl text-primary" height={40} />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-dark mb-3">Besoin d'aide pour choisir ?</h2>
          <p className="text-sm sm:text-base text-dark/70 mb-6 max-w-2xl mx-auto px-4">
            Notre équipe d'experts est là pour vous conseiller et vous accompagner dans le choix des services adaptés à vos besoins.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 px-4">
            <Link to="/contact" className="w-full sm:w-auto">
              <Button color="primary" size="md" className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">
                <Icon icon="solar:phone-calling-line-duotone" className="mr-2" height={18} width={18} />
                Contactez-nous
              </Button>
            </Link>
            <Link to="/realisations" className="w-full sm:w-auto">
              <Button color="light" size="md" className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 text-dark">
                <Icon icon="solar:folder-with-files-linear" className="mr-2" height={18} width={18} />
                Voir nos réalisations
              </Button>
            </Link>
          </div>
        </div>
      </CardBox>
    </div>
  );
};

export default Services;

