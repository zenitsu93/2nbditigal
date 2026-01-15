import { FC } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { Icon } from '@iconify/react';
import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems, Button } from 'flowbite-react';
import FullLogo from '../full/shared/logo/FullLogo';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout: FC = () => {
  const location = useLocation();
  const { logout, admin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: 'solar:graph-up-line-duotone' },
    { path: '/admin/services', label: 'Services', icon: 'solar:widget-5-line-duotone' },
    { path: '/admin/projects', label: 'Projets', icon: 'solar:folder-with-files-linear' },
    { path: '/admin/articles', label: 'Articles', icon: 'solar:document-text-line-duotone' },
    { path: '/admin/partners', label: 'Partenaires', icon: 'solar:users-group-two-rounded-line-duotone' },
    { path: '/admin/testimonials', label: 'Témoignages', icon: 'solar:chat-round-line-duotone' },
    { path: '/admin/config', label: 'Configuration', icon: 'solar:settings-line-duotone' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64">
        <Sidebar aria-label="Admin sidebar">
          <div className="pb-5 px-4 pt-4">
            <FullLogo />
          </div>
          <SidebarItems>
            <SidebarItemGroup>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path !== '/admin' && location.pathname.startsWith(item.path));
                return (
                  <SidebarItem
                    key={item.path}
                    active={isActive}
                    icon={() => <Icon icon={item.icon} className="w-5 h-5" />}
                    as={Link}
                    {...({ to: item.path } as any)}
                  >
                    {item.label}
                  </SidebarItem>
                );
              })}
            </SidebarItemGroup>
            <SidebarItemGroup>
              <div className="px-4 py-2">
                <div className="text-xs text-gray-500 mb-2">Connecté en tant que</div>
                <div className="text-sm font-medium text-dark mb-4">{admin?.username}</div>
              </div>
              <SidebarItem
                icon={() => <Icon icon="solar:home-2-line-duotone" className="w-5 h-5" />}
                as={Link}
                {...({ to: "/" } as any)}
              >
                Retour au site
              </SidebarItem>
              <div className="px-4 pt-2">
                <Button
                  color="failure"
                  size="sm"
                  className="w-full"
                  onClick={handleLogout}
                >
                  <Icon icon="solar:logout-2-line-duotone" className="mr-2 w-4 h-4" />
                  Déconnexion
                </Button>
              </div>
            </SidebarItemGroup>
          </SidebarItems>
        </Sidebar>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

