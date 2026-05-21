<template>
  <ModalBase :titulo="`Pedido ${idCorto}`" :subtitulo="subtitulo" ancho="4xl" padding-top="pt-8" @cerrar="$emit('cerrar')">
    <div class="flex justify-end gap-2 mb-5">
      <button @click="imprimir" class="btn-secundario py-2">Imprimir</button>
      <select v-model="cambioEstado" @change="emitirCambioEstado" class="btn-principal text-sm border-2 border-ferchas-rosa">
        <option value="">Cambiar estado</option>
        <option value="Pendiente">Marcar pendiente</option>
        <option value="Preparando">Marcar en preparación</option>
        <option value="Entregado">Marcar entregado</option>
        <option value="Cancelado">Cancelar pedido</option>
      </select>
    </div>

    <div class="grid grid-cols-3 gap-5">
      <div class="col-span-2 space-y-5">
        <!-- Timeline -->
        <div class="bg-white border-2 border-ferchas-cafe/10 rounded-lg p-5">
          <h3 class="font-titulo text-lg text-ferchas-vino mb-4">Estado del pedido</h3>
          <div class="flex items-center justify-between">
            <template v-for="(etapa, i) in timeline" :key="etapa.nombre">
              <div class="flex flex-col items-center flex-1">
                <div :class="['w-10 h-10 rounded-full flex items-center justify-center font-bold border-2',
                    etapa.estado === 'completado' ? 'bg-ferchas-exito text-white border-ferchas-exito' :
                    etapa.estado === 'activo' ? 'bg-ferchas-rosa text-white border-ferchas-rosa animate-pulse' :
                    'bg-ferchas-fondo-oscuro text-ferchas-cafe-claro border-ferchas-cafe/20']">
                  <Icono v-if="etapa.estado === 'completado'" nombre="exito" :tamano="18" />
                  <span v-else>{{ i + 1 }}</span>
                </div>
                <div :class="['text-xs mt-2', etapa.estado === 'activo' ? 'font-bold text-ferchas-vino' : etapa.estado === 'completado' ? 'font-bold text-ferchas-cafe' : 'text-ferchas-cafe-claro']">
                  {{ etapa.nombre }}
                </div>
              </div>
              <div v-if="i < timeline.length - 1" :class="['flex-1 h-1', timeline[i + 1].estado !== 'pendiente' ? 'bg-ferchas-exito' : 'bg-ferchas-cafe/15']" />
            </template>
          </div>
        </div>

        <!-- Productos -->
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
              <tr v-for="d in detalles" :key="d.id_detalle" class="border-b border-ferchas-cafe/10 last:border-0">
                <td class="py-3 px-4">
                  <div class="font-semibold text-ferchas-cafe">{{ d.productos?.nombre || 'Producto eliminado' }}</div>
                  <div v-if="d.productos?.descripcion" class="text-xs text-ferchas-cafe-claro mt-0.5">{{ d.productos.descripcion }}</div>
                </td>
                <td class="py-3 px-4 text-center font-bold">{{ d.cantidad }}</td>
                <td class="py-3 px-4 text-right">${{ parseFloat(d.precio_unitario).toFixed(2) }}</td>
                <td class="py-3 px-4 text-right font-bold text-ferchas-vino">
                  ${{ parseFloat(d.subtotal || (d.cantidad * d.precio_unitario)).toFixed(2) }}
                </td>
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

      <!-- Lateral -->
      <div class="space-y-5">
        <div class="bg-white border-2 border-ferchas-rosa/30 rounded-lg p-5">
          <h3 class="font-titulo text-lg text-ferchas-vino mb-3">Cliente</h3>
          <div v-if="pedido.clientes" class="space-y-2 text-sm">
            <div class="font-bold text-ferchas-cafe text-base">{{ pedido.clientes.nombre }}</div>
            <div v-if="pedido.clientes.telefono" class="text-ferchas-cafe-claro">{{ pedido.clientes.telefono }}</div>
            <div v-if="pedido.clientes.correo" class="text-ferchas-cafe-claro">{{ pedido.clientes.correo }}</div>
            <div v-if="pedido.clientes.direccion" class="text-ferchas-cafe-claro leading-snug">{{ pedido.clientes.direccion }}</div>
          </div>
          <p v-else class="text-sm text-ferchas-cafe-claro italic">Cliente ocasional (sin registrar)</p>
        </div>

        <div class="bg-white border-2 border-ferchas-cafe/10 rounded-lg p-5">
          <h3 class="font-titulo text-lg text-ferchas-vino mb-3">Información del pedido</h3>
          <dl class="space-y-2 text-sm">
            <div class="flex justify-between"><dt class="text-ferchas-cafe-claro">Tipo</dt><dd class="font-semibold text-ferchas-cafe">{{ pedido.tipo_pedido }}</dd></div>
            <div class="flex justify-between"><dt class="text-ferchas-cafe-claro">Método de pago</dt><dd class="font-semibold text-ferchas-cafe">{{ pedido.metodo_pago || '-' }}</dd></div>
            <div class="flex justify-between"><dt class="text-ferchas-cafe-claro">Fecha de pedido</dt><dd class="font-semibold text-ferchas-cafe">{{ formatearFecha(pedido.fecha_pedido) }}</dd></div>
            <div class="flex justify-between"><dt class="text-ferchas-cafe-claro">Fecha de entrega</dt><dd class="font-semibold text-ferchas-cafe">{{ formatearFecha(pedido.fecha_entrega) || '-' }}</dd></div>
            <div v-if="pedido.perfiles" class="flex justify-between"><dt class="text-ferchas-cafe-claro">Registró</dt><dd class="font-semibold text-ferchas-cafe">{{ pedido.perfiles.nombre }}</dd></div>
          </dl>
        </div>
      </div>
    </div>
  </ModalBase>
</template>

<script setup>
import { ref, computed } from 'vue'
import ModalBase from '../shared/ModalBase.vue'
import Icono from '../shared/Icono.vue'

const props = defineProps({
  pedido: { type: Object, required: true }
})
const emit = defineEmits(['cerrar', 'cambiar-estado'])

const cambioEstado = ref('')

const idCorto = computed(() => {
  const id = props.pedido.id_pedido || ''
  return 'P-' + id.split('-')[0].toUpperCase().slice(0, 4)
})

const subtitulo = computed(() => {
  const f = formatearFecha(props.pedido.fecha_pedido)
  const por = props.pedido.perfiles?.nombre ? ` por ${props.pedido.perfiles.nombre}` : ''
  return `Registrado el ${f}${por}`
})

const detalles = computed(() => props.pedido.detalles_pedido || [])

const timeline = computed(() => {
  const etapas = ['Pendiente', 'Preparando', 'Entregado']
  const actual = props.pedido.estado_pedido

  if (actual === 'Cancelado') {
    return [{ nombre: 'Cancelado', estado: 'completado' }]
  }

  const indiceActual = etapas.indexOf(actual)
  return etapas.map((nombre, i) => ({
    nombre,
    estado: i < indiceActual ? 'completado' : i === indiceActual ? 'activo' : 'pendiente',
  }))
})

function formatearFecha(iso) {
  if (!iso) return ''
  const f = new Date(iso)
  if (isNaN(f.getTime())) return ''
  return f.toLocaleDateString('es-SV', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function emitirCambioEstado() {
  if (cambioEstado.value) {
    emit('cambiar-estado', cambioEstado.value)
    cambioEstado.value = ''
  }
}

function imprimir() {
  window.print()
}
</script>
