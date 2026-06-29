const { Op } = require('sequelize');
const { Pedido, DetallePedido, Mesa, Producto, Cliente, SesionCaja, LibroCaja, RegistroInventario, sequelize } = require('../../models');

const INCLUDE_PEDIDO_COMPLETO = [
  { model: Mesa, as: 'mesa', attributes: ['id', 'nombre', 'estado'] },
  { model: Cliente, as: 'cliente', attributes: ['id', 'nombre', 'numero_documento'] },
  {
    model: DetallePedido, as: 'detalles',
    include: [{ model: Producto, as: 'producto', attributes: ['id', 'nombre', 'precio'] }],
  },
];

async function listar({ estado, mesa_id } = {}) {
  const where = {};
  if (estado) {
    where.estado = estado.includes(',') ? { [Op.in]: estado.split(',') } : estado;
  }
  if (mesa_id) where.mesa_id = mesa_id;
  return Pedido.findAll({ where, include: INCLUDE_PEDIDO_COMPLETO, order: [['creado_en', 'DESC']] });
}

async function listarCocina() {
  return Pedido.findAll({
    where: { estado: { [Op.in]: ['pendiente', 'listo'] } },
    include: INCLUDE_PEDIDO_COMPLETO,
    order: [['creado_en', 'ASC']],
  });
}

async function obtener(id) {
  const p = await Pedido.findByPk(id, { include: INCLUDE_PEDIDO_COMPLETO });
  if (!p) throw Object.assign(new Error('Pedido no encontrado'), { status: 404 });
  return p;
}

async function crear({ mesa_id, usuario_id, cliente_id, sesion_caja_id, notas, nombre_cliente, documento_cliente, tipo_documento }) {
  const mesa = await Mesa.findByPk(mesa_id);
  if (!mesa) throw Object.assign(new Error('Mesa no encontrada'), { status: 404 });

  if (!sesion_caja_id) {
    throw Object.assign(new Error('No hay caja abierta. Abre la caja antes de crear una orden.'), { status: 409 });
  }
  const sesionActiva = await SesionCaja.findByPk(sesion_caja_id);
  if (!sesionActiva || sesionActiva.estado !== 'abierta') {
    throw Object.assign(new Error('La sesión de caja no está abierta.'), { status: 409 });
  }

  const pedido = await Pedido.create({
    mesa_id,
    usuario_id,
    cliente_id,
    sesion_caja_id,
    notas,
    nombre_cliente: nombre_cliente || 'Público General',
    documento_cliente,
    tipo_documento: tipo_documento || 'Ticket',
  });

  await mesa.update({ estado: 'ocupada' });

  return obtener(pedido.id);
}

async function agregarItem(pedido_id, { producto_id, cantidad = 1, nota }) {
  const pedido = await Pedido.findByPk(pedido_id);
  if (!pedido) throw Object.assign(new Error('Pedido no encontrado'), { status: 404 });
  if (pedido.estado !== 'pendiente') throw Object.assign(new Error('El pedido no está pendiente'), { status: 409 });

  const producto = await Producto.findByPk(producto_id);
  if (!producto) throw Object.assign(new Error('Producto no encontrado'), { status: 404 });
  if (!producto.activo || !producto.es_vendible) throw Object.assign(new Error('Producto no disponible'), { status: 409 });

  const item = await DetallePedido.create({
    pedido_id,
    producto_id,
    cantidad,
    precio: producto.precio,
    nota,
  });

  await _recalcularTotal(pedido_id);
  return item;
}

async function actualizarItem(pedido_id, item_id, { cantidad, nota, estado }) {
  const item = await DetallePedido.findOne({ where: { id: item_id, pedido_id } });
  if (!item) throw Object.assign(new Error('Item no encontrado'), { status: 404 });
  await item.update({ cantidad, nota, estado });
  await _recalcularTotal(pedido_id);
  return item;
}

async function eliminarItem(pedido_id, item_id) {
  const pedido = await Pedido.findByPk(pedido_id);
  if (!pedido || pedido.estado !== 'pendiente') throw Object.assign(new Error('Pedido no modificable'), { status: 409 });
  const item = await DetallePedido.findOne({ where: { id: item_id, pedido_id } });
  if (!item) throw Object.assign(new Error('Item no encontrado'), { status: 404 });
  await item.destroy();
  await _recalcularTotal(pedido_id);
}

