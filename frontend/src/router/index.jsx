import { createBrowserRouter, Navigate } from 'react-router-dom';
import RutaProtegida from './RutaProtegida';
import Layout from '../components/layout/Layout';
import LoginPage from '../pages/auth/LoginPage';
import Dashboard from '../pages/Dashboard';
import VentasPage from '../pages/ventas/VentasPage';
import PedidoPage from '../pages/ventas/PedidoPage';
import ConfiguracionPage from '../pages/configuracion/ConfiguracionPage';
import ProductosPage from '../pages/productos/ProductosPage';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <RutaProtegida />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: '/',                    element: <Dashboard /> },
          { path: '/ventas',              element: <VentasPage /> },
          { path: '/ventas/pedido/:id',   element: <PedidoPage /> },
          { path: '/productos',           element: <ProductosPage /> },
          { path: '/configuracion',       element: <ConfiguracionPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
