<template>
  <LayoutPanel>
    <div class="p-7 max-w-5xl">
      <h1 class="font-titulo text-3xl text-ferchas-cafe">Mi perfil</h1>
      <p class="text-sm text-ferchas-cafe-claro mt-1">Información de tu cuenta y opciones personales</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <!-- Tarjeta del usuario -->
        <div class="bg-white border border-ferchas-cafe/10 rounded-lg p-6 text-center">
          <div class="w-24 h-24 bg-ferchas-vino text-ferchas-rosa rounded-full flex items-center justify-center font-titulo text-4xl font-bold mx-auto mb-4">
            {{ usuario.iniciales }}
          </div>
          <h3 class="font-titulo text-xl text-ferchas-cafe">{{ usuario.nombreCompleto }}</h3>
          <span class="inline-block mt-2 bg-ferchas-vino text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {{ usuario.rolEtiqueta }}
          </span>
          <p class="text-xs text-ferchas-cafe-claro mt-4 leading-relaxed">
            Miembro desde {{ usuario.registrado }}.
          </p>
        </div>

        <!-- Formularios -->
        <div class="md:col-span-2 space-y-6">
          <!-- Información personal -->
          <div class="bg-white border border-ferchas-cafe/10 rounded-lg p-6">
            <h2 class="font-titulo text-lg text-ferchas-vino mb-4 pb-2 border-b-2 border-ferchas-rosa/30">Información personal</h2>
            <form @submit.prevent="guardarInformacion" class="space-y-4">
              <label class="block">
                <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Nombre completo</span>
                <input v-model="formulario.nombre" type="text" class="input-base">
              </label>
              <label class="block">
                <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Correo electrónico</span>
                <input v-model="formulario.correo" type="email" disabled class="input-base bg-ferchas-fondo text-ferchas-cafe-claro cursor-not-allowed">
                <span class="text-[11px] text-ferchas-cafe-claro mt-1 block">El correo no puede modificarse desde el perfil</span>
              </label>
              <div class="flex justify-end">
                <button type="submit" class="btn-principal">Guardar cambios</button>
              </div>
            </form>
          </div>

          <!-- Cambio de contraseña -->
          <div class="bg-white border border-ferchas-cafe/10 rounded-lg p-6">
            <h2 class="font-titulo text-lg text-ferchas-vino mb-4 pb-2 border-b-2 border-ferchas-rosa/30">Cambiar contraseña</h2>
            <form @submit.prevent="cambiarContrasena" class="space-y-4">
              <label class="block">
                <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Nueva contraseña</span>
                <input v-model="contrasenas.nueva" type="password" placeholder="Mínimo 8 caracteres" class="input-base">
              </label>
              <label class="block">
                <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Confirmar nueva</span>
                <input v-model="contrasenas.confirmar" type="password" placeholder="Repite la contraseña" class="input-base">
              </label>
              <div v-if="errorContrasena" class="text-ferchas-error text-xs">{{ errorContrasena }}</div>
              <div v-if="exitoContrasena" class="text-ferchas-exito text-xs">Contraseña actualizada correctamente</div>
              <div class="flex justify-end">
                <button type="submit" class="btn-vino">Actualizar contraseña</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </LayoutPanel>
</template>

<script setup>
import { ref, computed } from 'vue'
import LayoutPanel from '../components/shared/LayoutPanel.vue'
import { useAlmacenAutenticacion } from '../controllers/ControladorAutenticacion.js'

const auth = useAlmacenAutenticacion()
const errorContrasena = ref(null)
const exitoContrasena = ref(false)

const usuario = computed(() => {
  const nombre = auth.perfil?.nombre || 'Usuario'
  const partes = nombre.split(' ')
  return {
    iniciales: partes.map(p => p[0]).join('').toUpperCase().slice(0, 2),
    nombreCompleto: nombre,
    rolEtiqueta: auth.perfil?.rol === 'admin' ? 'Admin' : auth.perfil?.rol === 'empleado' ? 'Empleado' : 'Usuario',
    registrado: auth.perfil?.created_at ? new Date(auth.perfil.created_at).toLocaleDateString('es-MX') : '-'
  }
})

const formulario = ref({
  nombre: auth.perfil?.nombre || '',
  correo: auth.usuario?.email || ''
})

const contrasenas = ref({ nueva: '', confirmar: '' })

function guardarInformacion() {
  console.log('Guardar info:', formulario.value)
}

async function cambiarContrasena() {
  errorContrasena.value = null
  exitoContrasena.value = false

  if (contrasenas.value.nueva.length < 6) {
    errorContrasena.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }
  if (contrasenas.value.nueva !== contrasenas.value.confirmar) {
    errorContrasena.value = 'Las contraseñas no coinciden'
    return
  }

  const resultado = await auth.cambiarContrasena(contrasenas.value.nueva)
  if (resultado.exito) {
    exitoContrasena.value = true
    contrasenas.value = { nueva: '', confirmar: '' }
  } else {
    errorContrasena.value = resultado.error || 'Error al cambiar la contraseña'
  }
}
</script>
