import { Link } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import CardBox from '../../components/shared/CardBox';
import { Card } from 'flowbite-react';
import { Icon } from '@iconify/react';
import Testimonials from '../../components/entreprise/Testimonials';
import AnimatedAccordion from '../../components/shared/AnimatedAccordion';
import AnimatedButton from '../../components/shared/AnimatedButton';
import TextType from '../../components/shared/TextType';
import TiltedCard from '../../components/shared/TiltedCard';
import LogoLoop from '../../components/shared/LogoLoop';
import { lazy, Suspense } from 'react';
const PromotionModal = lazy(() => import('../../components/shared/PromotionModal'));
import { partnersApi, Partner } from '../../services/api/partners';
import { servicesApi, Service } from '../../services/api/services';
import { configApi } from '../../services/api/config';
import YoutubeLazyEmbed from '../../components/shared/YoutubeLazyEmbed';
import { extractYoutubeVideoId } from '../../utils/youtubeUrl';

const VideoSection = ({ videoUrl }: { videoUrl: string }) => {
  const hasVideo = Boolean(videoUrl?.trim());
  const youtubeId = useMemo(() => (videoUrl ? extractYoutubeVideoId(videoUrl) : null), [videoUrl]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-black">
            {youtubeId ? (
              <YoutubeLazyEmbed
                videoUrl={videoUrl}
                title="Vidéo de présentation"
                className="!rounded-none shadow-none"
              />
            ) : (
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                {hasVideo ? (
                  <video
                    key={videoUrl}
                    src={videoUrl}
                    className="absolute inset-0 h-full w-full object-cover"
                    controls
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500">
                    Lien video YouTube non defini.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const Accueil = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [presentationVideo, setPresentationVideo] = useState('');
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
      {/* Popup promotionnelle - Chargée de manière asynchrone */}
      <Suspense fallback={null}>
        <PromotionModal />
      </Suspense>
      
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
                        <div className="absolute inset-0 rounded-xl flex flex-col justify-end p-6 [background:linear-gradient(to_top,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.2)_32%,transparent_55%)]">
                          <div className="relative z-10">
                            <h5 className="text-xl font-bold text-white mb-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] leading-tight">
                              {service.title}
                            </h5>
                            <p className="text-sm text-white line-clamp-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                              {service.description}
                            </p>
                          </div>
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

