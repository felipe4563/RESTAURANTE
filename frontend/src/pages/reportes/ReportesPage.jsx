import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart2, FileText, Package, Truck, BookOpen,
  Calendar, Download, Search, TrendingUp, TrendingDown,
  ArrowUpCircle, ArrowDownCircle, ShoppingCart, DollarSign,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getReporteVentas, getReporteInventario, getReporteCompras, getReporteCaja } from '../../api/reportes';
import { usePermisos } from '../../hooks/usePermisos';

const bs = (n) => `Bs ${parseFloat(n || 0).toLocaleString('es-BO', { minimumFractionDigits: 2 })}`;
const fecha = (d) => d ? new Date(d).toLocaleDateString('es-BO') : '-';
const fechaHora = (d) => d ? new Date(d).toLocaleString('es-BO') : '-';

const hoy = () => new Date().toISOString().slice(0, 10);
const inicioMes = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
};

function exportarPDF({ titulo, subtitulo, columnas, filas, totales, nombreArchivo }) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Header violeta
  doc.setFillColor(109, 40, 217);
  doc.rect(0, 0, 297, 30, 'F');
  doc.setFillColor(124, 58, 237);
  doc.circle(270, -5, 30, 'F');
  doc.setFillColor(91, 33, 182);
  doc.circle(285, 35, 18, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('RESTAURANTE', 14, 13);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(titulo, 14, 22);

  doc.setFontSize(9);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-BO')}`, 283, 12, { align: 'right' });
  if (subtitulo) doc.text(subtitulo, 283, 20, { align: 'right' });

  let y = 40;

  // Totales resumen
  if (totales && totales.length > 0) {
    const colW = 270 / totales.length;
    totales.forEach((item, i) => {
      const x = 14 + i * colW;
      doc.setFillColor(245, 243, 255);
      doc.roundedRect(x, y, colW - 4, 14, 2, 2, 'F');
      doc.setTextColor(109, 40, 217);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(item.label, x + 3, y + 5);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(50, 50, 50);
      doc.text(String(item.valor), x + 3, y + 12);
    });
    y += 22;
  }

  autoTable(doc, {
    head: [columnas],
    body: filas,
    startY: y,
    styles: { fontSize: 8, cellPadding: 2.5, overflow: 'linebreak' },
    headStyles: { fillColor: [109, 40, 217], textColor: 255, fontStyle: 'bold', fontSize: 8 },
    alternateRowStyles: { fillColor: [248, 245, 255] },
    margin: { left: 14, right: 14 },
    tableLineColor: [220, 210, 240],
    tableLineWidth: 0.1,
  });

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.text(`Página ${i} de ${pageCount} — Sistema de Gestión Restaurante`, 297 / 2, 205, { align: 'center' });
  }

  doc.save(nombreArchivo || 'reporte.pdf');
}

// ──────────────────────────────────────────────
// Tipos de badge
// ──────────────────────────────────────────────
function BadgeTipo({ tipo }) {
  const mapa = {
    entrada: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    salida:  'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
    venta:   'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    compra:  'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    ajuste:  'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    ingreso: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    egreso:  'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
    pendiente: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    recibido:  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    completado: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  };
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${mapa[tipo] || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
      {tipo}
    </span>
  );
}

