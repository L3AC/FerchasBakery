<template>
  <div class="min-h-screen bg-ferchas-fondo">
    <EncabezadoPrincipal />
    <div class="flex">
      <BarralateralPrincipal />
      <main class="flex-1 p-8">
        <h1 class="text-3xl font-titulo font-bold text-ferchas-cafe mb-8">Categorías de Productos</h1>

        <!-- Botón Crear -->
        <div class="mb-6">
          <button
            @click="mostrarFormulario = true"
            class="btn-principal"
          >
            + Nueva Categoría
          </button>
        </div>

        <!-- Buscador -->
        <div class="mb-6">
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar categorías..."
            class="input-base"
          />
        </div>

        <!-- Tabla de Categorías -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <table class="tabla-base">
            <thead class="tabla-header">
              <tr>
                <th class="px-6 py-4 text-left">Nombre</th>
                <th class="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="categoriasFiltradas.length === 0" class="tabla-fila">
                <td colspan="2" class="px-6 py-4 text-center text-ferchas-cafe-claro">
                  No hay categorías registradas
                </td>
              </tr>
              <tr v-for="categoria in categoriasFiltradas" :key="categoria.id_categoria" class="tabla-fila">
                <td class="px-6 py-4">{{ categoria.nombre_categoria }}</td>
                <td class="px-6 py-4 text-center space-x-2">
                  <button
                    @click="editar(categoria)"
                    class="px-3 py-1 bg-ferchas-rosa/10 text-ferchas-rosa hover:bg-ferchas-rosa/20 rounded text-sm transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    @click="eliminar(categoria.id_categoria)"
                    class="px-3 py-1 bg-ferchas-error/10 text-ferchas-error hover:bg-ferchas-error/20 rounded text-sm transition-colors"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Modal Formulario -->
        <div v-if="mostrarFormulario" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
            <h2 class="text-2xl font-titulo font-bold text-ferchas-cafe mb-6">
              {{ categoriaEnEdicion ? 'Editar Categoría' : 'Nueva Categoría' }}
            </h2>

            <form @submit.prevent="guardar" class="space-y-4">
              <div>
                <label class="block text-ferchas-cafe font-semibold mb-2">Nombre</label>
                <input
                  v-model="formulario.nombre"
                  type="text"
                  placeholder="Ej: Pasteles, Galletas, Panes..."
                  class="input-base"
                  required
                />
              </div>

              <div class="flex gap-3 pt-4">
                <button
                  type="button"
                  @click="cerrarFormulario"
                  class="btn-secundario flex-1"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="cargando"
                  class="btn-principal flex-1 disabled:opacity-50"
                >
                  {{ cargando ? 'Guardando...' : 'Guardar' }}
                </button>
              </div>
            </form>

            <div v-if="error" class="mt-4 p-3 bg-ferchas-error/10 text-ferchas-error rounded-lg text-sm">
              {{ error }}
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import EncabezadoPrincipal from '../components/shared/EncabezadoPrincipal.vue'
import BarralateralPrincipal from '../components/shared/BarralateralPrincipal.vue'
import { servicioCategorias } from '../services/servicioCategorias.js'

const categorias = ref([])
const busqueda = ref('')
const mostrarFormulario = ref(false)
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

function editar(categoria) {
  categoriaEnEdicion.value = categoria
  formulario.value.nombre = categoria.nombre_categoria
  mostrarFormulario.value = true
}

function cerrarFormulario() {
  mostrarFormulario.value = false
  categoriaEnEdicion.value = null
  formulario.value.nombre = ''
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
    cerrarFormulario()
    cargarCategorias()
  } else {
    error.value = resultado.error
  }
}

async function eliminar(id) {
  if (!confirm('¿Estás seguro de que deseas eliminar esta categoría?')) return

  const resultado = await servicioCategorias.eliminar(id)
  if (resultado.exito) {
    cargarCategorias()
  } else {
    error.value = resultado.error
  }
}
</script>