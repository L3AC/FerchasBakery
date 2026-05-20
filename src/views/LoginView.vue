<template>
  <div class="min-h-screen bg-ferchas-fondo flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="font-titulo text-4xl text-ferchas-vino mb-2">FerchasBakery</h1>
        <p class="text-ferchas-cafe-claro">Sistema Administrativo</p>
      </div>

      <!-- Verificación de Email -->
      <div v-if="vista === 'verificar'" class="bg-white border-2 border-ferchas-oro/50 rounded-lg shadow-md p-8">
        <h2 class="font-titulo text-2xl text-ferchas-cafe mb-4 text-center">Verifica tu Correo</h2>
        <p class="text-sm text-ferchas-cafe-claro text-center mb-6">Ingresa el código enviado a {{ correoTemporal }}</p>
        
        <form @submit.prevent="verificarCodigo">
          <input v-model="codigo" type="text" maxlength="6" class="input-base text-center text-2xl tracking-widest mb-4" placeholder="000000" />
          
          <div v-if="error" class="bg-ferchas-error/10 border-l-4 border-ferchas-error text-ferchas-error p-3 rounded mb-4">
            <p class="text-sm">{{ error }}</p>
          </div>
          
          <button type="submit" :disabled="cargando" class="w-full btn-principal">
            {{ cargando ? 'Verificando...' : 'Verificar' }}
          </button>
          
          <button type="button" @click="reenviarCodigo" class="w-full text-sm text-ferchas-cafe-claro mt-4 hover:text-ferchas-cafe">
            ¿No recibiste el código? Reenviar
          </button>
        </form>
      </div>

      <!-- Setup Inicial (Primer Usuario) -->
      <div v-else-if="vista === 'setup'" class="bg-white border-2 border-ferchas-oro/50 rounded-lg shadow-md p-8">
        <h2 class="font-titulo text-2xl text-ferchas-cafe mb-2 text-center">Configuración Inicial</h2>
        <p class="text-sm text-ferchas-cafe-claro text-center mb-6">Crea tu cuenta de administrador</p>
        
        <form @submit.prevent="crearUsuario">
          <input v-model="formulario.nombre" type="text" required class="input-base mb-4" placeholder="Nombre completo" />
          <input v-model="formulario.correo" type="email" required class="input-base mb-4" placeholder="Correo electrónico" />
          <input v-model="formulario.contrasena" type="password" required minlength="6" class="input-base mb-4" placeholder="Contraseña" />
          <input v-model="formulario.confirmar" type="password" required class="input-base mb-4" placeholder="Confirmar contraseña" />
          
          <div v-if="error" class="bg-ferchas-error/10 border-l-4 border-ferchas-error text-ferchas-error p-3 rounded mb-4">
            <p class="text-sm">{{ error }}</p>
          </div>
          
          <button type="submit" :disabled="cargando" class="w-full btn-principal">
            {{ cargando ? 'Creando...' : 'Crear Cuenta' }}
          </button>
        </form>
      </div>

      <!-- Login Normal -->
      <div v-else class="bg-white border-2 border-ferchas-rosa/30 rounded-lg shadow-md p-8">
        <h2 class="font-titulo text-2xl text-ferchas-cafe mb-6 text-center">Iniciar Sesión</h2>
        
        <form @submit.prevent="iniciarSesion">
          <input v-model="formulario.correo" type="email" required class="input-base mb-4" placeholder="Correo electrónico" />
          <input v-model="formulario.contrasena" type="password" required class="input-base mb-4" placeholder="Contraseña" />
          
          <div v-if="error" class="bg-ferchas-error/10 border-l-4 border-ferchas-error text-ferchas-error p-3 rounded mb-4">
            <p class="text-sm">{{ error }}</p>
          </div>
          
          <button type="submit" :disabled="cargando" class="w-full btn-principal">
            {{ cargando ? 'Cargando...' : 'Iniciar Sesión' }}
          </button>
        </form>
        
        <p class="text-center text-sm text-ferchas-cafe-claro mt-6">Sistema de uso interno</p>
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
const correoTemporal = ref('')
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
      correoTemporal.value = correo
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
  
  const resultado = await servicioAutenticacion.verificarEmail(correoTemporal.value, codigo.value)
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
  await servicioAutenticacion.reenviarVerificacion(correoTemporal.value)
  error.value = 'Código reenviado'
}
</script>