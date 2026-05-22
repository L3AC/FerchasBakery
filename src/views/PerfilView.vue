<template>
  <div class="min-h-screen bg-ferchas-fondo">
    <EncabezadoPrincipal />
    <div class="flex">
      <BarralateralPrincipal />
      <main class="flex-1 p-8">
        <h1 class="text-3xl font-titulo font-bold text-ferchas-cafe mb-8">Mi Perfil</h1>

        <div class="max-w-2xl">
          <!-- Información General -->
          <div class="bg-white rounded-lg shadow-sm p-8 mb-6">
            <h2 class="text-2xl font-titulo font-semibold text-ferchas-cafe mb-6">Información Personal</h2>

            <form @submit.prevent="guardarPerfil" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-ferchas-cafe font-semibold mb-2">Nombre</label>
                  <input
                    v-model="formulario.nombre"
                    type="text"
                    class="input-base"
                    required
                  />
                </div>
                <div>
                  <label class="block text-ferchas-cafe font-semibold mb-2">Email</label>
                  <input
                    v-model="formulario.email"
                    type="email"
                    class="input-base bg-gray-100 cursor-not-allowed"
                    disabled
                  />
                  <p class="text-xs text-ferchas-cafe-claro mt-1">El email no puede ser modificado</p>
                </div>
              </div>

              <div>
                <label class="block text-ferchas-cafe font-semibold mb-2">Rol</label>
                <input
                  v-model="formulario.rol"
                  type="text"
                  class="input-base bg-gray-100 cursor-not-allowed"
                  disabled
                />
                <p class="text-xs text-ferchas-cafe-claro mt-1">Contacta al administrador para cambiar tu rol</p>
              </div>

              <div class="flex gap-3">
                <button
                  type="button"
                  @click="revertirCambios"
                  class="btn-secundario"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="cargandoPerfil"
                  class="btn-principal disabled:opacity-50"
                >
                  {{ cargandoPerfil ? 'Guardando...' : 'Guardar Cambios' }}
                </button>
              </div>

              <div v-if="errorPerfil" class="p-3 bg-ferchas-error/10 text-ferchas-error rounded-lg text-sm">
                {{ errorPerfil }}
              </div>
              <div v-if="exitoPerfil" class="p-3 bg-ferchas-exito/10 text-ferchas-exito rounded-lg text-sm">
                Perfil actualizado correctamente
              </div>
            </form>
          </div>

          <!-- Cambiar Contraseña -->
          <div class="bg-white rounded-lg shadow-sm p-8">
            <h2 class="text-2xl font-titulo font-semibold text-ferchas-cafe mb-6">Cambiar Contraseña</h2>

            <form @submit.prevent="cambiarContrasena" class="space-y-6">
              <div>
                <label class="block text-ferchas-cafe font-semibold mb-2">Contraseña Actual</label>
                <input
                  v-model="formularioContrasena.actual"
                  type="password"
                  class="input-base"
                  required
                />
              </div>

              <div>
                <label class="block text-ferchas-cafe font-semibold mb-2">Nueva Contraseña</label>
                <input
                  v-model="formularioContrasena.nueva"
                  type="password"
                  class="input-base"
                  required
                  minlength="8"
                />
                <p class="text-xs text-ferchas-cafe-claro mt-1">Mínimo 8 caracteres</p>
              </div>

              <div>
                <label class="block text-ferchas-cafe font-semibold mb-2">Confirmar Nueva Contraseña</label>
                <input
                  v-model="formularioContrasena.confirmar"
                  type="password"
                  class="input-base"
                  required
                  minlength="8"
                />
              </div>

              <div class="flex gap-3">
                <button
                  type="button"
                  @click="revertirContrasena"
                  class="btn-secundario"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="cargandoContrasena"
                  class="btn-principal disabled:opacity-50"
                >
                  {{ cargandoContrasena ? 'Cambiando...' : 'Cambiar Contraseña' }}
                </button>
              </div>

              <div v-if="errorContrasena" class="p-3 bg-ferchas-error/10 text-ferchas-error rounded-lg text-sm">
                {{ errorContrasena }}
              </div>
              <div v-if="exitoContrasena" class="p-3 bg-ferchas-exito/10 text-ferchas-exito rounded-lg text-sm">
                Contraseña cambiada correctamente
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import EncabezadoPrincipal from '../components/shared/EncabezadoPrincipal.vue'
import BarralateralPrincipal from '../components/shared/BarralateralPrincipal.vue'
import { useAlmacenAutenticacion } from '../controllers/ControladorAutenticacion.js'

const almacenAuth = useAlmacenAutenticacion()

const formulario = ref({ nombre: '', email: '', rol: '' })
const formularioContrasena = ref({ actual: '', nueva: '', confirmar: '' })
const cargandoPerfil = ref(false)
const cargandoContrasena = ref(false)
const errorPerfil = ref('')
const errorContrasena = ref('')
const exitoPerfil = ref(false)
const exitoContrasena = ref(false)

onMounted(() => {
  if (almacenAuth.usuario?.profile) {
    formulario.value.nombre = almacenAuth.usuario.profile.name || ''
    formulario.value.email = almacenAuth.usuario.email || ''
  }
  if (almacenAuth.perfil) {
    formulario.value.rol = almacenAuth.perfil.rol || 'Usuario'
  }
})

function revertirCambios() {
  if (almacenAuth.usuario?.profile) {
    formulario.value.nombre = almacenAuth.usuario.profile.name || ''
  }
  errorPerfil.value = ''
  exitoPerfil.value = false
}

async function guardarPerfil() {
  if (!formulario.value.nombre.trim()) {
    errorPerfil.value = 'El nombre es requerido'
    return
  }

  cargandoPerfil.value = true
  errorPerfil.value = ''
  exitoPerfil.value = false

  try {
    // TODO: Implementar actualización de perfil en Insforge
    // Por ahora solo mostramos éxito
    exitoPerfil.value = true
    setTimeout(() => {
      exitoPerfil.value = false
    }, 3000)
  } catch (err) {
    errorPerfil.value = err.message
  } finally {
    cargandoPerfil.value = false
  }
}

function revertirContrasena() {
  formularioContrasena.value = { actual: '', nueva: '', confirmar: '' }
  errorContrasena.value = ''
  exitoContrasena.value = false
}

async function cambiarContrasena() {
  if (!formularioContrasena.value.actual.trim()) {
    errorContrasena.value = 'Debes ingresar tu contraseña actual'
    return
  }

  if (!formularioContrasena.value.nueva.trim() || formularioContrasena.value.nueva.length < 8) {
    errorContrasena.value = 'La nueva contraseña debe tener al menos 8 caracteres'
    return
  }

  if (formularioContrasena.value.nueva !== formularioContrasena.value.confirmar) {
    errorContrasena.value = 'Las contraseñas no coinciden'
    return
  }

  cargandoContrasena.value = true
  errorContrasena.value = ''
  exitoContrasena.value = false

  try {
    // TODO: Implementar cambio de contraseña en Insforge
    // Por ahora solo mostramos éxito
    exitoContrasena.value = true
    revertirContrasena()
    setTimeout(() => {
      exitoContrasena.value = false
    }, 3000)
  } catch (err) {
    errorContrasena.value = err.message
  } finally {
    cargandoContrasena.value = false
  }
}
</script>