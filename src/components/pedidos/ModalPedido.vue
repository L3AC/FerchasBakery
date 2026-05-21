<template>
  <ModalBase titulo="Nuevo pedido" subtitulo="Registra una venta o un encargo especial" ancho="4xl" padding-top="pt-8" @cerrar="emit('cerrar')">
    <form @submit.prevent="guardarPedido">
      <div class="mb-6">
        <h3 class="font-titulo text-base text-ferchas-vino mb-3 pb-2 border-b-2 border-ferchas-rosa/30">1. Cliente y tipo de pedido</h3>
        <div class="grid grid-cols-3 gap-4">
          <label class="block col-span-2">
            <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Cliente <span class="text-ferchas-error">*</span></span>
            <div class="flex gap-2">
              <select v-model="formulario.id_cliente" required class="input-base flex-1">
                <option value="">Seleccionar cliente</option>
                <option v-for="c in clientes" :key="c.id_cliente" :value="c.id_cliente">
                  {{ c.nombre }}{{ c.telefono ? ' — ' + c.telefono : '' }}
                </option>
              </select>
            </div>
            <span v-if="cargandoClientes" class="text-[11px] text-ferchas-cafe-claro mt-1 block">Cargando clientes...</span>
          </label>

          <label class="block">
            <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Tipo de pedido <span class="text-ferchas-error">*</span></span>
            <select v-model="formulario.tipo_pedido" class="input-base">
              <option>Mostrador</option>
              <option>Encargo</option>
              <option>Domicilio</option>
            </select>
          </label>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="font-titulo text-base text-ferchas-vino mb-3 pb-2 border-b-2 border-ferchas-rosa/30">2. Productos del pedido</h3>
        <div class="relative mb-3">
          <input v-model="busquedaProducto" type="text" placeholder="Buscar producto y agregar al pedido..." class="input-base pl-10" @input="filtrarProductos" @keydown.escape="resultadosBusqueda = []">
          <div class="absolute left-3 top-1/2 -translate-y-1/2 text-ferchas-cafe-claro"><Icono nombre="buscar" :tamano="18" /></div>
           <div v-if="resultadosBusqueda.length > 0" class="absolute z-10 top-full left-0 right-0 mt-1 bg-white border-2 border-ferchas-cafe/20 rounded-lg shadow-md max-h-48 overflow-y-auto">
            <button v-for="p in resultadosBusqueda" :key="p.id_producto" type="button" @click="agregarProducto(p)" class="w-full px-4 py-2.5 text-left text-sm text-ferchas-cafe hover:bg-ferchas-fondo border-b border-ferchas-cafe/10 last:border-0 flex justify-between items-center cursor-pointer">
              <span>{{ p.nombre }}</span>
              <span class="text-ferchas-cafe-claro text-xs">Stock: {{ p.stock_disponible }} · ${{ parseFloat(p.precio).toFixed(2) }}</span>
            </button>
          </div>
        </div>

        <div class="bg-ferchas-fondo rounded-lg border-2 border-ferchas-cafe/10 overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-ferchas-fondo-oscuro text-ferchas-cafe text-xs uppercase tracking-wider">
                <th class="text-left py-2.5 px-4 font-bold">Producto</th>
                <th class="text-center py-2.5 px-3 font-bold">Stock</th>
                <th class="text-center py-2.5 px-3 font-bold">Cantidad</th>
                <th class="text-right py-2.5 px-3 font-bold">Precio</th>
                <th class="text-right py-2.5 px-3 font-bold">Subtotal</th>
                <th class="w-10"></th>
              </tr>
            </thead>
            <tbody class="bg-white">
              <tr v-for="(p, i) in formulario.productos" :key="p.id_producto" class="border-b border-ferchas-cafe/10 last:border-0">
                <td class="py-3 px-4">
                  <div class="font-semibold text-ferchas-cafe">{{ p.nombre }}</div>
                </td>
                <td class="py-3 px-3 text-center">
                  <span :class="['font-bold', p.stockInsuficiente ? 'text-ferchas-error' : 'text-ferchas-cafe']">{{ p.stock_disponible }}</span>
                  <div v-if="p.stockInsuficiente" class="text-[10px] text-ferchas-error">¡Stock insuficiente!</div>
                </td>
                <td class="py-3 px-3">
                  <div class="flex items-center justify-center gap-1.5">
                    <button type="button" @click="ajustar(i, -1)" class="w-7 h-7 flex items-center justify-center border-2 border-ferchas-cafe/20 rounded text-ferchas-cafe hover:bg-ferchas-fondo"><Icono nombre="menos" :tamano="14" /></button>
                    <input v-model.number="p.cantidad" type="number" min="1" @change="validarStockProducto(p)" class="w-12 px-1 py-1 text-center bg-white border-2 border-ferchas-cafe/20 rounded text-ferchas-cafe font-bold">
                    <button type="button" @click="ajustar(i, 1)" class="w-7 h-7 flex items-center justify-center border-2 border-ferchas-cafe/20 rounded text-ferchas-cafe hover:bg-ferchas-fondo"><Icono nombre="mas" :tamano="16" /></button>
                  </div>
                </td>
                <td class="py-3 px-3 text-right text-ferchas-cafe">${{ parseFloat(p.precio).toFixed(2) }}</td>
                <td class="py-3 px-3 text-right font-bold text-ferchas-cafe">${{ (p.cantidad * parseFloat(p.precio)).toFixed(2) }}</td>
                <td class="py-3 px-3 text-center">
                  <button type="button" @click="eliminarProducto(i)" class="text-ferchas-error hover:bg-ferchas-error/10 p-1.5 rounded"><Icono nombre="basurero" :tamano="16" /></button>
                </td>
              </tr>
              <tr v-if="formulario.productos.length === 0">
                <td colspan="6" class="py-8 text-center text-ferchas-cafe-claro text-sm">Busca y agrega productos al pedido</td>
              </tr>
            </tbody>
          </table>

          <div class="bg-ferchas-fondo px-4 py-3 flex justify-between items-center border-t-2 border-ferchas-cafe/10">
            <span class="text-sm text-ferchas-cafe-claro">{{ formulario.productos.length }} productos · {{ totalUnidades }} unidades</span>
            <div class="text-right">
              <div class="text-xs text-ferchas-cafe-claro">Total</div>
              <div class="font-titulo text-2xl text-ferchas-vino">${{ total.toFixed(2) }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="font-titulo text-base text-ferchas-vino mb-3 pb-2 border-b-2 border-ferchas-rosa/30">3. Pago y entrega</h3>
        <div class="grid grid-cols-2 gap-4">
          <label class="block">
            <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Método de pago <span class="text-ferchas-error">*</span></span>
            <div class="flex gap-2">
              <label v-for="metodo in metodosPago" :key="metodo"
                :class="['flex-1 px-2 py-2.5 border-2 rounded-lg text-center cursor-pointer text-sm transition-all',
                  formulario.metodo_pago === metodo ? 'bg-ferchas-rosa-suave/40 border-ferchas-rosa font-bold text-ferchas-vino' : 'bg-white border-ferchas-cafe/20 text-ferchas-cafe hover:border-ferchas-cafe/40']">
                <input v-model="formulario.metodo_pago" type="radio" :value="metodo" class="sr-only">
                {{ metodo }}
              </label>
            </div>
          </label>

          <label class="block">
            <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Fecha de entrega <span class="text-xs text-ferchas-cafe-claro font-normal">(encargos)</span></span>
            <input v-model="formulario.fecha_entrega" type="date" :min="hoy" class="input-base">
            <span class="text-[11px] text-ferchas-cafe-claro mt-1 block">El calendario solo muestra fechas futuras, pero puedes escribir cualquier fecha manualmente si es necesario.</span>
          </label>
        </div>

        <label class="block mt-4">
          <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Observaciones</span>
          <textarea v-model="formulario.observaciones" rows="2" placeholder="Notas adicionales (decoración, mensaje, alergias, etc.)" class="input-base resize-none" />
        </label>
      </div>

      <div v-if="hayStockInsuficiente" class="bg-ferchas-error/15 border-2 border-ferchas-error/40 rounded-lg px-4 py-3 mb-4 flex items-start gap-3">
        <div class="text-ferchas-error mt-0.5"><Icono nombre="alerta" :tamano="18" /></div>
        <div class="text-sm text-ferchas-cafe">
          <strong>Stock insuficiente.</strong> Revisa los productos marcados en rojo. Ajusta las cantidades antes de registrar.
        </div>
      </div>
      <div v-else-if="formulario.productos.length > 0" class="bg-ferchas-exito/15 border-2 border-ferchas-exito/40 rounded-lg px-4 py-3 mb-4 flex items-start gap-3">
        <div class="text-ferchas-exito mt-0.5"><Icono nombre="exito" :tamano="18" /></div>
        <div class="text-sm text-ferchas-cafe">
          <strong>Stock validado.</strong> Al registrar el pedido se descontarán automáticamente las unidades del inventario.
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-4 border-t-2 border-ferchas-cafe/10">
        <button type="button" @click="emit('cerrar')" class="btn-secundario">Cancelar</button>
        <button type="submit" class="btn-principal" :disabled="hayStockInsuficiente || formulario.productos.length === 0 || cargandoClientes">
          Registrar pedido — ${{ total.toFixed(2) }}
        </button>
      </div>
    </form>
  </ModalBase>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import ModalBase from '../shared/ModalBase.vue'
