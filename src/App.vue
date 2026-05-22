<template>
  <div id="app" class="min-h-screen bg-ferchas-fondo">
    <router-view />
  </div>
</template>

<script setup>
import { useAlmacenAutenticacion } from './controllers/ControladorAutenticacion.js'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const almacenAuth = useAlmacenAutenticacion()
const router = useRouter()

onMounted(async () => {
  try {
    const resultado = await almacenAuth.obtenerUsuarioActual()
    if (!resultado.exito && router.currentRoute.value.path !== '/login') {
      router.push('/login')
    }
  } catch (err) {
    if (router.currentRoute.value.path !== '/login') router.push('/login')
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
