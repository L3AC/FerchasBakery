<template>
  <LayoutPanel>
    <div class="p-7">
      <div class="flex items-start justify-between mb-6">
        <div>
          <h1 class="font-titulo text-3xl text-ferchas-cafe">Categorías de Productos</h1>
          <p class="text-sm text-ferchas-cafe-claro mt-1">{{ categorias.length }} categorías registradas</p>
        </div>
        <button @click="abrirModalCrear" class="btn-principal flex items-center gap-2">
          <Icono nombre="mas" :tamano="16" /> Nueva categoría
        </button>
      </div>

      <!-- Buscador -->
      <div class="bg-white rounded-lg border border-ferchas-cafe/10 shadow-sm p-4 mb-6">
        <div class="relative">
          <input v-model="busqueda" type="text" placeholder="Buscar categorías..." class="input-base pl-10">
          <div class="absolute left-3 top-1/2 -translate-y-1/2 text-ferchas-cafe-claro"><Icono nombre="buscar" :tamano="18" /></div>
        </div>
      </div>

      <!-- Cards de categorías -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-if="categoriasFiltradas.length === 0"
             class="col-span-full bg-white rounded-lg border border-ferchas-cafe/10 shadow-sm p-10 text-center text-ferchas-cafe-claro">
          No hay categorías registradas
        </div>
        <div v-for="cat in categoriasFiltradas" :key="cat.id_categoria"
             class="bg-white rounded-lg border border-ferchas-cafe/10 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-ferchas-rosa-suave rounded-full flex items-center justify-center text-ferchas-vino">
              <Icono nombre="categorias" :tamano="20" />
            </div>
            <h3 class="font-titulo text-lg text-ferchas-vino flex-1">{{ cat.nombre_categoria }}</h3>
          </div>
          <div class="flex items-center justify-between pt-3 border-t border-ferchas-cafe/10 mt-auto">
            <span class="text-xs text-ferchas-cafe-claro">{{ cat.id_categoria ? 'ID: ' + cat.id_categoria.slice(0, 8) + '...' : '' }}</span>
            <div class="flex gap-1">
              <button @click="abrirModalEditar(cat)" class="text-ferchas-cafe-claro hover:text-ferchas-vino hover:bg-ferchas-fondo p-1.5 rounded">
                <Icono nombre="editar" :tamano="16" />
              </button>
              <button @click="eliminar(cat)" class="text-ferchas-error hover:bg-ferchas-error/10 p-1.5 rounded">
                <Icono nombre="basurero" :tamano="16" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ModalBase v-if="mostrarModal" :titulo="categoriaEnEdicion ? 'Editar categoría' : 'Nueva categoría'" ancho="sm" padding-top="pt-16" @cerrar="cerrarModal">
      <form @submit.prevent="guardar">
        <label class="block mb-6">
          <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Nombre de la categoría <span class="text-ferchas-error">*</span></span>
          <input v-model="formulario.nombre" type="text" maxlength="50" required placeholder="Ej: Pasteles, Galletas, Panes..." class="input-base">
        </label>

        <div v-if="error" class="mb-4 p-3 bg-ferchas-error/10 text-ferchas-error rounded-lg text-sm">{{ error }}</div>

        <div class="flex justify-end gap-3 pt-4 border-t-2 border-ferchas-cafe/10">
          <button type="button" @click="cerrarModal" class="btn-secundario">Cancelar</button>
          <button type="submit" :disabled="cargando" class="btn-principal disabled:opacity-50">
            {{ cargando ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </form>
    </ModalBase>
  </LayoutPanel>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import LayoutPanel from '../components/shared/LayoutPanel.vue'
import Icono from '../components/shared/Icono.vue'
import ModalBase from '../components/shared/ModalBase.vue'
import { servicioCategorias } from '../services/servicioCategorias.js'

const categorias = ref([])
const busqueda = ref('')
const mostrarModal = ref(false)
const categoriaEnEdicion = ref(null)
const formulario = ref({ nombre: '' })
const cargando = ref(false)
const error = ref('')

const categoriasFiltradas = computed(() => {
  if (!busqueda.value) return categorias.value
  const term = busqueda.value.toLowerCase()
  return categorias.value.filter(c =>
    c.nombre_categoria.toLowerCase().includes(term)
  )
})

onMounted(() => {
  cargarCategorias()
})

async function cargarCategorias() {
  const resultado = await servicioCategorias.obtenerTodas()
  if (resultado.exito) {
    categorias.value = resultado.categorias
  }
}

function abrirModalCrear() {
  categoriaEnEdicion.value = null
  formulario.value = { nombre: '' }
  error.value = ''
  mostrarModal.value = true
}

function abrirModalEditar(categoria) {
  categoriaEnEdicion.value = categoria
  formulario.value = { nombre: categoria.nombre_categoria }
  error.value = ''
  mostrarModal.value = true
}

function cerrarModal() {
  mostrarModal.value = false
  categoriaEnEdicion.value = null
  formulario.value = { nombre: '' }
  error.value = ''
}

async function guardar() {
  if (!formulario.value.nombre.trim()) {
    error.value = 'El nombre es requerido'
    return
  }

  cargando.value = true
  error.value = ''

  let resultado
  if (categoriaEnEdicion.value) {
    resultado = await servicioCategorias.actualizar(
      categoriaEnEdicion.value.id_categoria,
      formulario.value.nombre
    )
  } else {
    resultado = await servicioCategorias.crear(formulario.value.nombre)
  }

  cargando.value = false

  if (resultado.exito) {
    cerrarModal()
    cargarCategorias()
  } else {
    error.value = resultado.error
  }
}

async function eliminar(categoria) {
  if (!confirm(`¿Eliminar la categoría "${categoria.nombre_categoria}"?`)) return

  const resultado = await servicioCategorias.eliminar(categoria.id_categoria)
  if (resultado.exito) {
    cargarCategorias()
  } else {
    error.value = resultado.error
  }
}
</script>
