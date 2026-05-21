<template>
  <div class="min-h-screen bg-ferchas-fondo">
    <EncabezadoPrincipal />
    <div class="flex">
      <BarralateralPrincipal />
      <main class="flex-1 p-8">
        <h1 class="font-titulo text-3xl font-bold text-ferchas-cafe mb-8">Proveedores</h1>

        <!-- Botón Crear -->
        <div class="mb-6">
          <button @click="abrirFormulario" class="btn-principal">+ Nuevo Proveedor</button>
        </div>

        <!-- Buscador -->
        <div class="mb-6">
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar proveedores por nombre, teléfono o contacto..."
            class="input-base"
          />
        </div>

        <!-- Tabla de Proveedores -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
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
              <tr v-if="proveedoresFiltrados.length === 0">
                <td colspan="5" class="px-4 py-8 text-center text-ferchas-cafe-claro">No hay proveedores</td>
              </tr>
              <tr v-for="proveedor in proveedoresFiltrados" :key="proveedor.id_proveedor" class="tabla-fila border-b">
                <td class="px-4 py-3 font-semibold">{{ proveedor.nombre }}</td>
                <td class="px-4 py-3">{{ proveedor.telefono || '-' }}</td>
                <td class="px-4 py-3">{{ proveedor.contacto || '-' }}</td>
                <td class="px-4 py-3 text-sm">{{ proveedor.descripcion || '-' }}</td>
                <td class="px-4 py-3 text-center">
                  <button
                    @click="editarProveedor(proveedor)"
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
import { ref, computed, onMounted } from 'vue'
import EncabezadoPrincipal from '../components/shared/EncabezadoPrincipal.vue'
import BarralateralPrincipal from '../components/shared/BarralateralPrincipal.vue'
import { servicioProveedores } from '../services/servicioProveedores.js'

const proveedores = ref([])
const busqueda = ref('')
const mostrarFormulario = ref(false)
const proveedorEditando = ref(null)

const proveedoresFiltrados = computed(() => {
  if (!busqueda.value) return proveedores.value
  const term = busqueda.value.toLowerCase()
  return proveedores.value.filter(p =>
    p.nombre.toLowerCase().includes(term) ||
    (p.telefono && p.telefono.includes(term)) ||
    (p.contacto && p.contacto.toLowerCase().includes(term)) ||
    (p.descripcion && p.descripcion.toLowerCase().includes(term))
  )
})

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
