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

        <!-- Tabla de Productos -->
        <div class="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table class="tabla-base w-full">
            <thead class="tabla-header">
              <tr>
                <th class="px-4 py-3 text-left">Nombre</th>
                <th class="px-4 py-3 text-left">Categoría</th>
                <th class="px-4 py-3 text-left">Proveedor</th>
                <th class="px-4 py-3 text-center">Precio</th>
                <th class="px-4 py-3 text-center">Stock</th>
                <th class="px-4 py-3 text-center">Origen</th>
                <th class="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="productosFiltrados.length === 0">
                <td colspan="7" class="px-4 py-8 text-center text-ferchas-cafe-claro">No hay productos</td>
              </tr>
              <tr v-for="producto in productosFiltrados" :key="producto.id_producto" class="tabla-fila border-b">
                <td class="px-4 py-3 font-semibold">{{ producto.nombre }}</td>
                <td class="px-4 py-3">
                  <span class="text-sm text-ferchas-cafe-claro">{{ producto.categorias_productos?.nombre_categoria || '-' }}</span>
                </td>
                <td class="px-4 py-3">
                  <span class="text-sm text-ferchas-cafe-claro">{{ producto.proveedores?.nombre || '-' }}</span>
                </td>
                <td class="px-4 py-3 text-center">${{ parseFloat(producto.precio).toFixed(2) }}</td>
                <td class="px-4 py-3 text-center">
                  <span v-if="producto.stock_disponible < 10" class="badge-advertencia">{{ producto.stock_disponible }}</span>
                  <span v-else>{{ producto.stock_disponible }}</span>
                </td>
                <td class="px-4 py-3 text-center text-sm">
                  <span class="badge-info">{{ producto.tipo_origen }}</span>
                </td>
                <td class="px-4 py-3 text-center space-x-2">
                  <button
                    v-if="almacenAuth.esAdmin"
                    @click="editarProducto(producto)"
                    class="px-2 py-1 text-ferchas-rosa hover:bg-ferchas-rosa/10 rounded text-sm"
                  >
                    Editar
                  </button>
                  <button
                    v-if="almacenAuth.esAdmin"
                    @click="desactivarProducto(producto.id_producto)"
                    class="px-2 py-1 text-ferchas-error hover:bg-ferchas-error/10 rounded text-sm"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>

    <!-- Modal de Formulario -->
    <div v-if="mostrarFormulario" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div class="bg-white rounded-lg shadow-lg max-w-2xl w-full my-8 p-6">
        <h2 class="font-titulo text-2xl text-ferchas-cafe mb-6">{{ productoEditando ? 'Editar' : 'Nuevo' }} Producto</h2>
        
        <form @submit.prevent="guardarProducto" class="space-y-4">
          <!-- Nombre y Descripción -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-ferchas-cafe font-semibold mb-2">Nombre</label>
              <input
                v-model="formulario.nombre"
                type="text"
                placeholder="Ej: Torta de Chocolate"
                class="input-base"
                required
              />
            </div>
            <div>
              <label class="block text-ferchas-cafe font-semibold mb-2">Precio</label>
              <input
                v-model.number="formulario.precio"
                type="number"
                placeholder="0.00"
                class="input-base"
                step="0.01"
                required
              />
            </div>
          </div>

          <!-- Descripción -->
          <div>
            <label class="block text-ferchas-cafe font-semibold mb-2">Descripción</label>
            <textarea
              v-model="formulario.descripcion"
              placeholder="Descripción del producto..."
              class="input-base"
              rows="2"
            ></textarea>
          </div>

          <!-- Stock -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-ferchas-cafe font-semibold mb-2">Stock Disponible</label>
              <input
                v-model.number="formulario.stock_disponible"
                type="number"
                placeholder="0"
                class="input-base"
                required
              />
            </div>
            <div>
              <label class="block text-ferchas-cafe font-semibold mb-2">Categoría</label>
              <BuscadorSelect
                v-model="formulario.id_categoria"
                :items="categorias"
                label="nombre_categoria"
                value-key="id_categoria"
                placeholder="Buscar categoría..."
              />
            </div>
          </div>

           <!-- Proveedor y Tipo Origen -->
           <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-ferchas-cafe font-semibold mb-2">Proveedor</label>
                <BuscadorSelect
                  v-model="formulario.id_proveedor"
                  :items="proveedores"
                  label="nombre"
                  value-key="id_proveedor"
                  placeholder="Buscar proveedor..."
                />
              </div>
             <div>
               <label class="block text-ferchas-cafe font-semibold mb-2">Tipo de Origen</label>
               <select v-model="formulario.tipo_origen" class="input-base" required>
                 <option value="interno">Hecho en casa (Interno)</option>
                 <option v-if="formulario.id_proveedor" value="proveedor">Viene de proveedor</option>
               </select>
               <p v-if="!formulario.id_proveedor && formulario.tipo_origen === 'proveedor'" class="text-ferchas-error text-sm mt-1">
                 Selecciona un proveedor para usar "Viene de proveedor"
               </p>
             </div>
           </div>

          <!-- Personalizable -->
          <div class="flex items-center gap-3 p-3 bg-ferchas-fondo rounded-lg">
            <input
              v-model="formulario.es_personalizable"
              type="checkbox"
              id="personalizable"
              class="w-4 h-4 cursor-pointer"
            />
            <label for="personalizable" class="text-ferchas-cafe font-semibold cursor-pointer">
              Este producto es personalizable
            </label>
          </div>

          <!-- Botones -->
          <div class="flex gap-3 pt-4">
            <button type="button" @click="cerrarFormulario" class="btn-secundario flex-1">
              Cancelar
            </button>
            <button type="submit" :disabled="cargando" class="btn-principal flex-1 disabled:opacity-50">
              {{ cargando ? 'Guardando...' : 'Guardar Producto' }}
            </button>
          </div>

          <div v-if="errorFormulario" class="p-3 bg-ferchas-error/10 text-ferchas-error rounded-lg text-sm">
            {{ errorFormulario }}
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
import BuscadorSelect from '../components/shared/BuscadorSelect.vue'
import { useAlmacenAutenticacion } from '../stores/almacenAutenticacion.js'
import { useAlmacenProductos } from '../stores/almacenProductos.js'
import { useAlmacenCategorias } from '../stores/almacenCategorias.js'
import { useAlmacenProveedores } from '../stores/almacenProveedores.js'

