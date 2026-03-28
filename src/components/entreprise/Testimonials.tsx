import { useEffect, useState } from 'react';
import CardBox from '../shared/CardBox';
import LogoLoop from '../shared/LogoLoop';
import { Rating, RatingStar } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { testimonialsApi, Testimonial } from '../../services/api/testimonials';
import './Testimonials.css';

function TestimonialMarqueeCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <CardBox className="h-full w-[300px] md:w-[340px] transition-shadow duration-300 p-6 md:p-8 flex flex-col bg-gradient-to-br from-white to-gray-50/50 hover:shadow-xl border border-gray-100">
      <div className="flex flex-col h-full min-h-[280px] md:min-h-[300px]">
        <div className="mb-4">
          <Icon icon="solar:quote-up-line-duotone" className="text-3xl md:text-4xl text-primary/20" />
        </div>
        <div className="mb-4">
          <Rating size="md">
            {[...Array(5)].map((_, i) => (
              <RatingStar key={i} filled={i < testimonial.rating} />
            ))}
          </Rating>
        </div>
        <p className="text-dark/90 text-sm md:text-base leading-relaxed mb-6 flex-grow line-clamp-5 font-medium">
          &ldquo;{testimonial.content}&rdquo;
        </p>
        <div className="flex items-center gap-3 pt-4 border-t-2 border-gray-100 mt-auto">
          {testimonial.image ? (
            <img
              src={testimonial.image}
              alt=""
              className="h-12 w-12 md:h-14 md:w-14 rounded-full object-cover flex-shrink-0 border-2 border-primary/30 shadow-md"
            />
          ) : (
            <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-gradient-to-br from-primary/30 to-primary/50 flex items-center justify-center flex-shrink-0 shadow-md">
              <Icon icon="solar:user-circle-line-duotone" className="text-2xl md:text-3xl text-primary" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-dark text-base md:text-lg mb-0.5 truncate">{testimonial.name}</h4>
            <p className="text-xs md:text-sm text-dark/70 font-medium truncate">{testimonial.role}</p>
            {testimonial.company && (
              <p className="text-xs text-dark/50 mt-0.5 font-medium truncate">{testimonial.company}</p>
            )}
          </div>
        </div>
      </div>
    </CardBox>
  );
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Ce Que Disent Nos Clients</h2>
          <p className="text-dark/70 max-w-2xl mx-auto text-lg">
            Découvrez les témoignages de nos clients qui nous font confiance pour leur transformation digitale
          </p>
        </div>

        <div style={{ minHeight: '360px', position: 'relative', overflow: 'hidden' }} className="md:min-h-[380px]">
          <LogoLoop
            className="testimonials-logoloop"
            logos={testimonials.map((t) => ({
              node: <TestimonialMarqueeCard testimonial={t} />,
              ariaLabel: `Témoignage de ${t.name}`,
            }))}
            speed={80}
            direction="left"
            logoHeight={60}
            gap={48}
            hoverSpeed={20}
            scaleOnHover
            fadeOut
            fadeOutColor="#ffffff"
            ariaLabel="Témoignages clients"
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
