import { insforgeClient } from '../lib/insforge.js'

export const servicioProductos = {
  async obtenerTodos() {
    try {
      const { data, error } = await insforgeClient.database
        .from('productos')
        .select('*, categorias_productos(nombre_categoria), proveedores(nombre)')
        .eq('activo', true)
        .order('nombre', { ascending: true })

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, productos: data || [] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async obtenerPorId(idProducto) {
    try {
      const { data, error } = await insforgeClient.database
        .from('productos')
        .select('*, categorias_productos(nombre_categoria), proveedores(*)')
        .eq('id_producto', idProducto)
        .single()

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, producto: data }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async obtenerPorCategoria(idCategoria) {
    try {
      const { data, error } = await insforgeClient.database
        .from('productos')
        .select('*')
        .eq('id_categoria', idCategoria)
        .eq('activo', true)
        .order('nombre', { ascending: true })

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, productos: data || [] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async obtenerStockBajo(umbral = 10) {
    try {
      const { data, error } = await insforgeClient.database
        .from('productos')
        .select('*')
        .lt('stock_disponible', umbral)
        .eq('activo', true)
        .order('stock_disponible', { ascending: true })

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, productos: data || [] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async crear(datosProducto) {
    try {
      const { data, error } = await insforgeClient.database
        .from('productos')
        .insert([datosProducto])
        .select()

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, producto: data?.[0] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async actualizar(idProducto, datosProducto) {
    try {
      const { data, error } = await insforgeClient.database
        .from('productos')
        .update(datosProducto)
        .eq('id_producto', idProducto)
        .select()

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, producto: data?.[0] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async actualizarStock(idProducto, cantidad) {
    try {
      // Primero obtener el stock actual
      const { data: productoActual, error: errorObtener } = await insforgeClient.database
        .from('productos')
        .select('stock_disponible')
        .eq('id_producto', idProducto)
        .single()

      if (errorObtener || !productoActual) {
        return { exito: false, error: 'Producto no encontrado' }
      }

      const nuevoStock = Math.max(0, (productoActual.stock_disponible || 0) + cantidad)

      const { data, error } = await insforgeClient.database
        .from('productos')
        .update({ stock_disponible: nuevoStock })
        .eq('id_producto', idProducto)
        .select()

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, producto: data?.[0] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async desactivar(idProducto) {
    try {
      const { data, error } = await insforgeClient.database
        .from('productos')
        .update({ activo: false })
        .eq('id_producto', idProducto)
        .select()

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  },

  async buscar(termino) {
    try {
      const { data, error } = await insforgeClient.database
        .from('productos')
        .select('*')
        .eq('activo', true)
        .ilike('nombre', `%${termino}%`)
        .order('nombre', { ascending: true })

      if (error) {
        return { exito: false, error: error.message }
      }

      return { exito: true, productos: data || [] }
    } catch (err) {
      return { exito: false, error: err.message }
    }
  }
}
