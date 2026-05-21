<template>
  <aside class="bg-ferchas-fondo-oscuro border-r-2 border-ferchas-cafe/10 w-64 min-h-screen p-4">
    <nav class="space-y-1">
      <!-- Dashboard -->
      <router-link
        to="/dashboard"
        :class="[
          'block px-5 py-3 rounded-lg font-cuerpo transition-all duration-200 text-sm',
          $route.path === '/dashboard'
            ? 'bg-ferchas-rosa text-white shadow-sm'
            : 'text-ferchas-cafe hover:bg-ferchas-fondo hover:translate-x-0.5'
        ]"
      >
        Dashboard
      </router-link>

      <!-- Productos -->
      <router-link
        to="/productos"
        :class="[
          'block px-5 py-3 rounded-lg font-cuerpo transition-all duration-200 text-sm',
          $route.path === '/productos'
            ? 'bg-ferchas-rosa text-white shadow-sm'
            : 'text-ferchas-cafe hover:bg-ferchas-fondo hover:translate-x-0.5'
        ]"
      >
        Productos
      </router-link>

      <!-- Categorías (Solo Admin) -->
      <router-link
        v-if="almacenAuth.esAdmin"
        to="/categorias"
        :class="[
          'block px-5 py-3 rounded-lg font-cuerpo transition-all duration-200 text-sm',
          $route.path === '/categorias'
            ? 'bg-ferchas-rosa text-white shadow-sm'
            : 'text-ferchas-cafe hover:bg-ferchas-fondo hover:translate-x-0.5'
        ]"
      >
        Categorías
      </router-link>

      <!-- Pedidos -->
      <router-link
        to="/pedidos"
        :class="[
          'block px-5 py-3 rounded-lg font-cuerpo transition-all duration-200 text-sm',
          $route.path === '/pedidos'
            ? 'bg-ferchas-rosa text-white shadow-sm'
            : 'text-ferchas-cafe hover:bg-ferchas-fondo hover:translate-x-0.5'
        ]"
      >
        Pedidos
      </router-link>

      <!-- Clientes -->
      <router-link
        to="/clientes"
        :class="[
          'block px-5 py-3 rounded-lg font-cuerpo transition-all duration-200 text-sm',
          $route.path === '/clientes'
            ? 'bg-ferchas-rosa text-white shadow-sm'
            : 'text-ferchas-cafe hover:bg-ferchas-fondo hover:translate-x-0.5'
        ]"
      >
        Clientes
      </router-link>

      <!-- Proveedores (Solo Admin) -->
      <router-link
        v-if="almacenAuth.esAdmin"
        to="/proveedores"
        :class="[
          'block px-5 py-3 rounded-lg font-cuerpo transition-all duration-200 text-sm',
          $route.path === '/proveedores'
            ? 'bg-ferchas-rosa text-white shadow-sm'
            : 'text-ferchas-cafe hover:bg-ferchas-fondo hover:translate-x-0.5'
        ]"
      >
        Proveedores
      </router-link>

      <!-- Usuarios (Solo Admin) -->
      <router-link
        v-if="almacenAuth.esAdmin"
        to="/usuarios"
        :class="[
          'block px-5 py-3 rounded-lg font-cuerpo transition-all duration-200 text-sm',
          $route.path === '/usuarios'
            ? 'bg-ferchas-rosa text-white shadow-sm'
            : 'text-ferchas-cafe hover:bg-ferchas-fondo hover:translate-x-0.5'
        ]"
      >
        Usuarios
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { useAlmacenAutenticacion } from '../../stores/almacenAutenticacion.js'

const almacenAuth = useAlmacenAutenticacion()
</script>