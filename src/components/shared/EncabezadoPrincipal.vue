<template>
  <header class="bg-ferchas-vino text-white px-3 sm:px-6 py-3 flex items-center justify-between shadow-md">
    <div class="flex items-center gap-2 sm:gap-3">
      <button
        class="lg:hidden p-2 hover:bg-ferchas-vino-claro rounded-lg transition-colors"
        @click="$emit('toggleSidebar')"
        aria-label="Menú"
      >
        <Icono nombre="menu" :tamano="20" />
      </button>
      <img src="/img/logo.png" alt="Ferchas Bakery" class="w-9 h-9 rounded-full object-cover ring-2 ring-ferchas-rosa/50" />
      <div class="hidden sm:block">
        <div class="font-titulo text-lg leading-none">Ferchas Bakery</div>
        <div class="text-xs text-ferchas-rosa-suave">Panel administrativo</div>
      </div>
      <button
        class="hidden lg:flex p-1.5 ml-1 text-ferchas-rosa-suave hover:text-white hover:bg-ferchas-vino-claro rounded-lg transition-colors"
        @click="emit('toggleColapso')"
        :title="sidebarColapsada ? 'Expandir menú' : 'Colapsar menú'"
      >
        <Icono :nombre="sidebarColapsada ? 'menu' : 'cerrar'" :tamano="18" />
      </button>
    </div>

    <div class="flex items-center gap-2 sm:gap-4">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 sm:w-9 sm:h-9 bg-ferchas-rosa rounded-full flex items-center justify-center font-bold text-ferchas-vino text-sm sm:text-base">{{ usuario.iniciales }}</div>
        <div class="text-xs sm:text-sm leading-tight hidden sm:block">
          <div class="font-semibold">{{ usuario.nombreCorto }}</div>
          <div class="text-[10px] sm:text-xs text-ferchas-rosa-suave">{{ usuario.rolEtiqueta }}</div>
        </div>
      </div>

      <button @click="cerrarSesion" class="flex items-center gap-1 text-xs sm:text-sm bg-ferchas-vino-claro hover:bg-ferchas-rosa hover:text-ferchas-vino px-2 sm:px-3 py-1.5 rounded-md transition-colors whitespace-nowrap">
        <Icono nombre="salir" :tamano="14" />
        <span class="hidden sm:inline">Cerrar sesión</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Icono from './Icono.vue'
import { useAlmacenAutenticacion } from '../../controllers/ControladorAutenticacion.js'

const emit = defineEmits(['toggleSidebar', 'toggleColapso'])

defineProps({
  sidebarColapsada: { type: Boolean, default: false }
})

const auth = useAlmacenAutenticacion()
const router = useRouter()

const usuario = computed(() => {
  const nombre = auth.perfil?.nombre || 'Usuario'
  const partes = nombre.split(' ')
  return {
    iniciales: partes.map(p => p[0]).join('').toUpperCase().slice(0, 2),
    nombreCorto: partes[0] || 'Usuario',
    rolEtiqueta: auth.perfil?.rol === 'admin' ? 'Admin' : auth.perfil?.rol === 'empleado' ? 'Empleado' : 'Usuario'
  }
})

async function cerrarSesion() {
  await auth.cerrarSesion()
  router.push('/login')
}
</script>