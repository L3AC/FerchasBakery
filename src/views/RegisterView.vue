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
      <!-- Logo y Branding -->
      <div class="text-center mb-8">
        <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg overflow-hidden">
          <img src="/img/logo.png" alt="Ferchas Bakery" class="w-full h-full object-cover" />
        </div>
        <h1 class="font-titulo text-4xl text-ferchas-vino mb-1">Ferchas Bakery</h1>
        <p class="text-sm text-ferchas-cafe-claro">{{ mostrandoVerificacion ? 'Verifica tu correo' : 'Primer registro de administrador' }}</p>
      </div>

      <!-- Formulario de verificación -->
      <div v-if="mostrandoVerificacion" class="bg-white border-2 border-ferchas-rosa/30 rounded-xl shadow-xl p-8">
        <h2 class="font-titulo text-2xl text-ferchas-cafe mb-1">Verifica tu correo</h2>
        <p class="text-sm text-ferchas-cafe-claro mb-4">Se envió un código de 6 dígitos a <strong>{{ emailVerificacion }}</strong></p>

        <form @submit.prevent="verificarCodigo">
          <label class="block mb-4">
            <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Código de verificación</span>
            <input v-model="codigoVerificacion" type="text" required maxlength="6"
                   placeholder="000000" class="input-base text-center text-2xl tracking-widest"
                   @input="codigoVerificacion = codigoVerificacion.replace(/\D/g, '')">
          </label>

          <div v-if="errorVerificacion" class="bg-ferchas-error/10 border-l-4 border-ferchas-error text-ferchas-error p-3 rounded mb-4">
            <p class="text-sm">{{ errorVerificacion }}</p>
          </div>

          <button type="submit" :disabled="cargandoVerificacion" class="w-full btn-principal mb-3">
            {{ cargandoVerificacion ? 'Verificando…' : 'Verificar correo' }}
          </button>

          <button type="button" @click="reenviarCodigo" :disabled="cargandoReenvio"
                  class="w-full text-sm text-ferchas-vino hover:text-ferchas-cafe font-semibold">
            {{ cargandoReenvio ? 'Reenviando…' : '¿No recibiste el código?' }}
          </button>
        </form>

        <p class="text-center text-xs text-ferchas-cafe-claro mt-6">Sistema de uso interno · FerchasBakery 2026</p>
      </div>

      <!-- Formulario de registro -->
      <div v-else class="bg-white border-2 border-ferchas-rosa/30 rounded-xl shadow-xl p-8">
        <h2 class="font-titulo text-2xl text-ferchas-cafe mb-1">Crear cuenta</h2>
        <p class="text-sm text-ferchas-cafe-claro mb-6">Registra el usuario administrador del sistema</p>

        <form @submit.prevent="registrarse">
          <label class="block mb-4">
            <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Correo electrónico</span>
            <input v-model="formulario.correo" type="email" required
                   placeholder="correo@ferchasbakery.com" class="input-base">
            <p v-if="errores.correo" class="text-xs text-ferchas-error mt-1">{{ errores.correo }}</p>
          </label>

          <label class="block mb-4">
            <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Nombre</span>
            <input v-model="formulario.nombre" type="text" required
                   placeholder="Tu nombre" class="input-base" maxlength="70">
            <p v-if="errores.nombre" class="text-xs text-ferchas-error mt-1">{{ errores.nombre }}</p>
          </label>

          <label class="block mb-5">
            <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Contraseña</span>
            <div class="relative">
              <input v-model="formulario.contrasena" :type="mostrarPassword ? 'text' : 'password'"
                     required placeholder="••••••••" class="input-base pr-10" minlength="6">
              <button type="button" @click="mostrarPassword = !mostrarPassword"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-ferchas-cafe-claro hover:text-ferchas-vino">
                <Icono nombre="ojo" :tamano="18" />
              </button>
            </div>
            <p class="text-xs text-ferchas-cafe-claro mt-1">Mínimo 6 caracteres</p>
            <p v-if="errores.contrasena" class="text-xs text-ferchas-error mt-1">{{ errores.contrasena }}</p>
          </label>

          <label class="block mb-5">
            <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Confirmar contraseña</span>
            <div class="relative">
              <input v-model="formulario.confirmarContrasena" :type="mostrarPassword2 ? 'text' : 'password'"
                     required placeholder="••••••••" class="input-base pr-10" minlength="6">
              <button type="button" @click="mostrarPassword2 = !mostrarPassword2"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-ferchas-cafe-claro hover:text-ferchas-vino">
                <Icono nombre="ojo" :tamano="18" />
              </button>
            </div>
            <p v-if="errores.confirmarContrasena" class="text-xs text-ferchas-error mt-1">{{ errores.confirmarContrasena }}</p>
          </label>

          <div v-if="error" class="bg-ferchas-error/10 border-l-4 border-ferchas-error text-ferchas-error p-3 rounded mb-4">
            <p class="text-sm">{{ error }}</p>
          </div>

          <button type="submit" :disabled="cargando" class="w-full btn-principal">
            {{ cargando ? 'Registrando…' : 'Crear cuenta' }}
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
import { useAlmacenAutenticacion } from '../controllers/ControladorAutenticacion.js'
import { servicioAutenticacion } from '../models/ModeloAutenticacion.js'

