<template>
  <LayoutPanel>
    <div class="p-7">
      <div class="flex items-start justify-between mb-6">
        <div>
          <h1 class="font-titulo text-3xl text-ferchas-cafe">Proveedores</h1>
          <p class="text-sm text-ferchas-cafe-claro mt-1">
            {{ proveedoresFiltrados.length }} proveedores activos
          </p>
        </div>
        <button @click="abrirFormularioNuevo" class="btn-principal flex items-center gap-2">
          <Icono nombre="mas" :tamano="16" /> Nuevo proveedor
        </button>
      </div>

      <!-- Buscador -->
      <div class="bg-white rounded-lg border border-ferchas-cafe/10 shadow-sm p-4 mb-6">
        <div class="relative">
          <input v-model="busqueda" type="text" placeholder="Buscar proveedor por nombre o contacto..." class="input-base pl-10">
          <div class="absolute left-3 top-1/2 -translate-y-1/2 text-ferchas-cafe-claro"><Icono nombre="buscar" :tamano="18" /></div>
        </div>
      </div>

      <!-- Estado de carga -->
      <div v-if="cargando" class="bg-white rounded-lg border border-ferchas-cafe/10 shadow-sm p-12 text-center">
        <p class="text-ferchas-cafe-claro">Cargando proveedores...</p>
      </div>

      <!-- Mensaje vacío -->
      <div v-else-if="proveedoresFiltrados.length === 0" class="bg-white rounded-lg border border-ferchas-cafe/10 shadow-sm p-12 text-center">
        <p class="text-ferchas-cafe font-semibold">No hay proveedores que coincidan con tu búsqueda</p>
      </div>

      <!-- Cards de proveedores -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div v-for="p in proveedoresFiltrados" :key="p.id_proveedor"
             class="bg-white rounded-lg border border-ferchas-cafe/10 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between mb-3">
            <div>
              <h3 class="font-titulo text-lg text-ferchas-vino">{{ p.nombre }}</h3>
              <p class="text-sm text-ferchas-cafe-claro mt-0.5">{{ p.contacto || 'Sin contacto registrado' }}</p>
            </div>
          </div>
          <p class="text-sm text-ferchas-cafe leading-relaxed mb-4">{{ p.descripcion || 'Sin descripción' }}</p>
          <div class="flex items-center justify-between pt-3 border-t border-ferchas-cafe/10">
            <span class="text-sm font-bold text-ferchas-cafe">{{ p.telefono || '-' }}</span>
            <div class="flex gap-1">
              <button @click="abrirFormularioEditar(p)" class="text-ferchas-cafe-claro hover:text-ferchas-vino hover:bg-ferchas-fondo p-1.5 rounded">
                <Icono nombre="editar" :tamano="16" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ModalProveedor
      v-if="mostrarModal"
      :proveedor-editando="proveedorEditando"
      @cerrar="cerrarFormulario"
      @guardar="guardar"
    />
  </LayoutPanel>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import LayoutPanel from '../components/shared/LayoutPanel.vue'
import Icono from '../components/shared/Icono.vue'
import ModalProveedor from '../components/proveedores/ModalProveedor.vue'
import { servicioProveedores } from '../services/servicioProveedores.js'

const proveedores = ref([])
const busqueda = ref('')
const cargando = ref(false)
const mostrarModal = ref(false)
const proveedorEditando = ref(null)

// Filtrado por búsqueda (nombre o contacto)
const proveedoresFiltrados = computed(() => {
  if (!busqueda.value.trim()) return proveedores.value
  const t = busqueda.value.toLowerCase()
  return proveedores.value.filter(p =>
    (p.nombre || '').toLowerCase().includes(t) ||
    (p.contacto || '').toLowerCase().includes(t)
  )
})

// Carga inicial desde Insforge
async function obtenerProveedores() {
  cargando.value = true
  try {
    const resultado = await servicioProveedores.obtenerTodos()
    if (resultado.exito) {
      proveedores.value = resultado.proveedores
    } else {
      console.error('Error al obtener proveedores:', resultado.error)
    }
  } finally {
    cargando.value = false
  }
}

function abrirFormularioNuevo() {
  proveedorEditando.value = null
  mostrarModal.value = true
}

function abrirFormularioEditar(proveedor) {
  proveedorEditando.value = proveedor
  mostrarModal.value = true
}

function cerrarFormulario() {
  mostrarModal.value = false
  proveedorEditando.value = null
}

async function guardar(formulario) {
  if (proveedorEditando.value) {
    await servicioProveedores.actualizar(proveedorEditando.value.id_proveedor, formulario)
  } else {
    await servicioProveedores.crear(formulario)
  }
  cerrarFormulario()
  await obtenerProveedores()
}

onMounted(() => obtenerProveedores())
</script>
