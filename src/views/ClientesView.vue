<template>
  <div class="min-h-screen bg-ferchas-fondo">
    <EncabezadoPrincipal />
    <div class="flex">
      <BarralateralPrincipal />
      <main class="flex-1 p-8">
        <h1 class="font-titulo text-3xl font-bold text-ferchas-cafe mb-8">Clientes</h1>

        <!-- Botón Crear -->
        <div class="mb-6">
          <button @click="abrirFormulario" class="btn-principal">+ Nuevo Cliente</button>
        </div>

        <!-- Buscador -->
        <div class="mb-6">
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar clientes por nombre, teléfono o correo..."
            class="input-base"
          />
        </div>

        <!-- Tabla de Clientes -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <table class="tabla-base w-full">
            <thead class="tabla-header">
              <tr>
                <th class="px-4 py-3 text-left">Nombre</th>
                <th class="px-4 py-3 text-left">Teléfono</th>
                <th class="px-4 py-3 text-left">Correo</th>
                <th class="px-4 py-3 text-left">Dirección</th>
                <th class="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="clientesFiltrados.length === 0">
                <td colspan="5" class="px-4 py-8 text-center text-ferchas-cafe-claro">No hay clientes</td>
              </tr>
              <tr v-for="cliente in clientesFiltrados" :key="cliente.id_cliente" class="tabla-fila border-b">
                <td class="px-4 py-3 font-semibold">{{ cliente.nombre }}</td>
                <td class="px-4 py-3">{{ cliente.telefono || '-' }}</td>
                <td class="px-4 py-3">{{ cliente.correo || '-' }}</td>
                <td class="px-4 py-3 text-sm">{{ cliente.direccion || '-' }}</td>
                <td class="px-4 py-3 text-center">
                  <button
                    @click="editarCliente(cliente)"
                    class="px-3 py-1 text-ferchas-rosa hover:bg-ferchas-rosa/10 rounded text-sm"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>

    <!-- Modal Formulario -->
    <div v-if="mostrarFormulario" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 class="font-titulo text-2xl text-ferchas-cafe mb-4">{{ clienteEditando ? 'Editar' : 'Nuevo' }} Cliente</h2>
        <form @submit.prevent="guardarCliente" class="space-y-4">
          <input v-model="formulario.nombre" type="text" placeholder="Nombre completo" class="input-base" required />
          <input v-model="formulario.telefono" type="tel" placeholder="Teléfono" class="input-base" />
          <input v-model="formulario.correo" type="email" placeholder="Correo electrónico" class="input-base" />
          <textarea v-model="formulario.direccion" placeholder="Dirección" class="input-base" rows="2"></textarea>
          <div class="flex gap-2">
            <button type="submit" class="btn-principal flex-1">Guardar</button>
            <button type="button" @click="cerrarFormulario" class="btn-secundario flex-1">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import EncabezadoPrincipal from '../components/shared/EncabezadoPrincipal.vue'
import BarralateralPrincipal from '../components/shared/BarralateralPrincipal.vue'
import { useAlmacenClientes } from '../stores/almacenClientes.js'

const almacenClientes = useAlmacenClientes()

const busqueda = ref('')
const mostrarFormulario = ref(false)
const clienteEditando = ref(null)
const formulario = ref({
  nombre: '',
  telefono: '',
  correo: '',
  direccion: ''
})

const clientesFiltrados = computed(() => {
  if (!busqueda.value) return almacenClientes.clientes
  const term = busqueda.value.toLowerCase()
  return almacenClientes.clientes.filter(c =>
    c.nombre.toLowerCase().includes(term) ||
    (c.telefono && c.telefono.includes(term)) ||
    (c.correo && c.correo.toLowerCase().includes(term))
  )
})

function abrirFormulario() {
  clienteEditando.value = null
  formulario.value = { nombre: '', telefono: '', correo: '', direccion: '' }
  mostrarFormulario.value = true
}

function cerrarFormulario() {
  mostrarFormulario.value = false
}

function editarCliente(cliente) {
  clienteEditando.value = cliente
  formulario.value = { ...cliente }
  mostrarFormulario.value = true
}

async function guardarCliente() {
  if (!formulario.value.nombre) {
    alert('El nombre es requerido')
    return
  }

  if (clienteEditando.value) {
    await almacenClientes.actualizar(clienteEditando.value.id_cliente, formulario.value)
  } else {
    await almacenClientes.crear(formulario.value)
  }
  cerrarFormulario()
}

onMounted(async () => {
  await almacenClientes.obtenerTodos()
})
</script>
