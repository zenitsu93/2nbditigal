import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CardBox from '../shared/CardBox';
import { Rating, RatingStar } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { testimonialsApi, Testimonial } from '../../services/api/testimonials';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await testimonialsApi.getAll();
        setTestimonials(data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  // Auto-play slider
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-gray-500">Chargement des témoignages...</div>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  // Number of testimonials to show at once
  const itemsToShow = 3;
  const startIndex = currentIndex;
  const visibleTestimonials = [];

  for (let i = 0; i < itemsToShow; i++) {
    const index = (startIndex + i) % testimonials.length;
    visibleTestimonials.push(testimonials[index]);
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Ce Que Disent Nos Clients</h2>
          <p className="text-dark/70 max-w-2xl mx-auto text-lg">
            Découvrez les témoignages de nos clients qui nous font confiance pour leur transformation digitale
          </p>
        </div>

        <div className="relative">
          {/* Slider container with padding for buttons */}
          <div
            ref={sliderRef}
            className="overflow-hidden relative px-12 md:px-16"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Navigation buttons */}
            {testimonials.length > itemsToShow && (
              <>
                <button
                  onClick={goToPrevious}
                  aria-label="Témoignage précédent"
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-xl hover:shadow-2xl rounded-full p-4 border-2 border-gray-200 hover:border-primary transition-all duration-300 hover:bg-primary hover:text-white group"
                >
                  <Icon icon="solar:alt-arrow-left-line-duotone" className="text-2xl text-primary group-hover:text-white transition-colors" />
                </button>
                <button
                  onClick={goToNext}
                  aria-label="Témoignage suivant"
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-xl hover:shadow-2xl rounded-full p-4 border-2 border-gray-200 hover:border-primary transition-all duration-300 hover:bg-primary hover:text-white group"
                >
                  <Icon icon="solar:alt-arrow-right-line-duotone" className="text-2xl text-primary group-hover:text-white transition-colors" />
                </button>
              </>
            )}

            <div className="flex gap-8">
              <AnimatePresence mode="wait">
                {visibleTestimonials.map((testimonial, idx) => (
                  <motion.div
                    key={`${testimonial.id}-${currentIndex}-${idx}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3"
                  >
                    <CardBox className="h-full transition-shadow duration-300 p-8 flex flex-col bg-gradient-to-br from-white to-gray-50/50 hover:shadow-xl border border-gray-100">
                      <div className="flex flex-col h-full">
                        {/* Quote icon at top */}
                        <div className="mb-6">
                          <Icon icon="solar:quote-up-line-duotone" className="text-4xl text-primary/20" />
                        </div>

                        {/* Rating */}
                        <div className="mb-6">
                          <Rating size="lg">
                            {[...Array(5)].map((_, i) => (
                              <RatingStar key={i} filled={i < testimonial.rating} />
                            ))}
                          </Rating>
                        </div>

                        {/* Testimonial content */}
                        <p className="text-dark/90 text-base leading-relaxed mb-8 flex-grow line-clamp-5 font-medium">
                          "{testimonial.content}"
                        </p>

                        {/* Author info */}
                        <div className="flex items-center gap-4 pt-6 border-t-2 border-gray-100">
                          {testimonial.image ? (
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="h-14 w-14 rounded-full object-cover flex-shrink-0 border-2 border-primary/30 shadow-md"
                            />
                          ) : (
                            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/30 to-primary/50 flex items-center justify-center flex-shrink-0 shadow-md">
                              <Icon icon="solar:user-circle-line-duotone" className="text-3xl text-primary" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-dark text-lg mb-1">{testimonial.name}</h4>
                            <p className="text-sm text-dark/70 font-medium">{testimonial.role}</p>
                            {testimonial.company && (
                              <p className="text-xs text-dark/50 mt-1 font-medium">{testimonial.company}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardBox>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Dots indicator */}
          {testimonials.length > itemsToShow && (
            <div className="flex justify-center items-center gap-3 mt-12 pt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-12 h-3 bg-primary shadow-lg scale-110'
                      : 'w-3 h-3 bg-gray-300 hover:bg-primary/50 hover:scale-110'
                  }`}
                  aria-label={`Aller au témoignage ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

