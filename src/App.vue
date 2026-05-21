<template>
  <div id="app" class="min-h-screen bg-ferchas-fondo">
    <router-view />
  </div>
</template>

<script setup>
import { useAlmacenAutenticacion } from './stores/almacenAutenticacion.js'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { mockUsuarioActual } from './lib/datosMock.js'

const almacenAuth = useAlmacenAutenticacion()
const router = useRouter()

onMounted(async () => {
  // ---- MODO PROTOTIPO ----
  // Si hay una sesión de prototipo guardada, rehidrata el store sin llamar
  // a Insforge. Esto permite que refrescar la página (F5) no pierda la sesión.
  if (typeof localStorage !== 'undefined' && localStorage.getItem('prototipo_sesion') === 'true') {
    almacenAuth.usuario = { id: 'mock-id', email: mockUsuarioActual.correo }
    almacenAuth.token = 'mock-token'
    almacenAuth.perfil = {
      nombre: mockUsuarioActual.nombreCompleto,
      rol: mockUsuarioActual.rol,
      activo: true,
    }
    return
  }

  // ---- MODO REAL (Insforge) ----
  // Cuando el sistema esté conectado a Insforge, recupera la sesión guardada.
  try {
    const resultado = await almacenAuth.obtenerUsuarioActual()
    if (!resultado.exito && router.currentRoute.value.path !== '/login') {
      router.push('/login')
    }
  } catch (err) {
    // En el prototipo, Insforge puede no estar disponible — redirigir a login.
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
