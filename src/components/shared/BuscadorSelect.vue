<template>
  <div class="relative">
    <input
      ref="inputRef"
      :value="textoMostrado"
      @input="onInput"
      @focus="abierto = true"
      @blur="cerrar"
      :placeholder="placeholder"
      class="input-base"
    />
    <button
      v-if="modelValue"
      type="button"
      @mousedown.prevent="limpiar"
      class="absolute right-2 top-1/2 -translate-y-1/2 text-ferchas-cafe-claro hover:text-ferchas-error text-lg leading-none"
    >
      &times;
    </button>
    <ul
      v-if="abierto && opcionesFiltradas.length > 0"
      class="absolute z-50 mt-1 w-full bg-white border-2 border-ferchas-cafe/20 rounded-lg shadow-lg max-h-48 overflow-y-auto"
    >
      <li
        v-for="item in opcionesFiltradas"
        @mousedown.prevent="seleccionar(item)"
        class="px-4 py-2.5 cursor-pointer text-ferchas-cafe hover:bg-ferchas-rosa/10 transition-colors duration-150"
      >
        <slot name="option" :item="item">
          {{ obtenerLabel(item) }}
        </slot>
      </li>
    </ul>
    <p v-if="abierto && opcionesFiltradas.length === 0 && busquedaInterna" class="absolute z-50 mt-1 w-full bg-white border-2 border-ferchas-cafe/20 rounded-lg shadow-lg px-4 py-2.5 text-ferchas-cafe-claro text-sm">
      Sin resultados
    </p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: null },
  items: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Seleccionar...' },
  label: { type: String, default: 'nombre' },
  valueKey: { type: String, default: 'id' }
})

const emit = defineEmits(['update:modelValue'])

const inputRef = ref(null)
const abierto = ref(false)
const busquedaInterna = ref('')

function obtenerLabel(item) {
  return item[props.label] || item
}

function obtenerValue(item) {
  return item[props.valueKey] || item
}

const itemSeleccionado = computed(() => {
  if (!props.modelValue) return null
  return props.items.find(i => obtenerValue(i) === props.modelValue) || null
})

const textoMostrado = computed(() => {
  if (itemSeleccionado.value) return obtenerLabel(itemSeleccionado.value)
  return busquedaInterna.value
})

const opcionesFiltradas = computed(() => {
  if (!busquedaInterna.value) return props.items
  const term = busquedaInterna.value.toLowerCase()
  return props.items.filter(i =>
    obtenerLabel(i).toLowerCase().includes(term)
  )
})

function onInput(e) {
  busquedaInterna.value = e.target.value
  abierto.value = true
  if (itemSeleccionado.value && e.target.value !== obtenerLabel(itemSeleccionado.value)) {
    emit('update:modelValue', null)
  }
}

function seleccionar(item) {
  emit('update:modelValue', obtenerValue(item))
  busquedaInterna.value = ''
  abierto.value = false
}

function limpiar() {
  emit('update:modelValue', null)
  busquedaInterna.value = ''
  inputRef.value?.focus()
}

function cerrar() {
  setTimeout(() => { abierto.value = false }, 200)
}

watch(() => props.modelValue, (val) => {
  if (!val) busquedaInterna.value = ''
})
</script>
