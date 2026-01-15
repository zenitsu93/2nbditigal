import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import CardBox from '../../components/shared/CardBox';
import { Badge, Pagination } from 'flowbite-react';
import { articlesApi, Article } from '../../services/api/articles';

const Actualites = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        // Récupérer uniquement les articles publiés
        const data = await articlesApi.getAll(true);
        setArticles(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // Calculer la pagination
  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArticles = articles.slice(startIndex, endIndex);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="text-gray-500">Chargement des articles...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-dark mb-2">Actualités & Blog</h2>
        <p className="text-dark/70">
          Restez informé des dernières actualités, tendances et conseils dans le domaine du développement et du design.
        </p>
      </div>

      {articles.length === 0 ? (
        <CardBox className="py-12">
          <div className="text-center">
            <p className="text-lg text-dark/70 mb-2">Aucun article disponible pour le moment.</p>
            <p className="text-sm text-dark/50">Il n'y a aucun article publié à présenter.</p>
          </div>
        </CardBox>
      ) : (
        <>
          <div className="grid grid-cols-12 gap-6">
            {currentArticles.map((article) => (
              <div className="lg:col-span-4 md:col-span-6 col-span-12" key={article.id}>
                <CardBox className="p-0 overflow-hidden group card-hover h-full flex flex-col">
                  <div className="relative">
                    <Link to={`/actualites/${article.id}`}>
                      <div className="overflow-hidden h-[200px] w-full">
                        <img
                          src={article.image || '/images/blog/blog-img1.jpg'}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                    <div className="absolute top-4 left-4">
                      <Badge color="primary">{article.category}</Badge>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-xs text-dark/50 mb-3">
                      <span>{new Date(article.date).toLocaleDateString('fr-FR')}</span>
                      <span>•</span>
                      <span>{article.author}</span>
                    </div>
                    <Link to={`/actualites/${article.id}`}>
                      <h3 className="text-xl font-semibold text-dark mb-3 group-hover:text-primary transition-colors line-clamp-2 cursor-pointer">
                        {article.title}
                      </h3>
                    </Link>
                    <p className="text-dark/70 text-sm mb-4 flex-1 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.map((tag, index) => (
                        <Badge key={index} color="light" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Link to={`/actualites/${article.id}`}>
                      <button className="text-primary hover:underline text-sm font-medium">
                        Lire la suite →
                      </button>
                    </Link>
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

export default Actualites;

