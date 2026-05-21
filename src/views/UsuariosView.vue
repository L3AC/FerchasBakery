<template>
  <LayoutPanel>
    <div class="p-7">
      <div class="flex items-start justify-between mb-6">
        <div>
          <h1 class="font-titulo text-3xl text-ferchas-cafe">Gestión de usuarios</h1>
          <p class="text-sm text-ferchas-cafe-claro mt-1">
            {{ usuarios.length }} usuarios registrados · {{ usuariosActivos }} activos
          </p>
        </div>
        <button class="btn-principal flex items-center gap-2">
          <Icono nombre="mas" :tamano="16" /> Invitar usuario
        </button>
      </div>

      <!-- Banner informativo -->
      <div class="bg-ferchas-rosa-suave/30 border-l-4 border-ferchas-rosa rounded-lg px-5 py-3.5 mb-6 flex items-start gap-3">
        <div class="text-ferchas-vino mt-0.5"><Icono nombre="grupo" :tamano="18" /></div>
        <div class="text-sm text-ferchas-cafe leading-relaxed">
          <strong>Permisos por rol:</strong> Los administradores tienen acceso completo al sistema. Los empleados solo pueden registrar ventas, pedidos y clientes; no pueden gestionar usuarios, proveedores ni eliminar información.
        </div>
      </div>

      <!-- Estado de carga -->
      <div v-if="cargando" class="bg-white rounded-lg border border-ferchas-cafe/10 shadow-sm p-12 text-center">
        <p class="text-ferchas-cafe-claro">Cargando usuarios...</p>
      </div>

      <!-- Vacío -->
      <div v-else-if="usuarios.length === 0" class="bg-white rounded-lg border border-ferchas-cafe/10 shadow-sm p-12 text-center">
        <p class="text-ferchas-cafe font-semibold">No hay usuarios registrados</p>
      </div>

      <!-- Tabla -->
      <div v-else class="bg-white rounded-lg border border-ferchas-cafe/10 shadow-sm overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-ferchas-fondo-oscuro text-ferchas-cafe text-xs uppercase tracking-wider">
              <th class="text-left py-3 px-4 font-bold">Usuario</th>
              <th class="text-left py-3 px-4 font-bold">Rol</th>
              <th class="text-left py-3 px-4 font-bold">Registrado</th>
              <th class="text-center py-3 px-4 font-bold">Estado</th>
              <th class="text-center py-3 px-4 font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in usuarios" :key="u.user_id"
                :class="['border-b border-ferchas-cafe/10 last:border-0 hover:bg-ferchas-fondo transition-colors', !u.activo && 'opacity-50']">
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <div :class="['w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs',
                                u.rol === 'admin' ? 'bg-ferchas-vino text-ferchas-rosa' : 'bg-ferchas-rosa-suave text-ferchas-vino']">
                    {{ obtenerIniciales(u.nombre) }}
                  </div>
                  <span class="font-semibold text-ferchas-cafe">{{ u.nombre }}</span>
                </div>
              </td>
              <td class="py-3 px-4">
                <span :class="['px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider',
                              u.rol === 'admin' ? 'bg-ferchas-vino text-white' : 'bg-ferchas-rosa-suave text-ferchas-vino']">
                  {{ u.rol }}
                </span>
              </td>
              <td class="py-3 px-4 text-ferchas-cafe-claro">{{ formatearFecha(u.created_at) }}</td>
              <td class="py-3 px-4 text-center">
                <span :class="['px-2 py-0.5 rounded-full text-[11px] font-bold',
                              u.activo ? 'bg-ferchas-exito/30 text-ferchas-cafe' : 'bg-ferchas-fondo-oscuro text-ferchas-cafe-claro']">
                  {{ u.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="py-3 px-4 text-center">
                <button @click="cambiarRol(u)" class="text-xs font-bold text-ferchas-rosa-oscuro uppercase tracking-wider hover:underline">
                  Cambiar rol
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </LayoutPanel>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import LayoutPanel from '../components/shared/LayoutPanel.vue'
import Icono from '../components/shared/Icono.vue'
import { servicioPerfiles } from '../services/servicioPerfiles.js'

const usuarios = ref([])
const cargando = ref(false)

const usuariosActivos = computed(() => usuarios.value.filter(u => u.activo).length)

// Genera 2 letras a partir del nombre (ej. "Leslie Rivera" → "LR")
function obtenerIniciales(nombreCompleto) {
  if (!nombreCompleto) return '??'
  const partes = nombreCompleto.trim().split(/\s+/)
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
}

// Formatea fecha ISO a DD/MM/YYYY
function formatearFecha(fechaIso) {
  if (!fechaIso) return '-'
  const f = new Date(fechaIso)
  if (isNaN(f.getTime())) return '-'
  return f.toLocaleDateString('es-SV', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

async function obtenerUsuarios() {
  cargando.value = true
  try {
    const resultado = await servicioPerfiles.obtenerTodos()
    if (resultado.exito) {
      usuarios.value = resultado.perfiles
    } else {
      console.error('Error al obtener usuarios:', resultado.error)
    }
  } finally {
    cargando.value = false
  }
}

async function cambiarRol(usuario) {
  const nuevoRol = usuario.rol === 'admin' ? 'empleado' : 'admin'
  if (!confirm(`¿Cambiar rol de ${usuario.nombre} a ${nuevoRol}?`)) return
  const resultado = await servicioPerfiles.cambiarRol(usuario.user_id, nuevoRol)
  if (resultado.exito) {
    await obtenerUsuarios()
  } else {
    alert('No se pudo cambiar el rol: ' + (resultado.error || 'error desconocido'))
  }
}

onMounted(() => obtenerUsuarios())
</script>
