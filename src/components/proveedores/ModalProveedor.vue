<template>
  <ModalBase titulo="Nuevo proveedor" ancho="xl" padding-top="pt-16" @cerrar="$emit('cerrar')">
    <form @submit.prevent="$emit('guardar', formulario)">
      <label class="block mb-4">
        <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Nombre del proveedor <span class="text-ferchas-error">*</span></span>
        <input v-model="formulario.nombre" type="text" maxlength="70" required placeholder="Ej. Distribuidora de Harinas" class="input-base">
      </label>

      <div class="grid grid-cols-2 gap-4 mb-4">
        <label class="block">
          <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Teléfono</span>
          <input v-model="formulario.telefono" type="tel" maxlength="30" placeholder="2222-3344" class="input-base">
        </label>
        <label class="block">
          <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Persona de contacto</span>
          <input v-model="formulario.contacto" type="text" maxlength="90" placeholder="Nombre del contacto" class="input-base">
        </label>
      </div>

      <label class="block mb-6">
        <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Descripción</span>
        <textarea v-model="formulario.descripcion" rows="3" maxlength="200" placeholder="Qué productos suministra, condiciones de pago, etc." class="input-base resize-none" />
      </label>

      <div class="flex justify-end gap-3 pt-4 border-t-2 border-ferchas-cafe/10">
        <button type="button" @click="$emit('cerrar')" class="btn-secundario">Cancelar</button>
        <button type="submit" class="btn-principal">Guardar proveedor</button>
      </div>
    </form>
  </ModalBase>
</template>

<script setup>
import { ref } from 'vue'
import ModalBase from '../shared/ModalBase.vue'
defineEmits(['cerrar', 'guardar'])
const formulario = ref({ nombre: '', telefono: '', contacto: '', descripcion: '' })
</script>
