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

  async registrarPrimerUsuario(correo, contrasena, nombre) {
    try {
      console.log('📝 Iniciando registro con:', { correo, nombre })
      
      // 1. Registrar usuario en auth.users
      const respuesta = await insforgeClient.auth.signUp({
        email: correo,
        password: contrasena
      })
      
      console.log('=== RESPUESTA COMPLETA DE SIGNUP ===')
      console.log('Tipo de respuesta:', typeof respuesta)
      console.log('Respuesta completa:', respuesta)
      console.log('Keys de respuesta:', Object.keys(respuesta || {}))
      
      const { data: authData, error: authError } = respuesta
      
      console.log('data:', authData)
      console.log('error:', authError)
      console.log('====================================')
      
      if (authError) {
        console.error('❌ Error en signUp:', authError)
        return { exito: false, error: 'Error al registrar: ' + authError.message }
      }
      
      if (!authData) {
        console.error('❌ authData es null/undefined, respuesta completa:', respuesta)
        return { exito: false, error: 'No se recibió respuesta del servidor' }
      }

      // Intentar extraer ID de todas las posibilidades
      const userId = authData?.user?.id || authData?.id || authData?.uid || (typeof authData === 'string' ? authData : null)
      
      console.log('🔍 Buscando userId en authData:')
      console.log('  authData.user?.id:', authData?.user?.id)
      console.log('  authData.id:', authData?.id)
      console.log('  authData.uid:', authData?.uid)
      console.log('  userId final:', userId)

      if (!userId) {
        console.error('❌ No se encontró user ID')
        console.error('Estructura de authData:', JSON.stringify(authData, null, 2))
        return { exito: false, error: 'No se pudo obtener el ID del usuario.' }
      }

      console.log('✅ userId obtenido:', userId)

      // 2. Actualizar el perfil de Insforge con el nombre
      console.log('📋 Actualizando perfil Insforge...')
      const { error: profileError } = await insforgeClient.auth.setProfile({
        name: nombre
      })
      
      if (profileError) {
        console.warn('⚠️ Advertencia al actualizar perfil Insforge:', profileError.message)
      } else {
        console.log('✅ Perfil Insforge actualizado')
      }

      // 3. Crear perfil manualmente en la tabla perfiles
      console.log('🗄️ Creando perfil en BD...')
      const { error: perfilError } = await insforgeClient.database
        .from('perfiles')
        .insert([{
          user_id: userId,
          nombre: nombre,
          rol: 'admin',
          activo: true
        }])
      
      if (perfilError) {
        console.error('❌ Error al crear perfil en BD:', perfilError.message)
        return { exito: false, error: 'No se pudo crear el perfil: ' + perfilError.message }
      }

      console.log('✅ Perfil creado en BD exitosamente')

      // 4. Si requiere verificación de email, mostrar mensaje
      if (authData?.requireEmailVerification) {
        console.log('📧 Email verification requerida')
        return { 
          exito: true, 
          requiereVerificacion: true,
          email: correo,
          usuario: authData?.user
        }
      }

      // 5. Si no requiere verificación, iniciar sesión automáticamente
      console.log('🔓 No requiere verificación, iniciando sesión automáticamente')
      const { data: sessionData, error: sessionError } = await insforgeClient.auth.signInWithPassword({
        email: correo,
        password: contrasena
      })

      if (sessionError) {
        console.error('❌ Error al iniciar sesión:', sessionError)
        return { exito: false, error: 'Error al iniciar sesión: ' + sessionError.message }
      }
      
      if (sessionData?.accessToken) localStorage.setItem('insforge_token', sessionData.accessToken)

      console.log('✅ Login exitoso')
      return { exito: true, usuario: sessionData?.user, token: sessionData?.accessToken }
    } catch (err) {
      console.error('❌ Error en registrarPrimerUsuario:', err)
      console.error('Stack:', err.stack)
      return { exito: false, error: 'Error inesperado: ' + err.message }
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