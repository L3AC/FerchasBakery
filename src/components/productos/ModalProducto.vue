<template>
  <ModalBase titulo="Nuevo producto" ancho="2xl" @cerrar="$emit('cerrar')">
    <form @submit.prevent="$emit('guardar', formulario)">
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
          <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Categoría <span class="text-ferchas-error">*</span></span>
          <select v-model="formulario.categoria" required class="input-base">
            <option value="">Selecciona una categoría</option>
            <option>Pan dulce tradicional</option>
            <option>Crepas y postres</option>
            <option>Postres y especialidades</option>
            <option>Pasteles personalizados</option>
            <option>Productos salados</option>
            <option>Bebidas frías y calientes</option>
          </select>
        </label>

        <div class="block">
          <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Tipo de origen <span class="text-ferchas-error">*</span></span>
          <div class="flex gap-2">
            <label :class="['flex-1 px-3 py-2.5 border-2 rounded-lg text-center cursor-pointer text-sm transition-all',
                formulario.tipoOrigen === 'interno' ? 'bg-ferchas-rosa-suave/40 border-ferchas-rosa font-bold text-ferchas-vino' : 'bg-white border-ferchas-cafe/20 text-ferchas-cafe hover:border-ferchas-cafe/40']">
              <input v-model="formulario.tipoOrigen" type="radio" value="interno" class="sr-only">
              Interno
            </label>
            <label :class="['flex-1 px-3 py-2.5 border-2 rounded-lg text-center cursor-pointer text-sm transition-all',
                formulario.tipoOrigen === 'proveedor' ? 'bg-ferchas-rosa-suave/40 border-ferchas-rosa font-bold text-ferchas-vino' : 'bg-white border-ferchas-cafe/20 text-ferchas-cafe hover:border-ferchas-cafe/40']">
              <input v-model="formulario.tipoOrigen" type="radio" value="proveedor" class="sr-only">
              De proveedor
            </label>
          </div>
        </div>

        <label class="block">
          <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Precio (USD) <span class="text-ferchas-error">*</span></span>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-ferchas-cafe-claro font-bold">$</span>
            <input v-model="formulario.precio" type="number" step="0.01" min="0" required placeholder="0.00" class="input-base pl-7">
          </div>
        </label>

        <label class="block">
          <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Stock disponible <span class="text-ferchas-error">*</span></span>
          <input v-model="formulario.stock" type="number" min="0" required placeholder="0" class="input-base">
        </label>
      </div>

      <label class="block mb-4" :class="formulario.tipoOrigen !== 'proveedor' ? 'opacity-40' : ''">
        <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Proveedor <span class="text-xs text-ferchas-cafe-claro font-normal">(solo si es de proveedor)</span></span>
        <select v-model="formulario.proveedor" :disabled="formulario.tipoOrigen !== 'proveedor'" class="input-base disabled:bg-ferchas-fondo disabled:cursor-not-allowed">
          <option value="">Selecciona proveedor</option>
          <option>Distribuidora de Harinas</option>
          <option>Insumos Generales La Salud</option>
        </select>
      </label>

      <label class="flex items-center gap-2 mb-6 cursor-pointer">
        <input v-model="formulario.personalizable" type="checkbox" class="w-4 h-4 accent-ferchas-rosa">
        <span class="text-sm text-ferchas-cafe">Este producto es personalizable (encargos especiales)</span>
      </label>

      <div class="flex justify-end gap-3 pt-4 border-t-2 border-ferchas-cafe/10">
        <button type="button" @click="$emit('cerrar')" class="btn-secundario">Cancelar</button>
        <button type="submit" class="btn-principal">Guardar producto</button>
      </div>
    </form>
  </ModalBase>
</template>

<script setup>
import { ref } from 'vue'
import ModalBase from '../shared/ModalBase.vue'
defineEmits(['cerrar', 'guardar'])
const formulario = ref({ nombre: '', descripcion: '', categoria: '', tipoOrigen: 'interno', precio: '', stock: '', proveedor: '', personalizable: false })
</script>
