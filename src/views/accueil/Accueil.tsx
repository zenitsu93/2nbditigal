import { Link } from 'react-router';
import { useEffect, useState, useRef } from 'react';
import CardBox from '../../components/shared/CardBox';
import { Card } from 'flowbite-react';
import { Icon } from '@iconify/react';
import Testimonials from '../../components/entreprise/Testimonials';
import AnimatedAccordion from '../../components/shared/AnimatedAccordion';
import AnimatedButton from '../../components/shared/AnimatedButton';
import TextType from '../../components/shared/TextType';
import TiltedCard from '../../components/shared/TiltedCard';
import LogoLoop from '../../components/shared/LogoLoop';
import { partnersApi, Partner } from '../../services/api/partners';
import { servicesApi, Service } from '../../services/api/services';
import { configApi } from '../../services/api/config';

// Variable globale pour partager l'état du son entre les composants
let globalVideoRef: HTMLVideoElement | null = null;
let globalIsMuted = true;
let globalShowSoundHint = true;

// Composant VideoPlayer avec lecture automatique après délai
const VideoPlayer = ({ videoUrl }: { videoUrl: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showSoundHint, setShowSoundHint] = useState(true);

  // Synchroniser l'état local avec les variables globales
  useEffect(() => {
    if (videoRef.current) {
      globalVideoRef = videoRef.current;
      globalIsMuted = isMuted;
      globalShowSoundHint = showSoundHint;
    }
  }, [isMuted, showSoundHint]);

  // Écouter les changements des variables globales (quand le son est activé depuis l'extérieur)
  useEffect(() => {
    const checkGlobalState = () => {
      if (globalVideoRef === videoRef.current) {
        if (!globalIsMuted && isMuted) {
          setIsMuted(false);
        }
        if (!globalShowSoundHint && showSoundHint) {
          setShowSoundHint(false);
        }
      }
    };

    const interval = setInterval(checkGlobalState, 100);
    return () => clearInterval(interval);
  }, [isMuted, showSoundHint]);

  // Réinitialiser hasStarted quand la vidéo change
  useEffect(() => {
    setHasStarted(false);
  }, [videoUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || hasStarted || !videoUrl) return;

    let timer: ReturnType<typeof setTimeout>;
    let fallbackTimer: ReturnType<typeof setTimeout>;

    // Attendre que la vidéo soit prête
    const handleCanPlay = () => {
      // Démarrer la vidéo après 2 secondes
      timer = setTimeout(() => {
        if (video && !hasStarted) {
          video.muted = true; // S'assurer qu'elle est en sourdine
          video.play().then(() => {
            console.log('Vidéo démarrée avec succès');
            setHasStarted(true);
          }).catch((error) => {
            console.error('Erreur lors de la lecture automatique:', error);
          });
        }
      }, 2000);
    };

    video.addEventListener('canplay', handleCanPlay);
    
    // Fallback : démarrer après 3 secondes même si canplay ne se déclenche pas
    fallbackTimer = setTimeout(() => {
      if (video && !hasStarted) {
        video.muted = true;
        video.play().then(() => {
          console.log('Vidéo démarrée avec succès (fallback)');
          setHasStarted(true);
        }).catch((error) => {
          console.error('Erreur lors de la lecture automatique:', error);
        });
      }
    }, 3000);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      if (timer) clearTimeout(timer);
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, [hasStarted, videoUrl]);

  const handleToggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !videoRef.current.muted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      globalIsMuted = newMutedState;
      if (newMutedState === false) {
        setShowSoundHint(false);
        globalShowSoundHint = false;
      }
    }
  };

  // Synchroniser l'état local avec les variables globales
  useEffect(() => {
    if (videoRef.current) {
      globalVideoRef = videoRef.current;
    }
  }, []);

  return (
    <div 
      className="absolute inset-0 w-full h-full cursor-pointer"
      onClick={(e) => {
        // Si c'est le premier clic et que le son est en sourdine, activer le son
        // Ignorer les clics sur le bouton volume
        if (isMuted && showSoundHint && (e.target as HTMLElement).tagName !== 'BUTTON') {
          handleToggleMute();
        }
      }}
    >
      {videoUrl && videoUrl.trim() ? (
        <video
          key={videoUrl}
          ref={videoRef}
          className="w-full h-full object-cover"
          controls
          muted={isMuted}
          playsInline
          preload="metadata"
          onClick={(e) => {
            // Si c'est le premier clic et que le son est en sourdine, activer le son
            if (isMuted && showSoundHint) {
              e.stopPropagation();
              handleToggleMute();
            }
          }}
          onError={(e) => {
            const video = e.currentTarget;
            const error = video.error;
            if (error) {
              console.error('Erreur vidéo:', {
                code: error.code,
                message: error.message,
                url: videoUrl
              });
            } else {
              console.warn('Erreur de chargement vidéo (URL:', videoUrl, ')');
            }
          }}
          onLoadedMetadata={() => {
            console.log('Métadonnées vidéo chargées pour:', videoUrl);
          }}
        >
          <source src={videoUrl} type="video/mp4" />
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
          <p>Chargement de la vidéo...</p>
          {!videoUrl && <p className="text-xs mt-2">URL vidéo non définie</p>}
        </div>
      )}

      {/* Bouton mute/unmute et message */}
      <div 
        className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleMute();
          }}
          className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all duration-300"
          aria-label={isMuted ? 'Activer le son' : 'Désactiver le son'}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"></path>
              <line x1="22" x2="16" y1="9" y2="15"></line>
              <line x1="16" x2="22" y1="9" y2="15"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"></path>
              <path d="M19 10a7 7 0 0 1 0 4"></path>
              <path d="M15 8a3 3 0 0 1 0 8"></path>
            </svg>
          )}
        </button>

        {/* Message "Son activé au premier clic" */}
        {showSoundHint && (
          <div className="bg-amber-500 text-white text-xs px-3 py-1 rounded-full shadow-lg animate-pulse whitespace-nowrap">
            Son activé au premier clic
          </div>
        )}
      </div>
    </div>
  );
};

