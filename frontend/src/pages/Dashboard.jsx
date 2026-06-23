import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { usuario } = useAuth();
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        Bienvenido, {usuario?.nombre}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mt-1">Panel principal del restaurante</p>
    </div>
  );
}
