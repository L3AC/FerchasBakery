<template>
  <div class="min-h-screen bg-ferchas-fondo">
    <EncabezadoPrincipal />
    <div class="flex">
      <BarralateralPrincipal />
      <main class="flex-1 p-8">
        <h1 class="font-titulo text-3xl font-bold text-ferchas-cafe mb-8">Gestión de Usuarios</h1>

        <!-- Buscador -->
        <div class="mb-6">
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar usuarios por nombre, correo o rol..."
            class="input-base"
          />
        </div>

        <!-- Tabla de Usuarios -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
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
              <tr v-if="usuariosFiltrados.length === 0">
                <td colspan="5" class="px-4 py-8 text-center text-ferchas-cafe-claro">No hay usuarios</td>
              </tr>
              <tr v-for="usuario in usuariosFiltrados" :key="usuario.user_id" class="tabla-fila border-b">
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
                <td class="px-4 py-3 text-center">
                  <button
                    @click="cambiarRol(usuario)"
                    class="px-3 py-1 text-ferchas-rosa hover:bg-ferchas-rosa/10 rounded text-sm"
                  >
                    Cambiar Rol
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import EncabezadoPrincipal from '../components/shared/EncabezadoPrincipal.vue'
import BarralateralPrincipal from '../components/shared/BarralateralPrincipal.vue'
import { servicioPerfiles } from '../services/servicioPerfiles.js'

const usuarios = ref([])
const busqueda = ref('')

const usuariosFiltrados = computed(() => {
  if (!busqueda.value) return usuarios.value
  const term = busqueda.value.toLowerCase()
  return usuarios.value.filter(u =>
    u.nombre.toLowerCase().includes(term) ||
    (u.user_id && u.user_id.toLowerCase().includes(term)) ||
    (u.rol && u.rol.toLowerCase().includes(term))
  )
})

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
