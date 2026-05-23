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
        name: nombre,
        redirectTo: window.location.origin + '/login'
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

  async registrarPrimerUsuario(correo, contrasena, nombre) {
    try {
      const { data, error } = await insforgeClient.auth.signUp({
        email: correo,
        password: contrasena,
        name: nombre,
        redirectTo: window.location.origin + '/login'
      })

      if (error) return { exito: false, error: error.message }
      if (!data) return { exito: false, error: 'No se recibió respuesta del servidor' }

      if (data?.requireEmailVerification) {
        return {
          exito: true,
          requiereVerificacion: true,
          email: correo,
          usuario: { email: correo }
        }
      }

      if (data?.accessToken) localStorage.setItem('insforge_token', data.accessToken)

      await insforgeClient.database.rpc('crear_perfil', {
        p_email: correo, p_nombre: nombre, p_rol: 'admin'
      })

      return { exito: true, usuario: data?.user, token: data?.accessToken }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async verificarEmail(email, otp, nombre) {
    try {
      const { data, error } = await insforgeClient.auth.verifyEmail({ email: email.trim(), otp })
      if (error) return { exito: false, error: error.message }

      if (data?.accessToken) localStorage.setItem('insforge_token', data.accessToken)

      if (nombre) {
        const { error: rpcError } = await insforgeClient.database
          .rpc('crear_perfil', { p_email: email, p_nombre: nombre, p_rol: 'admin' })

        if (rpcError) console.error('Error creando perfil:', rpcError.message)
      }

      return { exito: true, usuario: data?.user, token: data?.accessToken }
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

  async registrarUsuario(correo, contrasena, nombre, rol) {
    try {
      const { data, error } = await insforgeClient.auth.signUp({
        email: correo,
        password: contrasena,
        name: nombre,
        redirectTo: window.location.origin + '/login'
      })

      if (error) return { exito: false, error: error.message }

      const { data: userId, error: rpcError } = await insforgeClient.database
        .rpc('crear_perfil', { p_email: correo, p_nombre: nombre, p_rol: rol })

      if (rpcError) return { exito: false, error: 'Error al crear perfil: ' + rpcError.message }

      return {
        exito: true,
        usuario: { id: userId, email: correo },
        requiereVerificacion: !!data?.requireEmailVerification
      }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async verificarEmailAdmin(email, otp) {
    try {
      const { data, error } = await insforgeClient.auth.verifyEmail({ email: email.trim(), otp })
      if (error) return { exito: false, error: error.message }
      return { exito: true }
    } catch (err) {
      return { exito: false, error: err.message }
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

   async cambiarContrasena(contrasenaNueva, contrasenaActual) {
     try {
       const { data, error } = await insforgeClient.auth.updateUser({
         password: contrasenaNueva
       })
       
       if (error) return { exito: false, error: error.message }
       return { exito: true, usuario: data?.user }
     } catch (err) {
       return { exito: false, error: err.message }
     }
   },

   obtenerTokenGuardado() {
     return localStorage.getItem('insforge_token')
   }
}