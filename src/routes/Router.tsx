// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import  { lazy } from 'react';
import { Navigate, createBrowserRouter } from "react-router";
import Loadable from 'src/layouts/full/shared/loadable/Loadable';
import ProtectedRoute from 'src/components/admin/ProtectedRoute';

/* ***Layouts**** */
const EntrepriseLayout = Loadable(lazy(() => import('../layouts/entreprise/EntrepriseLayout')));
const AdminLayout = Loadable(lazy(() => import('../layouts/admin/AdminLayout')));

// Pages entreprise
const Accueil = Loadable(lazy(() => import('../views/accueil/Accueil')));
const Services = Loadable(lazy(() => import('../views/services/Services')));
const Realisations = Loadable(lazy(() => import('../views/realisations/Realisations')));
const ProjetDetail = Loadable(lazy(() => import('../views/realisations/ProjetDetail')));
const Actualites = Loadable(lazy(() => import('../views/actualites/Actualites')));
const ArticleDetail = Loadable(lazy(() => import('../views/actualites/ArticleDetail')));
const Contact = Loadable(lazy(() => import('../views/contact/Contact')));

// Pages légales
const MentionsLegales = Loadable(lazy(() => import('../views/legal/MentionsLegales')));
const PolitiqueConfidentialite = Loadable(lazy(() => import('../views/legal/PolitiqueConfidentialite')));
const CGV = Loadable(lazy(() => import('../views/legal/CGV')));

// Pages admin
const Login = Loadable(lazy(() => import('../views/admin/Login')));
const AdminDashboard = Loadable(lazy(() => import('../views/admin/Dashboard')));
const AdminServices = Loadable(lazy(() => import('../views/admin/services/AdminServices')));
const AdminProjects = Loadable(lazy(() => import('../views/admin/projects/AdminProjects')));
const AdminArticles = Loadable(lazy(() => import('../views/admin/articles/AdminArticles')));
const AdminPartners = Loadable(lazy(() => import('../views/admin/partners/AdminPartners')));
const AdminTestimonials = Loadable(lazy(() => import('../views/admin/testimonials/AdminTestimonials')));
const AdminConfig = Loadable(lazy(() => import('../views/admin/config/AdminConfig')));

const Router = [
  {
    path: '/',
    element: <EntrepriseLayout />,
    children: [
      { path: '/', exact: true, element: <Accueil /> },
      { path: '/services', exact: true, element: <Services /> },
      { path: '/realisations', exact: true, element: <Realisations /> },
      { path: '/realisations/:slug', exact: true, element: <ProjetDetail /> },
      { path: '/actualites', exact: true, element: <Actualites /> },
      { path: '/actualites/:slug', exact: true, element: <ArticleDetail /> },
      { path: '/contact', exact: true, element: <Contact /> },
      { path: '/legal', exact: true, element: <MentionsLegales /> },
      { path: '/privacy', exact: true, element: <PolitiqueConfidentialite /> },
      { path: '/terms', exact: true, element: <CGV /> },
      { path: '*', element: <Navigate to="/" /> },
    ],
  },
  {
    path: '/admin/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/admin', exact: true, element: <AdminDashboard /> },
      { path: '/admin/services', exact: true, element: <AdminServices /> },
      { path: '/admin/projects', exact: true, element: <AdminProjects /> },
      { path: '/admin/articles', exact: true, element: <AdminArticles /> },
      { path: '/admin/partners', exact: true, element: <AdminPartners /> },
      { path: '/admin/testimonials', exact: true, element: <AdminTestimonials /> },
      { path: '/admin/config', exact: true, element: <AdminConfig /> },
    ],
  },
];

const router = createBrowserRouter(Router)

export default router;

