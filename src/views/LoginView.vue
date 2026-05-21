<template>
  <div class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Fondo decorativo -->
    <div class="absolute inset-0 -z-10"
         style="background: radial-gradient(circle at 30% 20%, #EBCED6 0%, #F0F0F0 45%, #E5E5E5 100%);"></div>
    <div class="absolute top-0 right-0 w-96 h-96 -z-10 opacity-30 rounded-full"
         style="background: radial-gradient(circle, #DF9CB4 0%, transparent 70%);"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 -z-10 opacity-20 rounded-full"
         style="background: radial-gradient(circle, #4A1818 0%, transparent 70%);"></div>

    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="w-20 h-20 bg-ferchas-vino rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
          <span class="font-titulo text-4xl text-ferchas-rosa font-bold">F</span>
        </div>
        <h1 class="font-titulo text-4xl text-ferchas-vino mb-1">Ferchas Bakery</h1>
        <p class="text-sm text-ferchas-cafe-claro">Panel administrativo</p>
      </div>

      <div class="bg-white border-2 border-ferchas-rosa/30 rounded-xl shadow-xl p-8">
        <h2 class="font-titulo text-2xl text-ferchas-cafe mb-1">Iniciar sesión</h2>
        <p class="text-sm text-ferchas-cafe-claro mb-6">Acceso para personal autorizado</p>

        <form @submit.prevent="iniciarSesion">
          <label class="block mb-4">
            <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Correo electrónico</span>
            <input v-model="formulario.correo" type="email" required
                   placeholder="correo@ferchasbakery.com" class="input-base">
          </label>

          <label class="block mb-5">
            <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Contraseña</span>
            <div class="relative">
              <input v-model="formulario.contrasena" :type="mostrarPassword ? 'text' : 'password'"
                     required placeholder="••••••••" class="input-base pr-10">
              <button type="button" @click="mostrarPassword = !mostrarPassword"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-ferchas-cafe-claro hover:text-ferchas-vino">
                <Icono nombre="ojo" :tamano="18" />
              </button>
            </div>
          </label>

          <div v-if="error" class="bg-ferchas-error/10 border-l-4 border-ferchas-error text-ferchas-error p-3 rounded mb-4">
            <p class="text-sm">{{ error }}</p>
          </div>

          <button type="submit" :disabled="cargando" class="w-full btn-principal">
            {{ cargando ? 'Cargando…' : 'Iniciar sesión' }}
          </button>
        </form>

        <p class="text-center text-xs text-ferchas-cafe-claro mt-6">Sistema de uso interno · FerchasBakery 2026</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Icono from '../components/shared/Icono.vue'
import { useAlmacenAutenticacion } from '../stores/almacenAutenticacion.js'

const router = useRouter()
const almacenAuth = useAlmacenAutenticacion()
const cargando = ref(false)
const error = ref(null)
const mostrarPassword = ref(false)

const formulario = ref({
  correo: '',
  contrasena: '',
})

async function iniciarSesion() {
  cargando.value = true
  error.value = null

  const resultado = await almacenAuth.iniciarSesion(formulario.value.correo, formulario.value.contrasena)
  if (resultado.exito) {
    router.push('/dashboard')
  } else {
    error.value = resultado.error || 'Credenciales inválidas'
  }
  cargando.value = false
}
</script>
