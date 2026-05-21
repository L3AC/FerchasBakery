<template>
  <div class="min-h-screen bg-ferchas-fondo">
    <EncabezadoPrincipal />
    <div class="flex">
      <BarralateralPrincipal />
      <main class="flex-1 p-8">
        <h1 class="font-titulo text-3xl font-bold text-ferchas-cafe mb-8">Pedidos</h1>

        <!-- Botón Crear -->
        <div class="mb-6">
          <button @click="abrirNuevoPedido" class="btn-principal">+ Nuevo Pedido</button>
        </div>

        <!-- Buscador -->
        <div class="mb-6">
          <input
            v-model="busquedaTexto"
            type="text"
            placeholder="Buscar pedidos por cliente, ID o tipo..."
            class="input-base"
          />
        </div>

        <!-- Filtros de Estado -->
        <div class="flex gap-2 mb-6 flex-wrap">
          <button
            @click="filtroEstado = null"
            :class="[
              'px-4 py-2 rounded-lg font-semibold text-sm transition-colors',
              filtroEstado === null ? 'bg-ferchas-rosa text-white' : 'bg-white text-ferchas-cafe border-2 border-ferchas-cafe/20'
            ]"
          >
            Todos
          </button>
          <button
            @click="filtroEstado = 'Pendiente'"
            :class="[
              'px-4 py-2 rounded-lg font-semibold text-sm transition-colors',
              filtroEstado === 'Pendiente' ? 'bg-ferchas-rosa text-white' : 'bg-white text-ferchas-cafe border-2 border-ferchas-cafe/20'
            ]"
          >
            Pendientes
          </button>
          <button
            @click="filtroEstado = 'Preparando'"
            :class="[
              'px-4 py-2 rounded-lg font-semibold text-sm transition-colors',
              filtroEstado === 'Preparando' ? 'bg-ferchas-rosa text-white' : 'bg-white text-ferchas-cafe border-2 border-ferchas-cafe/20'
            ]"
          >
            Preparando
          </button>
          <button
            @click="filtroEstado = 'Entregado'"
            :class="[
              'px-4 py-2 rounded-lg font-semibold text-sm transition-colors',
              filtroEstado === 'Entregado' ? 'bg-ferchas-rosa text-white' : 'bg-white text-ferchas-cafe border-2 border-ferchas-cafe/20'
            ]"
          >
            Entregados
          </button>
        </div>

        <!-- Tabla de Pedidos -->
        <div class="bg-white rounded-lg shadow-sm overflow-x-auto mb-6">
          <table class="tabla-base w-full">
            <thead class="tabla-header">
              <tr>
                <th class="px-4 py-3 text-left">ID Pedido</th>
                <th class="px-4 py-3 text-left">Cliente</th>
                <th class="px-4 py-3 text-left">Tipo</th>
                <th class="px-4 py-3 text-center">Total</th>
                <th class="px-4 py-3 text-left">Estado</th>
                <th class="px-4 py-3 text-left">Fecha</th>
                <th class="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="pedidosFiltrados.length === 0">
                <td colspan="7" class="px-4 py-8 text-center text-ferchas-cafe-claro">No hay pedidos</td>
              </tr>
              <tr v-for="pedido in pedidosFiltrados" :key="pedido.id_pedido" class="tabla-fila border-b hover:bg-ferchas-fondo/50 cursor-pointer">
                <td class="px-4 py-3 font-mono text-sm">{{ pedido.id_pedido.slice(0, 8) }}</td>
                <td class="px-4 py-3 font-semibold">{{ pedido.clientes?.nombre || 'Sin cliente' }}</td>
                <td class="px-4 py-3">
                  <span class="badge-info text-xs">{{ pedido.tipo_pedido }}</span>
                </td>
                <td class="px-4 py-3 text-center font-semibold text-ferchas-rosa">${{ parseFloat(pedido.total || 0).toFixed(2) }}</td>
                <td class="px-4 py-3">
                  <span :class="estadoBadge(pedido.estado_pedido)" class="text-xs">{{ pedido.estado_pedido }}</span>
                </td>
                <td class="px-4 py-3 text-sm text-ferchas-cafe-claro">{{ formatearFecha(pedido.fecha_pedido) }}</td>
                <td class="px-4 py-3 text-center space-x-1">
                  <button
                    @click="verDetalles(pedido)"
                    class="px-2 py-1 text-ferchas-rosa hover:bg-ferchas-rosa/10 rounded text-sm"
                  >
                    Ver
                  </button>
                  <button
                    @click="cambiarEstado(pedido)"
                    class="px-2 py-1 text-ferchas-cafe hover:bg-ferchas-cafe/10 rounded text-sm"
                  >
                    Cambiar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>

    <!-- Modal Nuevo Pedido -->
    <div v-if="mostrarModalNuevo" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div class="bg-white rounded-lg shadow-lg max-w-4xl w-full my-8 p-6">
        <h2 class="font-titulo text-2xl text-ferchas-cafe mb-6">Nuevo Pedido</h2>
        
        <form @submit.prevent="guardarPedido" class="space-y-6">
           <!-- Info del Pedido -->
           <div class="bg-ferchas-fondo p-4 rounded-lg">
             <h3 class="font-semibold text-ferchas-cafe mb-4">Información del Pedido</h3>
             <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-ferchas-cafe font-semibold mb-2">Cliente</label>
                  <BuscadorSelect
                    v-model="nuevoPedido.id_cliente"
                    :items="clientes"
                    label="nombre"
                    value-key="id_cliente"
                    placeholder="Buscar cliente..."
                  />
                </div>
               <div>
                 <label class="block text-ferchas-cafe font-semibold mb-2">Tipo de Pedido</label>
                 <select v-model="nuevoPedido.tipo_pedido" class="input-base" required>
                   <option>Mostrador</option>
                   <option>Encargo</option>
                   <option>Domicilio</option>
                 </select>
               </div>
               <div>
                 <label class="block text-ferchas-cafe font-semibold mb-2">Método de Pago</label>
                 <select v-model="nuevoPedido.metodo_pago" class="input-base" required>
                   <option>Efectivo</option>
                   <option>Transferencia</option>
                   <option>Tarjeta</option>
                 </select>
               </div>
             </div>
           </div>

           <!-- Agregar Productos -->
           <div class="bg-ferchas-fondo p-4 rounded-lg">
             <h3 class="font-semibold text-ferchas-cafe mb-4">Productos del Pedido</h3>
             
             <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                <div>
                  <label class="block text-sm font-semibold text-ferchas-cafe mb-2">Producto</label>
                  <BuscadorSelect
                    v-model="productoSeleccionado"
                    :items="productos"
                    label="nombre"
                    value-key="id_producto"
                    placeholder="Buscar producto..."
                  />
                  <p v-if="productoSeleccionado" class="text-xs text-ferchas-cafe-claro mt-1">
                    Precio: ${{ precioProductoSeleccionado }}
                  </p>
                </div>
               <div>
                 <label class="block text-sm font-semibold text-ferchas-cafe mb-2">Cantidad</label>
                 <input v-model.number="cantidadProducto" type="number" min="1" class="input-base text-sm" placeholder="1" />
               </div>
               <div class="flex items-end">
                 <button
                   type="button"
                   @click="agregarProductoAlDetalle"
                   class="btn-principal w-full text-sm"
                 >
                   Agregar
                 </button>
               </div>
             </div>

            <!-- Detalles agregados -->
            <div v-if="detallesNuevoPedido.length > 0" class="border-2 border-ferchas-cafe/20 rounded-lg overflow-hidden">
              <table class="w-full text-sm">
                <thead class="bg-ferchas-fondo-oscuro">
                  <tr>
                    <th class="px-3 py-2 text-left">Producto</th>
                    <th class="px-3 py-2 text-center">Precio</th>
                    <th class="px-3 py-2 text-center">Cantidad</th>
                    <th class="px-3 py-2 text-center">Subtotal</th>
                    <th class="px-3 py-2 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(detalle, idx) in detallesNuevoPedido" :key="idx" class="border-t border-ferchas-cafe/10">
                    <td class="px-3 py-2">{{ detalle.producto_nombre }}</td>
                    <td class="px-3 py-2 text-center">${{ parseFloat(detalle.precio_unitario).toFixed(2) }}</td>
                    <td class="px-3 py-2 text-center">{{ detalle.cantidad }}</td>
                    <td class="px-3 py-2 text-center font-semibold">${{ (detalle.cantidad * parseFloat(detalle.precio_unitario)).toFixed(2) }}</td>
                    <td class="px-3 py-2 text-center">
                      <button
                        type="button"
                        @click="removerDetalle(idx)"
                        class="text-ferchas-error hover:bg-ferchas-error/10 px-2 py-1 rounded text-xs"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="text-center py-4 text-ferchas-cafe-claro">
              No hay productos agregados aún
            </div>
          </div>

          <!-- Total -->
          <div class="bg-ferchas-fondo p-4 rounded-lg">
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold text-ferchas-cafe">Total del Pedido:</span>
              <span class="text-3xl font-titulo text-ferchas-rosa">${{ totalPedido.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Errores -->
          <div v-if="errorPedido" class="p-3 bg-ferchas-error/10 text-ferchas-error rounded-lg text-sm">
            {{ errorPedido }}
          </div>

          <!-- Botones -->
          <div class="flex gap-3">
            <button type="button" @click="cerrarModalNuevo" class="btn-secundario flex-1">
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="cargandoPedido || detallesNuevoPedido.length === 0"
              class="btn-principal flex-1 disabled:opacity-50"
            >
              {{ cargandoPedido ? 'Registrando...' : 'Registrar Pedido' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Ver Detalles -->
    <div v-if="mostrarDetalles" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6">
        <h2 class="font-titulo text-2xl text-ferchas-cafe mb-4">
          Detalles del Pedido {{ pedidoSeleccionado?.id_pedido.slice(0, 8) }}
        </h2>

        <div class="space-y-4">
          <!-- Info del Pedido -->
          <div class="bg-ferchas-fondo p-4 rounded-lg">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-ferchas-cafe-claro">Cliente</p>
                <p class="font-semibold">{{ pedidoSeleccionado?.clientes?.nombre }}</p>
              </div>
              <div>
                <p class="text-ferchas-cafe-claro">Estado</p>
                <p :class="estadoBadge(pedidoSeleccionado?.estado_pedido)" class="inline-block">
                  {{ pedidoSeleccionado?.estado_pedido }}
                </p>
              </div>
              <div>
                <p class="text-ferchas-cafe-claro">Tipo</p>
                <p class="font-semibold">{{ pedidoSeleccionado?.tipo_pedido }}</p>
              </div>
              <div>
                <p class="text-ferchas-cafe-claro">Fecha</p>
                <p class="font-semibold">{{ formatearFecha(pedidoSeleccionado?.fecha_pedido) }}</p>
              </div>
            </div>
          </div>

          <!-- Tabla de Productos -->
          <div class="border-2 border-ferchas-cafe/20 rounded-lg overflow-hidden">
            <table class="w-full text-sm">
              <thead class="bg-ferchas-fondo-oscuro">
                <tr>
                  <th class="px-3 py-2 text-left">Producto</th>
                  <th class="px-3 py-2 text-center">Cantidad</th>
                  <th class="px-3 py-2 text-center">Precio Unit.</th>
                  <th class="px-3 py-2 text-center">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="detalle in detallesSeleccionados" :key="detalle.id_detalle" class="border-t border-ferchas-cafe/10">
                  <td class="px-3 py-2">{{ detalle.productos?.nombre }}</td>
                  <td class="px-3 py-2 text-center">{{ detalle.cantidad }}</td>
                  <td class="px-3 py-2 text-center">${{ parseFloat(detalle.precio_unitario).toFixed(2) }}</td>
                  <td class="px-3 py-2 text-center font-semibold">
                    ${{ (detalle.cantidad * parseFloat(detalle.precio_unitario)).toFixed(2) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Total -->
          <div class="bg-ferchas-fondo p-4 rounded-lg flex justify-between items-center">
            <span class="font-semibold">Total:</span>
            <span class="text-2xl font-titulo text-ferchas-rosa">
              ${{ parseFloat(pedidoSeleccionado?.total || 0).toFixed(2) }}
            </span>
          </div>

          <!-- Botón Cerrar -->
          <button @click="cerrarDetalles" class="btn-secundario w-full">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import EncabezadoPrincipal from '../components/shared/EncabezadoPrincipal.vue'
import BarralateralPrincipal from '../components/shared/BarralateralPrincipal.vue'
import BuscadorSelect from '../components/shared/BuscadorSelect.vue'
import { useAlmacenPedidos } from '../stores/almacenPedidos.js'
import { useAlmacenProductos } from '../stores/almacenProductos.js'
import { useAlmacenClientes } from '../stores/almacenClientes.js'
import { useAlmacenAutenticacion } from '../stores/almacenAutenticacion.js'

const almacenPedidos = useAlmacenPedidos()
const almacenProductos = useAlmacenProductos()
const almacenClientes = useAlmacenClientes()
const almacenAuth = useAlmacenAutenticacion()

const filtroEstado = ref(null)
const busquedaTexto = ref('')
const mostrarModalNuevo = ref(false)
const mostrarDetalles = ref(false)
const pedidoSeleccionado = ref(null)
const detallesSeleccionados = ref([])
const cargandoPedido = ref(false)
const errorPedido = ref('')

const productoSeleccionado = ref('')
const cantidadProducto = ref(1)
const detallesNuevoPedido = ref([])

const nuevoPedido = ref({
  id_cliente: '',
  tipo_pedido: 'Mostrador',
  metodo_pago: 'Efectivo'
})

const pedidosFiltrados = computed(() => {
  let pedidos = almacenPedidos.pedidos

  if (filtroEstado.value) {
    pedidos = pedidos.filter(p => p.estado_pedido === filtroEstado.value)
  }

  if (busquedaTexto.value) {
    const term = busquedaTexto.value.toLowerCase()
    pedidos = pedidos.filter(p =>
      (p.clientes?.nombre && p.clientes.nombre.toLowerCase().includes(term)) ||
      p.id_pedido.toLowerCase().includes(term) ||
      p.tipo_pedido.toLowerCase().includes(term)
    )
  }

  return pedidos
})

const clientes = computed(() => almacenClientes.clientes)
const productos = computed(() => almacenProductos.productos)

const precioProductoSeleccionado = computed(() => {
  if (!productoSeleccionado.value) return '0.00'
  const prod = productos.value.find(p => p.id_producto === productoSeleccionado.value)
  return prod ? parseFloat(prod.precio).toFixed(2) : '0.00'
})

const totalPedido = computed(() => {
  return detallesNuevoPedido.value.reduce((sum, detalle) => {
    return sum + (detalle.cantidad * parseFloat(detalle.precio_unitario))
  }, 0)
})

function estadoBadge(estado) {
  const badges = {
    'Pendiente': 'badge-advertencia',
    'Preparando': 'badge-info',
    'Entregado': 'badge-exito',
    'Cancelado': 'badge-error'
  }
  return badges[estado] || 'badge-info'
}

function formatearFecha(fecha) {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function abrirNuevoPedido() {
  nuevoPedido.value = { id_cliente: '', tipo_pedido: 'Mostrador', metodo_pago: 'Efectivo' }
  detallesNuevoPedido.value = []
  productoSeleccionado.value = ''
  cantidadProducto.value = 1
  errorPedido.value = ''
  mostrarModalNuevo.value = true
}

function cerrarModalNuevo() {
  mostrarModalNuevo.value = false
}

function agregarProductoAlDetalle() {
  if (!productoSeleccionado.value || cantidadProducto.value <= 0) {
    errorPedido.value = 'Selecciona un producto y una cantidad válida'
    return
  }

  const producto = productos.value.find(p => p.id_producto === productoSeleccionado.value)
  if (!producto) return

  const detalle = {
    id_producto: producto.id_producto,
    producto_nombre: producto.nombre,
    cantidad: cantidadProducto.value,
    precio_unitario: producto.precio
  }

  detallesNuevoPedido.value.push(detalle)
  productoSeleccionado.value = ''
  cantidadProducto.value = 1
  errorPedido.value = ''
}

function removerDetalle(indice) {
  detallesNuevoPedido.value.splice(indice, 1)
}

async function guardarPedido() {
  if (!nuevoPedido.value.id_cliente) {
    errorPedido.value = 'Selecciona un cliente'
    return
  }

  if (detallesNuevoPedido.value.length === 0) {
    errorPedido.value = 'Agrega al menos un producto'
    return
  }

  cargandoPedido.value = true
  errorPedido.value = ''

  try {
    // Crear el pedido
    const datosPedido = {
      id_cliente: nuevoPedido.value.id_cliente,
      tipo_pedido: nuevoPedido.value.tipo_pedido,
      metodo_pago: nuevoPedido.value.metodo_pago,
      estado_pedido: 'Pendiente',
      total: totalPedido.value,
      fecha_pedido: new Date().toISOString(),
      id_usuario: almacenAuth.usuario?.id
    }

    const resultadoPedido = await almacenPedidos.crear(datosPedido)
    if (!resultadoPedido.exito) {
      errorPedido.value = resultadoPedido.error
      return
    }

    const idPedido = resultadoPedido.pedido.id_pedido

    // Agregar detalles
    for (const detalle of detallesNuevoPedido.value) {
      const datosDetalle = {
        id_pedido: idPedido,
        id_producto: detalle.id_producto,
        cantidad: detalle.cantidad,
        precio_unitario: detalle.precio_unitario
      }
      await almacenPedidos.agregarDetalle(datosDetalle)
    }

    await almacenPedidos.obtenerTodos()
    cerrarModalNuevo()
  } catch (err) {
    errorPedido.value = err.message
  } finally {
    cargandoPedido.value = false
  }
}

async function verDetalles(pedido) {
  pedidoSeleccionado.value = pedido
  const resultado = await almacenPedidos.obtenerDetalles(pedido.id_pedido)
  if (resultado.exito) {
    detallesSeleccionados.value = almacenPedidos.detallesActuales
  }
  mostrarDetalles.value = true
}

function cerrarDetalles() {
  mostrarDetalles.value = false
  pedidoSeleccionado.value = null
  detallesSeleccionados.value = []
}

function cambiarEstado(pedido) {
  const estados = ['Pendiente', 'Preparando', 'Entregado', 'Cancelado']
  const indiceActual = estados.indexOf(pedido.estado_pedido)
  const nuevoEstado = estados[(indiceActual + 1) % estados.length]
  almacenPedidos.actualizarEstado(pedido.id_pedido, nuevoEstado)
}

onMounted(async () => {
  await almacenPedidos.obtenerTodos()
  await almacenProductos.obtenerTodos()
  await almacenClientes.obtenerTodos()
})
</script>
