import { insforgeClient } from '../lib/insforge.js'

export const servicioDetallesPedido = {
  async obtenerPorPedido(idPedido) {
    try {
      const { data, error } = await insforgeClient.database
        .from('detalles_pedido')
        .select('*, productos(*)')
        .eq('id_pedido', idPedido)
        .order('id_detalle', { ascending: true })

      if (error) return { exito: false, error: error.message }
      return { exito: true, detalles: data || [] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async crear(datosDetalle) {
    try {
      const { data, error } = await insforgeClient.database
        .from('detalles_pedido')
        .insert([datosDetalle])
        .select()

      if (error) return { exito: false, error: error.message }
      return { exito: true, detalle: data?.[0] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async actualizar(idDetalle, datosDetalle) {
    try {
      const { data, error } = await insforgeClient.database
        .from('detalles_pedido')
        .update(datosDetalle)
        .eq('id_detalle', idDetalle)
        .select()

      if (error) return { exito: false, error: error.message }
      return { exito: true, detalle: data?.[0] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async eliminar(idDetalle) {
    try {
      const { error } = await insforgeClient.database
        .from('detalles_pedido')
        .delete()
        .eq('id_detalle', idDetalle)

      if (error) return { exito: false, error: error.message }
      return { exito: true }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  }
}
