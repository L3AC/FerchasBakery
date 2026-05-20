<template>
  <header class="bg-ferchas-vino text-white px-6 py-4 shadow-md">
    <div class="flex justify-between items-center">
      <!-- Logo y Título -->
      <div class="flex items-center space-x-4">
        <h1 class="font-titulo text-2xl font-bold">🎂 FerchasBakery</h1>
      </div>

      <!-- Info del Usuario y Menú -->
      <div class="flex items-center space-x-4">
        <div class="text-right text-sm">
          <p class="font-semibold">{{ almacenAuth.usuario?.profile?.name || almacenAuth.usuario?.email }}</p>
          <p class="text-ferchas-rosa-suave text-xs uppercase">{{ almacenAuth.perfil?.rol || 'Usuario' }}</p>
        </div>

        <!-- Botón de Cerrar Sesión -->
        <button
          @click="cerrarSesion"
          class="ml-4 bg-ferchas-rosa text-white px-4 py-2 rounded-lg hover:bg-ferchas-rosa-oscuro transition-colors duration-200 text-sm"
        >
          Cerrar Sesión
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
