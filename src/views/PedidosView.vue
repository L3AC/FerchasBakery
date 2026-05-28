<template>
  <LayoutPanel>
    <div class="p-7">
      <div class="flex items-start justify-between mb-6">
        <div>
          <h1 class="font-titulo text-3xl text-ferchas-cafe">Pedidos</h1>
          <p class="text-sm text-ferchas-cafe-claro mt-1">{{ pedidos.length }} pedidos en total · {{ pedidos.filter(p => p.estado === 'Pendiente').length }} pendientes</p>
        </div>
        <div class="flex gap-2">
          <button @click="abrirNuevoPedido" class="btn-principal flex items-center gap-2">
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

      <!-- Tabla -->
      <div class="bg-white rounded-lg border border-ferchas-cafe/10 shadow-sm overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-ferchas-fondo-oscuro text-ferchas-cafe text-xs uppercase tracking-wider">
              <th class="text-left py-3 px-4 font-bold">Pedido</th>
              <th class="text-left py-3 px-4 font-bold">Cliente</th>
              <th class="text-left py-3 px-4 font-bold">Fecha y hora</th>
              <th class="text-left py-3 px-4 font-bold">Tipo</th>
              <th class="text-left py-3 px-4 font-bold">Método</th>
              <th class="text-right py-3 px-4 font-bold">Total</th>
              <th class="text-center py-3 px-4 font-bold">Estado</th>
              <th class="text-center py-3 px-4 font-bold">Acción</th>
            </tr>
          </thead>
          <TransitionGroup name="fila-pedido" tag="tbody">
            <tr v-for="p in pedidosFiltrados" :key="p.id_pedido"
                class="border-b border-ferchas-cafe/10 last:border-0 hover:bg-ferchas-fondo transition-colors">
              <td class="py-3 px-4 font-bold text-ferchas-vino text-xs">{{ p.id_pedido.slice(0, 8) }}...</td>
              <td class="py-3 px-4 font-semibold text-ferchas-cafe">{{ p.cliente }}</td>
              <td class="py-3 px-4 text-ferchas-cafe-claro">{{ p.fecha }}</td>
              <td class="py-3 px-4 text-ferchas-cafe">{{ p.tipo }}</td>
              <td class="py-3 px-4 text-ferchas-cafe">{{ p.metodo }}</td>
              <td class="py-3 px-4 text-right font-bold text-ferchas-cafe">${{ p.total.toFixed(2) }}</td>
              <td class="py-3 px-4 text-center">
                <span :class="['px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-500', `estado-${p.estado}`]">{{ p.estado }}</span>
              </td>
              <td class="py-3 px-4 text-center" @click.stop>
                <div class="flex items-center justify-center gap-1">
                  <button @click="abrirEditarPedido(p)" title="Editar pedido"
                          class="text-ferchas-cafe-claro hover:text-ferchas-vino p-1.5 hover:bg-ferchas-fondo rounded transition-colors">
                    <Icono nombre="editar" :tamano="15" />
                  </button>
                  <div class="relative" @click.stop>
                    <button @click="toggleEstadoDropdown(p.id_pedido)" title="Cambiar estado"
                            class="text-ferchas-cafe-claro hover:text-ferchas-exito p-1.5 hover:bg-ferchas-fondo rounded transition-colors">
                      <Icono nombre="estado" :tamano="15" />
                    </button>
                    <div v-if="dropdownEstadoAbierto === p.id_pedido"
                         class="absolute right-0 top-full mt-1 z-10 bg-white border-2 border-ferchas-cafe/20 rounded-lg shadow-lg min-w-[160px] overflow-hidden">
                      <button v-for="e in opcionesEstado" :key="e"
                              @click="cambiarEstado(p, e)"
                              :disabled="e === p.estado"
                              :class="['w-full text-left px-4 py-2 text-sm transition-colors',
                                       e === p.estado ? 'text-ferchas-cafe-claro bg-ferchas-fondo cursor-not-allowed' : 'text-ferchas-cafe hover:bg-ferchas-fondo']">
                        <span v-if="e === p.estado">✓ </span>{{ e }}
                      </button>
                    </div>
                  </div>
                  <button @click="verDetalle(p)" title="Ver detalle"
                          class="text-ferchas-cafe-claro hover:text-ferchas-vino p-1.5 hover:bg-ferchas-fondo rounded transition-colors">
                    <Icono nombre="ojo" :tamano="15" />
                  </button>
                </div>
              </td>
            </tr>
          </TransitionGroup>
        </table>
      </div>
    </div>

    <ModalPedido v-if="mostrarFormulario" :pedido="pedidoEditando" @cerrar="cerrarModalPedido" @guardar="guardarPedido" />
    <ModalDetallePedido v-if="mostrarDetalle && pedidoSeleccionado" :pedido="pedidoSeleccionado" @cerrar="mostrarDetalle = false" />
  </LayoutPanel>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import LayoutPanel from '../components/shared/LayoutPanel.vue'
