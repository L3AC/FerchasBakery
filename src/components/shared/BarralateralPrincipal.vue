<template>
  <aside class="w-60 bg-ferchas-fondo-oscuro min-h-[calc(100vh-64px)] border-r-2 border-ferchas-cafe/10 py-5">
    <nav>
      <router-link
        v-for="item in itemsPrincipales"
        :key="item.ruta"
        :to="item.ruta"
        :class="['flex items-center gap-3 px-5 py-3 transition-all duration-200',
          esRutaActiva(item.ruta) ? 'nav-item-activo' : 'text-ferchas-cafe hover:bg-ferchas-fondo hover:translate-x-1']"
      >
        <Icono :nombre="item.icono" :tamano="18" />
        <span>{{ item.etiqueta }}</span>
      </router-link>

      <div class="mt-4 pt-4 border-t border-ferchas-cafe/10">
        <div class="px-5 text-xs uppercase text-ferchas-cafe-claro font-bold tracking-wider mb-2">Administración</div>
        <router-link
          v-for="item in itemsAdmin"
          :key="item.ruta"
          :to="item.ruta"
          :class="['flex items-center gap-3 px-5 py-3 transition-all duration-200',
            esRutaActiva(item.ruta) ? 'nav-item-activo' : 'text-ferchas-cafe hover:bg-ferchas-fondo hover:translate-x-1']"
        >
          <Icono :nombre="item.icono" :tamano="18" />
          <span>{{ item.etiqueta }}</span>
        </router-link>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import Icono from './Icono.vue'

const route = useRoute()

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

function esRutaActiva(ruta) { return route.path.startsWith(ruta) }
</script>
