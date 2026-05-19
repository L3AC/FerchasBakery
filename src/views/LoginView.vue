<template>
  <div class="min-h-screen bg-ferchas-fondo flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo y Título -->
      <div class="text-center mb-8">
        <h1 class="font-titulo text-4xl text-ferchas-vino mb-2">FerchasBakery</h1>
        <p class="text-ferchas-cafe-claro">Sistema Administrativo</p>
      </div>

      <!-- Tarjeta de Login -->
      <div class="bg-white border-2 border-ferchas-rosa/30 rounded-lg shadow-md p-8">
        <h2 class="font-titulo text-2xl text-ferchas-cafe mb-6 text-center">Iniciar Sesión</h2>

        <!-- Formulario -->
        <form @submit.prevent="iniciarSesion" class="space-y-5">
          <!-- Correo -->
          <div>
            <label class="block text-sm font-semibold text-ferchas-cafe mb-2">
              Correo Electrónico
            </label>
            <input
              v-model="formulario.correo"
              type="email"
              required
              class="input-base"
              placeholder="usuario@ejemplo.com"
            />
          </div>

          <!-- Contraseña -->
          <div>
            <label class="block text-sm font-semibold text-ferchas-cafe mb-2">
              Contraseña
            </label>
            <input
              v-model="formulario.contrasena"
              type="password"
              required
              class="input-base"
              placeholder="••••••••"
            />
          </div>

          <!-- Mensaje de Error -->
          <div v-if="error" class="bg-ferchas-error/10 border-l-4 border-ferchas-error text-ferchas-error p-4 rounded">
            <p class="font-semibold">Error</p>
            <p class="text-sm">{{ error }}</p>
          </div>

          <!-- Botón Enviar -->
          <button
            type="submit"
            :disabled="cargando"
            class="w-full btn-principal disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ cargando ? 'Cargando...' : 'Iniciar Sesión' }}
          </button>
        </form>

        <!-- Pie de página -->
        <p class="text-center text-sm text-ferchas-cafe-claro mt-6">
          Este sistema es solo para uso interno.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAlmacenAutenticacion } from '../stores/almacenAutenticacion.js'

const router = useRouter()
const almacenAuth = useAlmacenAutenticacion()

const formulario = ref({
  correo: '',
  contrasena: ''
})

const cargando = ref(false)
const error = ref(null)

async function iniciarSesion() {
  cargando.value = true
  error.value = null

  // Validaciones
  if (!formulario.value.correo || !formulario.value.contrasena) {
    error.value = 'Por favor completa todos los campos'
    cargando.value = false
    return
  }

  const resultado = await almacenAuth.iniciarSesion(
    formulario.value.correo,
    formulario.value.contrasena
  )

  if (resultado.exito) {
    // Redirigir al dashboard
    router.push('/dashboard')
  } else {
    error.value = resultado.error || 'Error al iniciar sesión'
  }

  cargando.value = false
}
</script>
