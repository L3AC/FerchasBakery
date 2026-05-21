<template>
  <div id="app" class="min-h-screen bg-ferchas-fondo">
    <router-view />
  </div>
</template>

<script setup>
// La sesión se restaura automáticamente en el guard de rutas (router/index.js)
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
