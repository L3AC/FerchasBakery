<template>
  <LayoutPanel>
    <div class="p-7">
      <div class="flex items-start justify-between mb-6">
        <div>
          <h1 class="font-titulo text-3xl text-ferchas-cafe">Pedidos</h1>
          <p class="text-sm text-ferchas-cafe-claro mt-1">
            {{ almacenPedidos.pedidos.length }} pedidos en total · {{ almacenPedidos.pedidosPendientes.length }} pendientes
          </p>
        </div>
        <div class="flex gap-2">
          <button @click="abrirFormularioNuevo" class="btn-principal flex items-center gap-2">
            <Icono nombre="mas" :tamano="16" /> Nuevo pedido
          </button>
        </div>
      </div>

      <!-- Filtros por estado -->
      <div class="bg-white rounded-lg border border-ferchas-cafe/10 shadow-sm p-4 mb-6">
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs uppercase tracking-wider text-ferchas-cafe-claro font-bold mr-2">Filtrar por estado:</span>
          <button v-for="e in estados" :key="e.valor"
                  @click="filtroEstado = e.valor"
                  :class="['px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all',
                          filtroEstado === e.valor ? 'bg-ferchas-vino text-white border-ferchas-vino' : 'bg-white text-ferchas-cafe border-ferchas-cafe/20 hover:border-ferchas-vino']">
            {{ e.etiqueta }}
          </button>
        </div>
      </div>

      <!-- Cargando -->
      <div v-if="almacenPedidos.cargando" class="bg-white rounded-lg border border-ferchas-cafe/10 shadow-sm p-12 text-center">
        <p class="text-ferchas-cafe-claro">Cargando pedidos...</p>
      </div>

      <!-- Vacío -->
      <div v-else-if="pedidosFiltrados.length === 0" class="bg-white rounded-lg border border-ferchas-cafe/10 shadow-sm p-12 text-center">
        <p class="text-ferchas-cafe font-semibold">No hay pedidos que coincidan con el filtro</p>
      </div>

      <!-- Tabla -->
      <div v-else class="bg-white rounded-lg border border-ferchas-cafe/10 shadow-sm overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-ferchas-fondo-oscuro text-ferchas-cafe text-xs uppercase tracking-wider">
              <th class="text-left py-3 px-4 font-bold">ID</th>
              <th class="text-left py-3 px-4 font-bold">Cliente</th>
              <th class="text-left py-3 px-4 font-bold">Fecha y hora</th>
              <th class="text-left py-3 px-4 font-bold">Tipo</th>
              <th class="text-left py-3 px-4 font-bold">Método</th>
              <th class="text-right py-3 px-4 font-bold">Total</th>
              <th class="text-center py-3 px-4 font-bold">Estado</th>
              <th class="text-center py-3 px-4 font-bold">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in pedidosFiltrados" :key="p.id_pedido"
                class="border-b border-ferchas-cafe/10 last:border-0 hover:bg-ferchas-fondo transition-colors cursor-pointer"
                @click="verDetalle(p)">
              <td class="py-3 px-4 font-bold text-ferchas-vino">{{ idCorto(p.id_pedido) }}</td>
              <td class="py-3 px-4 font-semibold text-ferchas-cafe">{{ p.clientes?.nombre || 'Cliente ocasional' }}</td>
              <td class="py-3 px-4 text-ferchas-cafe-claro">{{ formatearFecha(p.fecha_pedido) }}</td>
              <td class="py-3 px-4 text-ferchas-cafe">{{ p.tipo_pedido }}</td>
              <td class="py-3 px-4 text-ferchas-cafe">{{ p.metodo_pago || '-' }}</td>
              <td class="py-3 px-4 text-right font-bold text-ferchas-cafe">${{ parseFloat(p.total).toFixed(2) }}</td>
              <td class="py-3 px-4 text-center">
                <span :class="claseEstado(p.estado_pedido)">{{ p.estado_pedido }}</span>
              </td>
              <td class="py-3 px-4 text-center" @click.stop>
                <button @click="verDetalle(p)" class="text-ferchas-cafe-claro hover:text-ferchas-vino p-1.5 hover:bg-ferchas-fondo rounded">
                  <Icono nombre="ojo" :tamano="16" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ModalPedido v-if="mostrarFormulario" @cerrar="mostrarFormulario = false" @guardar="guardarPedido" @stock-insuficiente="mostrarErrorStock = true" />
    <ModalDetallePedido v-if="mostrarDetalle && pedidoSeleccionado" :pedido="pedidoSeleccionado" @cerrar="cerrarDetalle" @cambiar-estado="cambiarEstado" />
    <ModalErrorStock v-if="mostrarErrorStock" @cerrar="mostrarErrorStock = false" @ajustar="mostrarErrorStock = false" />
  </LayoutPanel>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import LayoutPanel from '../components/shared/LayoutPanel.vue'
