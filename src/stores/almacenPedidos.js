import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { servicioPedidos } from '../services/servicioPedidos.js'

export const useAlmacenPedidos = defineStore('pedidos', () => {
  const pedidos = ref([])
  const pedidoActual = ref(null)
  const detallesActuales = ref([])
  const cargando = ref(false)
  const error = ref(null)

  const pedidosPendientes = computed(() => {
    return pedidos.value.filter(p => p.estado_pedido === 'Pendiente')
  })

  const pedidosPreparando = computed(() => {
    return pedidos.value.filter(p => p.estado_pedido === 'Preparando')
  })

  const pedidosEntregados = computed(() => {
    return pedidos.value.filter(p => p.estado_pedido === 'Entregado')
  })

  async function obtenerTodos() {
    cargando.value = true
    error.value = null
    try {
      const resultado = await servicioPedidos.obtenerTodos()
      if (resultado.exito) {
        pedidos.value = resultado.pedidos
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

  async function obtenerPorId(idPedido) {
    cargando.value = true
    error.value = null
    try {
      const resultado = await servicioPedidos.obtenerPorId(idPedido)
      if (resultado.exito) {
        pedidoActual.value = resultado.pedido
        detallesActuales.value = resultado.pedido.detalles_pedido || []
        return { exito: true, pedido: resultado.pedido }
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
  },

  async function obtenerPendientes() {
    try {
      const resultado = await servicioPedidos.obtenerPendientes()
      if (resultado.exito) {
        return { exito: true, pedidos: resultado.pedidos }
      } else {
        error.value = resultado.error
        return { exito: false, error: resultado.error }
      }
    } catch (err) {
      error.value = err.message
      return { exito: false, error: err.message }
    }
  }

  async function registrarCompleto(datosPedido, detalles) {
    cargando.value = true
    error.value = null
    try {
      const resultado = await servicioPedidos.registrarPedidoCompleto(datosPedido, detalles)
      if (resultado.exito) {
        pedidos.value.unshift(resultado.pedido)
        return { exito: true, pedido: resultado.pedido }
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

  async function actualizarEstado(idPedido, nuevoEstado) {
    try {
      const resultado = await servicioPedidos.actualizarEstado(idPedido, nuevoEstado)
      if (resultado.exito) {
        const indice = pedidos.value.findIndex(p => p.id_pedido === idPedido)
        if (indice !== -1) {
          pedidos.value[indice] = resultado.pedido
        }
        if (pedidoActual.value?.id_pedido === idPedido) {
          pedidoActual.value.estado_pedido = nuevoEstado
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

  async function obtenerVentasDelDia() {
    try {
      const resultado = await servicioPedidos.obtenerVentasDelDia()
      if (resultado.exito) {
        return { exito: true, total: resultado.total }
      } else {
        return { exito: false, error: resultado.error, total: 0 }
      }
    } catch (err) {
      return { exito: false, error: err.message, total: 0 }
    }
  }

  function limpiarActual() {
    pedidoActual.value = null
    detallesActuales.value = []
  }

  return {
    pedidos,
    pedidoActual,
    detallesActuales,
    cargando,
    error,
    pedidosPendientes,
    pedidosPreparando,
    pedidosEntregados,
    obtenerTodos,
    obtenerPorId,
    obtenerPendientes,
    registrarCompleto,
    actualizarEstado,
    obtenerVentasDelDia,
    limpiarActual
  }
})
