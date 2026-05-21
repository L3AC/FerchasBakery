<template>
  <LayoutPanel>
    <div class="p-7">
      <div class="flex items-start justify-between mb-6">
        <div>
          <h1 class="font-titulo text-3xl text-ferchas-cafe">Productos</h1>
          <p class="text-sm text-ferchas-cafe-claro mt-1">{{ productos.length }} productos activos · {{ productos.filter(p => p.stockBajo).length }} con stock bajo</p>
        </div>
        <button @click="mostrarModal = true" class="btn-principal flex items-center gap-2">
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
          <option>Todas las categorías</option>
          <option>Pan dulce tradicional</option>
          <option>Crepas y postres</option>
          <option>Postres y especialidades</option>
          <option>Pasteles personalizados</option>
          <option>Productos salados</option>
          <option>Bebidas</option>
        </select>
        <select v-model="filtroTipo" class="input-base w-auto">
          <option>Todos los tipos</option>
          <option>Internos</option>
          <option>De proveedor</option>
        </select>
      </div>

      <!-- Grid de productos -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div v-for="p in productos" :key="p.id"
             class="bg-white rounded-lg shadow-sm border border-ferchas-cafe/10 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
          <div :class="['h-32 flex items-center justify-center', `bg-ferchas-${p.fondoColor}`]" v-html="ilustraciones[p.ilustracion]"></div>
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
                <button class="text-ferchas-cafe-claro hover:text-ferchas-vino hover:bg-ferchas-fondo p-1.5 rounded transition-colors">
                  <Icono nombre="editar" :tamano="16" />
                </button>
                <button class="text-ferchas-error hover:bg-ferchas-error/10 p-1.5 rounded transition-colors">
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

    <ModalProducto v-if="mostrarModal" @cerrar="mostrarModal = false" @guardar="guardar" />
  </LayoutPanel>
</template>

<script setup>
import { ref } from 'vue'
import LayoutPanel from '../components/shared/LayoutPanel.vue'
import Icono from '../components/shared/Icono.vue'
import ModalProducto from '../components/productos/ModalProducto.vue'
import { mockProductos, ilustracionesProductos } from '../lib/datosMock.js'

// Versión real (descomentar cuando Insforge esté conectado):
// import { useAlmacenProductos } from '../stores/almacenProductos.js'
// const almacenProductos = useAlmacenProductos()
// onMounted(() => almacenProductos.obtenerTodos())

const productos = mockProductos
const ilustraciones = ilustracionesProductos
const busqueda = ref('')
const filtroCategoria = ref('Todas las categorías')
const filtroTipo = ref('Todos los tipos')
const mostrarModal = ref(false)

function guardar(formulario) {
  // En el sistema real: await almacenProductos.crear(formulario)
  console.log('Guardar producto (mock):', formulario)
  mostrarModal.value = false
}
</script>
