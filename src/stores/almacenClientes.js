import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { servicioClientes } from '../services/servicioClientes.js'

export const useAlmacenClientes = defineStore('clientes', () => {
  const clientes = ref([])
  const clienteSeleccionado = ref(null)
  const cargando = ref(false)
  const error = ref(null)
  const busqueda = ref('')

  const clientesFiltrados = computed(() => {
    if (!busqueda.value) return clientes.value
    return clientes.value.filter(c =>
      c.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      (c.telefono && c.telefono.includes(busqueda.value)) ||
      (c.correo && c.correo.toLowerCase().includes(busqueda.value.toLowerCase()))
    )
  })

  async function obtenerTodos() {
    cargando.value = true
    error.value = null
    try {
      const resultado = await servicioClientes.obtenerTodos()
      if (resultado.exito) {
        clientes.value = resultado.clientes
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

  async function obtenerPorId(idCliente) {
    try {
      const resultado = await servicioClientes.obtenerPorId(idCliente)
      if (resultado.exito) {
        clienteSeleccionado.value = resultado.cliente
        return { exito: true, cliente: resultado.cliente }
      } else {
        error.value = resultado.error
        return { exito: false, error: resultado.error }
      }
    } catch (err) {
      error.value = err.message
      return { exito: false, error: err.message }
    }
  }

  async function crear(datosCliente) {
    try {
      const resultado = await servicioClientes.crear(datosCliente)
      if (resultado.exito) {
        clientes.value.push(resultado.cliente)
        return { exito: true, cliente: resultado.cliente }
      } else {
        error.value = resultado.error
        return { exito: false, error: resultado.error }
      }
    } catch (err) {
      error.value = err.message
      return { exito: false, error: err.message }
    }
  }

  async function actualizar(idCliente, datosCliente) {
    try {
      const resultado = await servicioClientes.actualizar(idCliente, datosCliente)
      if (resultado.exito) {
        const indice = clientes.value.findIndex(c => c.id_cliente === idCliente)
        if (indice !== -1) {
          clientes.value[indice] = resultado.cliente
        }
        if (clienteSeleccionado.value?.id_cliente === idCliente) {
          clienteSeleccionado.value = resultado.cliente
        }
        return { exito: true, cliente: resultado.cliente }
      } else {
        error.value = resultado.error
        return { exito: false, error: resultado.error }
      }
    } catch (err) {
      error.value = err.message
      return { exito: false, error: err.message }
    }
  }

  async function buscar(termino) {
    try {
      const resultado = await servicioClientes.buscar(termino)
      if (resultado.exito) {
        return { exito: true, clientes: resultado.clientes }
      } else {
        error.value = resultado.error
        return { exito: false, error: resultado.error }
      }
    } catch (err) {
      error.value = err.message
      return { exito: false, error: err.message }
    }
  }

  function establecerBusqueda(termino) {
    busqueda.value = termino
  }

  return {
    clientes,
    clienteSeleccionado,
    cargando,
    error,
    busqueda,
    clientesFiltrados,
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    buscar,
    establecerBusqueda
  }
})
