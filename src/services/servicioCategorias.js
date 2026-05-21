import { insforgeClient } from '../lib/insforge.js'

export const servicioCategorias = {
  async obtenerTodas() {
    try {
      const { data, error } = await insforgeClient.database
        .from('categorias_productos')
        .select('*')
        .order('nombre_categoria', { ascending: true })

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, categorias: data || [] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async obtenerPorId(idCategoria) {
    try {
      const { data, error } = await insforgeClient.database
        .from('categorias_productos')
        .select('*')
        .eq('id_categoria', idCategoria)
        .single()

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, categoria: data }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async crear(datosCategoria) {
    try {
      const { data, error } = await insforgeClient.database
        .from('categorias_productos')
        .insert([datosCategoria])
        .select()

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, categoria: data?.[0] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async actualizar(idCategoria, datosCategoria) {
    try {
      const { data, error } = await insforgeClient.database
        .from('categorias_productos')
        .update(datosCategoria)
        .eq('id_categoria', idCategoria)
        .select()

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, categoria: data?.[0] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  }
}
