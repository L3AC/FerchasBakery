<template>
  <ModalBase titulo="Nuevo pedido" subtitulo="Registra una venta o un encargo especial" ancho="4xl" padding-top="pt-8" @cerrar="$emit('cerrar')">
    <form @submit.prevent="$emit('guardar', formulario)">
      <div class="mb-6">
        <h3 class="font-titulo text-base text-ferchas-vino mb-3 pb-2 border-b-2 border-ferchas-rosa/30">1. Cliente y tipo de pedido</h3>
        <div class="grid grid-cols-3 gap-4">
          <label class="block col-span-2">
            <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Cliente <span class="text-ferchas-error">*</span></span>
            <div class="flex gap-2">
              <select v-model="formulario.cliente" class="input-base flex-1">
                <option>Cliente ocasional (sin registrar)</option>
                <option>María Hernández — 7777-1234</option>
                <option>Carlos Méndez — 7888-5678</option>
                <option>Lucía Ramírez — 7666-9012</option>
              </select>
              <button type="button" class="flex items-center gap-1.5 px-4 py-2.5 bg-ferchas-fondo border-2 border-ferchas-cafe/20 text-ferchas-cafe rounded-lg hover:bg-ferchas-fondo-oscuro transition-colors text-sm font-semibold whitespace-nowrap">
                <Icono nombre="mas" :tamano="16" /> Nuevo
              </button>
            </div>
          </label>

          <label class="block">
            <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Tipo de pedido <span class="text-ferchas-error">*</span></span>
            <select v-model="formulario.tipoPedido" class="input-base">
              <option>Mostrador</option>
              <option>Encargo</option>
              <option>Domicilio</option>
            </select>
          </label>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="font-titulo text-base text-ferchas-vino mb-3 pb-2 border-b-2 border-ferchas-rosa/30">2. Productos del pedido</h3>
        <div class="relative mb-3">
          <input v-model="busquedaProducto" type="text" placeholder="Buscar producto y agregar al pedido..." class="input-base pl-10">
          <div class="absolute left-3 top-1/2 -translate-y-1/2 text-ferchas-cafe-claro"><Icono nombre="buscar" :tamano="18" /></div>
        </div>

        <div class="bg-ferchas-fondo rounded-lg border-2 border-ferchas-cafe/10 overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-ferchas-fondo-oscuro text-ferchas-cafe text-xs uppercase tracking-wider">
                <th class="text-left py-2.5 px-4 font-bold">Producto</th>
                <th class="text-center py-2.5 px-3 font-bold">Stock</th>
                <th class="text-center py-2.5 px-3 font-bold">Cantidad</th>
                <th class="text-right py-2.5 px-3 font-bold">Precio</th>
                <th class="text-right py-2.5 px-3 font-bold">Subtotal</th>
                <th class="w-10"></th>
              </tr>
            </thead>
            <tbody class="bg-white">
              <tr v-for="(p, i) in formulario.productos" :key="p.nombre" class="border-b border-ferchas-cafe/10 last:border-0">
                <td class="py-3 px-4">
                  <div class="font-semibold text-ferchas-cafe">{{ p.nombre }}</div>
                  <div class="text-xs text-ferchas-cafe-claro">{{ p.categoria }}</div>
                </td>
                <td class="py-3 px-3 text-center"><span :class="`text-ferchas-${p.stockSeveridad} font-bold`">{{ p.stockDisponible }}</span></td>
                <td class="py-3 px-3">
                  <div class="flex items-center justify-center gap-1.5">
                    <button type="button" @click="ajustar(i, -1)" class="w-7 h-7 flex items-center justify-center border-2 border-ferchas-cafe/20 rounded text-ferchas-cafe hover:bg-ferchas-fondo"><Icono nombre="menos" :tamano="14" /></button>
                    <input v-model.number="p.cantidad" type="number" min="1" class="w-12 px-1 py-1 text-center bg-white border-2 border-ferchas-cafe/20 rounded text-ferchas-cafe font-bold">
                    <button type="button" @click="ajustar(i, 1)" class="w-7 h-7 flex items-center justify-center border-2 border-ferchas-cafe/20 rounded text-ferchas-cafe hover:bg-ferchas-fondo"><Icono nombre="mas" :tamano="16" /></button>
                  </div>
                </td>
                <td class="py-3 px-3 text-right text-ferchas-cafe">${{ p.precio.toFixed(2) }}</td>
                <td class="py-3 px-3 text-right font-bold text-ferchas-cafe">${{ (p.cantidad * p.precio).toFixed(2) }}</td>
                <td class="py-3 px-3 text-center">
                  <button type="button" @click="eliminar(i)" class="text-ferchas-error hover:bg-ferchas-error/10 p-1.5 rounded"><Icono nombre="basurero" :tamano="16" /></button>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="bg-ferchas-fondo px-4 py-3 flex justify-between items-center border-t-2 border-ferchas-cafe/10">
            <span class="text-sm text-ferchas-cafe-claro">{{ formulario.productos.length }} productos · {{ totalUnidades }} unidades</span>
            <div class="text-right">
              <div class="text-xs text-ferchas-cafe-claro">Total</div>
              <div class="font-titulo text-2xl text-ferchas-vino">${{ total.toFixed(2) }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="font-titulo text-base text-ferchas-vino mb-3 pb-2 border-b-2 border-ferchas-rosa/30">3. Pago y entrega</h3>
        <div class="grid grid-cols-2 gap-4">
          <label class="block">
            <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Método de pago <span class="text-ferchas-error">*</span></span>
            <div class="flex gap-2">
              <label v-for="metodo in ['Efectivo', 'Transferencia']" :key="metodo"
                :class="['flex-1 px-2 py-2.5 border-2 rounded-lg text-center cursor-pointer text-sm transition-all',
                  formulario.metodoPago === metodo ? 'bg-ferchas-rosa-suave/40 border-ferchas-rosa font-bold text-ferchas-vino' : 'bg-white border-ferchas-cafe/20 text-ferchas-cafe hover:border-ferchas-cafe/40']">
                <input v-model="formulario.metodoPago" type="radio" :value="metodo" class="sr-only">
                {{ metodo }}
              </label>
            </div>
          </label>

          <label class="block">
            <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Fecha de entrega <span class="text-xs text-ferchas-cafe-claro font-normal">(encargos)</span></span>
            <input v-model="formulario.fechaEntrega" type="date" class="input-base">
          </label>
        </div>

        <label class="block mt-4">
          <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Observaciones</span>
          <textarea v-model="formulario.observaciones" rows="2" placeholder="Notas adicionales (decoración, mensaje, alergias, etc.)" class="input-base resize-none" />
        </label>
      </div>

      <div class="bg-ferchas-exito/15 border-2 border-ferchas-exito/40 rounded-lg px-4 py-3 mb-4 flex items-start gap-3">
        <div class="text-ferchas-exito mt-0.5"><Icono nombre="exito" :tamano="18" /></div>
        <div class="text-sm text-ferchas-cafe">
          <strong>Stock validado.</strong> Al registrar el pedido se descontarán automáticamente las unidades del inventario.
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-4 border-t-2 border-ferchas-cafe/10">
        <button type="button" @click="$emit('cerrar')" class="btn-secundario">Cancelar</button>
        <button type="submit" class="btn-principal">Registrar pedido — ${{ total.toFixed(2) }}</button>
      </div>
    </form>
  </ModalBase>
</template>

<script setup>
import { ref, computed } from 'vue'
import ModalBase from '../shared/ModalBase.vue'
import Icono from '../shared/Icono.vue'
import { mockProductosFormPedido } from '../../lib/datosMock.js'

defineEmits(['cerrar', 'guardar'])

const busquedaProducto = ref('')
const formulario = ref({
  cliente: 'María Hernández — 7777-1234',
  tipoPedido: 'Encargo',
  productos: [...mockProductosFormPedido],
  metodoPago: 'Efectivo',
  fechaEntrega: '2026-05-24',
  observaciones: 'Tres leches con mensaje "Feliz cumpleaños Sofía" en color rosa',
})

const totalUnidades = computed(() => formulario.value.productos.reduce((s, p) => s + p.cantidad, 0))
const total = computed(() => formulario.value.productos.reduce((s, p) => s + p.cantidad * p.precio, 0))

function ajustar(i, delta) {
  const nuevo = formulario.value.productos[i].cantidad + delta
  if (nuevo >= 1) formulario.value.productos[i].cantidad = nuevo
}
function eliminar(i) { formulario.value.productos.splice(i, 1) }
</script>