// Composant wrapper pour gérer le clic sur toute la page
const VideoSection = ({ videoUrl }: { videoUrl: string }) => {
  useEffect(() => {
    // Gérer le clic sur toute la page pour activer le son
    const handlePageClick = (e: MouseEvent) => {
      if (!globalVideoRef || !globalIsMuted || !globalShowSoundHint) return;
      
      const target = e.target as HTMLElement;
      // Ignorer les clics sur les éléments interactifs
      if (target.tagName === 'BUTTON' || 
          target.closest('button') ||
          target.closest('a') ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT') {
        return;
      }

      // Activer le son
      if (globalVideoRef) {
        globalVideoRef.muted = false;
        globalIsMuted = false;
        globalShowSoundHint = false;
      }
    };

    window.addEventListener('click', handlePageClick, true);

    return () => {
      window.removeEventListener('click', handlePageClick, true);
    };
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <VideoPlayer videoUrl={videoUrl} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Accueil = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [presentationVideo, setPresentationVideo] = useState('/videos/presentation.mp4');
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await partnersApi.getAll();
        setPartners(data);
      } catch (error) {
        console.error('Error fetching partners:', error);
      }
    };
    fetchPartners();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await servicesApi.getAll();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setServicesLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const config = await configApi.getAll();
        console.log('Config chargée:', config);
        if (config.presentation_video) {
          console.log('URL vidéo trouvée:', config.presentation_video);
          setPresentationVideo(config.presentation_video);
        } else {
          console.log('Aucune URL vidéo dans la config, utilisation de la valeur par défaut');
        }
      } catch (error) {
        console.error('Error fetching config:', error);
        // Garder la valeur par défaut en cas d'erreur
      }
    };
    fetchConfig();
  }, []);

  // Prendre les 4 premiers services
  const displayedServices = services.slice(0, 4);

  const faqItems = [
    {
      question: 'Quels services proposez-vous ?',
      answer: 'Nous proposons une gamme complète de services incluant l\'ingénierie et le développement de solutions digitales, le conseil en transformation digitale, la data science et l\'intelligence artificielle, le marketing digital, et la formation. Consultez notre page Services pour plus de détails.',
    },
    {
      question: 'Combien de temps prend un projet de développement ?',
      answer: 'La durée d\'un projet dépend de sa complexité et de ses spécificités. Un projet simple peut prendre 2-4 semaines, tandis qu\'un projet complexe peut nécessiter plusieurs mois. Nous établissons un planning détaillé lors de la phase de consultation initiale.',
    },
    {
      question: 'Quels sont vos tarifs ?',
      answer: 'Nos tarifs varient selon le type de projet et les services requis. Nous proposons des devis personnalisés adaptés à vos besoins spécifiques. Contactez-nous pour obtenir un devis gratuit et sans engagement.',
    },
    {
      question: 'Travaillez-vous avec des entreprises de toutes tailles ?',
      answer: 'Oui, nous accompagnons des entreprises de toutes tailles, des startups aux grandes entreprises. Nous adaptons nos solutions et notre approche selon vos besoins et votre budget.',
    },
    {
      question: 'Proposez-vous un support après la livraison ?',
      answer: 'Absolument ! Nous offrons des services de maintenance et de support continu pour tous nos projets. Nous proposons différents niveaux de support selon vos besoins, incluant la maintenance corrective, évolutive et le support technique.',
    },
    {
      question: 'Quelles technologies utilisez-vous ?',
      answer: 'Nous utilisons les technologies les plus récentes et adaptées à chaque projet : React, Next.js, Node.js, Python, React Native, Flutter pour le développement, ainsi que des solutions cloud modernes. Nous choisissons toujours la meilleure stack technologique pour votre projet.',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <TextType
              text="Votre Partenaire de Confiance pour la Transformation Digitale"
              as="h1"
              className="text-4xl md:text-5xl font-bold text-dark mb-6"
              typingSpeed={50}
              initialDelay={500}
              pauseDuration={3000}
              deletingSpeed={30}
              loop={false}
              showCursor={true}
              hideCursorWhileTyping={false}
              cursorCharacter="|"
              cursorBlinkDuration={0.5}
              startOnVisible={true}
            />
            <p className="text-lg text-dark/70 mb-8">
              Nés de l'ambition commune d'ingénieurs Centraliens, nous avons fondé 2NB Digital avec une conviction forte : mettre notre expertise pluridisciplinaire au service de votre réussite dans un monde en constante évolution technologique.
              <br />
              <span className="font-bold">La transformation digitale. À votre service. À tout moment.</span>
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 px-4">
              <Link to="/services" className="w-full sm:w-auto">
                <AnimatedButton variant="primary" size="md" className="w-full sm:w-auto sm:size-lg">
                  Découvrir nos services
                </AnimatedButton>
              </Link>
              <Link to="/realisations" className="w-full sm:w-auto">
                <AnimatedButton variant="light" size="md" className="w-full sm:w-auto sm:size-lg text-dark">
                  Voir nos réalisations
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <VideoSection videoUrl={presentationVideo} />

      {/* Services Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark mb-4">Nos Services</h2>
            <p className="text-dark/70 max-w-2xl mx-auto">
              Une gamme complète de services pour répondre à tous vos besoins en transformation digitale
            </p>
          </div>

          {servicesLoading ? (
            <div className="text-center py-12">
              <div className="text-gray-500">Chargement des services...</div>
            </div>
          ) : displayedServices.length === 0 ? (
            <CardBox className="py-12 mb-8">
              <div className="text-center">
                <p className="text-lg text-dark/70 mb-2">Aucun service disponible pour le moment.</p>
                <p className="text-sm text-dark/50">Il n'y a aucun service à présenter.</p>
              </div>
            </CardBox>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {displayedServices.map((service) => (
                  <div key={service.id} className="h-[300px]">
                    <TiltedCard
                      imageSrc={service.image}
                      altText={service.title}
                      captionText={service.title}
                      containerHeight="100%"
                      containerWidth="100%"
                      imageHeight="100%"
                      imageWidth="100%"
                      rotateAmplitude={12}
                      scaleOnHover={1.05}
                      showMobileWarning={false}
                      showTooltip={true}
                      displayOverlayContent={true}
                      overlayContent={
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-xl flex flex-col justify-end p-6">
                          <h5 className="text-xl font-bold text-white mb-2">
                            {service.title}
                          </h5>
                          <p className="text-sm text-white/90 line-clamp-2">
                            {service.description}
                          </p>
                        </div>
                      }
                    >
                      {!service.image && (
                        <div className="flex flex-col items-center justify-center h-full text-center p-6">
                          <Icon icon="solar:gallery-add-line-duotone" className="text-5xl text-primary/50 mb-4" />
                          <p className="text-sm text-primary/70 font-medium">
                            {service.title}
                          </p>
                        </div>
                      )}
                    </TiltedCard>
                  </div>
                ))}
              </div>

              {/* Bouton pour voir tous les services */}
              <div className="text-center">
                <Link to="/services">
                  <AnimatedButton variant="primary" size="lg">
                    Voir tous nos services
                    <Icon icon="solar:arrow-right-line-duotone" className="ml-2" height={20} />
                  </AnimatedButton>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* FAQ Section */}
      <section id="faq" className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark mb-4">Questions Fréquentes</h2>
            <p className="text-dark/70 max-w-2xl mx-auto">
              Trouvez rapidement les réponses à vos questions sur nos services, nos projets et notre accompagnement.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <CardBox>
              <AnimatedAccordion
                items={faqItems.map(item => ({
                  title: item.question,
                  content: item.answer
                }))}
                type="single"
                collapsible={true}
              />
            </CardBox>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark mb-4">Nos Partenaires</h2>
            <p className="text-dark/70 max-w-2xl mx-auto">
              Nous collaborons avec des entreprises de confiance pour vous offrir les meilleures solutions.
            </p>
          </div>
          {partners.length > 0 ? (
            <div style={{ height: '120px', position: 'relative', overflow: 'hidden' }}>
              <LogoLoop
                logos={partners.map((partner) => ({
                  src: partner.logo,
                  alt: partner.name,
                  title: partner.name,
                  href: partner.website || undefined,
                }))}
                speed={80}
                direction="left"
                logoHeight={60}
                gap={60}
                hoverSpeed={20}
                scaleOnHover
                fadeOut
                fadeOutColor="#ffffff"
                ariaLabel="Nos partenaires"
              />
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun partenaire pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Card className="flex border border-gray-200 dark:border-gray-700 p-6 relative w-full break-words flex-col bg-primary/5 dark:bg-primary/5 mt-10 rounded-md text-center py-8 dark:shadow-md shadow-md !border-none" style={{ borderRadius: '18px' }}>
              <div className="flex h-full flex-col justify-center gap-2 p-0">
                <div className="flex justify-center">
                  <div className="-ms-2 h-11 w-11">
                    <img className="border-2 border-white dark:border-gray-700 rounded-full object-cover" alt="icon" src="/images/profile/user-2.jpg" />
                  </div>
                  <div className="-ms-2 h-11 w-11">
                    <img className="border-2 border-white dark:border-gray-700 rounded-full object-cover" alt="icon" src="/images/profile/user-3.jpg" />
                  </div>
                  <div className="-ms-2 h-11 w-11">
                    <img className="border-2 border-white dark:border-gray-700 rounded-full object-cover" alt="icon" src="/images/profile/user-4.jpg" />
                  </div>
                </div>
                <h4 className="text-xl sm:text-2xl font-bold mt-4 text-secondary/80 dark:text-secondary/80">Prêt à Transformer Votre Entreprise ?</h4>
                <p className="text-secondary/70 dark:text-secondary/70 text-sm sm:text-base px-2">
                  Contactez-nous dès aujourd'hui pour discuter de vos projets
                </p>
                <Link to="/contact" className="mx-auto mt-4">
                  <AnimatedButton variant="primary" size="md" className="sm:size-lg">
                    <Icon icon="solar:phone-calling-line-duotone" className="mr-2" height={18} width={18} />
                    Nous contacter
                  </AnimatedButton>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default Accueil;

