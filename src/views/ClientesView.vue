<template>
  <LayoutPanel>
    <div class="p-7">
      <div class="flex items-start justify-between mb-6">
        <div>
          <h1 class="font-titulo text-3xl text-ferchas-cafe">Clientes</h1>
          <p class="text-sm text-ferchas-cafe-claro mt-1">{{ clientesFiltrados.length }} clientes registrados</p>
        </div>
        <button @click="abrirModalCrear" class="btn-principal flex items-center gap-2">
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

      <!-- Tabla -->
      <div class="bg-white rounded-lg border border-ferchas-cafe/10 shadow-sm overflow-hidden">
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
                  <div class="w-9 h-9 bg-ferchas-rosa-suave rounded-full flex items-center justify-center font-bold text-ferchas-vino text-xs">{{ c.iniciales }}</div>
                  <span class="font-semibold text-ferchas-cafe">{{ c.nombre }}</span>
                </div>
              </td>
              <td class="py-3 px-4 text-ferchas-cafe">{{ c.telefono }}</td>
              <td class="py-3 px-4 text-ferchas-cafe-claro">{{ c.correo }}</td>
              <td class="py-3 px-4 text-ferchas-cafe-claro text-xs">{{ c.direccion }}</td>
              <td class="py-3 px-4 text-ferchas-cafe-claro text-xs">{{ c.created_at ? new Date(c.created_at).toLocaleDateString() : '-' }}</td>
              <td class="py-3 px-4 text-center space-x-1">
                <button @click="abrirModalEditar(c)" class="text-ferchas-cafe-claro hover:text-ferchas-vino hover:bg-ferchas-fondo p-1.5 rounded">
                  <Icono nombre="editar" :tamano="16" />
                </button>
                <button @click="eliminarCliente(c)" class="text-ferchas-error hover:bg-ferchas-error/10 p-1.5 rounded">
                  <Icono nombre="basurero" :tamano="16" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ModalCliente v-if="mostrarModal" :cliente="clienteAEditar" @cerrar="cerrarModal" @guardar="guardarCliente" />
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
const clienteAEditar = ref(null)

const clientesFiltrados = computed(() => {
  return almacenClientes.clientes
    .filter(c => {
      if (!busqueda.value) return true
      const t = busqueda.value.toLowerCase()
      return c.nombre.toLowerCase().includes(t) ||
             (c.telefono && c.telefono.includes(busqueda.value)) ||
             (c.correo && c.correo.toLowerCase().includes(t))
    })
    .map(c => ({
      ...c,
      iniciales: c.nombre.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
    }))
})

function abrirModalCrear() {
  clienteAEditar.value = null
  mostrarModal.value = true
}

function abrirModalEditar(cliente) {
  clienteAEditar.value = cliente
  mostrarModal.value = true
}

function cerrarModal() {
  mostrarModal.value = false
  clienteAEditar.value = null
}

async function guardarCliente(formulario) {
  let resultado
  if (formulario.id_cliente) {
    resultado = await almacenClientes.actualizar(formulario.id_cliente, {
      nombre: formulario.nombre,
      telefono: formulario.telefono || null,
      correo: formulario.correo || null,
      direccion: formulario.direccion || null
    })
  } else {
    const { id_cliente, ...datosCrear } = formulario
    resultado = await almacenClientes.crear(datosCrear)
  }
  if (resultado.exito) {
    cerrarModal()
  }
}

async function eliminarCliente(cliente) {
  if (!confirm(`¿Eliminar a ${cliente.nombre}? Esta acción no se puede deshacer.`)) return
  await almacenClientes.eliminar(cliente.id_cliente)
}

onMounted(async () => {
  await almacenClientes.obtenerTodos()
})
</script>
