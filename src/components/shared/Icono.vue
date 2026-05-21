<template>
  <span
    class="inline-flex items-center justify-center flex-shrink-0"
    :style="{ width: tamano + 'px', height: tamano + 'px' }"
    v-html="svg"
  />
</template>

<script setup>
import { computed } from 'vue'
import { iconos } from '../../lib/iconos.js'

const props = defineProps({
  nombre: { type: String, required: true },
  tamano: { type: Number, default: 18 },
})

const svg = computed(() => iconos[props.nombre] || '')
</script>

<style scoped>
span :deep(svg) { width: 100%; height: 100%; display: block; }
</style>
