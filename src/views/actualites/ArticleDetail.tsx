import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router';
import CardBox from '../../components/shared/CardBox';
import { Badge, Button } from 'flowbite-react';
import { Icon } from '@iconify/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { articlesApi, Article } from '../../services/api/articles';

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        if (id) {
          const data = await articlesApi.getById(Number(id));
          setArticle(data);
        }
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Chargement...</div>;
  }

  if (!article) {
    return <Navigate to="/actualites" />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-dark/70">
        <Link to="/" className="hover:text-primary">Accueil</Link>
        <Icon icon="solar:alt-arrow-right-linear" className="text-lg" />
        <Link to="/actualites" className="hover:text-primary">Actualités</Link>
        <Icon icon="solar:alt-arrow-right-linear" className="text-lg" />
        <span className="text-dark">{article.title}</span>
      </nav>

      <div className="grid grid-cols-12 gap-6">
        {/* Contenu principal */}
        <div className="lg:col-span-8 col-span-12">
          <CardBox className="mb-6 p-0 overflow-hidden">
            {article.video ? (
              <div className="h-[400px] w-full overflow-hidden bg-black">
                <video
                  src={article.video}
                  controls
                  className="w-full h-full object-contain"
                >
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              </div>
            ) : article.image ? (
              <div className="h-[400px] w-full overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : null}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <Badge color="primary">{article.category}</Badge>
                <span className="text-sm text-dark/50">
                  {new Date(article.date).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-dark mb-4">{article.title}</h1>
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon icon="solar:user-circle-line-duotone" className="text-2xl text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-dark">{article.author}</p>
                  </div>
                </div>
              </div>
              <p className="text-lg text-dark/70 mb-4">{article.excerpt}</p>
              <div className="prose prose-lg max-w-none text-dark/70 
                prose-headings:text-dark prose-headings:font-bold
                prose-h1:text-3xl prose-h1:mb-4 prose-h1:mt-6
                prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-5
                prose-h3:text-xl prose-h3:mb-2 prose-h3:mt-4
                prose-p:mb-4 prose-p:leading-relaxed
                prose-strong:text-dark prose-strong:font-semibold
                prose-em:text-dark/80
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4
                prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4
                prose-li:mb-2
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-dark/80
                prose-code:text-primary prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
                prose-img:rounded-lg prose-img:my-4 prose-img:max-w-full
                prose-hr:border-gray-300 prose-hr:my-6
                prose-table:w-full prose-table:border-collapse prose-table:my-4
                prose-th:border prose-th:border-gray-300 prose-th:px-4 prose-th:py-2 prose-th:bg-gray-100 prose-th:font-semibold
                prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-2">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm, remarkBreaks]}
                  components={{
                    p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
                    br: () => <br className="mb-2" />,
                  }}
                >
                  {article.content}
                </ReactMarkdown>
              </div>
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-200">
                {article.tags.map((tag, index) => (
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
            <h3 className="text-xl font-semibold text-dark mb-4">Informations</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-dark/50 mb-1">Auteur</p>
                <p className="font-medium text-dark">{article.author}</p>
              </div>
              <div>
                <p className="text-sm text-dark/50 mb-1">Date de publication</p>
                <p className="font-medium text-dark">
                  {new Date(article.date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-dark/50 mb-1">Catégorie</p>
                <Badge color="primary">{article.category}</Badge>
              </div>
            </div>
          </CardBox>

          <CardBox className="mt-6">
            <Link to="/actualites">
              <Button color="light" className="w-full">
                <Icon icon="solar:arrow-left-line-duotone" className="mr-2" />
                Retour aux actualités
              </Button>
            </Link>
          </CardBox>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;


