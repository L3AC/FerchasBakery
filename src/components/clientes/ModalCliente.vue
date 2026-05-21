<template>
  <ModalBase :titulo="cliente ? 'Editar cliente' : 'Nuevo cliente'" ancho="xl" padding-top="pt-16" @cerrar="$emit('cerrar')">
    <form @submit.prevent="$emit('guardar', formulario)">
      <label class="block mb-4">
        <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Nombre completo <span class="text-ferchas-error">*</span></span>
        <input v-model="formulario.nombre" type="text" maxlength="70" required placeholder="Ej. María Hernández" class="input-base">
        <span class="text-[11px] text-ferchas-cafe-claro mt-1 block">Máximo 70 caracteres</span>
      </label>

      <div class="grid grid-cols-2 gap-4 mb-4">
        <label class="block">
          <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Teléfono</span>
          <input v-model="formulario.telefono" type="tel" maxlength="30" placeholder="7777-1234" class="input-base">
        </label>
        <label class="block">
          <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Correo electrónico</span>
          <input v-model="formulario.correo" type="email" maxlength="90" placeholder="cliente@correo.com" class="input-base">
        </label>
      </div>

      <label class="block mb-6">
        <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Dirección</span>
        <textarea v-model="formulario.direccion" rows="2" maxlength="200" placeholder="Dirección completa para entregas a domicilio" class="input-base resize-none" />
        <span class="text-[11px] text-ferchas-cafe-claro mt-1 block">Máximo 200 caracteres</span>
      </label>

      <div class="bg-ferchas-rosa-suave/30 border-2 border-ferchas-rosa/40 rounded-lg px-4 py-3 mb-5 text-sm text-ferchas-cafe">
        <strong>Nota:</strong> solo el nombre es obligatorio. El resto de campos son opcionales pero útiles para pedidos a domicilio y contacto.
      </div>

      <div class="flex justify-end gap-3 pt-4 border-t-2 border-ferchas-cafe/10">
        <button type="button" @click="$emit('cerrar')" class="btn-secundario">Cancelar</button>
        <button type="submit" class="btn-principal">Guardar cliente</button>
      </div>
    </form>
  </ModalBase>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ModalBase from '../shared/ModalBase.vue'
const props = defineProps({
  cliente: { type: Object, default: null }
})
defineEmits(['cerrar', 'guardar'])
const formulario = ref({ id_cliente: null, nombre: '', telefono: '', correo: '', direccion: '' })

onMounted(() => {
  if (props.cliente) {
    formulario.value = {
      id_cliente: props.cliente.id_cliente,
      nombre: props.cliente.nombre,
      telefono: props.cliente.telefono || '',
      correo: props.cliente.correo || '',
      direccion: props.cliente.direccion || ''
    }
  }
})
</script>