import Icono from '../components/shared/Icono.vue'
import ModalPedido from '../components/pedidos/ModalPedido.vue'
import ModalDetallePedido from '../components/pedidos/ModalDetallePedido.vue'
import { useAlmacenPedidos } from '../controllers/ControladorPedidos.js'
import { useAlmacenAutenticacion } from '../controllers/ControladorAutenticacion.js'
import { servicioPedidos } from '../models/ModeloPedidos.js'

const almacenPedidos = useAlmacenPedidos()
const almacenAuth = useAlmacenAutenticacion()

const filtroEstado = ref('todos')
const mostrarFormulario = ref(false)
const mostrarDetalle = ref(false)
const pedidoSeleccionado = ref(null)
const pedidoEditando = ref(null)
const dropdownEstadoAbierto = ref(null)

function cerrarDropdownGlobal(e) {
  if (dropdownEstadoAbierto.value) {
    dropdownEstadoAbierto.value = null
  }
}

onMounted(() => document.addEventListener('click', cerrarDropdownGlobal))
onUnmounted(() => document.removeEventListener('click', cerrarDropdownGlobal))

const estados = [
  { valor: 'todos',      etiqueta: 'Todos' },
  { valor: 'Pendiente',  etiqueta: 'Pendientes' },
  { valor: 'Preparando', etiqueta: 'Preparando' },
  { valor: 'Entregado',  etiqueta: 'Entregados' },
  { valor: 'Cancelado',  etiqueta: 'Cancelados' },
]

const opcionesEstado = ['Pendiente', 'Preparando', 'Entregado', 'Cancelado']

function formatearFecha(fecha) {
  if (!fecha) return '-'
  const d = new Date(fecha)
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const pedidos = computed(() => {
  return almacenPedidos.pedidos.map(p => ({
    ...p,
    cliente: p.clientes?.nombre || 'Cliente eliminado',
    fecha: formatearFecha(p.fecha_pedido),
    tipo: p.tipo_pedido,
    metodo: p.metodo_pago || '-',
    estado: p.estado_pedido,
  }))
})

const pedidosFiltrados = computed(() =>
  filtroEstado.value === 'todos' ? pedidos.value : pedidos.value.filter(p => p.estado === filtroEstado.value)
)

function abrirNuevoPedido() {
  pedidoEditando.value = null
  mostrarFormulario.value = true
}

function abrirEditarPedido(pedido) {
  pedidoEditando.value = pedido
  mostrarFormulario.value = true
}

function cerrarModalPedido() {
  mostrarFormulario.value = false
  pedidoEditando.value = null
}

function toggleEstadoDropdown(idPedido) {
  dropdownEstadoAbierto.value = dropdownEstadoAbierto.value === idPedido ? null : idPedido
}

async function cambiarEstado(pedido, nuevoEstado) {
  dropdownEstadoAbierto.value = null
  if (nuevoEstado === pedido.estado) return
  const resultado = await almacenPedidos.actualizarEstado(pedido.id_pedido, nuevoEstado)
  if (resultado.exito) {
    await almacenPedidos.obtenerTodos()
  }
}

function verDetalle(pedido) {
  pedidoSeleccionado.value = pedido
  mostrarDetalle.value = true
}

async function guardarPedido(formulario) {
  let resultado

  if (formulario.id_pedido) {
    // Editar pedido existente
    resultado = await servicioPedidos.actualizarPedidoCompleto(
      formulario.id_pedido,
      {
        id_cliente: formulario.id_cliente,
        tipo_pedido: formulario.tipo_pedido,
        metodo_pago: formulario.metodo_pago,
        fecha_entrega: formulario.fecha_entrega || null,
        observaciones: formulario.observaciones || null,
        total: formulario.total
      },
      formulario.productos
    )
  } else {
    // Crear pedido nuevo
    resultado = await servicioPedidos.registrarPedidoCompleto({
      id_cliente: formulario.id_cliente,
      user_id: almacenAuth.usuario?.id || null,
      tipo_pedido: formulario.tipo_pedido,
      estado_pedido: 'Pendiente',
      metodo_pago: formulario.metodo_pago,
      fecha_entrega: formulario.fecha_entrega || null,
      observaciones: formulario.observaciones || null,
      total: formulario.total
    }, formulario.productos)
  }

  if (resultado.exito) {
    mostrarFormulario.value = false
    pedidoEditando.value = null
    await almacenPedidos.obtenerTodos()
  } else {
    alert(resultado.error)
  }
}

onMounted(async () => {
  await almacenPedidos.obtenerTodos()
})
</script>

<style scoped>
.fila-pedido-enter-active,
.fila-pedido-leave-active {
  transition: all 0.4s ease;
}
.fila-pedido-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.fila-pedido-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
.fila-pedido-move {
  transition: transform 0.4s ease;
}
</style>
