<template>
  <div class="min-h-screen bg-ferchas-fondo">
    <EncabezadoPrincipal />
    <div class="flex">
      <BarralateralPrincipal />
      <main class="flex-1 p-8">
        <h1 class="font-titulo text-3xl font-bold text-ferchas-cafe mb-8">Productos</h1>

        <!-- Botón Crear -->
        <div class="mb-6">
          <button
            v-if="almacenAuth.esAdmin"
            @click="abrirFormulario"
            class="btn-principal"
          >
            + Nuevo Producto
          </button>
        </div>

        <!-- Buscador -->
        <div class="mb-6">
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar productos..."
            class="input-base"
          />
        </div>

        <!-- Lista de Productos -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="producto in productosFiltrados"
            :key="producto.id_producto"
            class="card-base hover:shadow-lg transition-shadow"
          >
            <div class="flex justify-between items-start mb-3">
              <h3 class="font-titulo text-lg text-ferchas-cafe font-semibold">{{ producto.nombre }}</h3>
              <span v-if="producto.stock_disponible < 10" class="badge-advertencia text-xs">Bajo stock</span>
            </div>
            <p class="text-sm text-ferchas-cafe-claro mb-3">{{ producto.descripcion }}</p>
            <div class="flex justify-between items-center mb-4">
              <span class="text-2xl font-titulo text-ferchas-rosa">${{ parseFloat(producto.precio).toFixed(2) }}</span>
              <span class="text-sm font-semibold text-ferchas-cafe">Stock: {{ producto.stock_disponible }}</span>
            </div>
            <div v-if="almacenAuth.esAdmin" class="flex gap-2">
              <button @click="editarProducto(producto)" class="btn-secundario flex-1 text-sm py-2">Editar</button>
              <button @click="desactivarProducto(producto.id_producto)" class="btn-peligro flex-1 text-sm py-2">Eliminar</button>
            </div>
          </div>
        </div>

        <!-- Mensaje vacío -->
        <div v-if="productosFiltrados.length === 0" class="card-base text-center py-12">
          <p class="text-ferchas-cafe font-semibold">No hay productos</p>
        </div>
      </main>
    </div>

    <!-- Modal de Formulario -->
    <div v-if="mostrarFormulario" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 class="font-titulo text-2xl text-ferchas-cafe mb-4">{{ productoEditando ? 'Editar' : 'Nuevo' }} Producto</h2>
        <form @submit.prevent="guardarProducto" class="space-y-4">
          <input v-model="formulario.nombre" type="text" placeholder="Nombre" class="input-base" required />
          <textarea v-model="formulario.descripcion" placeholder="Descripción" class="input-base" rows="2"></textarea>
          <input v-model.number="formulario.precio" type="number" placeholder="Precio" class="input-base" step="0.01" required />
          <input v-model.number="formulario.stock_disponible" type="number" placeholder="Stock" class="input-base" required />
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
import { useAlmacenAutenticacion } from '../stores/almacenAutenticacion.js'
import { useAlmacenProductos } from '../stores/almacenProductos.js'

const almacenAuth = useAlmacenAutenticacion()
const almacenProductos = useAlmacenProductos()

const busqueda = ref('')
const mostrarFormulario = ref(false)
const productoEditando = ref(null)
const formulario = ref({
  nombre: '',
  descripcion: '',
  precio: 0,
  stock_disponible: 0
})

const productosFiltrados = computed(() => {
  if (!busqueda.value) return almacenProductos.productos
  return almacenProductos.productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
  )
})

function abrirFormulario() {
  productoEditando.value = null
  formulario.value = { nombre: '', descripcion: '', precio: 0, stock_disponible: 0 }
  mostrarFormulario.value = true
}

function cerrarFormulario() {
  mostrarFormulario.value = false
  productoEditando.value = null
}

function editarProducto(producto) {
  productoEditando.value = producto
  formulario.value = { ...producto }
  mostrarFormulario.value = true
}

async function guardarProducto() {
  if (productoEditando.value) {
    await almacenProductos.actualizar(productoEditando.value.id_producto, formulario.value)
  } else {
    await almacenProductos.crear({
      ...formulario.value,
      id_categoria: null,
      id_proveedor: null,
      tipo_origen: 'interno',
      es_personalizable: false,
      activo: true
    })
  }
  cerrarFormulario()
}

async function desactivarProducto(idProducto) {
  if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
    await almacenProductos.desactivar(idProducto)
  }
}

onMounted(async () => {
  await almacenProductos.obtenerTodos()
})
</script>
