<template>
  <aside class="bg-ferchas-fondo-oscuro border-r-2 border-ferchas-cafe/10 w-64 min-h-screen p-4">
    <nav class="space-y-2">
      <!-- Dashboard -->
      <router-link
        to="/dashboard"
        :class="[
          'block px-5 py-3 rounded-lg font-cuerpo transition-all duration-200',
          $route.path === '/dashboard'
            ? 'bg-ferchas-rosa text-white shadow-md'
            : 'text-ferchas-cafe hover:bg-ferchas-fondo hover:translate-x-1'
        ]"
      >
        📊 Dashboard
      </router-link>

      <!-- Productos -->
      <router-link
        to="/productos"
        :class="[
          'block px-5 py-3 rounded-lg font-cuerpo transition-all duration-200',
          $route.path === '/productos'
            ? 'bg-ferchas-rosa text-white shadow-md'
            : 'text-ferchas-cafe hover:bg-ferchas-fondo hover:translate-x-1'
        ]"
      >
        🧁 Productos
      </router-link>

      <!-- Pedidos -->
      <router-link
        to="/pedidos"
        :class="[
          'block px-5 py-3 rounded-lg font-cuerpo transition-all duration-200',
          $route.path === '/pedidos'
            ? 'bg-ferchas-rosa text-white shadow-md'
            : 'text-ferchas-cafe hover:bg-ferchas-fondo hover:translate-x-1'
        ]"
      >
        📦 Pedidos
      </router-link>

      <!-- Clientes -->
      <router-link
        to="/clientes"
        :class="[
          'block px-5 py-3 rounded-lg font-cuerpo transition-all duration-200',
          $route.path === '/clientes'
            ? 'bg-ferchas-rosa text-white shadow-md'
            : 'text-ferchas-cafe hover:bg-ferchas-fondo hover:translate-x-1'
        ]"
      >
        👥 Clientes
      </router-link>

      <!-- Proveedores (Solo Admin) -->
      <router-link
        v-if="almacenAuth.esAdmin"
        to="/proveedores"
        :class="[
          'block px-5 py-3 rounded-lg font-cuerpo transition-all duration-200',
          $route.path === '/proveedores'
            ? 'bg-ferchas-rosa text-white shadow-md'
            : 'text-ferchas-cafe hover:bg-ferchas-fondo hover:translate-x-1'
        ]"
      >
        🚚 Proveedores
      </router-link>

      <!-- Usuarios (Solo Admin) -->
      <router-link
        v-if="almacenAuth.esAdmin"
        to="/usuarios"
        :class="[
          'block px-5 py-3 rounded-lg font-cuerpo transition-all duration-200',
          $route.path === '/usuarios'
            ? 'bg-ferchas-rosa text-white shadow-md'
            : 'text-ferchas-cafe hover:bg-ferchas-fondo hover:translate-x-1'
        ]"
      >
        👨‍💼 Usuarios
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { useAlmacenAutenticacion } from '../stores/almacenAutenticacion.js'

const almacenAuth = useAlmacenAutenticacion()
</script>
