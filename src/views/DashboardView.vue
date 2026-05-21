<template>
  <LayoutPanel>
    <div class="p-7">
      <h1 class="font-titulo text-3xl text-ferchas-cafe">{{ saludo }}, {{ primerNombre }}</h1>
      <p class="text-sm text-ferchas-cafe-claro mt-1">Resumen del negocio para hoy, {{ fechaHoy }}.</p>

      <!-- KPIs -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div class="bg-white border-l-4 border-ferchas-rosa rounded-lg p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs uppercase font-bold tracking-wider text-ferchas-cafe-claro">Ventas del día</span>
            <span class="text-ferchas-rosa"><Icono nombre="dinero" :tamano="18" /></span>
          </div>
          <p class="font-titulo text-3xl text-ferchas-vino">${{ ventasDelDia.toFixed(2) }}</p>
          <p class="text-xs text-ferchas-cafe-claro mt-2">Pedidos entregados hoy</p>
        </div>

        <div class="bg-white border-l-4 border-ferchas-advertencia rounded-lg p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs uppercase font-bold tracking-wider text-ferchas-cafe-claro">Pedidos pendientes</span>
            <span class="text-ferchas-advertencia"><Icono nombre="reloj" :tamano="18" /></span>
          </div>
          <p class="font-titulo text-3xl text-ferchas-cafe">{{ cantidadPendientes }}</p>
          <p class="text-xs text-ferchas-cafe-claro mt-2">{{ cantidadPreparando }} en preparación</p>
        </div>

        <div class="bg-white border-l-4 border-ferchas-error rounded-lg p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs uppercase font-bold tracking-wider text-ferchas-cafe-claro">Stock bajo</span>
            <span class="text-ferchas-error"><Icono nombre="alerta" :tamano="18" /></span>
          </div>
          <p class="font-titulo text-3xl text-ferchas-cafe">{{ productosStockBajo.length }}</p>
          <p class="text-xs text-ferchas-error font-semibold mt-2">Productos críticos</p>
        </div>

        <div class="bg-white border-l-4 border-ferchas-exito rounded-lg p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs uppercase font-bold tracking-wider text-ferchas-cafe-claro">Clientes registrados</span>
            <span class="text-ferchas-exito"><Icono nombre="grupo" :tamano="18" /></span>
          </div>
          <p class="font-titulo text-3xl text-ferchas-cafe">{{ almacenClientes.clientes.length }}</p>
          <p class="text-xs text-ferchas-cafe-claro mt-2">Total en base de datos</p>
        </div>
      </div>

      <!-- Stock bajo + Pedidos recientes -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <!-- Productos con stock bajo -->
        <div class="bg-white rounded-lg shadow-sm border border-ferchas-cafe/10 overflow-hidden">
          <div class="px-5 py-4 border-b border-ferchas-cafe/10 flex items-center justify-between">
            <h2 class="font-titulo text-lg text-ferchas-cafe">Productos con stock bajo</h2>
            <router-link to="/productos" class="text-xs font-bold text-ferchas-rosa-oscuro uppercase tracking-wider hover:underline">
              Ver todos
            </router-link>
          </div>
          <div v-if="productosStockBajo.length === 0" class="p-8 text-center text-ferchas-cafe-claro text-sm">
            Sin productos con stock crítico
          </div>
          <div v-else>
            <div v-for="p in productosStockBajo.slice(0, 5)" :key="p.id_producto"
                 class="flex items-center justify-between px-5 py-3 border-b border-ferchas-cafe/10 last:border-0">
              <div>
                <div class="font-semibold text-ferchas-cafe">{{ p.nombre }}</div>
                <div class="text-xs text-ferchas-cafe-claro mt-0.5">
                  {{ p.categorias_productos?.nombre_categoria || 'Sin categoría' }}
                </div>
              </div>
              <div class="text-right">
                <div :class="['font-titulo text-2xl', p.stock_disponible < 3 ? 'text-ferchas-error' : 'text-ferchas-advertencia']">
                  {{ p.stock_disponible }}
                </div>
                <div class="text-[10px] uppercase tracking-wider text-ferchas-cafe-claro">unidades</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pedidos recientes -->
        <div class="bg-white rounded-lg shadow-sm border border-ferchas-cafe/10 overflow-hidden">
          <div class="px-5 py-4 border-b border-ferchas-cafe/10 flex items-center justify-between">
            <h2 class="font-titulo text-lg text-ferchas-cafe">Pedidos recientes</h2>
            <router-link to="/pedidos" class="text-xs font-bold text-ferchas-rosa-oscuro uppercase tracking-wider hover:underline">
              Ver todos
            </router-link>
          </div>
          <div v-if="pedidosRecientes.length === 0" class="p-8 text-center text-ferchas-cafe-claro text-sm">
            Sin pedidos recientes
          </div>
          <table v-else class="w-full text-sm">
            <thead>
              <tr class="bg-ferchas-fondo text-ferchas-cafe text-xs uppercase tracking-wider">
                <th class="text-left py-2 px-4 font-bold">Cliente</th>
                <th class="text-left py-2 px-4 font-bold">Tipo</th>
                <th class="text-left py-2 px-4 font-bold">Estado</th>
                <th class="text-right py-2 px-4 font-bold">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ped in pedidosRecientes.slice(0, 5)" :key="ped.id_pedido"
                  class="border-b border-ferchas-cafe/10 last:border-0">
                <td class="py-2 px-4">
                  <div class="font-semibold text-ferchas-cafe">{{ ped.clientes?.nombre || 'Cliente ocasional' }}</div>
                  <div class="text-xs text-ferchas-cafe-claro">{{ formatearHora(ped.fecha_pedido) }}</div>
                </td>
                <td class="py-2 px-4 text-ferchas-cafe">{{ ped.tipo_pedido }}</td>
                <td class="py-2 px-4">
                  <span :class="claseEstado(ped.estado_pedido)">{{ ped.estado_pedido }}</span>
                </td>
                <td class="py-2 px-4 text-right font-bold text-ferchas-vino">${{ parseFloat(ped.total).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </LayoutPanel>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import LayoutPanel from '../components/shared/LayoutPanel.vue'
import Icono from '../components/shared/Icono.vue'
import { useAlmacenAutenticacion } from '../stores/almacenAutenticacion.js'
import { useAlmacenProductos } from '../stores/almacenProductos.js'
import { useAlmacenPedidos } from '../stores/almacenPedidos.js'
import { useAlmacenClientes } from '../stores/almacenClientes.js'

const almacenAuth = useAlmacenAutenticacion()
const almacenProductos = useAlmacenProductos()
const almacenPedidos = useAlmacenPedidos()
const almacenClientes = useAlmacenClientes()

const ventasDelDia = ref(0)

const primerNombre = computed(() => {
  const n = almacenAuth.perfil?.nombre || ''
  return n.trim().split(/\s+/)[0] || 'Usuario'
})

const saludo = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
})

