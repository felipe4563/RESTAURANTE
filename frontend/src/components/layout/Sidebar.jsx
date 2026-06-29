import { NavLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { usePermisos } from '../../hooks/usePermisos';
import { getConfiguracion, logoSrc } from '../../api/configuracion';
import {
  LayoutDashboard, UtensilsCrossed, Wallet, BookOpen,
  Package, Boxes, Truck, Users, UserCog, Shield, Settings, X, BarChart2, ChefHat,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/',             label: 'Dashboard',     Icono: LayoutDashboard, siempre: true },
  { to: '/ventas',       label: 'Ventas / POS',  Icono: UtensilsCrossed, modulo: 'ventas',        accion: 'ver' },
  { to: '/cocina',       label: 'Cocina',        Icono: ChefHat,         modulo: 'cocina',        accion: 'ver' },
  { to: '/caja',         label: 'Caja',          Icono: Wallet,          modulo: 'caja',          accion: 'ver' },
  { to: '/libro-caja',   label: 'Libro Caja',    Icono: BookOpen,        modulo: 'libro_caja',    accion: 'ver' },
  { to: '/productos',    label: 'Productos',     Icono: Package,         modulo: 'inventario',    accion: 'ver' },
  { to: '/inventario',   label: 'Inventario',    Icono: Boxes,           modulo: 'inventario',    accion: 'ajustar' },
  { to: '/compras',      label: 'Compras',       Icono: Truck,           modulo: 'compras',       accion: 'ver' },
  { to: '/clientes',     label: 'Clientes',      Icono: Users,           modulo: 'ventas',        accion: 'ver' },
  { to: '/reportes',     label: 'Reportes',      Icono: BarChart2,       modulo: 'reportes',      accion: 'ver' },
  { to: '/usuarios',     label: 'Usuarios',      Icono: UserCog,         modulo: 'usuarios',      accion: 'ver' },
  { to: '/roles',        label: 'Roles',         Icono: Shield,          modulo: 'roles',         accion: 'ver' },
  { to: '/configuracion',label: 'Configuración', Icono: Settings,        modulo: 'configuracion', accion: 'ver' },
];

export default function Sidebar({ abierto, onCerrar }) {
  const { tienePermiso } = usePermisos();
  const { data: config = {} } = useQuery({
    queryKey: ['configuracion'],
    queryFn: getConfiguracion,
    staleTime: 60_000,
  });
  const nombreNegocio = config.nombre_negocio || 'Restaurante';
  const logo = logoSrc(config.logo);

  const itemsVisibles = NAV_ITEMS.filter(
    (item) => item.siempre || tienePermiso(item.modulo, item.accion)
  );

  return (
    <>
      {/* Overlay mobile */}
      {abierto && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onCerrar}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-30 w-64 flex flex-col transition-transform duration-300
          bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-transparent
          lg:static lg:translate-x-0 lg:z-auto lg:w-60 lg:shrink-0
          ${abierto ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700/60">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg shrink-0 overflow-hidden bg-blue-600 flex items-center justify-center">
              {logo
                ? <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                : <UtensilsCrossed className="w-4 h-4 text-white" />
              }
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight truncate">{nombreNegocio}</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">Sistema de Gestión</p>
            </div>
          </div>
          <button
            onClick={onCerrar}
            className="lg:hidden p-1 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {itemsVisibles.map(({ to, label, Icono }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onCerrar}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <Icono className="w-4 h-4 shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
