<template>
  <header class="bg-ferchas-vino text-white px-6 py-3 flex items-center justify-between shadow-md sticky top-0 z-30">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 bg-ferchas-rosa rounded-full flex items-center justify-center font-titulo text-2xl text-ferchas-vino font-bold">
        F
      </div>
      <div>
        <h1 class="font-titulo text-xl leading-none">Ferchas Bakery</h1>
        <p class="text-xs text-ferchas-rosa-suave mt-0.5">Panel administrativo</p>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <button class="relative text-ferchas-rosa-suave hover:text-white transition-colors">
        <Icono nombre="campana" :tamano="20" />
        <span class="absolute -top-1 -right-1 bg-ferchas-rosa text-ferchas-vino text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">3</span>
      </button>

      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 bg-ferchas-rosa rounded-full flex items-center justify-center font-bold text-ferchas-vino">
          {{ iniciales }}
        </div>
        <div class="text-sm">
          <div class="font-semibold leading-none">{{ nombreCorto }}</div>
          <div class="text-xs text-ferchas-rosa-suave">{{ rolEtiqueta }}</div>
        </div>
      </div>

      <button @click="cerrarSesion" class="flex items-center gap-1.5 text-sm bg-ferchas-vino-claro hover:bg-ferchas-rosa hover:text-ferchas-vino px-3 py-1.5 rounded-md transition-colors">
        <Icono nombre="salir" :tamano="16" /> Cerrar sesión
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Icono from './Icono.vue'
import { useAlmacenAutenticacion } from '../../stores/almacenAutenticacion.js'

const router = useRouter()
const almacenAuth = useAlmacenAutenticacion()

// Calcula iniciales del nombre del perfil real
const iniciales = computed(() => {
  const nombre = almacenAuth.perfil?.nombre
  if (!nombre) return '??'
  const partes = nombre.trim().split(/\s+/)
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
})

// Nombre corto: primer nombre + primer apellido
const nombreCorto = computed(() => {
  const nombre = almacenAuth.perfil?.nombre || 'Usuario'
  const partes = nombre.trim().split(/\s+/)
  if (partes.length <= 2) return nombre
  return `${partes[0]} ${partes[partes.length - 2]}`
})

const rolEtiqueta = computed(() => {
  return almacenAuth.perfil?.rol === 'admin' ? 'Administrador(a)' : 'Empleado(a)'
})

async function cerrarSesion() {
  await almacenAuth.cerrarSesion()
  router.push('/login')
}
</script>
