import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { servicioProductos } from '../services/servicioProductos.js'
import { servicioCategorias } from '../services/servicioCategorias.js'

export const useAlmacenProductos = defineStore('productos', () => {
  const productos = ref([])
  const categorias = ref([])
  const productoSeleccionado = ref(null)
  const cargando = ref(false)
  const error = ref(null)
  const busqueda = ref('')

  const productosFiltrados = computed(() => {
    if (!busqueda.value) return productos.value
    return productos.value.filter(p =>
      p.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
    )
  })

  const productosStockBajo = computed(() => {
    return productos.value.filter(p => (p.stock_disponible || 0) < 10)
  })

  async function obtenerTodos() {
    cargando.value = true
    error.value = null
    try {
      const resultado = await servicioProductos.obtenerTodos()
      if (resultado.exito) {
        productos.value = resultado.productos
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

  async function obtenerCategorias() {
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
    }
  }

  async function crear(datosProducto) {
    try {
      const resultado = await servicioProductos.crear(datosProducto)
      if (resultado.exito) {
        productos.value.push(resultado.producto)
        return { exito: true, producto: resultado.producto }
      } else {
        error.value = resultado.error
        return { exito: false, error: resultado.error }
      }
    } catch (err) {
      error.value = err.message
      return { exito: false, error: err.message }
    }
  }

  async function actualizar(idProducto, datosProducto) {
    try {
      const resultado = await servicioProductos.actualizar(idProducto, datosProducto)
      if (resultado.exito) {
        const indice = productos.value.findIndex(p => p.id_producto === idProducto)
        if (indice !== -1) {
          productos.value[indice] = resultado.producto
        }
        return { exito: true, producto: resultado.producto }
      } else {
        error.value = resultado.error
        return { exito: false, error: resultado.error }
      }
    } catch (err) {
      error.value = err.message
      return { exito: false, error: err.message }
    }
  }

  async function actualizarStock(idProducto, cantidad) {
    try {
      const resultado = await servicioProductos.actualizarStock(idProducto, cantidad)
      if (resultado.exito) {
        const indice = productos.value.findIndex(p => p.id_producto === idProducto)
        if (indice !== -1) {
          productos.value[indice] = resultado.producto
        }
        return { exito: true, producto: resultado.producto }
      } else {
        error.value = resultado.error
        return { exito: false, error: resultado.error }
      }
    } catch (err) {
      error.value = err.message
      return { exito: false, error: err.message }
    }
  }

  async function desactivar(idProducto) {
    try {
      const resultado = await servicioProductos.desactivar(idProducto)
      if (resultado.exito) {
        const indice = productos.value.findIndex(p => p.id_producto === idProducto)
        if (indice !== -1) {
          productos.value.splice(indice, 1)
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

  function establecerBusqueda(termino) {
    busqueda.value = termino
  }

  return {
    productos,
    categorias,
    productoSeleccionado,
    cargando,
    error,
    busqueda,
    productosFiltrados,
    productosStockBajo,
    obtenerTodos,
    obtenerCategorias,
    crear,
    actualizar,
    actualizarStock,
    desactivar,
    establecerBusqueda
  }
})
