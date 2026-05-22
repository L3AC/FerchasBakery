import { insforgeClient } from '../lib/insforge.js'

export const servicioCategorias = {
  async obtenerTodas() {
    try {
      const { data, error } = await insforgeClient.database
        .from('categorias_productos')
        .select('*')
        .order('nombre_categoria', { ascending: true })

      if (error) return { exito: false, error: error.message }
      return { exito: true, categorias: data || [] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async crear(nombre) {
    try {
      const { data, error } = await insforgeClient.database
        .from('categorias_productos')
        .insert([{ nombre_categoria: nombre }])
        .select()

      if (error) return { exito: false, error: error.message }
      return { exito: true, categoria: data?.[0] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async actualizar(id, nombre) {
    try {
      const { data, error } = await insforgeClient.database
        .from('categorias_productos')
        .update({ nombre_categoria: nombre })
        .eq('id_categoria', id)
        .select()

      if (error) return { exito: false, error: error.message }
      return { exito: true, categoria: data?.[0] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async eliminar(id) {
    try {
      const { error } = await insforgeClient.database
        .from('categorias_productos')
        .delete()
        .eq('id_categoria', id)

      if (error) return { exito: false, error: error.message }
      return { exito: true }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  }
}