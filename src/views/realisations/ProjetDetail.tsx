import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router';
import CardBox from '../../components/shared/CardBox';
import { Badge, Button } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { projectsApi, Project } from '../../services/api/projects';

const ProjetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (id) {
          const data = await projectsApi.getById(Number(id));
          setProject(data);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Chargement...</div>;
  }

  if (!project) {
    return <Navigate to="/realisations" />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-dark/70">
        <Link to="/" className="hover:text-primary">Accueil</Link>
        <Icon icon="solar:alt-arrow-right-linear" className="text-lg" />
        <Link to="/realisations" className="hover:text-primary">Réalisations</Link>
        <Icon icon="solar:alt-arrow-right-linear" className="text-lg" />
        <span className="text-dark">{project.title}</span>
      </nav>

      <div className="grid grid-cols-12 gap-6">
        {/* Contenu principal */}
        <div className="lg:col-span-8 col-span-12">
          <CardBox className="mb-6 p-0 overflow-hidden">
            {project.video ? (
              <div className="h-[400px] w-full overflow-hidden bg-black">
                <video
                  src={project.video}
                  controls
                  className="w-full h-full object-contain"
                >
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              </div>
            ) : project.image ? (
              <div className="h-[400px] w-full overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : null}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Badge color="primary">{project.category}</Badge>
                <span className="text-sm text-dark/50">
                  {new Date(project.date).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-dark mb-4">{project.title}</h1>
              <p className="text-lg text-dark/70 mb-6">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag, index) => (
                  <Badge key={index} color="light" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardBox>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 col-span-12">
          <CardBox>
            <h3 className="text-xl font-semibold text-dark mb-4">Informations du Projet</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-dark/50 mb-1">Date de réalisation</p>
                <p className="font-medium text-dark">
                  {new Date(project.date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-dark/50 mb-1">Catégorie</p>
                <Badge color="primary">{project.category}</Badge>
              </div>
            </div>
          </CardBox>

          <CardBox className="mt-6">
            <Link to="/realisations">
              <Button color="light" className="w-full">
                <Icon icon="solar:arrow-left-line-duotone" className="mr-2" />
                Retour aux réalisations
              </Button>
            </Link>
          </CardBox>
        </div>
      </div>
    </div>
  );
};

export default ProjetDetail;

