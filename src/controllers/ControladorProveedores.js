import { defineStore } from 'pinia'
import { ref } from 'vue'
import { servicioProveedores } from '../models/ModeloProveedores.js'

export const useAlmacenProveedores = defineStore('proveedores', () => {
  const proveedores = ref([])
  const cargando = ref(false)
  const error = ref(null)

  async function obtenerTodos() {
    cargando.value = true
    error.value = null
    try {
      const resultado = await servicioProveedores.obtenerTodos()
      if (resultado.exito) {
        proveedores.value = resultado.proveedores
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

  async function crear(datosProveedor) {
    try {
      const resultado = await servicioProveedores.crear(datosProveedor)
      if (resultado.exito) {
        proveedores.value.push(resultado.proveedor)
        return { exito: true, proveedor: resultado.proveedor }
      } else {
        error.value = resultado.error
        return { exito: false, error: resultado.error }
      }
    } catch (err) {
      error.value = err.message
      return { exito: false, error: err.message }
    }
  }

  async function actualizar(idProveedor, datosProveedor) {
    try {
      const resultado = await servicioProveedores.actualizar(idProveedor, datosProveedor)
      if (resultado.exito) {
        const indice = proveedores.value.findIndex(p => p.id_proveedor === idProveedor)
        if (indice !== -1) {
          proveedores.value[indice] = resultado.proveedor
        }
        return { exito: true, proveedor: resultado.proveedor }
      } else {
        error.value = resultado.error
        return { exito: false, error: resultado.error }
      }
    } catch (err) {
      error.value = err.message
      return { exito: false, error: err.message }
    }
  }

  async function eliminar(idProveedor) {
    try {
      const resultado = await servicioProveedores.eliminar(idProveedor)
      if (resultado.exito) {
        const indice = proveedores.value.findIndex(p => p.id_proveedor === idProveedor)
        if (indice !== -1) {
          proveedores.value.splice(indice, 1)
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
    proveedores,
    cargando,
    error,
    obtenerTodos,
    crear,
    actualizar,
    eliminar
  }
})
