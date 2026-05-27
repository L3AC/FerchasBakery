<template>
  <aside
    :class="[
      'bg-ferchas-fondo-oscuro border-r-2 border-ferchas-cafe/10 py-5 transition-all duration-300 flex flex-col',
      'fixed lg:static inset-y-0 left-0 z-20 lg:min-h-[calc(100vh-56px)]',
      mobileAbierta ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      colapsada ? 'w-16' : 'w-60'
    ]"
  >
    <nav class="flex-1 overflow-y-auto">
      <router-link
        v-for="item in itemsPrincipalesFilttrados"
        :key="item.ruta"
        :to="item.ruta"
        @click="$emit('cerrarMobile')"
        :class="[
          'flex items-center transition-all duration-200',
          colapsada ? 'justify-center px-0 py-3' : 'gap-3 px-5 py-3',
          esRutaActiva(item.ruta) ? 'nav-item-activo' : 'text-ferchas-cafe hover:bg-ferchas-fondo hover:translate-x-1'
        ]"
        :title="colapsada ? item.etiqueta : ''"
      >
        <Icono :nombre="item.icono" :tamano="20" />
        <span v-if="!colapsada" class="whitespace-nowrap">{{ item.etiqueta }}</span>
      </router-link>

      <div :class="['border-t border-ferchas-cafe/10', colapsada ? 'mt-2 pt-2 mx-2' : 'mt-4 pt-4']">
        <div v-if="!colapsada" class="px-5 text-xs uppercase text-ferchas-cafe-claro font-bold tracking-wider mb-2">Administración</div>
        <router-link
          v-for="item in itemsAdminFiltrados"
          :key="item.ruta"
          :to="item.ruta"
          @click="$emit('cerrarMobile')"
          :class="[
            'flex items-center transition-all duration-200',
            colapsada ? 'justify-center px-0 py-3' : 'gap-3 px-5 py-3',
            esRutaActiva(item.ruta) ? 'nav-item-activo' : 'text-ferchas-cafe hover:bg-ferchas-fondo hover:translate-x-1'
          ]"
          :title="colapsada ? item.etiqueta : ''"
        >
          <Icono :nombre="item.icono" :tamano="20" />
          <span v-if="!colapsada" class="whitespace-nowrap">{{ item.etiqueta }}</span>
        </router-link>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import Icono from './Icono.vue'
import { useAlmacenAutenticacion } from '../../controllers/ControladorAutenticacion.js'

defineProps({
  colapsada: { type: Boolean, default: false },
  mobileAbierta: { type: Boolean, default: false }
})

defineEmits(['toggleColapso', 'cerrarMobile'])

const route = useRoute()
const almacenAuth = useAlmacenAutenticacion()

const itemsPrincipales = [
  { ruta: '/dashboard',   etiqueta: 'Dashboard',   icono: 'dashboard'   },
  { ruta: '/productos',   etiqueta: 'Productos',   icono: 'productos'   },
  { ruta: '/pedidos',     etiqueta: 'Pedidos',     icono: 'pedidos'     },
  { ruta: '/clientes',    etiqueta: 'Clientes',    icono: 'clientes'    },
  { ruta: '/proveedores', etiqueta: 'Proveedores', icono: 'proveedores' },
]

const itemsAdmin = [
  { ruta: '/categorias', etiqueta: 'Categorias', icono: 'categorias' },
  { ruta: '/usuarios',   etiqueta: 'Usuarios',   icono: 'usuarios'   },
  { ruta: '/mi-perfil',  etiqueta: 'Mi perfil',  icono: 'perfil'     },
]

// Filtrar items según el rol del usuario
const itemsPrincipalesFilttrados = computed(() => {
  // Empleados no pueden ver Proveedores
  if (almacenAuth.esEmpleado) {
    return itemsPrincipales.filter(item => item.ruta !== '/proveedores')
  }
  return itemsPrincipales
})

const itemsAdminFiltrados = computed(() => {
  // Solo principal y admin pueden ver items de administración
  if (almacenAuth.esEmpleado) {
    return itemsAdmin.filter(item => item.ruta === '/mi-perfil')
  }
  // Admin no puede ver Categorias (solo principal)
  if (almacenAuth.esAdmin && !almacenAuth.esPrincipal) {
    return itemsAdmin.filter(item => item.ruta !== '/categorias')
  }
  return itemsAdmin
})

function esRutaActiva(ruta) { return route.path.startsWith(ruta) }
</script>
