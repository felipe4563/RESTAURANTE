import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RefreshCw, AlertCircle, Coffee, Wallet, ShoppingBag } from 'lucide-react';
import { getMesas } from '../../api/mesas';
import { getVentas, crearVenta } from '../../api/ventas';
import { getCajaActiva } from '../../api/caja';
import { usePermisos } from '../../hooks/usePermisos';
import { useAuth } from '../../hooks/useAuth';
import TarjetaMesa from './components/TarjetaMesa';
import Modal from '../../components/ui/Modal';

export default function VentasPage() {
  const { tienePermiso } = usePermisos();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [creando, setCreando] = useState(null); // mesa_id en proceso
  const [modalLlevar, setModalLlevar] = useState(false);
  const [creandoLlevar, setCreandoLlevar] = useState(false);

  const puedeVer    = tienePermiso('ventas', 'ver');
  const puedeCrear  = tienePermiso('ventas', 'crear');

  // Mesas
  const { data: mesas = [], isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['mesas'],
    queryFn: getMesas,
    refetchInterval: 30_000,
    enabled: puedeVer,
  });

  // Caja activa — requerida para crear órdenes
  const { data: cajaActiva, isLoading: cargandoCaja } = useQuery({
    queryKey: ['caja-activa'],
    queryFn: getCajaActiva,
    refetchInterval: 30_000,
    enabled: puedeVer,
  });

  // Pedidos activos (pendiente + listo) para saber qué mesas están ocupadas
  const { data: pedidosActivos = [] } = useQuery({
    queryKey: ['ventas', 'activos'],
    queryFn: () => getVentas({ estado: 'pendiente,listo' }),
    refetchInterval: 15_000,
    enabled: puedeVer,
  });

  // Mapa mesa_id → pedido
  const pedidoPorMesa = pedidosActivos.reduce((acc, p) => {
    if (p.mesa_id) acc[p.mesa_id] = p;
    return acc;
  }, {});

  // Crear nueva orden (mesa)
  const { mutate: crearOrden } = useMutation({
    mutationFn: (mesa) =>
      crearVenta({
        tipo: 'mesa',
        mesa_id: mesa.id,
        usuario_id: usuario.id,
        sesion_caja_id: cajaActiva?.id ?? null,
        nombre_cliente: 'Público General',
      }),
    onSuccess: (pedido) => {
      queryClient.invalidateQueries({ queryKey: ['mesas'] });
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
      navigate(`/ventas/pedido/${pedido.id}`);
    },
    onSettled: () => setCreando(null),
  });

  // Crear orden para llevar
  const { mutate: crearOrdenLlevar } = useMutation({
    mutationFn: (nombre_cliente) =>
      crearVenta({
        tipo: 'llevar',
        usuario_id: usuario.id,
        sesion_caja_id: cajaActiva?.id ?? null,
        nombre_cliente: nombre_cliente || 'Cliente',
      }),
    onSuccess: (pedido) => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
      navigate(`/ventas/pedido/${pedido.id}`);
    },
    onError: (err) => {
      alert(`Error al crear pedido para llevar: ${err?.message ?? 'Error desconocido'}`);
    },
    onSettled: () => setCreandoLlevar(false),
  });

  function handleClickMesa(mesa) {
    if (mesa.estado === 'ocupada') {
      const pedido = pedidoPorMesa[mesa.id];
      if (pedido) navigate(`/ventas/pedido/${pedido.id}`);
      return;
    }
    if (mesa.estado === 'disponible' && puedeCrear && cajaActiva) {
      setCreando(mesa.id);
      crearOrden(mesa);
    }
  }

  function esClickable(mesa) {
    if (mesa.estado === 'ocupada') return puedeVer && !!pedidoPorMesa[mesa.id];
    if (mesa.estado === 'disponible') return puedeCrear && !!cajaActiva;
    return false;
  }

  // Agrupar por área
  const porArea = mesas.reduce((acc, mesa) => {
    const key = mesa.area?.nombre ?? 'Sin área';
    if (!acc[key]) acc[key] = [];
    acc[key].push(mesa);
    return acc;
  }, {});

  // Sin permiso
  if (!puedeVer) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-400 dark:text-gray-600">
        <AlertCircle className="w-10 h-10" />
        <p className="font-medium">No tienes permiso para ver las mesas</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-red-400">
        <AlertCircle className="w-10 h-10" />
        <p className="font-medium">Error al cargar las mesas</p>
        <button onClick={() => refetch()} className="text-sm underline">Reintentar</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Plano de Mesas</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {mesas.length} mesas · actualiza cada 30s
          </p>
        </div>
        <div className="flex items-center gap-2">
          {puedeCrear && cajaActiva && (
            <button
              onClick={() => setModalLlevar(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Para llevar
            </button>
          )}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Banner sin caja */}
      {!cargandoCaja && !cajaActiva && (
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl text-amber-700 dark:text-amber-400">
          <Wallet className="w-5 h-5 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-semibold">No hay caja abierta</p>
            <p className="text-xs mt-0.5">No puedes crear nuevas órdenes hasta abrir la caja.</p>
          </div>
          <Link
            to="/caja"
            className="ml-auto shrink-0 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Ir a Caja
          </Link>
        </div>
      )}

      {/* Leyenda */}
      <div className="flex flex-wrap gap-4 text-xs">
        {[
          { color: 'bg-green-500', label: 'Disponible' },
          { color: 'bg-red-500',   label: 'Ocupada' },
          { color: 'bg-amber-500', label: 'Reservada' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
            <span className="text-gray-500 dark:text-gray-400">{label}</span>
          </div>
        ))}
        {!puedeCrear && (
          <span className="text-amber-600 dark:text-amber-400 font-medium">
            · Solo lectura (sin permiso para crear órdenes)
          </span>
        )}
        {puedeCrear && !cajaActiva && (
          <span className="text-amber-600 dark:text-amber-400 font-medium">
            · Mesas bloqueadas (sin caja abierta)
          </span>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center h-40 gap-3 text-gray-400">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Cargando mesas...</span>
        </div>
      )}

      {/* Sin mesas */}
      {!isLoading && mesas.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400 dark:text-gray-600">
          <Coffee className="w-10 h-10" />
          <p className="font-medium">No hay mesas configuradas</p>
          <p className="text-sm">Ve a Configuración para agregar mesas</p>
        </div>
      )}

      {/* Áreas y mesas */}
      {Object.entries(porArea).map(([area, mesasDeArea]) => (
        <section key={area}>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
            {area}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {mesasDeArea.map((mesa) => (
              <TarjetaMesa
                key={mesa.id}
                mesa={mesa}
                pedido={pedidoPorMesa[mesa.id]}
                clickable={esClickable(mesa) && creando !== mesa.id}
                onClick={() => handleClickMesa(mesa)}
              />
            ))}
          </div>
        </section>
      ))}

      {/* Overlay de creando orden */}
      {creando && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl flex items-center gap-4">
            <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Abriendo orden...
            </p>
          </div>
        </div>
      )}

      {/* Modal para llevar */}
      {modalLlevar && (
        <ModalLlevar
          cargando={creandoLlevar}
          onClose={() => setModalLlevar(false)}
          onConfirmar={(nombre) => {
            setCreandoLlevar(true);
            setModalLlevar(false);
            crearOrdenLlevar(nombre);
          }}
        />
      )}
    </div>
  );
}

function ModalLlevar({ onClose, onConfirmar, cargando }) {
  const [nombre, setNombre] = useState('');
  return (
    <Modal titulo="Nuevo pedido para llevar" onClose={onClose} ancho="max-w-sm">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
            Nombre del cliente
          </label>
          <input
            type="text"
            autoFocus
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && nombre.trim() && onConfirmar(nombre.trim())}
            placeholder="Ej: Juan, Mesa exterior..."
            className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          />
        </div>
        <div className="flex justify-end gap-3 pt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirmar(nombre.trim() || 'Cliente')}
            disabled={cargando}
            className="px-5 py-2 rounded-xl text-sm bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold transition-colors"
          >
            {cargando ? 'Creando...' : 'Crear pedido'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
