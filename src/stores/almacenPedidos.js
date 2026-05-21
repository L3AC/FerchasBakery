import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { servicioPedidos } from '../services/servicioPedidos.js'
import { servicioDetallesPedido } from '../services/servicioDetallesPedido.js'

export const useAlmacenPedidos = defineStore('pedidos', () => {
  const pedidos = ref([])
  const pedidoActivo = ref(null)
  const detallesActuales = ref([])
  const cargando = ref(false)
  const error = ref(null)

  const pedidosPendientes = computed(() => {
    return pedidos.value.filter(p => p.estado_pedido === 'Pendiente')
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

  async function obtenerDetalles(idPedido) {
    try {
      const resultado = await servicioDetallesPedido.obtenerPorPedido(idPedido)
      if (resultado.exito) {
        detallesActuales.value = resultado.detalles
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

  async function crear(datosPedido) {
    try {
      const resultado = await servicioPedidos.crear(datosPedido)
      if (resultado.exito) {
        pedidos.value.push(resultado.pedido)
        pedidoActivo.value = resultado.pedido
        return { exito: true, pedido: resultado.pedido }
      } else {
        error.value = resultado.error
        return { exito: false, error: resultado.error }
      }
    } catch (err) {
      error.value = err.message
      return { exito: false, error: err.message }
    }
  }

  async function agregarDetalle(datosDetalle) {
    try {
      const resultado = await servicioDetallesPedido.crear(datosDetalle)
      if (resultado.exito) {
        detallesActuales.value.push(resultado.detalle)
        return { exito: true, detalle: resultado.detalle }
      } else {
        error.value = resultado.error
        return { exito: false, error: resultado.error }
      }
    } catch (err) {
      error.value = err.message
      return { exito: false, error: err.message }
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
      return resultado
    } catch (err) {
      error.value = err.message
      return { exito: false, error: err.message, total: 0 }
    }
  }

  return {
    pedidos,
    pedidoActivo,
    detallesActuales,
    cargando,
    error,
    pedidosPendientes,
    obtenerTodos,
    obtenerDetalles,
    crear,
    agregarDetalle,
    actualizarEstado,
    obtenerVentasDelDia
  }
})