// ──────────────────────────────────────────────
// Filtro de fechas
// ──────────────────────────────────────────────
function FiltroFechas({ desde, hasta, setDesde, setHasta, onBuscar, cargando }) {
  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Desde</label>
        <input
          type="date"
          value={desde}
          onChange={e => setDesde(e.target.value)}
          className="px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Hasta</label>
        <input
          type="date"
          value={hasta}
          onChange={e => setHasta(e.target.value)}
          className="px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>
      <button
        onClick={onBuscar}
        disabled={cargando}
        className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
      >
        <Search className="w-4 h-4" />
        Buscar
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────
// Tarjeta resumen
// ──────────────────────────────────────────────
function StatCard({ label, valor, color, Icono, idx }) {
  const colores = {
    violet: { bg: 'bg-violet-50 dark:bg-violet-900/20', bar: 'bg-violet-500', icon: 'text-violet-600 dark:text-violet-400', text: 'text-violet-700 dark:text-violet-300' },
    emerald:{ bg: 'bg-emerald-50 dark:bg-emerald-900/20', bar: 'bg-emerald-500', icon: 'text-emerald-600 dark:text-emerald-400', text: 'text-emerald-700 dark:text-emerald-300' },
    rose:   { bg: 'bg-rose-50 dark:bg-rose-900/20', bar: 'bg-rose-500', icon: 'text-rose-600 dark:text-rose-400', text: 'text-rose-700 dark:text-rose-300' },
    blue:   { bg: 'bg-blue-50 dark:bg-blue-900/20', bar: 'bg-blue-500', icon: 'text-blue-600 dark:text-blue-400', text: 'text-blue-700 dark:text-blue-300' },
    amber:  { bg: 'bg-amber-50 dark:bg-amber-900/20', bar: 'bg-amber-500', icon: 'text-amber-600 dark:text-amber-400', text: 'text-amber-700 dark:text-amber-300' },
  };
  const c = colores[color] || colores.violet;
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 ${c.bg} border border-white/60 dark:border-gray-700/50 animate-[rpFadeUp_0.4s_ease_forwards] opacity-0`}
      style={{ animationDelay: `${idx * 60}ms` }}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${c.bar}`} />
      <div className="flex items-center gap-3 mb-1">
        <Icono className={`w-4 h-4 ${c.icon}`} />
        <span className={`text-xs font-medium ${c.text}`}>{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{valor}</p>
    </div>
  );
}

