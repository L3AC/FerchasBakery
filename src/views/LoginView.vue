<template>
  <div class="min-h-screen bg-ferchas-fondo flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <!-- Logo y Branding -->
      <div class="text-center mb-8">
        <img src="/img/logo.jpg" alt="FerchasBakery" class="w-24 h-24 mx-auto mb-6 rounded-full shadow-md">
        <h1 class="font-titulo text-4xl text-ferchas-cafe mb-1">FerchasBakery</h1>
        <p class="text-sm text-ferchas-cafe-claro">Sistema Administrativo</p>
      </div>

      <!-- Verificación de Email -->
      <div v-if="vista === 'verificar'" class="bg-white border-2 border-ferchas-rosa/40 rounded-lg shadow-sm p-8">
        <h2 class="font-titulo text-2xl text-ferchas-cafe mb-2 text-center">Verifica tu correo</h2>
        <p class="text-sm text-ferchas-cafe-claro text-center mb-6">Ingresa el código de 6 dígitos</p>
        
        <form @submit.prevent="verificarCodigo" class="space-y-5">
          <div>
            <label class="block text-sm font-semibold text-ferchas-cafe mb-2">Código</label>
            <input 
              v-model="codigo" 
              type="text" 
              maxlength="6" 
              class="input-base text-center text-xl tracking-widest" 
              placeholder="000000" 
            />
          </div>
          
          <div v-if="error" class="bg-ferchas-error/10 border-l-4 border-ferchas-error text-ferchas-error p-3 rounded text-sm">
            {{ error }}
          </div>
          
          <button type="submit" :disabled="cargando" class="w-full btn-principal">
            {{ cargando ? 'Verificando...' : 'Verificar' }}
          </button>
          
          <button type="button" @click="reenviarCodigo" class="w-full text-sm text-ferchas-cafe-claro hover:text-ferchas-cafe py-2">
            Reenviar código
          </button>
        </form>
      </div>

      <!-- Setup Inicial (Primer Usuario) -->
      <div v-else-if="vista === 'setup'" class="bg-white border-2 border-ferchas-rosa/40 rounded-lg shadow-sm p-8">
        <h2 class="font-titulo text-2xl text-ferchas-cafe mb-1 text-center">Crear Cuenta Admin</h2>
        <p class="text-sm text-ferchas-cafe-claro text-center mb-6">Configura tu cuenta de administrador</p>
        
        <form @submit.prevent="crearUsuario" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-ferchas-cafe mb-2">Nombre completo</label>
            <input v-model="formulario.nombre" type="text" required class="input-base" placeholder="Tu nombre" />
          </div>

          <div>
            <label class="block text-sm font-semibold text-ferchas-cafe mb-2">Correo electrónico</label>
            <input v-model="formulario.correo" type="email" required class="input-base" placeholder="admin@ejemplo.com" />
          </div>

          <div>
            <label class="block text-sm font-semibold text-ferchas-cafe mb-2">Contraseña</label>
            <input v-model="formulario.contrasena" type="password" required minlength="6" class="input-base" placeholder="Mínimo 6 caracteres" />
          </div>

          <div>
            <label class="block text-sm font-semibold text-ferchas-cafe mb-2">Confirmar contraseña</label>
            <input v-model="formulario.confirmar" type="password" required class="input-base" placeholder="Repite tu contraseña" />
          </div>
          
          <div v-if="error" class="bg-ferchas-error/10 border-l-4 border-ferchas-error text-ferchas-error p-3 rounded text-sm">
            {{ error }}
          </div>
          
          <button type="submit" :disabled="cargando" class="w-full btn-principal mt-2">
            {{ cargando ? 'Creando cuenta...' : 'Crear cuenta' }}
          </button>
        </form>
      </div>

      <!-- Login Normal -->
      <div v-else class="bg-white border-2 border-ferchas-rosa/40 rounded-lg shadow-sm p-8">
        <h2 class="font-titulo text-2xl text-ferchas-cafe mb-6 text-center">Iniciar sesión</h2>
        
        <form @submit.prevent="iniciarSesion" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-ferchas-cafe mb-2">Correo electrónico</label>
            <input v-model="formulario.correo" type="email" required class="input-base" placeholder="usuario@ejemplo.com" />
          </div>

          <div>
            <label class="block text-sm font-semibold text-ferchas-cafe mb-2">Contraseña</label>
            <input v-model="formulario.contrasena" type="password" required class="input-base" placeholder="Tu contraseña" />
          </div>
          
          <div v-if="error" class="bg-ferchas-error/10 border-l-4 border-ferchas-error text-ferchas-error p-3 rounded text-sm">
            {{ error }}
          </div>
          
          <button type="submit" :disabled="cargando" class="w-full btn-principal mt-2">
            {{ cargando ? 'Ingresando...' : 'Ingresar' }}
          </button>
        </form>
        
        <p class="text-center text-xs text-ferchas-cafe-claro mt-6">Solo para uso interno de la repostería</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAlmacenAutenticacion } from '../stores/almacenAutenticacion.js'
