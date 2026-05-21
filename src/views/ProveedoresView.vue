<template>
  <LayoutPanel>
    <div class="p-7">
      <div class="flex items-start justify-between mb-6">
        <div>
          <h1 class="font-titulo text-3xl text-ferchas-cafe">Proveedores</h1>
          <p class="text-sm text-ferchas-cafe-claro mt-1">{{ proveedores.length }} proveedores activos · {{ totalProductos }} productos asociados</p>
        </div>
        <button @click="mostrarModal = true" class="btn-principal flex items-center gap-2">
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
        <div v-for="p in proveedores" :key="p.nombre"
             class="bg-white rounded-lg border border-ferchas-cafe/10 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between mb-3">
            <div>
              <h3 class="font-titulo text-lg text-ferchas-vino">{{ p.nombre }}</h3>
              <p class="text-sm text-ferchas-cafe-claro mt-0.5">{{ p.contacto }}</p>
            </div>
            <span class="bg-ferchas-rosa-suave text-ferchas-vino text-xs font-bold px-2.5 py-1 rounded-full">{{ p.productos }} productos</span>
          </div>
          <p class="text-sm text-ferchas-cafe leading-relaxed mb-4">{{ p.descripcion }}</p>
          <div class="flex items-center justify-between pt-3 border-t border-ferchas-cafe/10">
            <span class="text-sm font-bold text-ferchas-cafe">{{ p.telefono }}</span>
            <div class="flex gap-1">
              <button class="text-ferchas-cafe-claro hover:text-ferchas-vino hover:bg-ferchas-fondo p-1.5 rounded">
                <Icono nombre="editar" :tamano="16" />
              </button>
              <button class="text-ferchas-error hover:bg-ferchas-error/10 p-1.5 rounded">
                <Icono nombre="basurero" :tamano="16" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ModalProveedor v-if="mostrarModal" @cerrar="mostrarModal = false" @guardar="guardar" />
  </LayoutPanel>
</template>

<script setup>
import { ref, computed } from 'vue'
import LayoutPanel from '../components/shared/LayoutPanel.vue'
import Icono from '../components/shared/Icono.vue'
import ModalProveedor from '../components/proveedores/ModalProveedor.vue'
import { mockProveedores } from '../lib/datosMock.js'

// Versión real (descomentar cuando Insforge esté conectado):
// import { servicioProveedores } from '../services/servicioProveedores.js'
// onMounted(async () => proveedores.value = await servicioProveedores.obtenerTodos())

const proveedores = mockProveedores
const busqueda = ref('')
const mostrarModal = ref(false)
const totalProductos = computed(() => proveedores.reduce((s, p) => s + p.productos, 0))

function guardar(formulario) {
  console.log('Guardar proveedor (mock):', formulario)
  mostrarModal.value = false
}
</script>
