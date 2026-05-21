<template>
  <LayoutPanel>
    <div class="p-7">
      <div class="flex items-start justify-between mb-6">
        <div>
          <h1 class="font-titulo text-3xl text-ferchas-cafe">Productos</h1>
          <p class="text-sm text-ferchas-cafe-claro mt-1">
            {{ productosFiltrados.length }} productos activos · {{ cantidadStockBajo }} con stock bajo
          </p>
        </div>
        <button v-if="almacenAuth.esAdmin" @click="abrirFormularioNuevo" class="btn-principal flex items-center gap-2">
          <Icono nombre="mas" :tamano="16" /> Nuevo producto
        </button>
      </div>

      <!-- Filtros -->
      <div class="bg-white rounded-lg border border-ferchas-cafe/10 shadow-sm p-4 mb-6 flex gap-3 items-center">
        <div class="relative flex-1">
          <input v-model="busqueda" type="text" placeholder="Buscar por nombre o descripción..." class="input-base pl-10">
          <div class="absolute left-3 top-1/2 -translate-y-1/2 text-ferchas-cafe-claro"><Icono nombre="buscar" :tamano="18" /></div>
        </div>
        <select v-model="filtroCategoria" class="input-base w-auto">
          <option value="">Todas las categorías</option>
          <option v-for="c in categorias" :key="c.id_categoria" :value="c.id_categoria">{{ c.nombre_categoria }}</option>
        </select>
        <select v-model="filtroTipo" class="input-base w-auto">
          <option value="">Todos los tipos</option>
          <option value="interno">Internos</option>
          <option value="proveedor">De proveedor</option>
        </select>
      </div>

      <!-- Cargando -->
      <div v-if="almacenProductos.cargando" class="bg-white rounded-lg border border-ferchas-cafe/10 shadow-sm p-12 text-center">
        <p class="text-ferchas-cafe-claro">Cargando productos...</p>
      </div>

      <!-- Vacío -->
      <div v-else-if="productosFiltrados.length === 0" class="bg-white rounded-lg border border-ferchas-cafe/10 shadow-sm p-12 text-center">
        <p class="text-ferchas-cafe font-semibold">No hay productos que coincidan con los filtros</p>
      </div>

      <!-- Grid de productos -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div v-for="p in productosFiltrados" :key="p.id_producto"
             class="bg-white rounded-lg shadow-sm border border-ferchas-cafe/10 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
          <div :class="['h-32 flex items-center justify-center', `bg-ferchas-${aspectoVisual(p).fondo}`]"
               v-html="ilustraciones[aspectoVisual(p).ilustracion]"></div>
          <div class="p-4 flex-1 flex flex-col">
            <div class="flex items-start justify-between mb-2 gap-2">
              <h3 class="font-titulo text-base text-ferchas-cafe leading-tight">{{ p.nombre }}</h3>
              <span v-if="estaStockBajo(p)" class="badge-stock-bajo whitespace-nowrap">Stock bajo</span>
              <span v-else class="bg-ferchas-rosa/30 text-ferchas-vino text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                {{ p.tipo_origen === 'interno' ? 'Interno' : 'Proveedor' }}
              </span>
            </div>
            <p class="text-xs text-ferchas-cafe-claro leading-relaxed line-clamp-2 flex-1">{{ p.descripcion || 'Sin descripción' }}</p>
            <div class="flex items-end justify-between mt-3 pt-3 border-t border-ferchas-cafe/10">
              <div>
                <div class="font-titulo text-xl text-ferchas-vino">${{ parseFloat(p.precio).toFixed(2) }}</div>
                <div :class="['text-xs font-semibold', estaStockBajo(p) ? 'text-ferchas-error' : estaStockMedio(p) ? 'text-ferchas-advertencia' : 'text-ferchas-exito']">
                  {{ estaStockBajo(p) ? `Solo ${p.stock_disponible} unidades` : `${p.stock_disponible} unidades` }}
                </div>
              </div>
              <div v-if="almacenAuth.esAdmin" class="flex gap-1">
                <button @click="abrirFormularioEditar(p)" class="text-ferchas-cafe-claro hover:text-ferchas-vino hover:bg-ferchas-fondo p-1.5 rounded transition-colors">
                  <Icono nombre="editar" :tamano="16" />
                </button>
                <button @click="eliminarProducto(p)" class="text-ferchas-error hover:bg-ferchas-error/10 p-1.5 rounded transition-colors">
                  <Icono nombre="basurero" :tamano="16" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ModalProducto
      v-if="mostrarModal"
      :producto-editando="productoEditando"
      :categorias="categorias"
      @cerrar="cerrarFormulario"
      @guardar="guardar"
    />
  </LayoutPanel>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import LayoutPanel from '../components/shared/LayoutPanel.vue'
