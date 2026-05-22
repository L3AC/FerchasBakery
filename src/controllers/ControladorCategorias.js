import { defineStore } from 'pinia'
import { ref } from 'vue'
import { servicioCategorias } from '../models/ModeloCategorias.js'

export const useAlmacenCategorias = defineStore('categorias', () => {
  const categorias = ref([])
  const cargando = ref(false)
  const error = ref(null)

  async function obtenerTodas() {
    cargando.value = true
    error.value = null
    try {
      const resultado = await servicioCategorias.obtenerTodas()
      if (resultado.exito) {
        categorias.value = resultado.categorias
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

  async function crear(nombre) {
    try {
      const resultado = await servicioCategorias.crear(nombre)
      if (resultado.exito) {
        categorias.value.push(resultado.categoria)
        return { exito: true, categoria: resultado.categoria }
      } else {
        error.value = resultado.error
        return { exito: false, error: resultado.error }
      }
    } catch (err) {
      error.value = err.message
      return { exito: false, error: err.message }
    }
  }

  async function actualizar(id, nombre) {
    try {
      const resultado = await servicioCategorias.actualizar(id, nombre)
      if (resultado.exito) {
        const indice = categorias.value.findIndex(c => c.id_categoria === id)
        if (indice !== -1) {
          categorias.value[indice] = resultado.categoria
        }
        return { exito: true, categoria: resultado.categoria }
      } else {
        error.value = resultado.error
        return { exito: false, error: resultado.error }
      }
    } catch (err) {
      error.value = err.message
      return { exito: false, error: err.message }
    }
  }

  async function eliminar(id) {
    try {
      const resultado = await servicioCategorias.eliminar(id)
      if (resultado.exito) {
        const indice = categorias.value.findIndex(c => c.id_categoria === id)
        if (indice !== -1) {
          categorias.value.splice(indice, 1)
        }
        return { exito: true }
      } else {
        error.value = resultado.error
        return { exito: false, error: resultado.error }
      }
    } catch (err) {
      error.value = err.message
      return { exito: false, error: err.message }
    }
  }

  return {
    categorias,
    cargando,
    error,
    obtenerTodas,
    crear,
    actualizar,
    eliminar
  }
})
