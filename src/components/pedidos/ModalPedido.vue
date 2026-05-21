<template>
  <ModalBase titulo="Nuevo pedido" subtitulo="Registra una venta o un encargo especial" ancho="4xl" padding-top="pt-8" @cerrar="$emit('cerrar')">
    <form @submit.prevent="emitirGuardar">
      <!-- Paso 1: Cliente y tipo -->
      <div class="mb-6">
        <h3 class="font-titulo text-base text-ferchas-vino mb-3 pb-2 border-b-2 border-ferchas-rosa/30">1. Cliente y tipo de pedido</h3>
        <div class="grid grid-cols-3 gap-4">
          <label class="block col-span-2">
            <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Cliente</span>
            <select v-model="formulario.id_cliente" class="input-base">
              <option :value="null">Cliente ocasional (sin registrar)</option>
              <option v-for="c in almacenClientes.clientes" :key="c.id_cliente" :value="c.id_cliente">
                {{ c.nombre }}{{ c.telefono ? ' — ' + c.telefono : '' }}
              </option>
            </select>
          </label>

          <label class="block">
            <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Tipo de pedido <span class="text-ferchas-error">*</span></span>
            <select v-model="formulario.tipo_pedido" class="input-base" required>
              <option>Mostrador</option>
              <option>Encargo</option>
              <option>Domicilio</option>
            </select>
          </label>
        </div>
      </div>

      <!-- Paso 2: Productos -->
      <div class="mb-6">
        <h3 class="font-titulo text-base text-ferchas-vino mb-3 pb-2 border-b-2 border-ferchas-rosa/30">2. Productos del pedido</h3>

        <div class="relative mb-3">
          <input v-model="busquedaProducto" type="text" placeholder="Buscar producto para agregar al pedido..." class="input-base pl-10">
          <div class="absolute left-3 top-1/2 -translate-y-1/2 text-ferchas-cafe-claro"><Icono nombre="buscar" :tamano="18" /></div>
        </div>

        <!-- Dropdown de productos coincidentes -->
        <div v-if="busquedaProducto.trim() && productosBusqueda.length > 0" class="bg-white border-2 border-ferchas-rosa/30 rounded-lg shadow-md mb-3 max-h-48 overflow-y-auto">
          <button v-for="p in productosBusqueda" :key="p.id_producto" type="button"
                  @click="agregarProducto(p)"
                  class="w-full text-left px-4 py-2 hover:bg-ferchas-fondo flex items-center justify-between border-b border-ferchas-cafe/10 last:border-0">
            <div>
              <div class="font-semibold text-ferchas-cafe text-sm">{{ p.nombre }}</div>
              <div class="text-xs text-ferchas-cafe-claro">Stock: {{ p.stock_disponible }}</div>
            </div>
            <div class="text-ferchas-vino font-bold text-sm">${{ parseFloat(p.precio).toFixed(2) }}</div>
          </button>
        </div>

        <!-- Tabla de productos seleccionados -->
        <div class="bg-ferchas-fondo rounded-lg border-2 border-ferchas-cafe/10 overflow-hidden">
          <table v-if="productosSeleccionados.length > 0" class="w-full text-sm">
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
              <tr v-for="(p, i) in productosSeleccionados" :key="p.id_producto" class="border-b border-ferchas-cafe/10 last:border-0">
                <td class="py-3 px-4">
                  <div class="font-semibold text-ferchas-cafe">{{ p.nombre }}</div>
                </td>
                <td class="py-3 px-3 text-center">
                  <span :class="p.stock_disponible < p.cantidad ? 'text-ferchas-error font-bold' : 'text-ferchas-exito font-bold'">
                    {{ p.stock_disponible }}
                  </span>
                </td>
                <td class="py-3 px-3">
                  <div class="flex items-center justify-center gap-1.5">
                    <button type="button" @click="ajustar(i, -1)" class="w-7 h-7 flex items-center justify-center border-2 border-ferchas-cafe/20 rounded text-ferchas-cafe hover:bg-ferchas-fondo"><Icono nombre="menos" :tamano="14" /></button>
                    <input v-model.number="p.cantidad" type="number" min="1" class="w-12 px-1 py-1 text-center bg-white border-2 border-ferchas-cafe/20 rounded text-ferchas-cafe font-bold">
                    <button type="button" @click="ajustar(i, 1)" class="w-7 h-7 flex items-center justify-center border-2 border-ferchas-cafe/20 rounded text-ferchas-cafe hover:bg-ferchas-fondo"><Icono nombre="mas" :tamano="16" /></button>
                  </div>
                </td>
                <td class="py-3 px-3 text-right text-ferchas-cafe">${{ parseFloat(p.precio).toFixed(2) }}</td>
                <td class="py-3 px-3 text-right font-bold text-ferchas-cafe">${{ (p.cantidad * parseFloat(p.precio)).toFixed(2) }}</td>
                <td class="py-3 px-3 text-center">
                  <button type="button" @click="eliminar(i)" class="text-ferchas-error hover:bg-ferchas-error/10 p-1.5 rounded"><Icono nombre="basurero" :tamano="16" /></button>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-else class="p-8 text-center text-ferchas-cafe-claro text-sm">
            Buscá y agregá productos al pedido
          </div>

          <div class="bg-ferchas-fondo px-4 py-3 flex justify-between items-center border-t-2 border-ferchas-cafe/10">
            <span class="text-sm text-ferchas-cafe-claro">{{ productosSeleccionados.length }} productos · {{ totalUnidades }} unidades</span>
            <div class="text-right">
              <div class="text-xs text-ferchas-cafe-claro">Total</div>
              <div class="font-titulo text-2xl text-ferchas-vino">${{ total.toFixed(2) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Paso 3: Pago -->
      <div class="mb-6">
        <h3 class="font-titulo text-base text-ferchas-vino mb-3 pb-2 border-b-2 border-ferchas-rosa/30">3. Pago y entrega</h3>
        <div class="grid grid-cols-2 gap-4">
          <label class="block">
            <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Método de pago <span class="text-ferchas-error">*</span></span>
            <div class="flex gap-2">
              <label v-for="metodo in ['Efectivo', 'Transferencia']" :key="metodo"
                :class="['flex-1 px-2 py-2.5 border-2 rounded-lg text-center cursor-pointer text-sm transition-all',
                  formulario.metodo_pago === metodo ? 'bg-ferchas-rosa-suave/40 border-ferchas-rosa font-bold text-ferchas-vino' : 'bg-white border-ferchas-cafe/20 text-ferchas-cafe hover:border-ferchas-cafe/40']">
                <input v-model="formulario.metodo_pago" type="radio" :value="metodo" class="sr-only">
                {{ metodo }}
              </label>
            </div>
          </label>

          <label class="block">
            <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Fecha de entrega <span class="text-xs text-ferchas-cafe-claro font-normal">(encargos)</span></span>
            <input v-model="formulario.fecha_entrega" type="date" class="input-base">
          </label>
        </div>

        <label class="block mt-4">
          <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Observaciones</span>
          <textarea v-model="formulario.observaciones" rows="2" placeholder="Notas adicionales (decoración, mensaje, alergias, etc.)" class="input-base resize-none" />
        </label>
      </div>

      <!-- Error de stock -->
      <div v-if="errorStock" class="bg-ferchas-error/10 border-2 border-ferchas-error/40 rounded-lg px-4 py-3 mb-4 flex items-start gap-3">
        <div class="text-ferchas-error mt-0.5"><Icono nombre="alerta" :tamano="18" /></div>
        <div class="text-sm text-ferchas-cafe">
          <strong>Stock insuficiente:</strong> {{ errorStock }}
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-4 border-t-2 border-ferchas-cafe/10">
        <button type="button" @click="$emit('cerrar')" class="btn-secundario">Cancelar</button>
        <button type="submit" :disabled="productosSeleccionados.length === 0 || guardando" class="btn-principal">
          {{ guardando ? 'Registrando…' : `Registrar pedido — $${total.toFixed(2)}` }}
        </button>
      </div>
    </form>
  </ModalBase>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ModalBase from '../shared/ModalBase.vue'
import Icono from '../shared/Icono.vue'
import { useAlmacenAutenticacion } from '../../stores/almacenAutenticacion.js'
import { useAlmacenClientes } from '../../stores/almacenClientes.js'
import { useAlmacenProductos } from '../../stores/almacenProductos.js'

const emit = defineEmits(['cerrar', 'guardar', 'stock-insuficiente'])

const almacenAuth = useAlmacenAutenticacion()
const almacenClientes = useAlmacenClientes()
const almacenProductos = useAlmacenProductos()

const busquedaProducto = ref('')
const productosSeleccionados = ref([])
const errorStock = ref('')
const guardando = ref(false)

const formulario = ref({
  id_cliente: null,
  tipo_pedido: 'Mostrador',
  metodo_pago: 'Efectivo',
  fecha_entrega: '',
  observaciones: '',
})

const productosBusqueda = computed(() => {
  if (!busquedaProducto.value.trim()) return []
  const t = busquedaProducto.value.toLowerCase()
  return almacenProductos.productos
    .filter(p =>
      (p.nombre || '').toLowerCase().includes(t) &&
      !productosSeleccionados.value.some(sel => sel.id_producto === p.id_producto)
    )
    .slice(0, 8)
})

const totalUnidades = computed(() => productosSeleccionados.value.reduce((s, p) => s + (p.cantidad || 0), 0))
const total = computed(() => productosSeleccionados.value.reduce((s, p) => s + (p.cantidad || 0) * parseFloat(p.precio || 0), 0))

function agregarProducto(producto) {
  productosSeleccionados.value.push({
    id_producto: producto.id_producto,
    nombre: producto.nombre,
    precio: producto.precio,
    stock_disponible: producto.stock_disponible,
    cantidad: 1,
  })
  busquedaProducto.value = ''
}

function ajustar(i, delta) {
  const nuevo = (productosSeleccionados.value[i].cantidad || 0) + delta
  if (nuevo >= 1) productosSeleccionados.value[i].cantidad = nuevo
}

function eliminar(i) {
  productosSeleccionados.value.splice(i, 1)
}

function emitirGuardar() {
  // Validar stock
  const conInsuficiente = productosSeleccionados.value.find(p => p.cantidad > p.stock_disponible)
  if (conInsuficiente) {
    errorStock.value = `"${conInsuficiente.nombre}" tiene solo ${conInsuficiente.stock_disponible} unidades disponibles, no se pueden pedir ${conInsuficiente.cantidad}.`
    emit('stock-insuficiente')
    return
  }

  guardando.value = true
  const datosPedido = {
    id_cliente: formulario.value.id_cliente || null,
    user_id: almacenAuth.usuario?.id || null,
    tipo_pedido: formulario.value.tipo_pedido,
    estado_pedido: 'Pendiente',
    metodo_pago: formulario.value.metodo_pago,
    fecha_entrega: formulario.value.fecha_entrega || null,
    total: parseFloat(total.value.toFixed(2)),
    observaciones: formulario.value.observaciones || null,
  }
  const detalles = productosSeleccionados.value.map(p => ({
    id_producto: p.id_producto,
    cantidad: p.cantidad,
    precio_unitario: parseFloat(p.precio),
    subtotal: parseFloat((p.cantidad * parseFloat(p.precio)).toFixed(2)),
  }))

  emit('guardar', { datosPedido, detalles })
}

onMounted(() => {
  if (almacenProductos.productos.length === 0) almacenProductos.obtenerTodos()
  if (almacenClientes.clientes.length === 0) almacenClientes.obtenerTodos()
})
</script>
