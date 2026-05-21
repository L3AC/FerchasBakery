<template>
  <div class="min-h-screen bg-ferchas-fondo">
    <EncabezadoPrincipal />
    <div class="flex">
      <BarralateralPrincipal />
      <main class="flex-1 p-8">
        <h1 class="font-titulo text-3xl font-bold text-ferchas-cafe mb-8">Pedidos</h1>

        <!-- Botón Crear -->
        <div class="mb-6">
          <button @click="abrirNuevoPedido" class="btn-principal">+ Nuevo Pedido</button>
        </div>

        <!-- Filtros de Estado -->
        <div class="flex gap-3 mb-6">
          <button
            @click="filtroEstado = null"
            :class="[
              'px-4 py-2 rounded-lg font-semibold transition-colors',
              filtroEstado === null ? 'bg-ferchas-rosa text-white' : 'bg-white text-ferchas-cafe border-2 border-ferchas-cafe/20'
            ]"
          >
            Todos
          </button>
          <button
            @click="filtroEstado = 'Pendiente'"
            :class="[
              'px-4 py-2 rounded-lg font-semibold transition-colors',
              filtroEstado === 'Pendiente' ? 'bg-ferchas-rosa text-white' : 'bg-white text-ferchas-cafe border-2 border-ferchas-cafe/20'
            ]"
          >
            Pendientes
          </button>
          <button
            @click="filtroEstado = 'Preparando'"
            :class="[
              'px-4 py-2 rounded-lg font-semibold transition-colors',
              filtroEstado === 'Preparando' ? 'bg-ferchas-rosa text-white' : 'bg-white text-ferchas-cafe border-2 border-ferchas-cafe/20'
            ]"
          >
            Preparando
          </button>
          <button
            @click="filtroEstado = 'Entregado'"
            :class="[
              'px-4 py-2 rounded-lg font-semibold transition-colors',
              filtroEstado === 'Entregado' ? 'bg-ferchas-rosa text-white' : 'bg-white text-ferchas-cafe border-2 border-ferchas-cafe/20'
            ]"
          >
            Entregados
          </button>
        </div>

        <!-- Lista de Pedidos -->
        <div class="space-y-4">
          <div
            v-for="pedido in pedidosFiltrados"
            :key="pedido.id_pedido"
            class="card-base hover:shadow-lg transition-shadow cursor-pointer"
            @click="verDetalles(pedido)"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h3 class="font-titulo text-lg text-ferchas-cafe font-semibold">
                  {{ pedido.clientes?.nombre || 'Sin cliente' }}
                </h3>
                <p class="text-sm text-ferchas-cafe-claro">Pedido: {{ pedido.id_pedido.slice(0, 8) }}</p>
                <div class="flex gap-3 mt-2">
                  <span class="badge-info">{{ pedido.tipo_pedido }}</span>
                  <span :class="estadoBadge(pedido.estado_pedido)">{{ pedido.estado_pedido }}</span>
                </div>
              </div>
              <div class="text-right">
                <p class="text-2xl font-titulo text-ferchas-rosa">${{ parseFloat(pedido.total).toFixed(2) }}</p>
                <p class="text-xs text-ferchas-cafe-claro mt-1">{{ formatearFecha(pedido.fecha_pedido) }}</p>
              </div>
            </div>
          </div>

          <div v-if="pedidosFiltrados.length === 0" class="card-base text-center py-12">
            <p class="text-ferchas-cafe font-semibold">No hay pedidos</p>
          </div>
        </div>
      </main>
    </div>

    <!-- Modal Nuevo Pedido -->
    <div v-if="mostrarModalNuevo" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-lg max-w-2xl w-full p-8">
        <h2 class="font-titulo text-2xl text-ferchas-cafe mb-6">Nuevo Pedido</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-ferchas-cafe font-semibold mb-2">Cliente</label>
            <input
              v-model="nuevoPedido.clienteNombre"
              type="text"
              placeholder="Nombre del cliente"
              class="input-base"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-ferchas-cafe font-semibold mb-2">Tipo de Pedido</label>
              <select v-model="nuevoPedido.tipo_pedido" class="input-base">
                <option>Mostrador</option>
                <option>Encargo</option>
                <option>Domicilio</option>
              </select>
            </div>
            <div>
              <label class="block text-ferchas-cafe font-semibold mb-2">Método de Pago</label>
              <select v-model="nuevoPedido.metodo_pago" class="input-base">
                <option>Efectivo</option>
                <option>Transferencia</option>
                <option>Tarjeta</option>
              </select>
            </div>
          </div>

          <div class="bg-ferchas-fondo p-4 rounded-lg">
            <p class="text-sm text-ferchas-cafe-claro mb-2">Total del Pedido</p>
            <p class="font-titulo text-3xl text-ferchas-rosa">${{ nuevoPedido.total.toFixed(2) }}</p>
          </div>

          <div class="flex gap-3">
            <button @click="guardarPedido" class="btn-principal flex-1">Registrar Pedido</button>
            <button @click="cerrarModal" class="btn-secundario flex-1">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import EncabezadoPrincipal from '../components/shared/EncabezadoPrincipal.vue'
import BarralateralPrincipal from '../components/shared/BarralateralPrincipal.vue'
import { useAlmacenPedidos } from '../stores/almacenPedidos.js'
import { useAlmacenAutenticacion } from '../stores/almacenAutenticacion.js'

const almacenPedidos = useAlmacenPedidos()
const almacenAuth = useAlmacenAutenticacion()

const filtroEstado = ref(null)
const mostrarModalNuevo = ref(false)

const nuevoPedido = ref({
  clienteNombre: '',
  tipo_pedido: 'Mostrador',
  metodo_pago: 'Efectivo',
  total: 0
})

const pedidosFiltrados = computed(() => {
  if (!filtroEstado.value) return almacenPedidos.pedidos
  return almacenPedidos.pedidos.filter(p => p.estado_pedido === filtroEstado.value)
})

function estadoBadge(estado) {
  const badges = {
    'Pendiente': 'badge-advertencia',
    'Preparando': 'badge-info',
    'Entregado': 'badge-exito',
    'Cancelado': 'badge-error'
  }
  return badges[estado] || 'badge-info'
}

function formatearFecha(fecha) {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleDateString('es-CO')
}

function abrirNuevoPedido() {
  nuevoPedido.value = { clienteNombre: '', tipo_pedido: 'Mostrador', metodo_pago: 'Efectivo', total: 0 }
  mostrarModalNuevo.value = true
}

function cerrarModal() {
  mostrarModalNuevo.value = false
}

async function guardarPedido() {
  // Validaciones básicas
  if (!nuevoPedido.value.clienteNombre) {
    alert('Por favor ingresa el nombre del cliente')
    return
  }

  // Aquí iría la lógica real de guardar el pedido
  alert('Pedido registrado exitosamente')
  cerrarModal()
  await almacenPedidos.obtenerTodos()
}

function verDetalles(pedido) {
  // Aquí se abriría un modal con los detalles del pedido
  console.log('Ver detalles del pedido:', pedido)
}

onMounted(async () => {
  await almacenPedidos.obtenerTodos()
})
</script>
