<template>
  <div class="min-h-screen bg-ferchas-fondo">
    <EncabezadoPrincipal />
    <div class="flex">
      <BarralateralPrincipal />
      <main class="flex-1 bg-ferchas-fondo">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import EncabezadoPrincipal from './EncabezadoPrincipal.vue'
import BarralateralPrincipal from './BarralateralPrincipal.vue'
</script>
