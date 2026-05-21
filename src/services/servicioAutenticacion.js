import { insforgeClient } from '../lib/insforge.js'

export const servicioAutenticacion = {
  async iniciarSesion(correo, contrasena) {
    try {
      const { data, error } = await insforgeClient.auth.signInWithPassword({
        email: correo,
        password: contrasena
      })
      
      if (error) return { exito: false, error: error.message }
      if (data?.accessToken) localStorage.setItem('insforge_token', data.accessToken)
      
      return { exito: true, usuario: data?.user, token: data?.accessToken }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async registrarse(correo, contrasena, nombre) {
    try {
      const { data, error } = await insforgeClient.auth.signUp({
        email: correo,
        password: contrasena,
        name: nombre
      })
      
      if (error) return { exito: false, error: error.message }
      
      return { 
        exito: true, 
        usuario: data?.user,
        requiereVerificacion: data?.requireEmailVerification || false 
      }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async verificarEmail(email, otp) {
    try {
      const { data, error } = await insforgeClient.auth.verifyEmail({ email, otp })
      if (error) return { exito: false, error: error.message }
      if (data?.accessToken) localStorage.setItem('insforge_token', data.accessToken)
      return { exito: true, usuario: data?.user }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async reenviarVerificacion(email) {
    try {
      const { data, error } = await insforgeClient.auth.resendVerificationEmail({ email })
      if (error) return { exito: false, error: error.message }
      return { exito: true }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async obtenerUsuarioActual() {
    try {
      const { data, error } = await insforgeClient.auth.getCurrentUser()
      if (error || !data?.user) return { exito: false, usuario: null }
      return { exito: true, usuario: data.user }
    } catch (err) {
      return { exito: false, usuario: null }
    }
  },

  async cerrarSesion() {
    try {
      await insforgeClient.auth.signOut()
      localStorage.removeItem('insforge_token')
      return { exito: true }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  obtenerTokenGuardado() {
    return localStorage.getItem('insforge_token')
  }
}