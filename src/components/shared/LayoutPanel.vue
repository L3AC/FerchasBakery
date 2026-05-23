<template>
  <div class="min-h-screen bg-ferchas-fondo">
    <EncabezadoPrincipal
      :sidebar-colapsada="sidebarColapsada"
      :sidebar-mobile-abierta="sidebarMobileAbierta"
      @toggle-sidebar="sidebarMobileAbierta = !sidebarMobileAbierta"
      @toggle-colapso="sidebarColapsada = !sidebarColapsada"
    />
    <div class="flex relative">
      <BarralateralPrincipal
        :colapsada="sidebarColapsada"
        :mobile-abierta="sidebarMobileAbierta"
        @toggle-colapso="sidebarColapsada = !sidebarColapsada"
        @cerrar-mobile="sidebarMobileAbierta = false"
      />
      <div
        v-if="sidebarMobileAbierta"
        class="fixed inset-0 bg-black/40 z-10 lg:hidden"
        @click="sidebarMobileAbierta = false"
      />
      <main class="flex-1 bg-ferchas-fondo min-w-0">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import EncabezadoPrincipal from './EncabezadoPrincipal.vue'
import BarralateralPrincipal from './BarralateralPrincipal.vue'

const sidebarColapsada = ref(false)
const sidebarMobileAbierta = ref(false)
</script>
