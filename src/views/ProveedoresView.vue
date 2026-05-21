<template>
  <LayoutPanel>
    <div class="p-7">
      <div class="flex items-start justify-between mb-6">
        <div>
          <h1 class="font-titulo text-3xl text-ferchas-cafe">Proveedores</h1>
          <p class="text-sm text-ferchas-cafe-claro mt-1">{{ proveedores.length }} proveedores activos</p>
        </div>
        <button @click="abrirModalCrear" class="btn-principal flex items-center gap-2">
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

      <!-- Cards de proveedores -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div v-for="p in proveedoresFiltrados" :key="p.id_proveedor"
             class="bg-white rounded-lg border border-ferchas-cafe/10 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between mb-3">
            <div>
              <h3 class="font-titulo text-lg text-ferchas-vino">{{ p.nombre }}</h3>
              <p class="text-sm text-ferchas-cafe-claro mt-0.5">{{ p.contacto }}</p>
            </div>
          </div>
          <p class="text-sm text-ferchas-cafe leading-relaxed mb-4">{{ p.descripcion }}</p>
            <div class="flex items-center justify-between pt-3 border-t border-ferchas-cafe/10">
            <span class="text-sm font-bold text-ferchas-cafe">{{ p.telefono }}</span>
            <div class="flex gap-1">
              <button @click="abrirModalEditar(p)" class="text-ferchas-cafe-claro hover:text-ferchas-vino hover:bg-ferchas-fondo p-1.5 rounded">
                <Icono nombre="editar" :tamano="16" />
              </button>
              <button @click="eliminarProveedor(p)" class="text-ferchas-error hover:bg-ferchas-error/10 p-1.5 rounded">
                <Icono nombre="basurero" :tamano="16" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ModalProveedor v-if="mostrarModal" :proveedor="proveedorAEditar" @cerrar="cerrarModal" @guardar="guardarProveedor" />
  </LayoutPanel>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import LayoutPanel from '../components/shared/LayoutPanel.vue'
import Icono from '../components/shared/Icono.vue'
import ModalProveedor from '../components/proveedores/ModalProveedor.vue'
import { useAlmacenProveedores } from '../stores/almacenProveedores.js'

const almacenProveedores = useAlmacenProveedores()

const proveedores = computed(() => almacenProveedores.proveedores)
const busqueda = ref('')
const mostrarModal = ref(false)
const proveedorAEditar = ref(null)

const proveedoresFiltrados = computed(() => {
  return almacenProveedores.proveedores.filter(p => {
    if (!busqueda.value) return true
    const t = busqueda.value.toLowerCase()
    return p.nombre.toLowerCase().includes(t) || (p.contacto || '').toLowerCase().includes(t)
  })
})

function abrirModalCrear() {
  proveedorAEditar.value = null
  mostrarModal.value = true
}

function abrirModalEditar(proveedor) {
  proveedorAEditar.value = proveedor
  mostrarModal.value = true
}

function cerrarModal() {
  mostrarModal.value = false
  proveedorAEditar.value = null
}

async function guardarProveedor(formulario) {
  let resultado
  if (formulario.id_proveedor) {
    resultado = await almacenProveedores.actualizar(formulario.id_proveedor, {
      nombre: formulario.nombre,
      telefono: formulario.telefono || null,
      contacto: formulario.contacto || null,
      descripcion: formulario.descripcion || null
    })
  } else {
    const { id_proveedor, ...datosCrear } = formulario
    resultado = await almacenProveedores.crear(datosCrear)
  }
  if (resultado.exito) {
    cerrarModal()
  }
}

async function eliminarProveedor(proveedor) {
  if (!confirm(`¿Eliminar a ${proveedor.nombre}?`)) return
  const resultado = await almacenProveedores.eliminar(proveedor.id_proveedor)
  if (!resultado.exito) {
    alert(resultado.error)
  }
}

onMounted(async () => {
  await almacenProveedores.obtenerTodos()
})
</script>
