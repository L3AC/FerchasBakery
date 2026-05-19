import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { servicioAutenticacion } from '../services/servicioAutenticacion.js'
import { servicioPerfiles } from '../services/servicioPerfiles.js'

export const useAlmacenAutenticacion = defineStore('autenticacion', () => {
  const usuario = ref(null)
  const perfil = ref(null)
  const token = ref(null)
  const cargando = ref(false)
  const error = ref(null)

  const estaAutenticado = computed(() => !!usuario.value && !!token.value)
  const esAdmin = computed(() => perfil.value?.rol === 'admin')
  const esEmpleado = computed(() => perfil.value?.rol === 'empleado')

  async function iniciarSesion(correo, contrasena) {
    cargando.value = true
    error.value = null
    try {
      const resultado = await servicioAutenticacion.iniciarSesion(correo, contrasena)
      if (resultado.exito) {
        usuario.value = resultado.usuario
        token.value = resultado.token

        // Obtener perfil del usuario
        const resultadoPerfil = await servicioPerfiles.obtenerPorUserId(resultado.usuario.id)
        if (resultadoPerfil.exito) {
          perfil.value = resultadoPerfil.perfil
        }

        return { exito: true }
      } else {
        error.value = resultado.error
        return { exito: false, error: resultado.error }
      }
    } catch (err) {
      error.value = err.message
      return { exito: false, error: err.message }
    } finally {
      cargando.value = false
    }
  }

  async function registrarse(correo, contrasena, nombre) {
    cargando.value = true
    error.value = null
    try {
      const resultado = await servicioAutenticacion.registrarse(correo, contrasena, nombre)
      if (resultado.exito) {
        // Crear perfil de empleado por defecto para nuevos usuarios
        await servicioPerfiles.crear({
          user_id: resultado.usuario.id,
          nombre: nombre,
          rol: 'empleado',
          activo: true
        })
        return { exito: true, requiereVerificacion: resultado.requiereVerificacion }
      } else {
        error.value = resultado.error
        return { exito: false, error: resultado.error }
      }
    } catch (err) {
      error.value = err.message
      return { exito: false, error: err.message }
    } finally {
      cargando.value = false
    }
  }

  async function cerrarSesion() {
    try {
      await servicioAutenticacion.cerrarSesion()
      usuario.value = null
      perfil.value = null
      token.value = null
      error.value = null
      return { exito: true }
    } catch (err) {
      error.value = err.message
      return { exito: false, error: err.message }
    }
  }

  async function obtenerUsuarioActual() {
    cargando.value = true
    try {
      const resultado = await servicioAutenticacion.obtenerUsuarioActual()
      if (resultado.exito && resultado.usuario) {
        usuario.value = resultado.usuario
        token.value = servicioAutenticacion.obtenerTokenGuardado()

        // Obtener perfil
        const resultadoPerfil = await servicioPerfiles.obtenerPorUserId(resultado.usuario.id)
        if (resultadoPerfil.exito) {
          perfil.value = resultadoPerfil.perfil
        }
      }
      return resultado
    } catch (err) {
      return { exito: false, error: err.message }
    } finally {
      cargando.value = false
    }
  }

  return {
    usuario,
    perfil,
    token,
    cargando,
    error,
    estaAutenticado,
    esAdmin,
    esEmpleado,
    iniciarSesion,
    registrarse,
    cerrarSesion,
    obtenerUsuarioActual
  }
})
