import { insforgeClient } from '../lib/insforge.js'

export const servicioPerfiles = {
  async obtenerTodos() {
    try {
      const { data, error } = await insforgeClient.database
        .from('perfiles')
        .select('*')
        .order('nombre', { ascending: true })

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, perfiles: data || [] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async verificarExistencia() {
    try {
      const { data, error } = await insforgeClient.database
        .from('perfiles')
        .select('user_id')
        .limit(1)

      if (error) return { existenUsuarios: true }

      return { existenUsuarios: !!data && data.length > 0 }
    } catch (err) {
      return { existenUsuarios: true }
    }
  },

  async obtenerPorUserId(userId) {
    try {
      const { data, error } = await insforgeClient.database
        .from('perfiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, perfil: data }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async crear(datosPerfil) {
    try {
      const { data, error } = await insforgeClient.database
        .from('perfiles')
        .insert([datosPerfil])
        .select()

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, perfil: data?.[0] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async actualizar(userId, datosPerfil) {
    try {
      const { data, error } = await insforgeClient.database
        .from('perfiles')
        .update(datosPerfil)
        .eq('user_id', userId)
        .select()

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, perfil: data?.[0] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async cambiarRol(userId, nuevoRol) {
    try {
      const { data, error } = await insforgeClient.database
        .from('perfiles')
        .update({ rol: nuevoRol })
        .eq('user_id', userId)
        .select()

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, perfil: data?.[0] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async desactivar(userId) {
    try {
      const { data, error } = await insforgeClient.database
        .from('perfiles')
        .update({ activo: false })
        .eq('user_id', userId)
        .select()

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  }
}
