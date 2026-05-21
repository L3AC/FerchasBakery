<template>
  <LayoutPanel>
    <div class="p-7">
      <div class="flex items-start justify-between mb-6">
        <div>
          <h1 class="font-titulo text-3xl text-ferchas-cafe">Clientes</h1>
          <p class="text-sm text-ferchas-cafe-claro mt-1">{{ clientes.length }} clientes registrados</p>
        </div>
        <button @click="mostrarModal = true" class="btn-principal flex items-center gap-2">
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
              <th class="text-center py-3 px-4 font-bold">Pedidos</th>
              <th class="text-left py-3 px-4 font-bold">Último</th>
              <th class="text-center py-3 px-4 font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in clientes" :key="c.nombre"
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
              <td class="py-3 px-4 text-center">
                <span class="bg-ferchas-rosa-suave text-ferchas-vino text-xs font-bold px-2 py-0.5 rounded-full">{{ c.pedidos }}</span>
              </td>
              <td class="py-3 px-4 text-ferchas-cafe-claro">{{ c.ultimo }}</td>
              <td class="py-3 px-4 text-center">
                <button class="text-ferchas-cafe-claro hover:text-ferchas-vino hover:bg-ferchas-fondo p-1.5 rounded">
                  <Icono nombre="editar" :tamano="16" />
                </button>
                <button class="text-ferchas-error hover:bg-ferchas-error/10 p-1.5 rounded ml-1">
                  <Icono nombre="basurero" :tamano="16" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ModalCliente v-if="mostrarModal" @cerrar="mostrarModal = false" @guardar="guardar" />
  </LayoutPanel>
</template>

<script setup>
import { ref } from 'vue'
import LayoutPanel from '../components/shared/LayoutPanel.vue'
import Icono from '../components/shared/Icono.vue'
import ModalCliente from '../components/clientes/ModalCliente.vue'
import { mockClientes } from '../lib/datosMock.js'

// Versión real (descomentar cuando Insforge esté conectado):
// import { useAlmacenClientes } from '../stores/almacenClientes.js'
// const almacenClientes = useAlmacenClientes()
// onMounted(() => almacenClientes.obtenerTodos())

const clientes = mockClientes
const busqueda = ref('')
const mostrarModal = ref(false)

function guardar(formulario) {
  console.log('Guardar cliente (mock):', formulario)
  mostrarModal.value = false
}
</script>