const fechaHoy = computed(() => {
  return new Date().toLocaleDateString('es-SV', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
})

const productosStockBajo = computed(() =>
  almacenProductos.productos
    .filter(p => (p.stock_disponible || 0) < 10)
    .sort((a, b) => (a.stock_disponible || 0) - (b.stock_disponible || 0))
)

const pedidosRecientes = computed(() =>
  [...almacenPedidos.pedidos].sort((a, b) =>
    new Date(b.fecha_pedido).getTime() - new Date(a.fecha_pedido).getTime()
  )
)

const cantidadPendientes = computed(() => almacenPedidos.pedidosPendientes.length)
const cantidadPreparando = computed(() => almacenPedidos.pedidosPreparando.length)

function formatearHora(iso) {
  if (!iso) return '-'
  const f = new Date(iso)
  if (isNaN(f.getTime())) return '-'
  return f.toLocaleString('es-SV', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function claseEstado(estado) {
  const base = 'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider'
  if (estado === 'Pendiente') return base + ' bg-ferchas-advertencia/30 text-ferchas-cafe'
  if (estado === 'Preparando') return base + ' bg-ferchas-rosa/40 text-ferchas-vino'
  if (estado === 'Entregado') return base + ' bg-ferchas-exito/30 text-ferchas-cafe'
  if (estado === 'Cancelado') return base + ' bg-ferchas-error/20 text-ferchas-error'
  return base + ' bg-ferchas-fondo text-ferchas-cafe-claro'
}

onMounted(async () => {
  await Promise.all([
    almacenProductos.obtenerTodos(),
    almacenPedidos.obtenerTodos(),
    almacenClientes.obtenerTodos(),
  ])
  // Calcular ventas del día: sumar totales de pedidos entregados hoy
  const hoy = new Date().toISOString().slice(0, 10)
  ventasDelDia.value = almacenPedidos.pedidos
    .filter(p => p.estado_pedido === 'Entregado' && (p.fecha_pedido || '').slice(0, 10) === hoy)
    .reduce((s, p) => s + parseFloat(p.total || 0), 0)
})
</script>
