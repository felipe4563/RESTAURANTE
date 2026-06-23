import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, Sun, Moon } from 'lucide-react';
import api from '../../api/cliente';

export default function Topbar({ onToggleSidebar }) {
  const { usuario, logout } = useAuth();
  const { modo, toggleModo } = useTheme();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignorar errores de red al cerrar sesión
    }
    logout();
    navigate('/login');
  }

  return (
    <header className="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 shrink-0 transition-colors">
      {/* Botón hamburguesa (solo mobile) */}
      <button
        onClick={onToggleSidebar}
        className="lg:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="hidden lg:block" />

      {/* Controles derecha */}
      <div className="flex items-center gap-2">
        {/* Toggle modo oscuro/claro */}
        <button
          onClick={toggleModo}
          title={modo === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {modo === 'dark'
            ? <Sun className="w-4 h-4" />
            : <Moon className="w-4 h-4" />
          }
        </button>

        {/* Separador */}
        <div className="w-px h-5 bg-gray-200 dark:bg-gray-600" />

        {/* Usuario */}
        <div className="text-right px-1">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight">{usuario?.nombre}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 leading-tight">{usuario?.rol?.nombre}</p>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Cerrar sesión"
          className="p-2 rounded-lg text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
