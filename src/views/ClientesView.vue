<template>
  <LayoutPanel>
    <div class="p-7">
      <div class="flex items-start justify-between mb-6">
        <div>
          <h1 class="font-titulo text-3xl text-ferchas-cafe">Clientes</h1>
          <p class="text-sm text-ferchas-cafe-claro mt-1">{{ clientesFiltrados.length }} clientes registrados</p>
        </div>
        <button @click="abrirFormularioNuevo" class="btn-principal flex items-center gap-2">
          <Icono nombre="mas" :tamano="16" /> Nuevo cliente
        </button>
      </div>

      <!-- Buscador -->
      <div class="bg-white rounded-lg border border-ferchas-cafe/10 shadow-sm p-4 mb-6">
        <div class="relative">
          <input v-model="busqueda" type="text" placeholder="Buscar cliente por nombre, teléfono o correo..." class="input-base pl-10">
          <div class="absolute left-3 top-1/2 -translate-y-1/2 text-ferchas-cafe-claro"><Icono nombre="buscar" :tamano="18" /></div>
        </div>
      </div>

      <!-- Cargando -->
      <div v-if="almacenClientes.cargando" class="bg-white rounded-lg border border-ferchas-cafe/10 shadow-sm p-12 text-center">
        <p class="text-ferchas-cafe-claro">Cargando clientes...</p>
      </div>

      <!-- Vacío -->
      <div v-else-if="clientesFiltrados.length === 0" class="bg-white rounded-lg border border-ferchas-cafe/10 shadow-sm p-12 text-center">
        <p class="text-ferchas-cafe font-semibold">No hay clientes registrados</p>
      </div>

      <!-- Tabla -->
      <div v-else class="bg-white rounded-lg border border-ferchas-cafe/10 shadow-sm overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-ferchas-fondo-oscuro text-ferchas-cafe text-xs uppercase tracking-wider">
              <th class="text-left py-3 px-4 font-bold">Cliente</th>
              <th class="text-left py-3 px-4 font-bold">Teléfono</th>
              <th class="text-left py-3 px-4 font-bold">Correo</th>
              <th class="text-left py-3 px-4 font-bold">Dirección</th>
              <th class="text-left py-3 px-4 font-bold">Registrado</th>
              <th class="text-center py-3 px-4 font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in clientesFiltrados" :key="c.id_cliente"
                class="border-b border-ferchas-cafe/10 last:border-0 hover:bg-ferchas-fondo transition-colors">
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 bg-ferchas-rosa-suave rounded-full flex items-center justify-center font-bold text-ferchas-vino text-xs">
                    {{ obtenerIniciales(c.nombre) }}
                  </div>
                  <span class="font-semibold text-ferchas-cafe">{{ c.nombre }}</span>
                </div>
              </td>
              <td class="py-3 px-4 text-ferchas-cafe">{{ c.telefono || '-' }}</td>
              <td class="py-3 px-4 text-ferchas-cafe-claro">{{ c.correo || '-' }}</td>
              <td class="py-3 px-4 text-ferchas-cafe-claro text-xs">{{ c.direccion || '-' }}</td>
              <td class="py-3 px-4 text-ferchas-cafe-claro">{{ formatearFecha(c.created_at) }}</td>
              <td class="py-3 px-4 text-center">
                <button @click="abrirFormularioEditar(c)" class="text-ferchas-cafe-claro hover:text-ferchas-vino hover:bg-ferchas-fondo p-1.5 rounded">
                  <Icono nombre="editar" :tamano="16" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ModalCliente v-if="mostrarModal" :cliente-editando="clienteEditando" @cerrar="cerrarFormulario" @guardar="guardar" />
  </LayoutPanel>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import LayoutPanel from '../components/shared/LayoutPanel.vue'
import Icono from '../components/shared/Icono.vue'
import ModalCliente from '../components/clientes/ModalCliente.vue'
import { useAlmacenClientes } from '../stores/almacenClientes.js'

const almacenClientes = useAlmacenClientes()
const busqueda = ref('')
const mostrarModal = ref(false)
const clienteEditando = ref(null)

const clientesFiltrados = computed(() => {
  const lista = almacenClientes.clientes
  if (!busqueda.value.trim()) return lista
  const t = busqueda.value.toLowerCase()
  return lista.filter(c =>
    (c.nombre || '').toLowerCase().includes(t) ||
    (c.telefono || '').includes(busqueda.value) ||
    (c.correo || '').toLowerCase().includes(t)
  )
})

function obtenerIniciales(nombre) {
  if (!nombre) return '??'
  const partes = nombre.trim().split(/\s+/)
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
}

function formatearFecha(fechaIso) {
  if (!fechaIso) return '-'
  const f = new Date(fechaIso)
  if (isNaN(f.getTime())) return '-'
  return f.toLocaleDateString('es-SV', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function abrirFormularioNuevo() {
  clienteEditando.value = null
  mostrarModal.value = true
}

function abrirFormularioEditar(cliente) {
  clienteEditando.value = cliente
  mostrarModal.value = true
}

function cerrarFormulario() {
  mostrarModal.value = false
  clienteEditando.value = null
}

async function guardar(formulario) {
  if (clienteEditando.value) {
    await almacenClientes.actualizar(clienteEditando.value.id_cliente, formulario)
  } else {
    await almacenClientes.crear(formulario)
  }
  cerrarFormulario()
}

onMounted(() => almacenClientes.obtenerTodos())
</script>
