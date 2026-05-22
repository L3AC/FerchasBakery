<template>
  <LayoutPanel>
    <div class="p-7">
      <div class="flex items-start justify-between mb-6">
        <div>
          <h1 class="font-titulo text-3xl text-ferchas-cafe">Productos</h1>
          <p class="text-sm text-ferchas-cafe-claro mt-1">{{ productos.length }} productos activos · {{ productos.filter(p => p.stockBajo).length }} con stock bajo</p>
        </div>
        <button @click="abrirModalCrear" class="btn-principal flex items-center gap-2">
          <Icono nombre="mas" :tamano="16" /> Nuevo producto
        </button>
      </div>

      <!-- Filtros -->
      <div class="bg-white rounded-lg border border-ferchas-cafe/10 shadow-sm p-4 mb-6 flex gap-3 items-center">
        <div class="relative flex-1">
          <input v-model="busqueda" type="text" placeholder="Buscar por nombre o descripción..." class="input-base pl-10">
          <div class="absolute left-3 top-1/2 -translate-y-1/2 text-ferchas-cafe-claro"><Icono nombre="buscar" :tamano="18" /></div>
        </div>
        <select v-model="filtroCategoriaId" class="input-base w-auto">
          <option value="">Todas las categorías</option>
          <option v-for="cat in categorias" :key="cat.id_categoria" :value="cat.id_categoria">
            {{ cat.nombre_categoria }}
          </option>
        </select>
        <select v-model="filtroTipo" class="input-base w-auto">
          <option value="">Todos los tipos</option>
          <option value="interno">Internos</option>
          <option value="proveedor">De proveedor</option>
        </select>
      </div>

      <!-- Grid de productos -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div v-for="p in productos" :key="p.id_producto"
             class="bg-white rounded-lg shadow-sm border border-ferchas-cafe/10 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
          <div :class="['h-32 flex items-center justify-center', `bg-ferchas-${p.fondoColor}`]" v-html="p.ilustracion"></div>
          <div class="p-4 flex-1 flex flex-col">
            <div class="flex items-start justify-between mb-2 gap-2">
              <h3 class="font-titulo text-base text-ferchas-cafe leading-tight">{{ p.nombre }}</h3>
              <span v-if="p.stockBajo" class="badge-stock-bajo whitespace-nowrap">Stock bajo</span>
              <span v-else class="bg-ferchas-rosa/30 text-ferchas-vino text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">{{ p.tipo }}</span>
            </div>
            <p class="text-xs text-ferchas-cafe-claro leading-relaxed line-clamp-2 flex-1">{{ p.descripcion }}</p>
            <div class="flex items-end justify-between mt-3 pt-3 border-t border-ferchas-cafe/10">
              <div>
                <div class="font-titulo text-xl text-ferchas-vino">${{ p.precio.toFixed(2) }}</div>
                <div :class="['text-xs font-semibold', p.stockBajo ? 'text-ferchas-error' : p.stockMedio ? 'text-ferchas-advertencia' : 'text-ferchas-exito']">
                  {{ p.stockBajo ? `Solo ${p.stock} unidades` : `${p.stock} unidades` }}
                </div>
              </div>
              <div class="flex gap-1">
                <button @click="abrirModalEditar(p)" class="text-ferchas-cafe-claro hover:text-ferchas-vino hover:bg-ferchas-fondo p-1.5 rounded transition-colors">
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

      <!-- Paginación simple -->
      <div class="flex items-center justify-between mt-6 text-sm">
        <span class="text-ferchas-cafe-claro">Mostrando 1–{{ productos.length }} de {{ productos.length }}</span>
        <div class="flex gap-1">
          <button class="px-3 py-1.5 bg-white border border-ferchas-cafe/20 rounded text-ferchas-cafe-claro disabled:opacity-40" disabled>Anterior</button>
          <button class="px-3 py-1.5 bg-ferchas-rosa text-white rounded font-bold">1</button>
          <button class="px-3 py-1.5 bg-white border border-ferchas-cafe/20 rounded text-ferchas-cafe-claro disabled:opacity-40" disabled>Siguiente</button>
        </div>
      </div>
    </div>

    <ModalProducto v-if="mostrarModal" :producto="productoAEditar" @cerrar="cerrarModal" @guardar="guardarProducto" />
  </LayoutPanel>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import LayoutPanel from '../components/shared/LayoutPanel.vue'
import Icono from '../components/shared/Icono.vue'
import ModalProducto from '../components/productos/ModalProducto.vue'
import { useAlmacenProductos } from '../controllers/ControladorProductos.js'
import { useAlmacenCategorias } from '../controllers/ControladorCategorias.js'

const almacenProductos = useAlmacenProductos()
const almacenCategorias = useAlmacenCategorias()

const busqueda = ref('')
const filtroCategoriaId = ref('')
const filtroTipo = ref('')
const mostrarModal = ref(false)
const productoAEditar = ref(null)
const categorias = computed(() => almacenCategorias.categorias)

const mapeoCategoriaIlustracion = {
  'Pan dulce tradicional': { svg: 'galleta', fondo: 'rosa-suave' },
  'Crepas y postres': { svg: 'velvet', fondo: 'rosa/40' },
  'Postres y especialidades': { svg: 'vainilla', fondo: 'advertencia/30' },
  'Pasteles personalizados': { svg: 'pastel', fondo: 'rosa-suave' },
  'Productos salados': { svg: 'tartaleta', fondo: 'advertencia/30' },
  'Bebidas frías y calientes': { svg: 'cafe', fondo: 'cafe/15' },
}