import { servicioPerfiles } from '../services/servicioPerfiles.js'
import { servicioAutenticacion } from '../services/servicioAutenticacion.js'

const router = useRouter()
const almacenAuth = useAlmacenAutenticacion()

const vista = ref('cargando')
const cargando = ref(true)
const error = ref(null)
const codigo = ref('')

const formulario = ref({ nombre: '', correo: '', contrasena: '', confirmar: '' })

onMounted(async () => {
  const resultado = await servicioPerfiles.verificarExistencia()
  vista.value = resultado.existenUsuarios ? 'login' : 'setup'
  cargando.value = false
})

async function iniciarSesion() {
  if (!formulario.value.correo || !formulario.value.contrasena) {
    error.value = 'Completa todos los campos'
    return
  }
  cargando.value = true
  error.value = null
  
  const resultado = await almacenAuth.iniciarSesion(formulario.value.correo, formulario.value.contrasena)
  if (resultado.exito) {
    router.push('/dashboard')
  } else {
    error.value = resultado.error
  }
  cargando.value = false
}

async function crearUsuario() {
  const { nombre, correo, contrasena, confirmar } = formulario.value
  if (!nombre || !correo || !contrasena || !confirmar) {
    error.value = 'Completa todos los campos'
    return
  }
  if (contrasena !== confirmar) {
    error.value = 'Las contraseñas no coinciden'
    return
  }
  if (contrasena.length < 6) {
    error.value = 'Mínimo 6 caracteres'
    return
  }
  
  cargando.value = true
  error.value = null
  
  const resultado = await servicioAutenticacion.registrarse(correo, contrasena, nombre)
  if (resultado.exito) {
    if (resultado.requiereVerificacion) {
      codigo.value = ''
      vista.value = 'verificar'
    } else {
      await almacenAuth.iniciarSesion(correo, contrasena)
      await servicioPerfiles.crear({ user_id: almacenAuth.usuario.id, nombre, rol: 'admin', activo: true })
      router.push('/dashboard')
    }
  } else {
    error.value = resultado.error
  }
  cargando.value = false
}

async function verificarCodigo() {
  if (!codigo.value || codigo.value.length !== 6) {
    error.value = 'Ingresa el código de 6 dígitos'
    return
  }
  cargando.value = true
  error.value = null
  
  const resultado = await servicioAutenticacion.verificarEmail(formulario.value.correo, codigo.value)
  if (resultado.exito) {
    await almacenAuth.iniciarSesion(formulario.value.correo, formulario.value.contrasena)
    const perfil = await servicioPerfiles.obtenerPorUserId(almacenAuth.usuario.id)
    if (!perfil.exito) {
      await servicioPerfiles.crear({ user_id: almacenAuth.usuario.id, nombre: formulario.value.nombre, rol: 'admin', activo: true })
    }
    router.push('/dashboard')
  } else {
    error.value = resultado.error
  }
  cargando.value = false
}

async function reenviarCodigo() {
  await servicioAutenticacion.reenviarVerificacion(formulario.value.correo)
  error.value = 'Código reenviado. Revisa tu correo'
}
</script>