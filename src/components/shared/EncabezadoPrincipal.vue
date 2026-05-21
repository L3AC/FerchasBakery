<template>
  <header class="bg-ferchas-vino text-white px-6 py-4 shadow-sm">
    <div class="flex justify-between items-center">
      <!-- Logo y Título -->
      <div class="flex items-center gap-3">
        <img src="/img/logo.jpg" alt="Logo" class="w-10 h-10 rounded-full">
        <div>
          <h1 class="font-titulo text-xl font-semibold">FerchasBakery</h1>
          <p class="text-xs text-ferchas-rosa-suave">Sistema Administrativo</p>
        </div>
      </div>

      <!-- Menú Derecho -->
      <div class="flex items-center gap-6">
        <!-- Info del Usuario -->
        <div class="text-right hidden sm:block">
          <p class="font-semibold text-sm">{{ almacenAuth.usuario?.profile?.name || almacenAuth.usuario?.email }}</p>
          <p class="text-xs text-ferchas-rosa-suave uppercase">{{ almacenAuth.perfil?.rol || 'Usuario' }}</p>
        </div>

        <!-- Botón Perfil -->
        <router-link
          to="/perfil"
          class="px-3 py-2 text-sm text-white hover:bg-ferchas-vino-claro rounded-lg transition-colors duration-200"
          title="Mi perfil"
        >
          Perfil
        </router-link>

        <!-- Botón Cerrar Sesión -->
        <button
          @click="cerrarSesion"
          class="px-4 py-2 bg-ferchas-rosa text-white rounded-lg hover:bg-ferchas-rosa-oscuro transition-colors duration-200 text-sm font-semibold"
        >
          Salir
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAlmacenAutenticacion } from '../../stores/almacenAutenticacion.js'
import { useRouter } from 'vue-router'

const almacenAuth = useAlmacenAutenticacion()
const router = useRouter()

async function cerrarSesion() {
  const resultado = await almacenAuth.cerrarSesion()
  if (resultado.exito) {
    router.push('/login')
  }
}
</script>