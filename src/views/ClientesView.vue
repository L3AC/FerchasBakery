<template>
  <div class="flex min-h-screen bg-ferchas-fondo">
    <BarralateralPrincipal />
    <div class="flex-1 flex flex-col">
      <EncabezadoPrincipal />
      <main class="flex-1 p-8 overflow-y-auto">
        <div class="max-w-6xl mx-auto">
          <div class="flex justify-between items-center mb-8">
            <h1 class="font-titulo text-4xl text-ferchas-cafe">👥 Clientes</h1>
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
          <div class="card-base overflow-x-auto">
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
                <tr v-for="cliente in clientesFiltrados" :key="cliente.id_cliente" class="tabla-fila border-b">
                  <td class="px-4 py-3 font-semibold">{{ cliente.nombre }}</td>
                  <td class="px-4 py-3">{{ cliente.telefono || '-' }}</td>
                  <td class="px-4 py-3">{{ cliente.correo || '-' }}</td>
                  <td class="px-4 py-3 text-sm">{{ cliente.direccion || '-' }}</td>
                  <td class="px-4 py-3 text-center space-x-2">
                    <button
                      @click="editarCliente(cliente)"
                      class="text-ferchas-rosa hover:text-ferchas-rosa-oscuro text-sm font-semibold"
                    >
                      ✏️
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="clientesFiltrados.length === 0" class="card-base text-center py-12">
            <p class="text-2xl mb-2">👤</p>
            <p class="text-ferchas-cafe font-semibold">No hay clientes</p>
          </div>
        </div>
      </main>
    </div>

    <!-- Modal Formulario -->
    <div v-if="mostrarFormulario" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
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
