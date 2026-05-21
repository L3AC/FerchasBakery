import { insforgeClient } from '../lib/insforge.js'
import { servicioProductos } from './servicioProductos.js'

export const servicioPedidos = {
  async obtenerTodos() {
    try {
      const { data, error } = await insforgeClient.database
        .from('pedidos')
        .select('*, clientes(nombre, telefono, correo), perfiles(nombre)')
        .order('fecha_pedido', { ascending: false })

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, pedidos: data || [] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async obtenerPorId(idPedido) {
    try {
      const { data, error } = await insforgeClient.database
        .from('pedidos')
        .select('*, clientes(*), perfiles(*), detalles_pedido(*, productos(*))')
        .eq('id_pedido', idPedido)
        .single()

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, pedido: data }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async obtenerDetalles(idPedido) {
    try {
      const { data, error } = await insforgeClient.database
        .from('detalles_pedido')
        .select('*, productos(*)')
        .eq('id_pedido', idPedido)

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, detalles: data || [] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async obtenerPendientes() {
    try {
      const { data, error } = await insforgeClient.database
        .from('pedidos')
        .select('*, clientes(nombre), perfiles(nombre)')
        .eq('estado_pedido', 'Pendiente')
        .order('fecha_pedido', { ascending: false })

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, pedidos: data || [] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async crear(datosPedido) {
    try {
      const { data, error } = await insforgeClient.database
        .from('pedidos')
        .insert([datosPedido])
        .select()

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, pedido: data?.[0] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async agregarDetalle(datosDetalle) {
    try {
      const { data, error } = await insforgeClient.database
        .from('detalles_pedido')
        .insert([datosDetalle])
        .select()

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, detalle: data?.[0] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async actualizarEstado(idPedido, nuevoEstado) {
    try {
      const { data, error } = await insforgeClient.database
        .from('pedidos')
        .update({ estado_pedido: nuevoEstado })
        .eq('id_pedido', idPedido)
        .select()

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, pedido: data?.[0] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async registrarPedidoCompleto(datosPedido, detalles) {
    try {
      // 1. Crear el pedido
      const { data: pedidoData, error: errorPedido } = await insforgeClient.database
        .from('pedidos')
        .insert([datosPedido])
        .select()

      if (errorPedido || !pedidoData?.[0]) {
        return { exito: false, error: errorPedido?.message || 'Error creando pedido' }
      }

      const idPedido = pedidoData[0].id_pedido

      // 2. Agregar detalles y descontar stock
      for (const detalle of detalles) {
        // Insertar detalle
        const { error: errorDetalle } = await insforgeClient.database
          .from('detalles_pedido')
          .insert([{ ...detalle, id_pedido: idPedido }])

        if (errorDetalle) {
          return { exito: false, error: errorDetalle.message }
        }

        // Descontar stock
        const resultadoStock = await servicioProductos.actualizarStock(
          detalle.id_producto,
          -detalle.cantidad
        )

        if (!resultadoStock.exito) {
          return { exito: false, error: 'Error actualizando stock: ' + resultadoStock.error }
        }
      }

      return { exito: true, pedido: pedidoData[0] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async obtenerVentasDelDia() {
    try {
      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0)

      const { data, error } = await insforgeClient.database
        .from('pedidos')
        .select('total')
        .eq('estado_pedido', 'Entregado')
        .gte('fecha_pedido', hoy.toISOString())

      if (error) {
        return { exito: false, error: error.message, total: 0 }
      }

      const total = (data || []).reduce((sum, p) => sum + (parseFloat(p.total) || 0), 0)

      return { exito: true, total }
    } catch (err) {
      return { exito: false, error: err.message, total: 0 }
    }
  }
}