import Icono from '../components/shared/Icono.vue'
import ModalPedido from '../components/pedidos/ModalPedido.vue'
import ModalDetallePedido from '../components/pedidos/ModalDetallePedido.vue'
import ModalErrorStock from '../components/pedidos/ModalErrorStock.vue'
import { useAlmacenPedidos } from '../stores/almacenPedidos.js'

const almacenPedidos = useAlmacenPedidos()

const filtroEstado = ref('todos')
const mostrarFormulario = ref(false)
const mostrarDetalle = ref(false)
const mostrarErrorStock = ref(false)
const pedidoSeleccionado = ref(null)

const estados = [
  { valor: 'todos',      etiqueta: 'Todos' },
  { valor: 'Pendiente',  etiqueta: 'Pendientes' },
  { valor: 'Preparando', etiqueta: 'Preparando' },
  { valor: 'Entregado',  etiqueta: 'Entregados' },
  { valor: 'Cancelado',  etiqueta: 'Cancelados' },
]

const pedidosFiltrados = computed(() => {
  if (filtroEstado.value === 'todos') return almacenPedidos.pedidos
  return almacenPedidos.pedidos.filter(p => p.estado_pedido === filtroEstado.value)
})

function idCorto(uuid) {
  if (!uuid) return '-'
  return 'P-' + uuid.split('-')[0].toUpperCase().slice(0, 4)
}

function formatearFecha(iso) {
  if (!iso) return '-'
  const f = new Date(iso)
  if (isNaN(f.getTime())) return '-'
  return f.toLocaleString('es-SV', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function claseEstado(estado) {
  const base = 'px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider'
  if (estado === 'Pendiente') return base + ' bg-ferchas-advertencia/30 text-ferchas-cafe'
  if (estado === 'Preparando') return base + ' bg-ferchas-rosa/40 text-ferchas-vino'
  if (estado === 'Entregado') return base + ' bg-ferchas-exito/30 text-ferchas-cafe'
  if (estado === 'Cancelado') return base + ' bg-ferchas-error/20 text-ferchas-error'
  return base + ' bg-ferchas-fondo text-ferchas-cafe-claro'
}

function abrirFormularioNuevo() {
  mostrarFormulario.value = true
}

async function verDetalle(pedido) {
  // Cargar detalle completo (con detalles_pedido y productos)
  await almacenPedidos.obtenerPorId(pedido.id_pedido)
  pedidoSeleccionado.value = almacenPedidos.pedidoActual
  mostrarDetalle.value = true
}

function cerrarDetalle() {
  mostrarDetalle.value = false
  pedidoSeleccionado.value = null
  almacenPedidos.limpiarActual()
}

async function guardarPedido({ datosPedido, detalles }) {
  const resultado = await almacenPedidos.registrarCompleto(datosPedido, detalles)
  if (resultado.exito) {
    mostrarFormulario.value = false
    await almacenPedidos.obtenerTodos()
  } else {
    alert('Error al registrar pedido: ' + (resultado.error || 'desconocido'))
  }
}

async function cambiarEstado(nuevoEstado) {
  if (!pedidoSeleccionado.value) return
  await almacenPedidos.actualizarEstado(pedidoSeleccionado.value.id_pedido, nuevoEstado)
  cerrarDetalle()
}

onMounted(() => almacenPedidos.obtenerTodos())
</script>
