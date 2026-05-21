<template>
  <div id="app" class="min-h-screen bg-ferchas-fondo">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAlmacenAutenticacion } from './stores/almacenAutenticacion.js'

const almacenAuth = useAlmacenAutenticacion()
const router = useRouter()

onMounted(async () => {
  // Intenta recuperar la sesión guardada en localStorage
  const resultado = await almacenAuth.obtenerUsuarioActual()

  // Si no hay sesión válida y no estamos en /login, redirige al login
  if (!resultado.exito && router.currentRoute.value.path !== '/login') {
    router.push('/login')
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
}

#app {
  height: 100%;
}
</style>
