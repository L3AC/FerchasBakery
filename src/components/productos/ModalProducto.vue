<template>
  <ModalBase :titulo="productoEditando ? 'Editar producto' : 'Nuevo producto'" ancho="2xl" @cerrar="$emit('cerrar')">
    <form @submit.prevent="emitirGuardar">
      <div class="grid grid-cols-2 gap-4 mb-4">
        <label class="block col-span-2">
          <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Nombre <span class="text-ferchas-error">*</span></span>
          <input v-model="formulario.nombre" type="text" maxlength="70" required placeholder="Ej. Cheesecake de fresa" class="input-base">
          <span class="text-[11px] text-ferchas-cafe-claro mt-1 block">Máximo 70 caracteres</span>
        </label>

        <label class="block col-span-2">
          <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Descripción</span>
          <textarea v-model="formulario.descripcion" rows="2" maxlength="250" placeholder="Descripción breve del producto..." class="input-base resize-none"></textarea>
        </label>

        <label class="block">
          <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Categoría</span>
          <select v-model="formulario.id_categoria" class="input-base">
            <option :value="null">Sin categoría</option>
            <option v-for="c in categorias" :key="c.id_categoria" :value="c.id_categoria">
              {{ c.nombre_categoria }}
            </option>
          </select>
        </label>

        <div class="block">
          <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Tipo de origen <span class="text-ferchas-error">*</span></span>
          <div class="flex gap-2">
            <label :class="['flex-1 px-3 py-2.5 border-2 rounded-lg text-center cursor-pointer text-sm transition-all',
                formulario.tipo_origen === 'interno' ? 'bg-ferchas-rosa-suave/40 border-ferchas-rosa font-bold text-ferchas-vino' : 'bg-white border-ferchas-cafe/20 text-ferchas-cafe hover:border-ferchas-cafe/40']">
              <input v-model="formulario.tipo_origen" type="radio" value="interno" class="sr-only">
              Interno
            </label>
            <label :class="['flex-1 px-3 py-2.5 border-2 rounded-lg text-center cursor-pointer text-sm transition-all',
                formulario.tipo_origen === 'proveedor' ? 'bg-ferchas-rosa-suave/40 border-ferchas-rosa font-bold text-ferchas-vino' : 'bg-white border-ferchas-cafe/20 text-ferchas-cafe hover:border-ferchas-cafe/40']">
              <input v-model="formulario.tipo_origen" type="radio" value="proveedor" class="sr-only">
              De proveedor
            </label>
          </div>
        </div>

        <label class="block">
          <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Precio (USD) <span class="text-ferchas-error">*</span></span>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-ferchas-cafe-claro font-bold">$</span>
            <input v-model.number="formulario.precio" type="number" step="0.01" min="0" required placeholder="0.00" class="input-base pl-7">
          </div>
        </label>

        <label class="block">
          <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Stock disponible <span class="text-ferchas-error">*</span></span>
          <input v-model.number="formulario.stock_disponible" type="number" min="0" required placeholder="0" class="input-base">
        </label>
      </div>

      <label class="flex items-center gap-2 mb-6 cursor-pointer">
        <input v-model="formulario.es_personalizable" type="checkbox" class="w-4 h-4 accent-ferchas-rosa">
        <span class="text-sm text-ferchas-cafe">Este producto es personalizable (encargos especiales)</span>
      </label>

      <div class="flex justify-end gap-3 pt-4 border-t-2 border-ferchas-cafe/10">
        <button type="button" @click="$emit('cerrar')" class="btn-secundario">Cancelar</button>
        <button type="submit" class="btn-principal">{{ productoEditando ? 'Actualizar producto' : 'Guardar producto' }}</button>
      </div>
    </form>
  </ModalBase>
</template>

<script setup>
import { ref } from 'vue'
import ModalBase from '../shared/ModalBase.vue'

const props = defineProps({
  productoEditando: { type: Object, default: null },
  categorias: { type: Array, default: () => [] },
})
const emit = defineEmits(['cerrar', 'guardar'])

// Si hay producto para editar, precarga sus datos en el formulario
const formulario = ref({
  nombre: props.productoEditando?.nombre || '',
  descripcion: props.productoEditando?.descripcion || '',
  id_categoria: props.productoEditando?.id_categoria || null,
  tipo_origen: props.productoEditando?.tipo_origen || 'interno',
  precio: props.productoEditando?.precio || 0,
  stock_disponible: props.productoEditando?.stock_disponible ?? 0,
  es_personalizable: props.productoEditando?.es_personalizable || false,
})

function emitirGuardar() {
  // Asegura que los numéricos van como números, no como strings
  emit('guardar', {
    nombre: formulario.value.nombre,
    descripcion: formulario.value.descripcion || null,
    id_categoria: formulario.value.id_categoria || null,
    tipo_origen: formulario.value.tipo_origen,
    precio: parseFloat(formulario.value.precio) || 0,
    stock_disponible: parseInt(formulario.value.stock_disponible) || 0,
    es_personalizable: !!formulario.value.es_personalizable,
  })
}
</script>
