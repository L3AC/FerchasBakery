import { insforgeClient } from '../lib/insforge.js'

export const servicioClientes = {
  async obtenerTodos() {
    try {
      const { data, error } = await insforgeClient.database
        .from('clientes')
        .select('*')
        .order('nombre', { ascending: true })

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, clientes: data || [] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async obtenerPorId(idCliente) {
    try {
      const { data, error } = await insforgeClient.database
        .from('clientes')
        .select('*')
        .eq('id_cliente', idCliente)
        .single()

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, cliente: data }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async crear(datosCliente) {
    try {
      const { data, error } = await insforgeClient.database
        .from('clientes')
        .insert([datosCliente])
        .select()

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, cliente: data?.[0] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async actualizar(idCliente, datosCliente) {
    try {
      const { data, error } = await insforgeClient.database
        .from('clientes')
        .update(datosCliente)
        .eq('id_cliente', idCliente)
        .select()

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, cliente: data?.[0] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async buscar(termino) {
    try {
      const { data, error } = await insforgeClient.database
        .from('clientes')
        .select('*')
        .or(`nombre.ilike.%${termino}%,correo.ilike.%${termino}%,telefono.ilike.%${termino}%`)
        .order('nombre', { ascending: true })

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, clientes: data || [] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async obtenerHistorialPedidos(idCliente) {
    try {
      const { data, error } = await insforgeClient.database
        .from('pedidos')
        .select('*')
        .eq('id_cliente', idCliente)
        .order('fecha_pedido', { ascending: false })

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, pedidos: data || [] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  }
}
