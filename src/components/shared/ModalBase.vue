<template>
  <div class="fixed inset-0 bg-ferchas-vino/40 flex items-start justify-center z-40 animacion-modal" :class="paddingTop"
       @click.self="$emit('cerrar')">
    <div class="bg-white w-full mx-4 rounded-lg border-2 shadow-xl max-h-[92vh] overflow-y-auto"
      :class="[anchoMaximo, variante === 'error' ? 'border-ferchas-error/40' : 'border-ferchas-rosa/30']">
      <div class="px-6 py-4 border-b-2 border-ferchas-cafe/10 flex items-center justify-between sticky top-0 z-10"
        :class="variante === 'error' ? 'bg-ferchas-error/10' : 'bg-ferchas-rosa/10'">
        <div>
          <h2 class="font-titulo text-2xl text-ferchas-vino">{{ titulo }}</h2>
          <p v-if="subtitulo" class="text-xs text-ferchas-cafe-claro mt-0.5">{{ subtitulo }}</p>
        </div>
        <button @click="$emit('cerrar')" class="text-ferchas-cafe-claro hover:text-ferchas-vino p-1 rounded transition-colors">
          <Icono nombre="cerrar" :tamano="20" />
        </button>
      </div>
      <div class="p-6">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import Icono from './Icono.vue'

const props = defineProps({
  titulo: { type: String, required: true },
  subtitulo: { type: String, default: '' },
  ancho: { type: String, default: 'xl' },
  variante: { type: String, default: 'normal' },
  paddingTop: { type: String, default: 'pt-12' },
})

const emit = defineEmits(['cerrar'])

const anchoMaximo = { sm: 'max-w-md', xl: 'max-w-xl', '2xl': 'max-w-2xl', '4xl': 'max-w-4xl' }[props.ancho] || 'max-w-xl'

// Cierra el modal con la tecla Escape
function manejarEscape(evento) {
  if (evento.key === 'Escape') emit('cerrar')
}
onMounted(() => document.addEventListener('keydown', manejarEscape))
onBeforeUnmount(() => document.removeEventListener('keydown', manejarEscape))
</script>
