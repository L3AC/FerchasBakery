<template>
  <LayoutPanel>
    <div class="p-7">
      <div class="flex items-start justify-between mb-6">
        <div>
          <h1 class="font-titulo text-3xl text-ferchas-cafe">Pedidos</h1>
          <p class="text-sm text-ferchas-cafe-claro mt-1">{{ pedidos.length }} pedidos en total · {{ pedidos.filter(p => p.estado === 'pendiente').length }} pendientes</p>
        </div>
        <div class="flex gap-2">
          <button @click="mostrarErrorStock = true" class="btn-secundario text-sm" title="Demostración del modal de error de stock">
            Demo: error stock
          </button>
          <button @click="mostrarFormulario = true" class="btn-principal flex items-center gap-2">
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
              <th class="text-left py-3 px-4 font-bold">ID</th>
              <th class="text-left py-3 px-4 font-bold">Cliente</th>
              <th class="text-left py-3 px-4 font-bold">Fecha y hora</th>
              <th class="text-left py-3 px-4 font-bold">Tipo</th>
              <th class="text-left py-3 px-4 font-bold">Método</th>
              <th class="text-center py-3 px-4 font-bold">Items</th>
              <th class="text-right py-3 px-4 font-bold">Total</th>
              <th class="text-center py-3 px-4 font-bold">Estado</th>
              <th class="text-center py-3 px-4 font-bold">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in pedidosFiltrados" :key="p.id"
                class="border-b border-ferchas-cafe/10 last:border-0 hover:bg-ferchas-fondo transition-colors cursor-pointer"
                @click="mostrarDetalle = true">
              <td class="py-3 px-4 font-bold text-ferchas-vino">{{ p.id }}</td>
              <td class="py-3 px-4 font-semibold text-ferchas-cafe">{{ p.cliente }}</td>
              <td class="py-3 px-4 text-ferchas-cafe-claro">{{ p.fecha }}</td>
              <td class="py-3 px-4 text-ferchas-cafe">{{ p.tipo }}</td>
              <td class="py-3 px-4 text-ferchas-cafe">{{ p.metodo }}</td>
              <td class="py-3 px-4 text-center font-bold text-ferchas-cafe">{{ p.items }}</td>
              <td class="py-3 px-4 text-right font-bold text-ferchas-cafe">${{ p.total.toFixed(2) }}</td>
              <td class="py-3 px-4 text-center">
                <span :class="['px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider', `estado-${p.estado}`]">{{ p.estado }}</span>
              </td>
              <td class="py-3 px-4 text-center" @click.stop>
                <button @click="mostrarDetalle = true" class="text-ferchas-cafe-claro hover:text-ferchas-vino p-1.5 hover:bg-ferchas-fondo rounded">
                  <Icono nombre="ojo" :tamano="16" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ModalPedido v-if="mostrarFormulario" @cerrar="mostrarFormulario = false" @guardar="guardarPedido" />
    <ModalDetallePedido v-if="mostrarDetalle" @cerrar="mostrarDetalle = false" />
    <ModalErrorStock v-if="mostrarErrorStock" @cerrar="mostrarErrorStock = false"
                     @ajustar="mostrarErrorStock = false; mostrarFormulario = true" />
  </LayoutPanel>
</template>

<script setup>
import { ref, computed } from 'vue'
import LayoutPanel from '../components/shared/LayoutPanel.vue'
import Icono from '../components/shared/Icono.vue'
import ModalPedido from '../components/pedidos/ModalPedido.vue'
import ModalDetallePedido from '../components/pedidos/ModalDetallePedido.vue'
import ModalErrorStock from '../components/pedidos/ModalErrorStock.vue'
import { mockPedidos } from '../lib/datosMock.js'

// Versión real (descomentar cuando Insforge esté conectado):
// import { useAlmacenPedidos } from '../stores/almacenPedidos.js'
// const almacenPedidos = useAlmacenPedidos()
// onMounted(() => almacenPedidos.obtenerTodos())

const pedidos = mockPedidos
const filtroEstado = ref('todos')
const mostrarFormulario = ref(false)
const mostrarDetalle = ref(false)
const mostrarErrorStock = ref(false)

const estados = [
  { valor: 'todos',      etiqueta: 'Todos' },
  { valor: 'pendiente',  etiqueta: 'Pendientes' },
  { valor: 'preparando', etiqueta: 'Preparando' },
  { valor: 'entregado',  etiqueta: 'Entregados' },
  { valor: 'cancelado',  etiqueta: 'Cancelados' },
]

const pedidosFiltrados = computed(() =>
  filtroEstado.value === 'todos' ? pedidos : pedidos.filter(p => p.estado === filtroEstado.value)
)

function guardarPedido(formulario) {
  console.log('Guardar pedido (mock):', formulario)
  mostrarFormulario.value = false
}
</script>