// ──────────────────────────────────────────────
// Skeleton
// ──────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="space-y-3 animate-pulse mt-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────
// TAB VENTAS
// ──────────────────────────────────────────────
function TabVentas() {
  const [desde, setDesde] = useState(inicioMes());
  const [hasta, setHasta] = useState(hoy());
  const [params, setParams] = useState({ desde: inicioMes(), hasta: hoy() });

  const { data = [], isLoading } = useQuery({
    queryKey: ['reporte-ventas', params],
    queryFn: () => getReporteVentas(params),
  });

  const stats = useMemo(() => {
    const total = data.reduce((s, v) => s + parseFloat(v.total || 0), 0);
    const efectivo = data.filter(v => v.metodo_pago === 'efectivo').reduce((s, v) => s + parseFloat(v.total || 0), 0);
    const qr = data.filter(v => v.metodo_pago !== 'efectivo').reduce((s, v) => s + parseFloat(v.total || 0), 0);
    return { count: data.length, total, efectivo, qr };
  }, [data]);

  const exportar = () => {
    exportarPDF({
      titulo: 'Reporte de Ventas',
      subtitulo: params.desde && params.hasta ? `${fecha(params.desde)} — ${fecha(params.hasta)}` : 'Todas las fechas',
      columnas: ['Fecha', 'Mesa', 'Cliente', 'Cajero', 'Método de pago', 'Total'],
      filas: data.map(v => [
        fechaHora(v.creado_en),
        v.mesa?.nombre || '-',
        v.nombre_cliente || v.cliente?.nombre || 'Público General',
        v.usuario?.nombre || '-',
        v.metodo_pago || '-',
        bs(v.total),
      ]),
      totales: [
        { label: 'N° Ventas', valor: stats.count },
        { label: 'Total Ingresos', valor: bs(stats.total) },
        { label: 'Efectivo', valor: bs(stats.efectivo) },
        { label: 'QR / Transferencia', valor: bs(stats.qr) },
      ],
      nombreArchivo: `reporte-ventas-${params.desde}-${params.hasta}.pdf`,
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <FiltroFechas desde={desde} hasta={hasta} setDesde={setDesde} setHasta={setHasta}
          onBuscar={() => setParams({ desde, hasta })} cargando={isLoading} />
        <button onClick={exportar} disabled={!data.length}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-40">
          <Download className="w-4 h-4" />
          Exportar PDF
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="N° Ventas" valor={stats.count} color="violet" Icono={ShoppingCart} idx={0} />
        <StatCard label="Total Ingresos" valor={bs(stats.total)} color="emerald" Icono={TrendingUp} idx={1} />
        <StatCard label="Efectivo" valor={bs(stats.efectivo)} color="blue" Icono={DollarSign} idx={2} />
        <StatCard label="QR / Transferencia" valor={bs(stats.qr)} color="amber" Icono={BarChart2} idx={3} />
      </div>

      {isLoading ? <Skeleton /> : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700/50">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700/50">
                {['Fecha', 'Mesa', 'Cliente', 'Cajero', 'Método', 'Total'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/40">
              {data.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400 dark:text-gray-500">Sin resultados para el período</td></tr>
              ) : data.map((v, i) => (
                <tr key={v.id}
                  className="bg-white dark:bg-gray-900 hover:bg-violet-50/40 dark:hover:bg-violet-900/10 transition-colors animate-[rpFadeUp_0.3s_ease_forwards] opacity-0"
                  style={{ animationDelay: `${i * 20}ms` }}>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{fechaHora(v.creado_en)}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{v.mesa?.nombre || '-'}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{v.nombre_cliente || v.cliente?.nombre || 'Público General'}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{v.usuario?.nombre || '-'}</td>
                  <td className="px-4 py-3"><BadgeTipo tipo={v.metodo_pago || 'efectivo'} /></td>
                  <td className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400">{bs(v.total)}</td>
                </tr>
              ))}
            </tbody>
            {data.length > 0 && (
              <tfoot>
                <tr className="bg-gray-50 dark:bg-gray-800/60 border-t-2 border-violet-200 dark:border-violet-700/40">
                  <td colSpan={5} className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300 text-sm">TOTAL</td>
                  <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">{bs(stats.total)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// TAB INVENTARIO
// ──────────────────────────────────────────────
function TabInventario() {
  const [desde, setDesde] = useState(inicioMes());
  const [hasta, setHasta] = useState(hoy());
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [params, setParams] = useState({ desde: inicioMes(), hasta: hoy() });

  const { data = [], isLoading } = useQuery({
    queryKey: ['reporte-inventario', params],
    queryFn: () => getReporteInventario(params),
  });

  const filtrado = useMemo(() =>
    filtroTipo === 'todos' ? data : data.filter(r => r.tipo === filtroTipo),
    [data, filtroTipo]
  );

  const stats = useMemo(() => {
    const entradas = data.filter(r => ['entrada', 'compra'].includes(r.tipo)).reduce((s, r) => s + r.cantidad, 0);
    const salidas  = data.filter(r => ['salida', 'venta'].includes(r.tipo)).reduce((s, r) => s + r.cantidad, 0);
    const ajustes  = data.filter(r => r.tipo === 'ajuste').length;
    return { total: data.length, entradas, salidas, ajustes };
  }, [data]);

  const exportar = () => {
    exportarPDF({
      titulo: 'Reporte de Inventario',
      subtitulo: `${fecha(params.desde)} — ${fecha(params.hasta)}${filtroTipo !== 'todos' ? ` · ${filtroTipo}` : ''}`,
      columnas: ['Fecha', 'Producto', 'Tipo', 'Cantidad', 'Stock Ant.', 'Stock Nuevo', 'Usuario', 'Nota'],
      filas: filtrado.map(r => [
        fechaHora(r.creado_en),
        r.producto?.nombre || '-',
        r.tipo,
        r.cantidad,
        r.stock_anterior ?? '-',
        r.stock_nuevo ?? '-',
        r.usuario?.nombre || '-',
        r.nota || '-',
      ]),
      totales: [
        { label: 'Total movimientos', valor: stats.total },
        { label: 'Unidades ingresadas', valor: stats.entradas },
        { label: 'Unidades egresadas', valor: stats.salidas },
        { label: 'Ajustes', valor: stats.ajustes },
      ],
      nombreArchivo: `reporte-inventario-${params.desde}-${params.hasta}.pdf`,
    });
  };

  const TIPOS = ['todos', 'entrada', 'salida', 'venta', 'compra', 'ajuste'];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap items-end gap-3">
          <FiltroFechas desde={desde} hasta={hasta} setDesde={setDesde} setHasta={setHasta}
            onBuscar={() => setParams({ desde, hasta })} cargando={isLoading} />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Tipo</label>
            <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}
              className="px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
              {TIPOS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>
        </div>
        <button onClick={exportar} disabled={!filtrado.length}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-40">
          <Download className="w-4 h-4" />
          Exportar PDF
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total movimientos" valor={stats.total} color="violet" Icono={Package} idx={0} />
        <StatCard label="Unidades ingresadas" valor={stats.entradas} color="emerald" Icono={ArrowUpCircle} idx={1} />
        <StatCard label="Unidades egresadas" valor={stats.salidas} color="rose" Icono={ArrowDownCircle} idx={2} />
        <StatCard label="Ajustes" valor={stats.ajustes} color="amber" Icono={BarChart2} idx={3} />
      </div>

      {isLoading ? <Skeleton /> : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700/50">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700/50">
                {['Fecha', 'Producto', 'Tipo', 'Cantidad', 'Stock Ant.', 'Stock Nuevo', 'Usuario', 'Nota'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/40">
              {filtrado.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-10 text-gray-400 dark:text-gray-500">Sin resultados</td></tr>
              ) : filtrado.map((r, i) => (
                <tr key={r.id}
                  className="bg-white dark:bg-gray-900 hover:bg-violet-50/40 dark:hover:bg-violet-900/10 transition-colors animate-[rpFadeUp_0.3s_ease_forwards] opacity-0"
                  style={{ animationDelay: `${i * 20}ms` }}>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{fechaHora(r.creado_en)}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{r.producto?.nombre || '-'}</td>
                  <td className="px-4 py-3"><BadgeTipo tipo={r.tipo} /></td>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{r.cantidad}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{r.stock_anterior ?? '-'}</td>
                  <td className="px-4 py-3 font-medium text-violet-600 dark:text-violet-400">{r.stock_nuevo ?? '-'}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{r.usuario?.nombre || '-'}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">{r.nota || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// TAB COMPRAS
// ──────────────────────────────────────────────
function TabCompras() {
  const [desde, setDesde] = useState(inicioMes());
  const [hasta, setHasta] = useState(hoy());
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [params, setParams] = useState({ desde: inicioMes(), hasta: hoy() });

  const { data = [], isLoading } = useQuery({
    queryKey: ['reporte-compras', params],
    queryFn: () => getReporteCompras(params),
  });

  const filtrado = useMemo(() =>
    filtroEstado === 'todos' ? data : data.filter(c => c.estado === filtroEstado),
    [data, filtroEstado]
  );

  const stats = useMemo(() => {
    const total = data.reduce((s, c) => s + parseFloat(c.total || 0), 0);
    const pendiente = data.filter(c => c.estado === 'pendiente').reduce((s, c) => s + parseFloat(c.total || 0), 0);
    const recibido  = data.filter(c => c.estado === 'recibido').reduce((s, c) => s + parseFloat(c.total || 0), 0);
    return { count: data.length, total, pendiente, recibido };
  }, [data]);

  const exportar = () => {
    exportarPDF({
      titulo: 'Reporte de Compras',
      subtitulo: `${fecha(params.desde)} — ${fecha(params.hasta)}`,
      columnas: ['Fecha', 'Proveedor', 'Estado', 'Registrado por', 'Total', 'Notas'],
      filas: filtrado.map(c => [
        fechaHora(c.creado_en),
        c.proveedor?.nombre || '-',
        c.estado,
        c.usuario?.nombre || '-',
        bs(c.total),
        c.notas || '-',
      ]),
      totales: [
        { label: 'N° Compras', valor: stats.count },
        { label: 'Total', valor: bs(stats.total) },
        { label: 'Pendiente', valor: bs(stats.pendiente) },
        { label: 'Recibido', valor: bs(stats.recibido) },
      ],
      nombreArchivo: `reporte-compras-${params.desde}-${params.hasta}.pdf`,
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap items-end gap-3">
          <FiltroFechas desde={desde} hasta={hasta} setDesde={setDesde} setHasta={setHasta}
            onBuscar={() => setParams({ desde, hasta })} cargando={isLoading} />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Estado</label>
            <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}
              className="px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
              <option value="todos">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="recibido">Recibido</option>
            </select>
          </div>
        </div>
        <button onClick={exportar} disabled={!filtrado.length}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-40">
          <Download className="w-4 h-4" />
          Exportar PDF
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="N° Compras" valor={stats.count} color="violet" Icono={Truck} idx={0} />
        <StatCard label="Total" valor={bs(stats.total)} color="blue" Icono={DollarSign} idx={1} />
        <StatCard label="Pendiente" valor={bs(stats.pendiente)} color="amber" Icono={ShoppingCart} idx={2} />
        <StatCard label="Recibido" valor={bs(stats.recibido)} color="emerald" Icono={TrendingUp} idx={3} />
      </div>

      {isLoading ? <Skeleton /> : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700/50">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700/50">
                {['Fecha', 'Proveedor', 'Estado', 'Registrado por', 'Total', 'Notas'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/40">
              {filtrado.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400 dark:text-gray-500">Sin resultados</td></tr>
              ) : filtrado.map((c, i) => (
                <tr key={c.id}
                  className="bg-white dark:bg-gray-900 hover:bg-violet-50/40 dark:hover:bg-violet-900/10 transition-colors animate-[rpFadeUp_0.3s_ease_forwards] opacity-0"
                  style={{ animationDelay: `${i * 20}ms` }}>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{fechaHora(c.creado_en)}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{c.proveedor?.nombre || '-'}</td>
                  <td className="px-4 py-3"><BadgeTipo tipo={c.estado} /></td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{c.usuario?.nombre || '-'}</td>
                  <td className="px-4 py-3 font-semibold text-blue-600 dark:text-blue-400">{bs(c.total)}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">{c.notas || '-'}</td>
                </tr>
              ))}
            </tbody>
            {filtrado.length > 0 && (
              <tfoot>
                <tr className="bg-gray-50 dark:bg-gray-800/60 border-t-2 border-violet-200 dark:border-violet-700/40">
                  <td colSpan={4} className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300 text-sm">TOTAL</td>
                  <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">
                    {bs(filtrado.reduce((s, c) => s + parseFloat(c.total || 0), 0))}
                  </td>
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// TAB CAJA
// ──────────────────────────────────────────────
function TabCaja() {
  const [desde, setDesde] = useState(inicioMes());
  const [hasta, setHasta] = useState(hoy());
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [params, setParams] = useState({ desde: inicioMes(), hasta: hoy() });

  const { data = [], isLoading } = useQuery({
    queryKey: ['reporte-caja', params],
    queryFn: () => getReporteCaja(params),
  });

  const filtrado = useMemo(() =>
    filtroTipo === 'todos' ? data : data.filter(r => r.tipo === filtroTipo),
    [data, filtroTipo]
  );

  const stats = useMemo(() => {
    const ingresos = data.filter(r => r.tipo === 'ingreso').reduce((s, r) => s + parseFloat(r.monto || 0), 0);
    const egresos  = data.filter(r => r.tipo === 'egreso').reduce((s, r) => s + parseFloat(r.monto || 0), 0);
    return { total: data.length, ingresos, egresos, balance: ingresos - egresos };
  }, [data]);

  const exportar = () => {
    exportarPDF({
      titulo: 'Reporte de Caja / Libro Caja',
      subtitulo: `${fecha(params.desde)} — ${fecha(params.hasta)}`,
      columnas: ['Fecha', 'Tipo', 'Concepto', 'Método de pago', 'Usuario', 'Monto'],
      filas: filtrado.map(r => [
        fechaHora(r.creado_en),
        r.tipo,
        r.concepto || '-',
        r.metodo_pago || '-',
        r.usuario?.nombre || '-',
        bs(r.monto),
      ]),
      totales: [
        { label: 'Total registros', valor: stats.total },
        { label: 'Total ingresos', valor: bs(stats.ingresos) },
        { label: 'Total egresos', valor: bs(stats.egresos) },
        { label: 'Balance', valor: bs(stats.balance) },
      ],
      nombreArchivo: `reporte-caja-${params.desde}-${params.hasta}.pdf`,
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap items-end gap-3">
          <FiltroFechas desde={desde} hasta={hasta} setDesde={setDesde} setHasta={setHasta}
            onBuscar={() => setParams({ desde, hasta })} cargando={isLoading} />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Tipo</label>
            <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}
              className="px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
              <option value="todos">Todos</option>
              <option value="ingreso">Ingresos</option>
              <option value="egreso">Egresos</option>
            </select>
          </div>
        </div>
        <button onClick={exportar} disabled={!filtrado.length}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-40">
          <Download className="w-4 h-4" />
          Exportar PDF
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Registros" valor={stats.total} color="violet" Icono={BookOpen} idx={0} />
        <StatCard label="Total Ingresos" valor={bs(stats.ingresos)} color="emerald" Icono={TrendingUp} idx={1} />
        <StatCard label="Total Egresos" valor={bs(stats.egresos)} color="rose" Icono={TrendingDown} idx={2} />
        <StatCard label="Balance" valor={bs(stats.balance)} color={stats.balance >= 0 ? 'blue' : 'rose'} Icono={DollarSign} idx={3} />
      </div>

      {isLoading ? <Skeleton /> : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700/50">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700/50">
                {['Fecha', 'Tipo', 'Concepto', 'Método', 'Usuario', 'Monto'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/40">
              {filtrado.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400 dark:text-gray-500">Sin resultados</td></tr>
              ) : filtrado.map((r, i) => (
                <tr key={r.id}
                  className="bg-white dark:bg-gray-900 hover:bg-violet-50/40 dark:hover:bg-violet-900/10 transition-colors animate-[rpFadeUp_0.3s_ease_forwards] opacity-0"
                  style={{ animationDelay: `${i * 20}ms` }}>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{fechaHora(r.creado_en)}</td>
                  <td className="px-4 py-3"><BadgeTipo tipo={r.tipo} /></td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{r.concepto || '-'}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300 capitalize">{r.metodo_pago || '-'}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{r.usuario?.nombre || '-'}</td>
                  <td className={`px-4 py-3 font-semibold ${r.tipo === 'ingreso' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {r.tipo === 'egreso' ? '-' : ''}{bs(r.monto)}
                  </td>
                </tr>
              ))}
            </tbody>
            {filtrado.length > 0 && (
              <tfoot>
                <tr className="bg-gray-50 dark:bg-gray-800/60 border-t-2 border-violet-200 dark:border-violet-700/40">
                  <td colSpan={5} className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300 text-sm">BALANCE</td>
                  <td className={`px-4 py-3 font-bold ${stats.balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {bs(stats.balance)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// PÁGINA PRINCIPAL
// ──────────────────────────────────────────────
const TABS = [
  { id: 'ventas',     label: 'Ventas',     Icono: FileText,  Comp: TabVentas },
  { id: 'inventario', label: 'Inventario', Icono: Package,   Comp: TabInventario },
  { id: 'compras',    label: 'Compras',    Icono: Truck,     Comp: TabCompras },
  { id: 'caja',       label: 'Caja',       Icono: BookOpen,  Comp: TabCaja },
];

export default function ReportesPage() {
  const { tienePermiso } = usePermisos();
  const [tab, setTab] = useState('ventas');

  if (!tienePermiso('reportes', 'ver')) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        No tienes permiso para ver reportes.
      </div>
    );
  }

  const TabActivo = TABS.find(t => t.id === tab)?.Comp || null;

  return (
    <>
      <style>{`
        @keyframes rpFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-violet-700 to-purple-800 p-6 text-white shadow-xl">
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -bottom-4 -right-12 w-44 h-44 bg-white/5 rounded-full" />
          <div className="absolute top-4 right-24 w-10 h-10 bg-white/10 rounded-full" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <BarChart2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Reportes</h1>
                <p className="text-violet-200 text-sm">Filtra, analiza y exporta datos del negocio</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-700/50 overflow-x-auto">
            {TABS.map(({ id, label, Icono }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors whitespace-nowrap flex-1 justify-center ${
                  tab === id
                    ? 'text-violet-600 dark:text-violet-400 border-b-2 border-violet-600 dark:border-violet-400 bg-violet-50/50 dark:bg-violet-900/10'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}>
                <Icono className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {TabActivo && <TabActivo />}
          </div>
        </div>
      </div>
    </>
  );
}
