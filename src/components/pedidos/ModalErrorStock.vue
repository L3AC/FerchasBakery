<template>
  <ModalBase titulo="Nuevo pedido" ancho="2xl" variante="error" @cerrar="$emit('cerrar')">
    <div class="bg-ferchas-error/15 border-2 border-ferchas-error rounded-lg px-5 py-4 mb-5 flex items-start gap-3">
      <div class="text-ferchas-error mt-0.5"><Icono nombre="alerta" :tamano="18" /></div>
      <div class="flex-1">
        <h4 class="font-bold text-ferchas-vino mb-1">Stock insuficiente</h4>
        <p class="text-sm text-ferchas-cafe leading-relaxed mb-3">
          No hay stock suficiente para completar este pedido. Revisa las cantidades de los siguientes productos:
        </p>
        <ul class="space-y-1.5 text-sm">
          <li v-for="e in errores" :key="e.nombre" class="flex items-center justify-between bg-white px-3 py-2 rounded border border-ferchas-error/30">
            <span class="font-semibold text-ferchas-cafe">{{ e.nombre }}</span>
            <span class="text-xs text-ferchas-error font-bold">Solicitado: {{ e.solicitado }} · Disponible: {{ e.disponible }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="bg-ferchas-fondo border-2 border-ferchas-cafe/15 rounded-lg p-4 mb-5">
      <h4 class="text-sm font-bold text-ferchas-cafe mb-2">¿Qué hacer ahora?</h4>
      <ul class="text-sm text-ferchas-cafe-claro space-y-1.5 list-disc pl-5">
        <li>Reduce las cantidades a las disponibles en stock</li>
        <li>Elimina los productos sin stock del pedido</li>
        <li>O cancela este pedido y vuelve a intentar más tarde</li>
      </ul>
    </div>

    <div class="flex justify-end gap-3 pt-4 border-t-2 border-ferchas-cafe/10">
      <button @click="$emit('cerrar')" class="btn-secundario">Cancelar pedido</button>
      <button @click="$emit('ajustar')" class="btn-principal">Ajustar cantidades</button>
    </div>
  </ModalBase>
</template>

<script setup>
import ModalBase from '../shared/ModalBase.vue'
import Icono from '../shared/Icono.vue'

defineProps({
  errores: { type: Array, default: () => [] }
})
defineEmits(['cerrar', 'ajustar'])
</script>
