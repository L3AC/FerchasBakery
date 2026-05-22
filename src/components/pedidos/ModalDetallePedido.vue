<template>
  <ModalBase :titulo="`Pedido ${pedido.id_pedido.slice(0, 8)}...`" :subtitulo="`Registrado el ${fechaRegistro}`" ancho="4xl" padding-top="pt-8" @cerrar="emit('cerrar')">
    <div class="flex justify-end gap-2 mb-5">
      <select v-model="nuevoEstado" class="btn-principal text-sm border-2 border-ferchas-rosa">
        <option :value="pedido.estado_pedido" disabled>Cambiar estado</option>
        <option value="Preparando">Marcar como preparando</option>
        <option value="Entregado">Marcar como entregado</option>
        <option value="Cancelado">Cancelar pedido</option>
      </select>
    </div>

    <div class="grid grid-cols-3 gap-5">
      <div class="col-span-2 space-y-5">
        <div class="bg-white border-2 border-ferchas-cafe/10 rounded-lg p-5">
          <h3 class="font-titulo text-lg text-ferchas-vino mb-4">Estado del pedido</h3>
          <div class="flex items-center justify-between">
            <template v-for="(etapa, i) in estadoTimeline" :key="etapa.etapa">
              <div class="flex flex-col items-center flex-1">
                <div :class="['w-10 h-10 rounded-full flex items-center justify-center font-bold border-2',
                    etapa.completado ? 'bg-ferchas-exito text-white border-ferchas-exito' :
                    etapa.activo ? 'bg-ferchas-rosa text-white border-ferchas-rosa animate-pulse' :
                    'bg-ferchas-fondo-oscuro text-ferchas-cafe-claro border-ferchas-cafe/20']">
                  <Icono v-if="etapa.completado" nombre="exito" :tamano="18" />
                  <span v-else>{{ i + 1 }}</span>
                </div>
                <div :class="['text-xs mt-2', etapa.activo ? 'font-bold text-ferchas-vino' : etapa.completado ? 'font-bold text-ferchas-cafe' : 'text-ferchas-cafe-claro']">{{ etapa.etapa }}</div>
              </div>
              <div v-if="i < estadoTimeline.length - 1" :class="['flex-1 h-1 mx-2 rounded', estadoTimeline[i + 1].completado || etapa.completado ? 'bg-ferchas-exito' : 'bg-ferchas-cafe/15']" />
            </template>
          </div>
        </div>

        <div class="bg-white border-2 border-ferchas-cafe/10 rounded-lg overflow-hidden">
          <div class="px-5 py-3 bg-ferchas-rosa/10 border-b-2 border-ferchas-rosa/30">
            <h3 class="font-titulo text-lg text-ferchas-vino">Productos del pedido</h3>
          </div>
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-ferchas-fondo-oscuro text-ferchas-cafe">
                <th class="text-left py-2 px-4 font-semibold">Producto</th>
                <th class="text-center py-2 px-4 font-semibold">Cantidad</th>
                <th class="text-right py-2 px-4 font-semibold">Precio</th>
                <th class="text-right py-2 px-4 font-semibold">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in detalles" :key="p.id_detalle" class="border-b border-ferchas-cafe/10 last:border-0">
                <td class="py-3 px-4">
                  <div class="font-semibold text-ferchas-cafe">{{ p.productos?.nombre || 'Producto eliminado' }}</div>
                </td>
                <td class="py-3 px-4 text-center font-bold">{{ p.cantidad }}</td>
                <td class="py-3 px-4 text-right">${{ parseFloat(p.precio_unitario).toFixed(2) }}</td>
                <td class="py-3 px-4 text-right font-bold text-ferchas-vino">${{ parseFloat(p.subtotal).toFixed(2) }}</td>
              </tr>
              <tr v-if="detalles.length === 0">
                <td colspan="4" class="py-6 text-center text-ferchas-cafe-claro text-sm">Cargando detalles...</td>
              </tr>
            </tbody>
            <tfoot class="bg-ferchas-fondo">
              <tr>
                <td colspan="3" class="py-3 px-4 text-right font-bold text-ferchas-cafe">Total</td>
                <td class="py-3 px-4 text-right font-titulo text-2xl text-ferchas-vino">${{ parseFloat(pedido.total).toFixed(2) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div v-if="pedido.observaciones" class="bg-white border-2 border-ferchas-cafe/10 rounded-lg p-5">
          <h3 class="font-titulo text-lg text-ferchas-vino mb-2">Observaciones</h3>
          <p class="text-sm text-ferchas-cafe leading-relaxed">{{ pedido.observaciones }}</p>
        </div>
      </div>

      <div class="space-y-5">
        <div class="bg-white border-2 border-ferchas-rosa/30 rounded-lg p-5">
          <h3 class="font-titulo text-lg text-ferchas-vino mb-3">Cliente</h3>
          <div class="space-y-2 text-sm">
            <div class="font-bold text-ferchas-cafe text-base">{{ pedido.clientes?.nombre || 'Cliente eliminado' }}</div>
            <div class="text-ferchas-cafe-claro">{{ pedido.clientes?.telefono || '' }}</div>
            <div class="text-ferchas-cafe-claro">{{ pedido.clientes?.correo || '' }}</div>
          </div>
        </div>

        <div class="bg-white border-2 border-ferchas-cafe/10 rounded-lg p-5">
          <h3 class="font-titulo text-lg text-ferchas-vino mb-3">Información del pedido</h3>
          <dl class="space-y-2 text-sm">
            <div class="flex justify-between"><dt class="text-ferchas-cafe-claro">Tipo</dt><dd class="font-semibold text-ferchas-cafe">{{ pedido.tipo_pedido }}</dd></div>
            <div class="flex justify-between"><dt class="text-ferchas-cafe-claro">Método de pago</dt><dd class="font-semibold text-ferchas-cafe">{{ pedido.metodo_pago || '-' }}</dd></div>
            <div class="flex justify-between"><dt class="text-ferchas-cafe-claro">Fecha de pedido</dt><dd class="font-semibold text-ferchas-cafe">{{ formatearFecha(pedido.fecha_pedido) }}</dd></div>
            <div class="flex justify-between"><dt class="text-ferchas-cafe-claro">Fecha de entrega</dt><dd class="font-semibold text-ferchas-cafe">{{ pedido.fecha_entrega || '-' }}</dd></div>
          </dl>
        </div>
      </div>
    </div>
  </ModalBase>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import ModalBase from '../shared/ModalBase.vue'
import Icono from '../shared/Icono.vue'
import { useAlmacenPedidos } from '../../controllers/ControladorPedidos.js'

const props = defineProps({
  pedido: { type: Object, required: true }
})
const emit = defineEmits(['cerrar'])

const almacenPedidos = useAlmacenPedidos()
const nuevoEstado = ref(props.pedido.estado_pedido)
const detalles = ref([])

function formatearFecha(fecha) {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleString('es-MX')
}

const fechaRegistro = computed(() => formatearFecha(props.pedido.fecha_pedido))

const estadoTimeline = computed(() => {
  const estados = ['Pendiente', 'Preparando', 'Entregado']
  const estadoActual = props.pedido.estado_pedido
  const indiceActual = estados.indexOf(estadoActual) + 1

  return estados.map((e, i) => ({
    etapa: e,
    completado: i < indicesEstados.indexOf(estadoActual),
    activo: e === estadoActual
  }))
})

const indicesEstados = ['Pendiente', 'Preparando', 'Entregado', 'Cancelado']

onMounted(async () => {
  const res = await almacenPedidos.obtenerDetalles(props.pedido.id_pedido)
  if (res.exito) {
    detalles.value = almacenPedidos.detallesActuales
  }
})

watch(nuevoEstado, async (nuevo) => {
  if (nuevo !== props.pedido.estado_pedido) {
    await almacenPedidos.actualizarEstado(props.pedido.id_pedido, nuevo)
  }
})
</script>
