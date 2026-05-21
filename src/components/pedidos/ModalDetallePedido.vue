<template>
  <ModalBase :titulo="`Pedido ${detalle.id}`" :subtitulo="`Registrado el ${detalle.fechaRegistro} por ${detalle.registradoPor}`" ancho="4xl" padding-top="pt-8" @cerrar="$emit('cerrar')">
    <div class="flex justify-end gap-2 mb-5">
      <button class="btn-secundario py-2">Imprimir</button>
      <select class="btn-principal text-sm border-2 border-ferchas-rosa">
        <option>Cambiar estado</option>
        <option>Marcar como entregado</option>
        <option>Cancelar pedido</option>
      </select>
    </div>

    <div class="grid grid-cols-3 gap-5">
      <div class="col-span-2 space-y-5">
        <div class="bg-white border-2 border-ferchas-cafe/10 rounded-lg p-5">
          <h3 class="font-titulo text-lg text-ferchas-vino mb-4">Estado del pedido</h3>
          <div class="flex items-center justify-between">
            <template v-for="(etapa, i) in detalle.estadoTimeline" :key="etapa.etapa">
              <div class="flex flex-col items-center flex-1">
                <div :class="['w-10 h-10 rounded-full flex items-center justify-center font-bold border-2',
                    etapa.completado ? 'bg-ferchas-exito text-white border-ferchas-exito' :
                    etapa.activo ? 'bg-ferchas-rosa text-white border-ferchas-rosa animate-pulse' :
                    'bg-ferchas-fondo-oscuro text-ferchas-cafe-claro border-ferchas-cafe/20']">
                  <Icono v-if="etapa.completado" nombre="exito" :tamano="18" />
                  <span v-else>{{ i + 1 }}</span>
                </div>
                <div :class="['text-xs mt-2', etapa.activo ? 'font-bold text-ferchas-vino' : etapa.completado ? 'font-bold text-ferchas-cafe' : 'text-ferchas-cafe-claro']">{{ etapa.etapa }}</div>
                <div class="text-[10px] text-ferchas-cafe-claro">{{ etapa.hora }}</div>
              </div>
              <div v-if="i < detalle.estadoTimeline.length - 1" :class="['flex-1 h-1', detalle.estadoTimeline[i + 1].completado || etapa.completado ? 'bg-ferchas-exito' : 'bg-ferchas-cafe/15']" />
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
              <tr v-for="p in detalle.productos" :key="p.nombre" class="border-b border-ferchas-cafe/10 last:border-0">
                <td class="py-3 px-4">
                  <div class="font-semibold text-ferchas-cafe">{{ p.nombre }}</div>
                  <div class="text-xs text-ferchas-cafe-claro mt-0.5">{{ p.descripcion }}</div>
                </td>
                <td class="py-3 px-4 text-center font-bold">{{ p.cantidad }}</td>
                <td class="py-3 px-4 text-right">${{ p.precio.toFixed(2) }}</td>
                <td class="py-3 px-4 text-right font-bold text-ferchas-vino">${{ p.subtotal.toFixed(2) }}</td>
              </tr>
            </tbody>
            <tfoot class="bg-ferchas-fondo">
              <tr>
                <td colspan="3" class="py-3 px-4 text-right font-bold text-ferchas-cafe">Total</td>
                <td class="py-3 px-4 text-right font-titulo text-2xl text-ferchas-vino">${{ detalle.total.toFixed(2) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div class="bg-white border-2 border-ferchas-cafe/10 rounded-lg p-5">
          <h3 class="font-titulo text-lg text-ferchas-vino mb-2">Observaciones</h3>
          <p class="text-sm text-ferchas-cafe leading-relaxed">{{ detalle.observaciones }}</p>
        </div>
      </div>

      <div class="space-y-5">
        <div class="bg-white border-2 border-ferchas-rosa/30 rounded-lg p-5">
          <h3 class="font-titulo text-lg text-ferchas-vino mb-3">Cliente</h3>
          <div class="space-y-2 text-sm">
            <div class="font-bold text-ferchas-cafe text-base">{{ detalle.cliente.nombre }}</div>
            <div class="text-ferchas-cafe-claro">{{ detalle.cliente.telefono }}</div>
            <div class="text-ferchas-cafe-claro">{{ detalle.cliente.correo }}</div>
            <div class="text-ferchas-cafe-claro leading-snug">{{ detalle.cliente.direccion }}</div>
          </div>
          <button class="mt-4 text-xs text-ferchas-rosa-oscuro font-bold uppercase tracking-wider hover:underline">Ver historial</button>
        </div>

        <div class="bg-white border-2 border-ferchas-cafe/10 rounded-lg p-5">
          <h3 class="font-titulo text-lg text-ferchas-vino mb-3">Información del pedido</h3>
          <dl class="space-y-2 text-sm">
            <div class="flex justify-between"><dt class="text-ferchas-cafe-claro">Tipo</dt><dd class="font-semibold text-ferchas-cafe">{{ detalle.info.tipo }}</dd></div>
            <div class="flex justify-between"><dt class="text-ferchas-cafe-claro">Método de pago</dt><dd class="font-semibold text-ferchas-cafe">{{ detalle.info.metodoPago }}</dd></div>
            <div class="flex justify-between"><dt class="text-ferchas-cafe-claro">Fecha de pedido</dt><dd class="font-semibold text-ferchas-cafe">{{ detalle.info.fechaPedido }}</dd></div>
            <div class="flex justify-between"><dt class="text-ferchas-cafe-claro">Fecha de entrega</dt><dd class="font-semibold text-ferchas-cafe">{{ detalle.info.fechaEntrega }}</dd></div>
            <div class="flex justify-between"><dt class="text-ferchas-cafe-claro">Registró</dt><dd class="font-semibold text-ferchas-cafe">{{ detalle.registradoPor }}</dd></div>
          </dl>
        </div>
      </div>
    </div>
  </ModalBase>
</template>

<script setup>
import ModalBase from '../shared/ModalBase.vue'
import Icono from '../shared/Icono.vue'
import { mockDetallePedido } from '../../lib/datosMock.js'
defineEmits(['cerrar'])
const detalle = mockDetallePedido
</script>