import Icono from '../shared/Icono.vue'
import { useAlmacenClientes } from '../../stores/almacenClientes.js'
import { servicioProductos } from '../../services/servicioProductos.js'

const emit = defineEmits(['cerrar', 'guardar'])

const almacenClientes = useAlmacenClientes()

const clientes = ref([])
const cargandoClientes = ref(false)
const busquedaProducto = ref('')
const resultadosBusqueda = ref([])
let tiempoBusqueda = null

const metodosPago = ['Efectivo', 'Transferencia', 'Tarjeta']

const formulario = ref({
  id_cliente: '',
  tipo_pedido: 'Mostrador',
  productos: [],
  metodo_pago: 'Efectivo',
  fecha_entrega: '',
  observaciones: ''
})

const hoy = new Date().toISOString().split('T')[0]

const hayStockInsuficiente = computed(() => {
  return formulario.value.productos.some(p => p.stockInsuficiente)
})

const totalUnidades = computed(() => formulario.value.productos.reduce((s, p) => s + p.cantidad, 0))
const total = computed(() => formulario.value.productos.reduce((s, p) => s + p.cantidad * parseFloat(p.precio), 0))

function validarStockProducto(p) {
  p.stockInsuficiente = p.cantidad > p.stock_disponible
}

function ajustar(i, delta) {
  const p = formulario.value.productos[i]
  const nuevo = p.cantidad + delta
  if (nuevo >= 1) {
    p.cantidad = nuevo
    validarStockProducto(p)
  }
}

