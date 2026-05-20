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
        await cargarPerfil()
        return { exito: true }
      }
      error.value = resultado.error
      return { exito: false, error: resultado.error }
    } catch (err) {
      error.value = err.message
      return { exito: false, error: err.message }
    } finally {
      cargando.value = false
    }
  }

  async function cargarPerfil() {
    if (!usuario.value?.id) return
    const resultado = await servicioPerfiles.obtenerPorUserId(usuario.value.id)
    if (resultado.exito) perfil.value = resultado.perfil
  }

  async function cerrarSesion() {
    await servicioAutenticacion.cerrarSesion()
    usuario.value = null
    perfil.value = null
    token.value = null
    return { exito: true }
  }

  async function obtenerUsuarioActual() {
    cargando.value = true
    try {
      const resultado = await servicioAutenticacion.obtenerUsuarioActual()
      if (resultado.exito && resultado.usuario) {
        usuario.value = resultado.usuario
        token.value = servicioAutenticacion.obtenerTokenGuardado()
        await cargarPerfil()
      }
      return resultado
    } finally {
      cargando.value = false
    }
  }

  return {
    usuario, perfil, token, cargando, error,
    estaAutenticado, esAdmin, esEmpleado,
    iniciarSesion, cerrarSesion, obtenerUsuarioActual
  }
})