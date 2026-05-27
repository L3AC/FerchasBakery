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
                 <input v-model="formulario.nombre" type="text" required class="input-base" maxlength="70">
               </label>
               <label class="block">
                 <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Correo electrónico</span>
                 <input v-model="formulario.correo" type="email" disabled class="input-base bg-ferchas-fondo text-ferchas-cafe-claro cursor-not-allowed">
                 <span class="text-[11px] text-ferchas-cafe-claro mt-1 block">El correo no puede modificarse desde el perfil</span>
               </label>
               <div v-if="errorNombre" class="bg-ferchas-error/10 border-l-4 border-ferchas-error text-ferchas-error p-3 rounded text-xs">{{ errorNombre }}</div>
               <div v-if="exitoNombre" class="bg-ferchas-exito/10 border-l-4 border-ferchas-exito text-ferchas-cafe p-3 rounded text-xs">{{ exitoNombre }}</div>
               <div class="flex justify-end">
                 <button type="submit" :disabled="cargandoNombre" class="btn-principal">
                   {{ cargandoNombre ? 'Guardando...' : 'Guardar cambios' }}
                 </button>
               </div>
             </form>
           </div>

           <!-- Cambio de contraseña -->
           <div class="bg-white border border-ferchas-cafe/10 rounded-lg p-6">
             <h2 class="font-titulo text-lg text-ferchas-vino mb-4 pb-2 border-b-2 border-ferchas-rosa/30">Cambiar contraseña</h2>
             <form @submit.prevent="cambiarContrasena" class="space-y-4">
               <label class="block">
                 <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Contraseña actual <span class="text-ferchas-error">*</span></span>
                 <input v-model="contrasenas.actual" type="password" required placeholder="Ingresa tu contraseña actual" class="input-base">
               </label>
               <label class="block">
                 <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Nueva contraseña <span class="text-ferchas-error">*</span></span>
                 <input v-model="contrasenas.nueva" type="password" required placeholder="Mínimo 6 caracteres" class="input-base">
               </label>
               <label class="block">
                 <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Confirmar nueva contraseña <span class="text-ferchas-error">*</span></span>
                 <input v-model="contrasenas.confirmar" type="password" required placeholder="Repite la contraseña" class="input-base">
               </label>
               <div v-if="errorContrasena" class="bg-ferchas-error/10 border-l-4 border-ferchas-error text-ferchas-error p-3 rounded text-xs">{{ errorContrasena }}</div>
               <div v-if="exitoContrasena" class="bg-ferchas-exito/10 border-l-4 border-ferchas-exito text-ferchas-cafe p-3 rounded text-xs">Contraseña actualizada correctamente</div>
               <div class="flex justify-end">
                 <button type="submit" :disabled="cargandoContrasena" class="btn-vino">
                   {{ cargandoContrasena ? 'Actualizando...' : 'Actualizar contraseña' }}
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
import { ref, computed, onMounted } from 'vue'
import LayoutPanel from '../components/shared/LayoutPanel.vue'
import { useAlmacenAutenticacion } from '../controllers/ControladorAutenticacion.js'
import { servicioPerfiles } from '../models/ModeloPerfiles.js'
import { servicioAutenticacion } from '../models/ModeloAutenticacion.js'

const auth = useAlmacenAutenticacion()
const errorContrasena = ref(null)
const exitoContrasena = ref(false)
const errorNombre = ref(null)
const exitoNombre = ref(null)
const cargandoNombre = ref(false)
const cargandoContrasena = ref(false)

const usuario = computed(() => {
  const nombre = auth.perfil?.nombre || 'Usuario'
  const partes = nombre.split(' ')
  return {
    iniciales: partes.map(p => p[0]).join('').toUpperCase().slice(0, 2),
    nombreCompleto: nombre,
    rolEtiqueta: auth.perfil?.rol === 'admin' ? 'Admin' : auth.perfil?.rol === 'empleado' ? 'Empleado' : auth.perfil?.rol === 'principal' ? 'Principal' : 'Usuario',
    registrado: auth.perfil?.created_at ? new Date(auth.perfil.created_at).toLocaleDateString('es-MX') : '-'
  }
})

const formulario = ref({
  nombre: auth.perfil?.nombre || '',
  correo: auth.usuario?.email || ''
})

const contrasenas = ref({ actual: '', nueva: '', confirmar: '' })

async function guardarInformacion() {
  errorNombre.value = null
  exitoNombre.value = null

  if (!formulario.value.nombre || formulario.value.nombre.trim().length === 0) {
    errorNombre.value = 'El nombre no puede estar vacío'
    return
  }

  cargandoNombre.value = true

  try {
    const resultado = await servicioPerfiles.actualizar(auth.usuario?.id, {
      nombre: formulario.value.nombre.trim()
    })

    if (resultado.exito) {
      // Actualizar el perfil en el store
      auth.perfil.nombre = formulario.value.nombre.trim()
      exitoNombre.value = 'Nombre actualizado correctamente'
      setTimeout(() => {
        exitoNombre.value = null
      }, 3000)
    } else {
      errorNombre.value = resultado.error || 'Error al actualizar el nombre'
    }
  } catch (err) {
    errorNombre.value = 'Error al actualizar el nombre'
  } finally {
    cargandoNombre.value = false
  }
}

async function cambiarContrasena() {
  errorContrasena.value = null
  exitoContrasena.value = false

  // Validaciones
  if (!contrasenas.value.actual || contrasenas.value.actual.trim().length === 0) {
    errorContrasena.value = 'Debes ingresar tu contraseña actual'
    return
  }

  if (!contrasenas.value.nueva || contrasenas.value.nueva.trim().length === 0) {
    errorContrasena.value = 'Debes ingresar una nueva contraseña'
    return
  }

  if (contrasenas.value.nueva.length < 6) {
    errorContrasena.value = 'La nueva contraseña debe tener al menos 6 caracteres'
    return
  }

  if (contrasenas.value.nueva !== contrasenas.value.confirmar) {
    errorContrasena.value = 'Las contraseñas nuevas no coinciden'
    return
  }

  if (contrasenas.value.actual === contrasenas.value.nueva) {
    errorContrasena.value = 'La nueva contraseña no puede ser igual a la actual'
    return
  }

  cargandoContrasena.value = true

  try {
    // Primero verificar que la contraseña actual sea correcta
    const verificacion = await servicioAutenticacion.iniciarSesion(
      auth.usuario?.email,
      contrasenas.value.actual
    )

    if (!verificacion.exito) {
      errorContrasena.value = 'La contraseña actual es incorrecta'
      cargandoContrasena.value = false
      return
    }

    // Si la contraseña actual es correcta, cambiar la nueva
    const resultado = await servicioAutenticacion.cambiarContrasena(contrasenas.value.nueva, contrasenas.value.actual)

    if (resultado.exito) {
      exitoContrasena.value = true
      contrasenas.value = { actual: '', nueva: '', confirmar: '' }
      setTimeout(() => {
        exitoContrasena.value = false
      }, 3000)
    } else {
      errorContrasena.value = resultado.error || 'Error al cambiar la contraseña'
    }
  } catch (err) {
    errorContrasena.value = 'Error al cambiar la contraseña'
  } finally {
    cargandoContrasena.value = false
  }
}

onMounted(() => {
  // Actualizar los valores del formulario si cambian en el store
  formulario.value.nombre = auth.perfil?.nombre || ''
  formulario.value.correo = auth.usuario?.email || ''
})
</script>
