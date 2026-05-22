<template>
  <ModalBase :titulo="producto ? 'Editar producto' : 'Nuevo producto'" ancho="2xl" @cerrar="$emit('cerrar')">
    <form @submit.prevent="guardarProducto">
      <div class="grid grid-cols-2 gap-4 mb-4">
        <label class="block col-span-2">
          <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Nombre <span class="text-ferchas-error">*</span></span>
          <input v-model="formulario.nombre" type="text" maxlength="70" required placeholder="Ej. Cheesecake de fresa" class="input-base">
          <span class="text-[11px] text-ferchas-cafe-claro mt-1 block">Máximo 70 caracteres</span>
        </label>

        <label class="block col-span-2">
          <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Descripción</span>
          <textarea v-model="formulario.descripcion" rows="2" maxlength="250" placeholder="Descripción breve del producto..." class="input-base resize-none"></textarea>
        </label>

        <label class="block">
          <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Categoría <span class="text-ferchas-error">*</span></span>
          <select v-model="formulario.id_categoria" required class="input-base">
            <option value="">Selecciona una categoría</option>
            <option v-for="cat in categorias" :key="cat.id_categoria" :value="cat.id_categoria">
              {{ cat.nombre_categoria }}
            </option>
          </select>
          <span v-if="cargandoCategorias" class="text-[11px] text-ferchas-cafe-claro mt-1 block">Cargando...</span>
        </label>

        <div class="block">
          <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Tipo de origen <span class="text-ferchas-error">*</span></span>
          <div class="flex gap-2">
            <label :class="['flex-1 px-3 py-2.5 border-2 rounded-lg text-center cursor-pointer text-sm transition-all',
                formulario.tipo_origen === 'interno' ? 'bg-ferchas-rosa-suave/40 border-ferchas-rosa font-bold text-ferchas-vino' : 'bg-white border-ferchas-cafe/20 text-ferchas-cafe hover:border-ferchas-cafe/40']">
              <input v-model="formulario.tipo_origen" type="radio" value="interno" class="sr-only">
              Interno
            </label>
            <label :class="['flex-1 px-3 py-2.5 border-2 rounded-lg text-center cursor-pointer text-sm transition-all',
                formulario.tipo_origen === 'proveedor' ? 'bg-ferchas-rosa-suave/40 border-ferchas-rosa font-bold text-ferchas-vino' : 'bg-white border-ferchas-cafe/20 text-ferchas-cafe hover:border-ferchas-cafe/40']">
              <input v-model="formulario.tipo_origen" type="radio" value="proveedor" class="sr-only">
              De proveedor
            </label>
          </div>
        </div>

        <label class="block">
          <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Precio (USD) <span class="text-ferchas-error">*</span></span>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-ferchas-cafe-claro font-bold">$</span>
            <input v-model="formulario.precio" type="number" step="0.01" min="0" required placeholder="0.00" class="input-base pl-7">
          </div>
        </label>

        <label class="block">
          <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Stock disponible <span class="text-ferchas-error">*</span></span>
          <input v-model="formulario.stock_disponible" type="number" min="0" required placeholder="0" class="input-base">
        </label>
      </div>

      <label class="block mb-4" :class="formulario.tipo_origen !== 'proveedor' ? 'opacity-40' : ''">
        <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Proveedor <span class="text-xs text-ferchas-cafe-claro font-normal">(solo si es de proveedor)</span></span>
        <select v-model="formulario.id_proveedor" :disabled="formulario.tipo_origen !== 'proveedor'" class="input-base disabled:bg-ferchas-fondo disabled:cursor-not-allowed">
          <option :value="null">Selecciona proveedor</option>
          <option v-for="prov in proveedores" :key="prov.id_proveedor" :value="prov.id_proveedor">
            {{ prov.nombre }}
          </option>
        </select>
        <span v-if="cargandoProveedores" class="text-[11px] text-ferchas-cafe-claro mt-1 block">Cargando...</span>
      </label>

      <label class="flex items-center gap-2 mb-6 cursor-pointer">
        <input v-model="formulario.es_personalizable" type="checkbox" class="w-4 h-4 accent-ferchas-rosa">
        <span class="text-sm text-ferchas-cafe">Este producto es personalizable (encargos especiales)</span>
      </label>

      <div class="flex justify-end gap-3 pt-4 border-t-2 border-ferchas-cafe/10">
        <button type="button" @click="$emit('cerrar')" class="btn-secundario">Cancelar</button>
        <button type="submit" class="btn-principal" :disabled="cargandoCategorias || cargandoProveedores">Guardar producto</button>
      </div>
    </form>
  </ModalBase>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ModalBase from '../shared/ModalBase.vue'
import { useAlmacenCategorias } from '../../controllers/ControladorCategorias'
import { useAlmacenProveedores } from '../../controllers/ControladorProveedores'

const props = defineProps({
  producto: { type: Object, default: null }
})
const emit = defineEmits(['cerrar', 'guardar'])

const almacenCategorias = useAlmacenCategorias()
const almacenProveedores = useAlmacenProveedores()

const categorias = ref([])
const proveedores = ref([])
const cargandoCategorias = ref(false)
const cargandoProveedores = ref(false)

const formulario = ref({
  id_producto: null,
  nombre: '',
  descripcion: '',
  id_categoria: '',
  tipo_origen: 'interno',
  precio: '',
  stock_disponible: '',
  id_proveedor: null,
  es_personalizable: false
})

async function cargarDatos() {
  cargandoCategorias.value = true
  cargandoProveedores.value = true

  const resCat = await almacenCategorias.obtenerTodas()
  if (resCat.exito) {
    categorias.value = almacenCategorias.categorias
  }
  cargandoCategorias.value = false

  const resProv = await almacenProveedores.obtenerTodos()
  if (resProv.exito) {
    proveedores.value = almacenProveedores.proveedores
  }
  cargandoProveedores.value = false
}

function guardarProducto() {
  emit('guardar', {
    ...formulario.value,
    precio: parseFloat(formulario.value.precio),
    stock_disponible: parseInt(formulario.value.stock_disponible),
    id_proveedor: formulario.value.tipo_origen === 'proveedor' ? formulario.value.id_proveedor : null
  })
}

onMounted(() => {
  cargarDatos()
  if (props.producto) {
    formulario.value = {
      id_producto: props.producto.id_producto,
      nombre: props.producto.nombre,
      descripcion: props.producto.descripcion || '',
      id_categoria: props.producto.id_categoria || '',
      tipo_origen: props.producto.tipo_origen || 'interno',
      precio: props.producto.precio?.toString() || '',
      stock_disponible: props.producto.stock_disponible?.toString() || '',
      id_proveedor: props.producto.id_proveedor || null,
      es_personalizable: props.producto.es_personalizable || false
    }
  }
})
</script>