import Icono from '../components/shared/Icono.vue'
import ModalProducto from '../components/productos/ModalProducto.vue'
import { ilustracionesProductos } from '../lib/ilustracionesCategorias.js'
import { useAlmacenAutenticacion } from '../stores/almacenAutenticacion.js'
import { useAlmacenProductos } from '../stores/almacenProductos.js'

const almacenAuth = useAlmacenAutenticacion()
const almacenProductos = useAlmacenProductos()

const busqueda = ref('')
const filtroCategoria = ref('')
const filtroTipo = ref('')
const mostrarModal = ref(false)
const productoEditando = ref(null)
const ilustraciones = ilustracionesProductos

// Categorías del store (para el filtro y el modal)
const categorias = computed(() => almacenProductos.categorias)

// Filtra productos por búsqueda + categoría + tipo
const productosFiltrados = computed(() => {
  let lista = almacenProductos.productos
  if (busqueda.value.trim()) {
    const t = busqueda.value.toLowerCase()
    lista = lista.filter(p =>
      (p.nombre || '').toLowerCase().includes(t) ||
      (p.descripcion || '').toLowerCase().includes(t)
    )
  }
  if (filtroCategoria.value) {
    lista = lista.filter(p => p.id_categoria === filtroCategoria.value)
  }
  if (filtroTipo.value) {
    lista = lista.filter(p => p.tipo_origen === filtroTipo.value)
  }
  return lista
})

const cantidadStockBajo = computed(() =>
  almacenProductos.productos.filter(p => (p.stock_disponible || 0) < 5).length
)

function estaStockBajo(p) { return (p.stock_disponible || 0) < 5 }
function estaStockMedio(p) { return (p.stock_disponible || 0) >= 5 && (p.stock_disponible || 0) < 10 }

// Mapea categoría del producto a una ilustración y color de fondo
// Las claves son palabras que aparecen en el nombre de la categoría real
const mapaCategorias = [
  { palabras: ['pan', 'dulce', 'tradicional'], ilustracion: 'galleta',   fondo: 'rosa-suave' },
  { palabras: ['crepa', 'postre'],             ilustracion: 'velvet',    fondo: 'rosa/40' },
  { palabras: ['cheesecake', 'especialidad'],  ilustracion: 'fresa',     fondo: 'rosa-suave' },
  { palabras: ['pastel', 'personalizado'],     ilustracion: 'pastel',    fondo: 'rosa/40' },
  { palabras: ['salado', 'sándwich', 'sandwich'], ilustracion: 'tartaleta', fondo: 'advertencia/30' },
  { palabras: ['bebida', 'café', 'cafe', 'frappe'], ilustracion: 'cafe', fondo: 'cafe/15' },
  { palabras: ['cupcake', 'vainilla'],         ilustracion: 'vainilla',  fondo: 'advertencia/30' },
]

function aspectoVisual(producto) {
  const nombreCat = (producto.categorias_productos?.nombre_categoria || '').toLowerCase()
  const nombreProd = (producto.nombre || '').toLowerCase()
  const textoBusqueda = nombreCat + ' ' + nombreProd

  for (const regla of mapaCategorias) {
    if (regla.palabras.some(palabra => textoBusqueda.includes(palabra))) {
      return { ilustracion: regla.ilustracion, fondo: regla.fondo }
    }
  }
  // Por defecto, si no calza con ninguna regla
  return { ilustracion: 'pastel', fondo: 'rosa-suave' }
}

function abrirFormularioNuevo() {
  productoEditando.value = null
  mostrarModal.value = true
}

function abrirFormularioEditar(producto) {
  productoEditando.value = producto
  mostrarModal.value = true
}

function cerrarFormulario() {
  mostrarModal.value = false
  productoEditando.value = null
}

async function guardar(formulario) {
  if (productoEditando.value) {
    await almacenProductos.actualizar(productoEditando.value.id_producto, formulario)
  } else {
    await almacenProductos.crear({
      ...formulario,
      tipo_origen: formulario.tipo_origen || 'interno',
      es_personalizable: formulario.es_personalizable || false,
      activo: true,
    })
  }
  cerrarFormulario()
  await almacenProductos.obtenerTodos()
}

async function eliminarProducto(producto) {
  if (!confirm(`¿Eliminar el producto "${producto.nombre}"?`)) return
  await almacenProductos.desactivar(producto.id_producto)
  await almacenProductos.obtenerTodos()
}

onMounted(async () => {
  await almacenProductos.obtenerTodos()
  await almacenProductos.obtenerCategorias()
})
</script>
