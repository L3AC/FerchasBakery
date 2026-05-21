<template>
  <LayoutPanel>
    <div class="p-7 max-w-5xl">
      <h1 class="font-titulo text-3xl text-ferchas-cafe">Mi perfil</h1>
      <p class="text-sm text-ferchas-cafe-claro mt-1">Información de tu cuenta y opciones personales</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <!-- Tarjeta del usuario -->
        <div class="bg-white border border-ferchas-cafe/10 rounded-lg p-6 text-center">
          <div class="w-24 h-24 bg-ferchas-vino text-ferchas-rosa rounded-full flex items-center justify-center font-titulo text-4xl font-bold mx-auto mb-4">
            {{ iniciales }}
          </div>
          <h3 class="font-titulo text-xl text-ferchas-cafe">{{ nombreCompleto }}</h3>
          <span class="inline-block mt-2 bg-ferchas-vino text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {{ rolEtiqueta }}
          </span>
          <p class="text-xs text-ferchas-cafe-claro mt-4 leading-relaxed">
            <span v-if="correo">{{ correo }}<br></span>
            <span v-if="fechaRegistro">Cuenta creada el {{ fechaRegistro }}.</span>
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
                <input v-model="formulario.nombre" type="text" class="input-base" required>
              </label>
              <label class="block">
                <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Correo electrónico</span>
                <input :value="correo" type="email" disabled class="input-base bg-ferchas-fondo text-ferchas-cafe-claro cursor-not-allowed">
                <span class="text-[11px] text-ferchas-cafe-claro mt-1 block">El correo no puede modificarse desde el perfil</span>
              </label>
              <div v-if="mensajeInfo" :class="['p-3 rounded text-sm', mensajeInfoTipo === 'exito' ? 'bg-ferchas-exito/20 text-ferchas-cafe' : 'bg-ferchas-error/10 text-ferchas-error']">
                {{ mensajeInfo }}
              </div>
              <div class="flex justify-end">
                <button type="submit" :disabled="guardando" class="btn-principal">
                  {{ guardando ? 'Guardando…' : 'Guardar cambios' }}
                </button>
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
import { useAlmacenAutenticacion } from '../stores/almacenAutenticacion.js'
import { servicioPerfiles } from '../services/servicioPerfiles.js'

const almacenAuth = useAlmacenAutenticacion()
const guardando = ref(false)
const mensajeInfo = ref('')
const mensajeInfoTipo = ref('exito')

const nombreCompleto = computed(() => almacenAuth.perfil?.nombre || 'Usuario')
const correo = computed(() => almacenAuth.usuario?.email || '')
const rolEtiqueta = computed(() => almacenAuth.perfil?.rol === 'admin' ? 'Administrador(a)' : 'Empleado(a)')

const iniciales = computed(() => {
  const nombre = almacenAuth.perfil?.nombre
  if (!nombre) return '??'
  const partes = nombre.trim().split(/\s+/)
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
})

const fechaRegistro = computed(() => {
  const iso = almacenAuth.perfil?.created_at
  if (!iso) return ''
  const f = new Date(iso)
  if (isNaN(f.getTime())) return ''
  return f.toLocaleDateString('es-SV', { day: 'numeric', month: 'long', year: 'numeric' })
})

const formulario = ref({
  nombre: nombreCompleto.value,
})

async function guardarInformacion() {
  if (!almacenAuth.usuario?.id) {
    mensajeInfo.value = 'No se pudo identificar el usuario'
    mensajeInfoTipo.value = 'error'
    return
  }
  guardando.value = true
  mensajeInfo.value = ''
  const resultado = await servicioPerfiles.actualizar(almacenAuth.usuario.id, { nombre: formulario.value.nombre })
  if (resultado.exito) {
    // Refresca el perfil en el store
    almacenAuth.perfil = resultado.perfil
    mensajeInfo.value = 'Cambios guardados correctamente'
    mensajeInfoTipo.value = 'exito'
  } else {
    mensajeInfo.value = resultado.error || 'No se pudo guardar'
    mensajeInfoTipo.value = 'error'
  }
  guardando.value = false
}
</script>
