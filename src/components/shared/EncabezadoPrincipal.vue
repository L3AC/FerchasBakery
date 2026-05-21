<template>
  <header class="bg-ferchas-vino text-white px-6 py-3.5 flex items-center justify-between shadow-md">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 bg-ferchas-rosa rounded-full flex items-center justify-center font-titulo text-xl text-ferchas-vino font-bold">F</div>
      <div>
        <div class="font-titulo text-lg leading-none">Ferchas Bakery</div>
        <div class="text-xs text-ferchas-rosa-suave">Panel administrativo</div>
      </div>
    </div>

    <div class="flex items-center gap-5">
      <button class="relative text-white hover:text-ferchas-rosa-suave transition-colors" title="Notificaciones">
        <Icono nombre="campana" :tamano="20" />
        <span class="absolute -top-1 -right-1 w-4 h-4 bg-ferchas-rosa text-ferchas-vino text-[10px] font-bold rounded-full flex items-center justify-center">3</span>
      </button>

      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 bg-ferchas-rosa rounded-full flex items-center justify-center font-bold text-ferchas-vino">{{ usuario.iniciales }}</div>
        <div class="text-sm">
          <div class="font-semibold leading-none">{{ usuario.nombreCorto }}</div>
          <div class="text-xs text-ferchas-rosa-suave">{{ usuario.rolEtiqueta }}</div>
        </div>
      </div>

      <button @click="cerrarSesion" class="flex items-center gap-1.5 text-sm bg-ferchas-vino-claro hover:bg-ferchas-rosa hover:text-ferchas-vino px-3 py-1.5 rounded-md transition-colors">
        <Icono nombre="salir" :tamano="14" />
        Cerrar sesión
      </button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Icono from './Icono.vue'
import { mockUsuarioActual } from '../../lib/datosMock.js'

const usuario = mockUsuarioActual
const router = useRouter()

function cerrarSesion() {
  // Limpia la sesión del prototipo y vuelve al login
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('prototipo_sesion')
  }
  router.push('/login')
}
</script>
