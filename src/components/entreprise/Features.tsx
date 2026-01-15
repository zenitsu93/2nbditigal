import CardBox from '../shared/CardBox';
import { Icon } from '@iconify/react';
import { Badge } from 'flowbite-react';

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: string;
  benefits: string[];
}

const features: Feature[] = [
  {
    id: 1,
    title: 'Expertise Technique',
    description: 'Une équipe d\'experts certifiés dans les dernières technologies et méthodologies.',
    icon: 'solar:code-square-line-duotone',
    benefits: ['Certifications', 'Technologies récentes', 'Best practices'],
  },
  {
    id: 2,
    title: 'Accompagnement Personnalisé',
    description: 'Un suivi dédié et un accompagnement sur mesure pour chaque projet.',
    icon: 'solar:handshake-line-duotone',
    benefits: ['Support continu', 'Conseil stratégique', 'Formation'],
  },
  {
    id: 3,
    title: 'Solutions Innovantes',
    description: 'Des solutions sur mesure qui s\'adaptent à vos besoins spécifiques.',
    icon: 'solar:lightbulb-bolt-line-duotone',
    benefits: ['Innovation', 'Sur mesure', 'Scalabilité'],
  },
  {
    id: 4,
    title: 'Délais Respectés',
    description: 'Engagement ferme sur les délais avec une communication transparente.',
    icon: 'solar:calendar-check-line-duotone',
    benefits: ['Ponctualité', 'Transparence', 'Agilité'],
  },
];

const Features = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-dark mb-4">Pourquoi Nous Choisir ?</h2>
          <p className="text-dark/70 max-w-2xl mx-auto">
            Des avantages qui font la différence dans votre transformation digitale
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <CardBox key={feature.id} className="h-full hover:shadow-lg transition-shadow">
              <div className="flex flex-col h-full">
                <div className="p-4 bg-primary/10 rounded-lg mb-4 w-fit">
                  <Icon icon={feature.icon} className="text-3xl text-primary" height={32} />
                </div>
                <h3 className="text-xl font-semibold text-dark mb-2">{feature.title}</h3>
                <p className="text-dark/70 text-sm mb-4 flex-1">{feature.description}</p>
                <div className="flex flex-wrap gap-2">
                  {feature.benefits.map((benefit, index) => (
                    <Badge key={index} color="light" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardBox>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

