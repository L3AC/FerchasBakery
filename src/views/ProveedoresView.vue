<template>
  <div class="flex min-h-screen bg-ferchas-fondo">
    <BarralateralPrincipal />
    <div class="flex-1 flex flex-col">
      <EncabezadoPrincipal />
      <main class="flex-1 p-8 overflow-y-auto">
        <div class="max-w-6xl mx-auto">
          <div class="flex justify-between items-center mb-8">
            <h1 class="font-titulo text-4xl text-ferchas-cafe">🚚 Proveedores</h1>
            <button @click="abrirFormulario" class="btn-principal">+ Nuevo Proveedor</button>
          </div>

          <!-- Tabla de Proveedores -->
          <div class="card-base overflow-x-auto">
            <table class="tabla-base w-full">
              <thead class="tabla-header">
                <tr>
                  <th class="px-4 py-3 text-left">Nombre</th>
                  <th class="px-4 py-3 text-left">Teléfono</th>
                  <th class="px-4 py-3 text-left">Contacto</th>
                  <th class="px-4 py-3 text-left">Descripción</th>
                  <th class="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="proveedor in proveedores" :key="proveedor.id_proveedor" class="tabla-fila border-b">
                  <td class="px-4 py-3 font-semibold">{{ proveedor.nombre }}</td>
                  <td class="px-4 py-3">{{ proveedor.telefono || '-' }}</td>
                  <td class="px-4 py-3">{{ proveedor.contacto || '-' }}</td>
                  <td class="px-4 py-3 text-sm">{{ proveedor.descripcion || '-' }}</td>
                  <td class="px-4 py-3 text-center">
                    <button @click="editarProveedor(proveedor)" class="text-ferchas-rosa hover:text-ferchas-rosa-oscuro">✏️</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="proveedores.length === 0" class="card-base text-center py-12">
            <p class="text-2xl mb-2">📦</p>
            <p class="text-ferchas-cafe font-semibold">No hay proveedores registrados</p>
          </div>
        </div>
      </main>
    </div>

    <!-- Modal Formulario -->
    <div v-if="mostrarFormulario" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 class="font-titulo text-2xl text-ferchas-cafe mb-4">{{ proveedorEditando ? 'Editar' : 'Nuevo' }} Proveedor</h2>
        <form @submit.prevent="guardarProveedor" class="space-y-4">
          <input v-model="formulario.nombre" type="text" placeholder="Nombre" class="input-base" required />
          <input v-model="formulario.telefono" type="tel" placeholder="Teléfono" class="input-base" />
          <input v-model="formulario.contacto" type="text" placeholder="Contacto" class="input-base" />
          <textarea v-model="formulario.descripcion" placeholder="Descripción" class="input-base" rows="2"></textarea>
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
import { ref, onMounted } from 'vue'
import EncabezadoPrincipal from '../components/shared/EncabezadoPrincipal.vue'
import BarralateralPrincipal from '../components/shared/BarralateralPrincipal.vue'
import { servicioProveedores } from '../services/servicioProveedores.js'

const proveedores = ref([])
const mostrarFormulario = ref(false)
const proveedorEditando = ref(null)
const formulario = ref({
  nombre: '',
  telefono: '',
  contacto: '',
  descripcion: ''
})

function abrirFormulario() {
  proveedorEditando.value = null
  formulario.value = { nombre: '', telefono: '', contacto: '', descripcion: '' }
  mostrarFormulario.value = true
}

function cerrarFormulario() {
  mostrarFormulario.value = false
}

function editarProveedor(proveedor) {
  proveedorEditando.value = proveedor
  formulario.value = { ...proveedor }
  mostrarFormulario.value = true
}

async function guardarProveedor() {
  if (proveedorEditando.value) {
    await servicioProveedores.actualizar(proveedorEditando.value.id_proveedor, formulario.value)
  } else {
    await servicioProveedores.crear(formulario.value)
  }
  cerrarFormulario()
  await obtenerProveedores()
}

async function obtenerProveedores() {
  const resultado = await servicioProveedores.obtenerTodos()
  if (resultado.exito) {
    proveedores.value = resultado.proveedores
  }
}

onMounted(async () => {
  await obtenerProveedores()
})
</script>
