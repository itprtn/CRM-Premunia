import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FileText, 
  Settings, 
  Zap,
  Upload,
  BarChart3,
  LogOut,
  Shield
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const adminMenuItems = [
    { icon: LayoutDashboard, label: 'Tableau de Bord', path: '/dashboard' },
    { icon: Users, label: 'Prospects', path: '/prospects' },
    { icon: FileText, label: 'Contrats', path: '/contracts' },
    { icon: Building2, label: 'Compagnies', path: '/companies' },
    { icon: Shield, label: 'Utilisateurs', path: '/users' },
    { icon: Zap, label: 'Automatisation', path: '/automation' },
    { icon: Upload, label: 'Importation', path: '/import' },
    { icon: BarChart3, label: 'Rapports', path: '/reports' },
    { icon: Settings, label: 'Paramètres', path: '/settings' }
  ];

  const commercialMenuItems = [
    { icon: LayoutDashboard, label: 'Tableau de Bord', path: '/dashboard' },
    { icon: Users, label: 'Mes Prospects', path: '/prospects' },
    { icon: FileText, label: 'Mes Contrats', path: '/contracts' },
    { icon: Building2, label: 'Compagnies', path: '/companies' },
    { icon: Settings, label: 'Paramètres', path: '/settings' }
  ];

  const menuItems = user?.role === 'Admin' ? adminMenuItems : commercialMenuItems;

  return (
    <div className="bg-slate-900 text-white w-64 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Premunia</h1>
            <p className="text-slate-400 text-sm">CRM Courtage</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="bg-slate-700 p-2 rounded-full">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium text-sm">{user?.fullName}</p>
            <p className="text-slate-400 text-xs">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors w-full"
        >
          <LogOut className="h-5 w-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;