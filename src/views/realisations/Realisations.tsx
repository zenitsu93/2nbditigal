import { useState, useEffect } from 'react';
import CardBox from '../../components/shared/CardBox';
import { Button, Badge, Pagination } from 'flowbite-react';
import { Link } from 'react-router';
import { projectsApi, Project } from '../../services/api/projects';

// Catégories disponibles
const categories = ['Tous', 'Web', 'Mobile', 'Design'];

const Realisations = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await projectsApi.getAll();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Filtrer les projets selon la catégorie sélectionnée
  const filteredProjects = selectedCategory === 'Tous' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  // Calculer la pagination
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  // Réinitialiser à la page 1 quand la catégorie change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="text-gray-500">Chargement des projets...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-dark mb-2">Nos Réalisations</h2>
        <p className="text-dark/70">
          Découvrez nos projets et réalisations dans différents domaines.
        </p>
      </div>

      {/* Filtres */}
      <CardBox className="mb-6">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => handleCategoryChange(category)}
              color={selectedCategory === category ? 'primary' : 'light'}
              className={selectedCategory === category ? '' : 'text-dark'}
            >
              {category}
            </Button>
          ))}
        </div>
      </CardBox>

      {/* Liste des projets */}
      {filteredProjects.length === 0 ? (
        <CardBox className="py-12">
          <div className="text-center">
            {projects.length === 0 ? (
              <>
                <p className="text-lg text-dark/70 mb-2">Aucun projet disponible pour le moment.</p>
                <p className="text-sm text-dark/50">Il n'y a aucun projet à présenter.</p>
              </>
            ) : (
              <>
                <p className="text-lg text-dark/70 mb-2">Aucun projet trouvé dans cette catégorie.</p>
                <p className="text-sm text-dark/50">Essayez de sélectionner une autre catégorie.</p>
              </>
            )}
          </div>
        </CardBox>
      ) : (
        <>
          <div className="grid grid-cols-12 gap-6">
            {currentProjects.map((project) => (
              <div className="lg:col-span-4 md:col-span-6 col-span-12" key={project.id}>
                <CardBox className="p-0 overflow-hidden group card-hover h-full flex flex-col">
                  <div className="relative">
                    <Link to={`/realisations/${project.id}`}>
                      <div className="overflow-hidden h-[200px] w-full">
                        <img
                          src={project.image || '/images/products/s1.jpg'}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                    <div className="absolute top-4 right-4">
                      <Badge color="primary">{project.category}</Badge>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <Link to={`/realisations/${project.id}`}>
                      <h3 className="text-xl font-semibold text-dark mb-2 group-hover:text-primary transition-colors cursor-pointer">
                        {project.title}
                      </h3>
                    </Link>
                    <p className="text-dark/70 text-sm mb-4 flex-1">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, index) => (
                        <Badge key={index} color="light" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-dark/50">{new Date(project.date).toLocaleDateString('fr-FR')}</span>
                      <Link to={`/realisations/${project.id}`}>
                        <Button color="primary" size="sm">
                          Voir plus
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardBox>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                showIcons
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Realisations;

