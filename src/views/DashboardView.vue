<template>
  <div class="flex min-h-screen bg-ferchas-fondo">
    <!-- Barra Lateral -->
    <BarralateralPrincipal />

    <!-- Contenido Principal -->
    <div class="flex-1 flex flex-col">
      <!-- Encabezado -->
      <EncabezadoPrincipal />

      <!-- Contenido -->
      <main class="flex-1 p-8 overflow-y-auto">
        <div class="max-w-7xl mx-auto">
          <!-- Título -->
          <h1 class="font-titulo text-4xl text-ferchas-cafe mb-8">Dashboard</h1>

          <!-- Grid de Tarjetas de Resumen -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <!-- Ventas del Día -->
            <div class="card-base">
              <div class="flex justify-between items-start mb-4">
                <h3 class="text-sm font-semibold text-ferchas-cafe-claro uppercase">Ventas del Día</h3>
                <span class="text-2xl">💰</span>
              </div>
              <p class="font-titulo text-3xl text-ferchas-rosa font-bold">
                ${{ ventasDelDia.toLocaleString('es-CO', { minimumFractionDigits: 2 }) }}
              </p>
              <p class="text-xs text-ferchas-cafe-claro mt-2">Actualizando...</p>
            </div>

            <!-- Pedidos Pendientes -->
            <div class="card-base">
              <div class="flex justify-between items-start mb-4">
                <h3 class="text-sm font-semibold text-ferchas-cafe-claro uppercase">Pendientes</h3>
                <span class="text-2xl">📋</span>
              </div>
              <p class="font-titulo text-3xl text-ferchas-cafe font-bold">
                {{ pedidosPendientes.length }}
              </p>
              <p class="text-xs text-ferchas-cafe-claro mt-2">Órdenes sin completar</p>
            </div>

            <!-- Stock Bajo -->
            <div class="card-base">
              <div class="flex justify-between items-start mb-4">
                <h3 class="text-sm font-semibold text-ferchas-cafe-claro uppercase">Stock Bajo</h3>
                <span class="text-2xl">⚠️</span>
              </div>
              <p class="font-titulo text-3xl text-ferchas-advertencia font-bold">
                {{ productosStockBajo.length }}
              </p>
              <p class="text-xs text-ferchas-cafe-claro mt-2">Productos por reponer</p>
            </div>

            <!-- Clientes Registrados -->
            <div class="card-base">
              <div class="flex justify-between items-start mb-4">
                <h3 class="text-sm font-semibold text-ferchas-cafe-claro uppercase">Clientes</h3>
                <span class="text-2xl">👥</span>
              </div>
              <p class="font-titulo text-3xl text-ferchas-exito font-bold">
                {{ totalClientes }}
              </p>
              <p class="text-xs text-ferchas-cafe-claro mt-2">Clientes activos</p>
            </div>
          </div>

          <!-- Sección de Productos Stock Bajo -->
          <div v-if="productosStockBajo.length > 0" class="card-base mb-8">
            <h2 class="font-titulo text-xl text-ferchas-cafe mb-4 flex items-center">
              <span class="text-2xl mr-2">⚠️</span> Productos con Stock Bajo
            </h2>
            <div class="overflow-x-auto">
              <table class="tabla-base w-full">
                <thead class="tabla-header">
                  <tr>
                    <th class="px-4 py-3 text-left">Producto</th>
                    <th class="px-4 py-3 text-center">Stock</th>
                    <th class="px-4 py-3 text-center">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="producto in productosStockBajo.slice(0, 5)" :key="producto.id_producto" class="tabla-fila border-b">
                    <td class="px-4 py-3">{{ producto.nombre }}</td>
                    <td class="px-4 py-3 text-center">
                      <span class="badge-advertencia">{{ producto.stock_disponible }} unidades</span>
                    </td>
                    <td class="px-4 py-3 text-center">${{ parseFloat(producto.precio).toFixed(2) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Sección de Pedidos Pendientes -->
          <div v-if="pedidosPendientes.length > 0" class="card-base">
            <h2 class="font-titulo text-xl text-ferchas-cafe mb-4 flex items-center">
              <span class="text-2xl mr-2">📋</span> Pedidos Pendientes
            </h2>
            <div class="overflow-x-auto">
              <table class="tabla-base w-full">
                <thead class="tabla-header">
                  <tr>
                    <th class="px-4 py-3 text-left">Cliente</th>
                    <th class="px-4 py-3 text-left">Tipo</th>
                    <th class="px-4 py-3 text-center">Total</th>
                    <th class="px-4 py-3 text-left">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="pedido in pedidosPendientes.slice(0, 5)" :key="pedido.id_pedido" class="tabla-fila border-b">
                    <td class="px-4 py-3 font-semibold">{{ pedido.clientes?.nombre || 'Sin cliente' }}</td>
                    <td class="px-4 py-3">
                      <span class="badge-info">{{ pedido.tipo_pedido }}</span>
                    </td>
                    <td class="px-4 py-3 text-center">${{ parseFloat(pedido.total).toFixed(2) }}</td>
                    <td class="px-4 py-3 text-sm text-ferchas-cafe-claro">
                      {{ formatearFecha(pedido.fecha_pedido) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Mensaje cuando todo está bien -->
          <div v-if="pedidosPendientes.length === 0 && productosStockBajo.length === 0" class="card-base text-center py-8">
            <p class="text-2xl mb-2">✨</p>
            <p class="text-ferchas-cafe font-semibold">¡Todo está en orden!</p>
            <p class="text-ferchas-cafe-claro text-sm mt-2">No hay pedidos pendientes ni productos con stock bajo</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import EncabezadoPrincipal from '../components/shared/EncabezadoPrincipal.vue'
import BarralateralPrincipal from '../components/shared/BarralateralPrincipal.vue'
import { useAlmacenProductos } from '../stores/almacenProductos.js'
import { useAlmacenPedidos } from '../stores/almacenPedidos.js'
import { useAlmacenClientes } from '../stores/almacenClientes.js'

const almacenProductos = useAlmacenProductos()
const almacenPedidos = useAlmacenPedidos()
const almacenClientes = useAlmacenClientes()

const ventasDelDia = ref(0)
const totalClientes = ref(0)

const productosStockBajo = ref([])
const pedidosPendientes = ref([])

function formatearFecha(fecha) {
  if (!fecha) return '-'
  const date = new Date(fecha)
  return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
}

onMounted(async () => {
  // Cargar productos
  await almacenProductos.obtenerTodos()
  productosStockBajo.value = almacenProductos.productosStockBajo

  // Cargar pedidos
  await almacenPedidos.obtenerTodos()
  pedidosPendientes.value = almacenPedidos.pedidosPendientes

  // Cargar clientes
  await almacenClientes.obtenerTodos()
  totalClientes.value = almacenClientes.clientes.length

  // Obtener ventas del día
  const resultadoVentas = await almacenPedidos.obtenerVentasDelDia()
  if (resultadoVentas.exito) {
    ventasDelDia.value = resultadoVentas.total
  }
})
</script>