async function cobrar(pedido_id, usuario_id, { metodo_pago, monto_recibido, descuento = 0, propina = 0 }) {
  const pedido = await Pedido.findByPk(pedido_id, { include: INCLUDE_PEDIDO_COMPLETO });
  if (!pedido) throw Object.assign(new Error('Pedido no encontrado'), { status: 404 });
  if (!['pendiente', 'listo'].includes(pedido.estado)) throw Object.assign(new Error('El pedido no puede cobrarse'), { status: 409 });
  if (!pedido.sesion_caja_id) throw Object.assign(new Error('No hay sesión de caja activa en este pedido'), { status: 409 });

  const sesion = await SesionCaja.findByPk(pedido.sesion_caja_id);
  if (!sesion || sesion.estado !== 'abierta') throw Object.assign(new Error('La sesión de caja está cerrada'), { status: 409 });

  const monto_neto = parseFloat(pedido.total) - parseFloat(descuento) + parseFloat(propina);

  if (metodo_pago === 'efectivo') {
    if (!monto_recibido || parseFloat(monto_recibido) < monto_neto) {
      throw Object.assign(new Error('Monto recibido insuficiente'), { status: 400 });
    }
  }

  const cambio = metodo_pago === 'efectivo' ? parseFloat(monto_recibido) - monto_neto : 0;

  await sequelize.transaction(async (t) => {
    await pedido.update({
      estado: 'completado',
      metodo_pago,
      monto_recibido: monto_recibido || monto_neto,
      cambio,
      descuento,
      propina,
    }, { transaction: t });

    const pendientes = await Pedido.count({ where: { mesa_id: pedido.mesa_id, estado: 'pendiente' }, transaction: t });
    if (pendientes === 0) {
      await Mesa.update({ estado: 'disponible' }, { where: { id: pedido.mesa_id }, transaction: t });
    }

    await LibroCaja.create({
      sesion_caja_id: pedido.sesion_caja_id,
      usuario_id,
      tipo: 'ingreso',
      concepto: `Venta #${pedido.id}`,
      monto: monto_neto,
      metodo_pago,
      referencia_id: pedido.id,
    }, { transaction: t });

    await SesionCaja.increment('total_ventas', { by: monto_neto, where: { id: pedido.sesion_caja_id }, transaction: t });

    for (const detalle of pedido.detalles) {
      const producto = await Producto.findByPk(detalle.producto_id, { transaction: t });
      if (producto) {
        const stock_anterior = producto.stock ?? 0;
        const stock_nuevo = stock_anterior - detalle.cantidad;
        await producto.update({ stock: stock_nuevo }, { transaction: t });
        await RegistroInventario.create({
          producto_id: detalle.producto_id,
          usuario_id,
          tipo: 'venta',
          cantidad: detalle.cantidad,
          stock_anterior,
          stock_nuevo,
          nota: `Venta #${pedido.id}`,
        }, { transaction: t });
      }
    }
  });

  return obtener(pedido_id);
}

async function cancelar(pedido_id, usuario_id) {
  const pedido = await Pedido.findByPk(pedido_id);
  if (!pedido) throw Object.assign(new Error('Pedido no encontrado'), { status: 404 });
  if (pedido.estado !== 'pendiente') throw Object.assign(new Error('Solo se pueden cancelar pedidos pendientes'), { status: 409 });

  await pedido.update({ estado: 'cancelado' });

  const pendientes = await Pedido.count({ where: { mesa_id: pedido.mesa_id, estado: 'pendiente' } });
  if (pendientes === 0) {
    await Mesa.update({ estado: 'disponible' }, { where: { id: pedido.mesa_id } });
  }

  return obtener(pedido_id);
}

async function _recalcularTotal(pedido_id) {
  const [result] = await sequelize.query(
    'SELECT COALESCE(SUM(cantidad * precio), 0) as total FROM detalle_pedidos WHERE pedido_id = ?',
    { replacements: [pedido_id], type: sequelize.QueryTypes.SELECT }
  );
  await Pedido.update({ total: result.total }, { where: { id: pedido_id } });
}

async function marcarListo(pedido_id) {
  const pedido = await Pedido.findByPk(pedido_id);
  if (!pedido) throw Object.assign(new Error('Pedido no encontrado'), { status: 404 });
  if (pedido.estado !== 'pendiente') throw Object.assign(new Error('Solo pedidos pendientes pueden marcarse como listos'), { status: 409 });
  await pedido.update({ estado: 'listo' });
  return obtener(pedido_id);
}

module.exports = { listar, listarCocina, obtener, crear, agregarItem, actualizarItem, eliminarItem, cobrar, cancelar, marcarListo };
