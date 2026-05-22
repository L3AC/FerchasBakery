<template>
  <LayoutPanel>
    <div class="p-7">
      <div class="flex items-start justify-between mb-6">
        <div>
          <h1 class="font-titulo text-3xl text-ferchas-cafe">Gestión de usuarios</h1>
          <p class="text-sm text-ferchas-cafe-claro mt-1">{{ usuarios.length }} usuarios registrados · {{ usuarios.filter(u => u.activo).length }} activos</p>
        </div>
        <button class="btn-principal flex items-center gap-2">
          <Icono nombre="mas" :tamano="16" /> Invitar usuario
        </button>
      </div>

      <!-- Banner informativo -->
      <div class="bg-ferchas-rosa-suave/30 border-l-4 border-ferchas-rosa rounded-lg px-5 py-3.5 mb-6 flex items-start gap-3">
        <div class="text-ferchas-vino mt-0.5"><Icono nombre="usuarios" :tamano="18" /></div>
        <div class="text-sm text-ferchas-cafe leading-relaxed">
          <strong>Permisos por rol:</strong> Los administradores tienen acceso completo al sistema. Los empleados solo pueden registrar ventas, pedidos y clientes; no pueden gestionar usuarios, proveedores ni eliminar información.
        </div>
      </div>

      <!-- Tabla -->
      <div class="bg-white rounded-lg border border-ferchas-cafe/10 shadow-sm overflow-hidden">
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
            <tr v-for="u in usuariosMapeados" :key="u.user_id"
                :class="['border-b border-ferchas-cafe/10 last:border-0 hover:bg-ferchas-fondo transition-colors', !u.activo && 'opacity-50']">
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <div :class="['w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs',
                                u.rol === 'admin' ? 'bg-ferchas-vino text-ferchas-rosa' : 'bg-ferchas-rosa-suave text-ferchas-vino']">
                    {{ u.iniciales }}
                  </div>
                  <span class="font-semibold text-ferchas-cafe">{{ u.nombre }}</span>
                </div>
              </td>
              <td class="py-3 px-4 text-ferchas-cafe-claro">{{ u.rol }}</td>
              <td class="py-3 px-4 text-ferchas-cafe-claro">{{ u.created_at ? new Date(u.created_at).toLocaleDateString() : '-' }}</td>
              <td class="py-3 px-4 text-center">
                <span :class="['px-2 py-0.5 rounded-full text-[11px] font-bold',
                              u.activo ? 'bg-ferchas-exito/30 text-ferchas-cafe' : 'bg-ferchas-fondo-oscuro text-ferchas-cafe-claro']">
                  {{ u.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="py-3 px-4 text-center">
                <button class="text-ferchas-cafe-claro hover:text-ferchas-vino hover:bg-ferchas-fondo p-1.5 rounded">
                  <Icono nombre="editar" :tamano="16" />
                </button>
                <button class="text-xs font-bold text-ferchas-rosa-oscuro uppercase tracking-wider ml-2 hover:underline">
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
import { servicioPerfiles } from '../models/ModeloPerfiles.js'

const usuarios = ref([])

const usuariosMapeados = computed(() => {
  return usuarios.value.map(u => ({
    ...u,
    iniciales: u.nombre.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
  }))
})

onMounted(async () => {
  const resultado = await servicioPerfiles.obtenerTodos()
  if (resultado.exito) {
    usuarios.value = resultado.perfiles
  }
})
</script>
