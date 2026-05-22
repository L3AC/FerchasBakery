import { insforgeClient } from '../lib/insforge.js'

export const servicioProveedores = {
  async obtenerTodos() {
    try {
      const { data, error } = await insforgeClient.database
        .from('proveedores')
        .select('*')
        .order('nombre', { ascending: true })

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, proveedores: data || [] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async obtenerPorId(idProveedor) {
    try {
      const { data, error } = await insforgeClient.database
        .from('proveedores')
        .select('*')
        .eq('id_proveedor', idProveedor)
        .single()

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, proveedor: data }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async crear(datosProveedor) {
    try {
      const { data, error } = await insforgeClient.database
        .from('proveedores')
        .insert([datosProveedor])
        .select()

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, proveedor: data?.[0] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async actualizar(idProveedor, datosProveedor) {
    try {
      const { data, error } = await insforgeClient.database
        .from('proveedores')
        .update(datosProveedor)
        .eq('id_proveedor', idProveedor)
        .select()

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, proveedor: data?.[0] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async eliminar(idProveedor) {
    try {
      const { error } = await insforgeClient.database
        .from('proveedores')
        .delete()
        .eq('id_proveedor', idProveedor)

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async buscar(termino) {
    try {
      const { data, error } = await insforgeClient.database
        .from('proveedores')
        .select('*')
        .ilike('nombre', `%${termino}%`)
        .order('nombre', { ascending: true })

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, proveedores: data || [] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  }
}