const ilustracionesSvg = {
  fresa: `<svg viewBox="0 0 100 100" width="56" height="56"><circle cx="50" cy="55" r="28" fill="#C4889A"/><circle cx="50" cy="42" r="22" fill="#fff" opacity="0.85"/><path d="M30 40 Q50 30 70 40" stroke="#DF9CB4" stroke-width="3" fill="none"/><circle cx="42" cy="45" r="2" fill="#C47B7B"/><circle cx="55" cy="48" r="2" fill="#C47B7B"/></svg>`,
  vainilla: `<svg viewBox="0 0 100 100" width="56" height="56"><path d="M30 60 L70 60 L65 88 L35 88 Z" fill="#D4A574"/><circle cx="50" cy="50" r="22" fill="#EBCED6"/><circle cx="50" cy="35" r="4" fill="#C47B7B"/></svg>`,
  pastel: `<svg viewBox="0 0 100 100" width="56" height="56"><rect x="20" y="40" width="60" height="40" rx="3" fill="#fff" stroke="#C4889A" stroke-width="2"/><rect x="20" y="55" width="60" height="3" fill="#DF9CB4"/><path d="M50 28 L50 40 M44 28 Q50 22 50 28 Q50 22 56 28" stroke="#C47B7B" stroke-width="2.5" fill="none"/></svg>`,
  velvet: `<svg viewBox="0 0 100 100" width="56" height="56"><path d="M30 60 L70 60 L65 88 L35 88 Z" fill="#5A3A3A"/><circle cx="50" cy="50" r="22" fill="#EBCED6"/><path d="M30 50 Q50 35 70 50" stroke="#C47B7B" stroke-width="2" fill="none"/></svg>`,
  galleta: `<svg viewBox="0 0 100 100" width="56" height="56"><circle cx="50" cy="50" r="28" fill="#D4A574"/><circle cx="40" cy="42" r="3" fill="#381414"/><circle cx="55" cy="45" r="3" fill="#381414"/><circle cx="48" cy="58" r="3" fill="#381414"/><circle cx="60" cy="55" r="2.5" fill="#381414"/></svg>`,
  tartaleta: `<svg viewBox="0 0 100 100" width="56" height="56"><ellipse cx="50" cy="60" rx="32" ry="22" fill="#D4A574"/><ellipse cx="50" cy="55" rx="26" ry="16" fill="#fff" opacity="0.6"/><circle cx="42" cy="55" r="3" fill="#EBCED6"/><circle cx="58" cy="55" r="3" fill="#EBCED6"/></svg>`,
  cafe: `<svg viewBox="0 0 100 100" width="56" height="56"><path d="M28 30 L72 30 L68 80 Q50 88 32 80 Z" fill="#381414"/><path d="M72 40 Q88 40 88 55 Q88 70 72 70" fill="none" stroke="#381414" stroke-width="4"/><path d="M40 20 Q42 12 45 20 M50 20 Q52 12 55 20 M60 20 Q62 12 65 20" stroke="#C4889A" stroke-width="2" fill="none"/></svg>`,
}

function obtenerIlustracionYCategoria(idCategoria) {
  const cat = categorias.value.find(c => c.id_categoria === idCategoria)
  const mapeo = mapeoCategoriaIlustracion[cat?.nombre_categoria]
  return {
    svg: ilustracionesSvg[mapeo?.svg || 'pastel'],
    fondo: mapeo?.fondo || 'rosa-suave'
  }
}

const productos = computed(() => {
  return almacenProductos.productos
    .filter(p => {
      if (p.activo === false) return false
      if (busqueda.value) {
        const t = busqueda.value.toLowerCase()
        if (!p.nombre.toLowerCase().includes(t) && !(p.descripcion || '').toLowerCase().includes(t)) return false
      }
      if (filtroCategoriaId.value && p.id_categoria !== filtroCategoriaId.value) return false
      if (filtroTipo.value && p.tipo_origen !== filtroTipo.value) return false
      return true
    })
    .map(p => {
      const ilust = obtenerIlustracionYCategoria(p.id_categoria)
      return {
        ...p,
        stock: p.stock_disponible,
        tipo: p.tipo_origen === 'interno' ? 'INTERNO' : 'PROVEEDOR',
        stockBajo: p.stock_disponible > 0 && p.stock_disponible < 10,
        stockMedio: p.stock_disponible >= 10 && p.stock_disponible < 20,
        ilustracion: ilust.svg,
        fondoColor: ilust.fondo,
      }
    })
})

function abrirModalCrear() {
  productoAEditar.value = null
  mostrarModal.value = true
}

function abrirModalEditar(producto) {
  productoAEditar.value = producto
  mostrarModal.value = true
}

function cerrarModal() {
  mostrarModal.value = false
  productoAEditar.value = null
}

async function guardarProducto(formulario) {
  let resultado
  if (formulario.id_producto) {
    resultado = await almacenProductos.actualizar(formulario.id_producto, {
      nombre: formulario.nombre,
      descripcion: formulario.descripcion,
      id_categoria: formulario.id_categoria,
      tipo_origen: formulario.tipo_origen,
      precio: formulario.precio,
      stock_disponible: formulario.stock_disponible,
      id_proveedor: formulario.tipo_origen === 'proveedor' ? formulario.id_proveedor : null,
      es_personalizable: formulario.es_personalizable
    })
  } else {
    const { id_producto, ...datosCrear } = formulario
    resultado = await almacenProductos.crear(datosCrear)
  }
  if (resultado.exito) {
    cerrarModal()
  }
}

async function eliminarProducto(producto) {
  if (!confirm('¿Desactivar producto? Se ocultará del listado.')) return
  await almacenProductos.desactivar(producto.id_producto)
}

onMounted(async () => {
  await almacenProductos.obtenerTodos()
  await almacenCategorias.obtenerTodas()
})
</script>
