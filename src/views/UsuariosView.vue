<template>
  <div class="flex min-h-screen bg-ferchas-fondo">
    <BarralateralPrincipal />
    <div class="flex-1 flex flex-col">
      <EncabezadoPrincipal />
      <main class="flex-1 p-8 overflow-y-auto">
        <div class="max-w-6xl mx-auto">
          <h1 class="font-titulo text-4xl text-ferchas-cafe mb-8">👨‍💼 Gestión de Usuarios</h1>

          <!-- Tabla de Usuarios -->
          <div class="card-base overflow-x-auto">
            <table class="tabla-base w-full">
              <thead class="tabla-header">
                <tr>
                  <th class="px-4 py-3 text-left">Nombre</th>
                  <th class="px-4 py-3 text-left">Correo</th>
                  <th class="px-4 py-3 text-left">Rol</th>
                  <th class="px-4 py-3 text-center">Estado</th>
                  <th class="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="usuario in usuarios" :key="usuario.user_id" class="tabla-fila border-b">
                  <td class="px-4 py-3 font-semibold">{{ usuario.nombre }}</td>
                  <td class="px-4 py-3 text-sm">{{ usuario.user_id }}</td>
                  <td class="px-4 py-3">
                    <span v-if="usuario.rol === 'admin'" class="badge-exito">{{ usuario.rol }}</span>
                    <span v-else class="badge-info">{{ usuario.rol }}</span>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span v-if="usuario.activo" class="badge-exito">Activo</span>
                    <span v-else class="badge-error">Inactivo</span>
                  </td>
                  <td class="px-4 py-3 text-center space-x-2">
                    <button @click="cambiarRol(usuario)" class="text-ferchas-rosa hover:text-ferchas-rosa-oscuro text-sm">
                      Cambiar Rol
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="usuarios.length === 0" class="card-base text-center py-12">
            <p class="text-2xl mb-2">👤</p>
            <p class="text-ferchas-cafe font-semibold">No hay usuarios registrados</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import EncabezadoPrincipal from '../components/shared/EncabezadoPrincipal.vue'
import BarralateralPrincipal from '../components/shared/BarralateralPrincipal.vue'
import { servicioPerfiles } from '../services/servicioPerfiles.js'

const usuarios = ref([])

async function obtenerUsuarios() {
  const resultado = await servicioPerfiles.obtenerTodos()
  if (resultado.exito) {
    usuarios.value = resultado.perfiles
  }
}

async function cambiarRol(usuario) {
  const nuevoRol = usuario.rol === 'admin' ? 'empleado' : 'admin'
  if (confirm(`¿Cambiar rol de ${usuario.nombre} a ${nuevoRol}?`)) {
    const resultado = await servicioPerfiles.cambiarRol(usuario.user_id, nuevoRol)
    if (resultado.exito) {
      await obtenerUsuarios()
    }
  }
}

onMounted(async () => {
  await obtenerUsuarios()
})
</script>