const router = useRouter()
const almacenAuth = useAlmacenAutenticacion()
const cargando = ref(false)
const error = ref(null)
const mostrarPassword = ref(false)
const mostrarPassword2 = ref(false)

// Estados para verificación
const mostrandoVerificacion = ref(false)
const emailVerificacion = ref('')
const codigoVerificacion = ref('')
const cargandoVerificacion = ref(false)
const cargandoReenvio = ref(false)
const errorVerificacion = ref(null)

const formulario = ref({
  correo: '',
  nombre: '',
  contrasena: '',
  confirmarContrasena: '',
})

const errores = ref({
  correo: '',
  nombre: '',
  contrasena: '',
  confirmarContrasena: '',
})

function validar() {
  errores.value = {}
  let valido = true

  // Validar correo
  if (!formulario.value.correo) {
    errores.value.correo = 'El correo es requerido'
    valido = false
  } else if (!formulario.value.correo.includes('@')) {
    errores.value.correo = 'Ingresa un correo válido'
    valido = false
  }

  // Validar nombre
  if (!formulario.value.nombre.trim()) {
    errores.value.nombre = 'El nombre es requerido'
    valido = false
  } else if (formulario.value.nombre.length < 3) {
    errores.value.nombre = 'El nombre debe tener al menos 3 caracteres'
    valido = false
  }

  // Validar contraseña
  if (!formulario.value.contrasena) {
    errores.value.contrasena = 'La contraseña es requerida'
    valido = false
  } else if (formulario.value.contrasena.length < 6) {
    errores.value.contrasena = 'Mínimo 6 caracteres'
    valido = false
  }

  // Validar confirmación
  if (formulario.value.contrasena !== formulario.value.confirmarContrasena) {
    errores.value.confirmarContrasena = 'Las contraseñas no coinciden'
    valido = false
  }

  return valido
}

async function registrarse() {
  if (!validar()) return

  cargando.value = true
  error.value = null

  const resultado = await almacenAuth.registrarPrimerUsuario(
    formulario.value.correo,
    formulario.value.contrasena,
    formulario.value.nombre
  )

  if (resultado.exito) {
    if (resultado.requiereVerificacion) {
      // Mostrar pantalla de verificación
      mostrandoVerificacion.value = true
      emailVerificacion.value = formulario.value.correo
      codigoVerificacion.value = ''
      errorVerificacion.value = null
    } else {
      // Login automático sin verificación
      router.push('/dashboard')
    }
  } else {
    error.value = resultado.error
  }

  cargando.value = false
}

async function verificarCodigo() {
  if (!codigoVerificacion.value || codigoVerificacion.value.length !== 6) {
    errorVerificacion.value = 'Ingresa un código válido de 6 dígitos'
    return
  }

  cargandoVerificacion.value = true
  errorVerificacion.value = null

  const resultado = await servicioAutenticacion.verificarEmail(
    emailVerificacion.value,
    codigoVerificacion.value
  )

  if (resultado.exito) {
    // Email verificado, iniciar sesión automáticamente
    await almacenAuth.iniciarSesion(formulario.value.correo, formulario.value.contrasena)
    router.push('/dashboard')
  } else {
    errorVerificacion.value = resultado.error || 'Código inválido o expirado'
  }

  cargandoVerificacion.value = false
}

async function reenviarCodigo() {
  cargandoReenvio.value = true
  errorVerificacion.value = null

  const resultado = await servicioAutenticacion.reenviarVerificacion(emailVerificacion.value)

  if (resultado.exito) {
    errorVerificacion.value = null
  } else {
    errorVerificacion.value = resultado.error || 'No se pudo reenviar el código'
  }

  cargandoReenvio.value = false
}
</script>