const almacenAuth = useAlmacenAutenticacion()
const almacenProductos = useAlmacenProductos()
const almacenCategorias = useAlmacenCategorias()
const almacenProveedores = useAlmacenProveedores()

const busqueda = ref('')
const mostrarFormulario = ref(false)
const productoEditando = ref(null)
const cargando = ref(false)
const errorFormulario = ref('')

const formulario = ref({
  nombre: '',
  descripcion: '',
  precio: 0,
  stock_disponible: 0,
  id_categoria: null,
  id_proveedor: null,
  tipo_origen: 'interno',
  es_personalizable: false
})

const productosFiltrados = computed(() => {
  if (!busqueda.value) return almacenProductos.productos
  const term = busqueda.value.toLowerCase()
  return almacenProductos.productos.filter(p =>
    p.nombre.toLowerCase().includes(term) ||
    (p.descripcion && p.descripcion.toLowerCase().includes(term)) ||
    (p.categorias_productos?.nombre_categoria && p.categorias_productos.nombre_categoria.toLowerCase().includes(term)) ||
    (p.proveedores?.nombre && p.proveedores.nombre.toLowerCase().includes(term)) ||
    (p.tipo_origen && p.tipo_origen.toLowerCase().includes(term))
  )
})

const categorias = computed(() => almacenCategorias.categorias)
const proveedores = computed(() => almacenProveedores.proveedores)

function abrirFormulario() {
  productoEditando.value = null
  formulario.value = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock_disponible: 0,
    id_categoria: null,
    id_proveedor: null,
    tipo_origen: 'interno',
    es_personalizable: false
  }
  errorFormulario.value = ''
  mostrarFormulario.value = true
}

function cerrarFormulario() {
  mostrarFormulario.value = false
  productoEditando.value = null
  errorFormulario.value = ''
}

function editarProducto(producto) {
  productoEditando.value = producto
  formulario.value = {
    nombre: producto.nombre,
    descripcion: producto.descripcion || '',
    precio: producto.precio,
    stock_disponible: producto.stock_disponible,
    id_categoria: producto.id_categoria,
    id_proveedor: producto.id_proveedor,
    tipo_origen: producto.tipo_origen || 'interno',
    es_personalizable: producto.es_personalizable || false
  }
  errorFormulario.value = ''
  mostrarFormulario.value = true
}

async function guardarProducto() {
  if (!formulario.value.nombre.trim()) {
    errorFormulario.value = 'El nombre del producto es requerido'
    return
  }

  if (formulario.value.precio <= 0) {
    errorFormulario.value = 'El precio debe ser mayor a 0'
    return
  }

  if (formulario.value.stock_disponible < 0) {
    errorFormulario.value = 'El stock no puede ser negativo'
    return
  }

  if (formulario.value.tipo_origen === 'proveedor' && !formulario.value.id_proveedor) {
    errorFormulario.value = 'Debes seleccionar un proveedor si el tipo de origen es "Viene de proveedor"'
    return
  }

  cargando.value = true
  errorFormulario.value = ''

  try {
    const datos = {
      nombre: formulario.value.nombre,
      descripcion: formulario.value.descripcion,
      precio: formulario.value.precio,
      stock_disponible: formulario.value.stock_disponible,
      id_categoria: formulario.value.id_categoria || null,
      id_proveedor: formulario.value.id_proveedor || null,
      tipo_origen: formulario.value.tipo_origen,
      es_personalizable: formulario.value.es_personalizable,
      activo: true
    }

    if (productoEditando.value) {
      await almacenProductos.actualizar(productoEditando.value.id_producto, datos)
    } else {
      await almacenProductos.crear(datos)
    }
    cerrarFormulario()
  } catch (err) {
    errorFormulario.value = err.message
  } finally {
    cargando.value = false
  }
}

async function desactivarProducto(idProducto) {
  if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
    await almacenProductos.desactivar(idProducto)
  }
}

onMounted(async () => {
  await almacenProductos.obtenerTodos()
  await almacenCategorias.obtenerTodas()
  await almacenProveedores.obtenerTodos()
})
</script>