function eliminarProducto(i) {
  formulario.value.productos.splice(i, 1)
}

function filtrarProductos() {
  const termino = busquedaProducto.value.trim()
  if (!termino) {
    resultadosBusqueda.value = []
    return
  }
  if (tiempoBusqueda) clearTimeout(tiempoBusqueda)
  tiempoBusqueda = setTimeout(async () => {
    const idsAgregados = new Set(formulario.value.productos.map(p => p.id_producto))
    const resultado = await servicioProductos.buscarDisponibles(termino)
    if (resultado.exito) {
      resultadosBusqueda.value = resultado.productos.filter(p => !idsAgregados.has(p.id_producto))
    }
  }, 200)
}

function agregarProducto(producto) {
  if ((producto.stock_disponible || 0) < 1) return
  formulario.value.productos.push({
    id_producto: producto.id_producto,
    nombre: producto.nombre,
    precio: parseFloat(producto.precio),
    stock_disponible: producto.stock_disponible,
    cantidad: 1,
    stockInsuficiente: false
  })
  busquedaProducto.value = ''
  resultadosBusqueda.value = []
}

async function guardarPedido() {
  for (const p of formulario.value.productos) {
    const res = await servicioProductos.obtenerPorId(p.id_producto)
    if (res.exito) {
      p.stock_disponible = res.producto.stock_disponible
      p.stockInsuficiente = p.cantidad > (res.producto.stock_disponible || 0)
    }
  }
  if (hayStockInsuficiente.value) return

  emit('guardar', {
    id_cliente: formulario.value.id_cliente,
    tipo_pedido: formulario.value.tipo_pedido,
    metodo_pago: formulario.value.metodo_pago,
    fecha_entrega: formulario.value.fecha_entrega || null,
    observaciones: formulario.value.observaciones,
    productos: formulario.value.productos.map(p => ({
      id_producto: p.id_producto,
      cantidad: p.cantidad,
      precio_unitario: p.precio,
      subtotal: p.cantidad * p.precio
    })),
    total: total.value
  })
}

onMounted(async () => {
  cargandoClientes.value = true
  const resClientes = await almacenClientes.obtenerTodos()
  if (resClientes.exito) clientes.value = almacenClientes.clientes
  cargandoClientes.value = false
})

onBeforeUnmount(() => {
  if (tiempoBusqueda) clearTimeout(tiempoBusqueda)
})
</script>
