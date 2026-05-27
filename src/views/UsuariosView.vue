<template>
  <LayoutPanel>
    <div class="p-7">
      <div class="flex items-start justify-between mb-6">
        <div>
          <h1 class="font-titulo text-3xl text-ferchas-cafe">Gesti&oacute;n de usuarios</h1>
          <p class="text-sm text-ferchas-cafe-claro mt-1">{{ usuarios.length }} usuarios registrados &middot; {{ usuarios.filter(u => u.activo).length }} activos</p>
        </div>
        <button @click="abrirModalInvitar" class="btn-principal flex items-center gap-2">
          <Icono nombre="mas" :tamano="16" /> Invitar usuario
        </button>
      </div>

      <div class="bg-ferchas-rosa-suave/30 border-l-4 border-ferchas-rosa rounded-lg px-5 py-3.5 mb-6 flex items-start gap-3">
        <div class="text-ferchas-vino mt-0.5"><Icono nombre="usuarios" :tamano="18" /></div>
        <div class="text-sm text-ferchas-cafe leading-relaxed">
          <strong>Permisos por rol:</strong> Los administradores tienen acceso completo al sistema. Los empleados solo pueden registrar ventas, pedidos y clientes; no pueden gestionar usuarios, proveedores ni eliminar informaci&oacute;n.
        </div>
      </div>

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
              <td class="py-3 px-4">
                <span :class="['px-2 py-0.5 rounded-full text-[11px] font-bold uppercase',
                              u.rol === 'admin' ? 'bg-ferchas-vino/10 text-ferchas-vino' : 'bg-ferchas-rosa-suave/30 text-ferchas-cafe']">
                  {{ u.rol }}
                </span>
              </td>
              <td class="py-3 px-4 text-ferchas-cafe-claro">{{ u.created_at ? new Date(u.created_at).toLocaleDateString() : '-' }}</td>
              <td class="py-3 px-4 text-center">
                <span :class="['px-2 py-0.5 rounded-full text-[11px] font-bold',
                              u.activo ? 'bg-ferchas-exito/30 text-ferchas-cafe' : 'bg-ferchas-fondo-oscuro text-ferchas-cafe-claro']">
                  {{ u.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="py-3 px-4 text-center">
                <div class="flex items-center justify-center gap-1">
                  <button @click="abrirModalEditar(u)" title="Editar usuario"
                          class="text-ferchas-cafe-claro hover:text-ferchas-cafe hover:bg-ferchas-fondo p-1.5 rounded transition-colors">
                    <Icono nombre="editar" :tamano="16" />
                  </button>
                  <button @click="abrirModalVerificar(u)" title="Verificar correo"
                          class="text-ferchas-cafe-claro hover:text-ferchas-exito hover:bg-ferchas-fondo p-1.5 rounded transition-colors">
                    <Icono nombre="correo" :tamano="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Invitar Usuario -->
    <ModalBase v-if="mostrandoModal === 'invitar'" titulo="Invitar usuario" subtitulo="El usuario recibir&aacute; un correo para verificar su cuenta" @cerrar="cerrarModal">
      <template v-if="!usuarioCreado">
        <form @submit.prevent="invitarUsuario">
          <label class="block mb-4">
            <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Correo electr&oacute;nico <span class="text-ferchas-error">*</span></span>
            <input v-model="formularioInvitar.correo" type="email" required placeholder="correo@ejemplo.com" class="input-base">
          </label>

          <label class="block mb-4">
            <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Nombre completo <span class="text-ferchas-error">*</span></span>
            <input v-model="formularioInvitar.nombre" type="text" required placeholder="Nombre del usuario" class="input-base" maxlength="70">
          </label>

          <label class="block mb-4">
            <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Contrase&ntilde;a temporal <span class="text-ferchas-error">*</span></span>
            <input v-model="formularioInvitar.contrasena" type="password" required minlength="6" placeholder="M&iacute;nimo 6 caracteres" class="input-base">
          </label>

          <label class="block mb-4">
            <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Rol <span class="text-ferchas-error">*</span></span>
            <select v-model="formularioInvitar.rol" required class="input-base">
              <option value="empleado">Empleado</option>
              <option v-if="almacenAuth.esPrincipal" value="admin">Administrador</option>
            </select>
          </label>

          <div v-if="error" class="bg-ferchas-error/10 border-l-4 border-ferchas-error text-ferchas-error p-3 rounded mb-4">
            <p class="text-sm">{{ error }}</p>
          </div>

          <div class="flex gap-3 justify-end">
            <button type="button" @click="cerrarModal" class="btn-secundario">Cancelar</button>
            <button type="submit" :disabled="cargando" class="btn-principal">
              {{ cargando ? 'Creando&hellip;' : 'Crear usuario' }}
            </button>
          </div>
        </form>
      </template>

      <template v-else>
        <div class="bg-ferchas-exito/10 border-l-4 border-ferchas-exito text-ferchas-cafe p-3 rounded mb-4">
          <p class="text-sm font-semibold">Usuario creado exitosamente</p>
          <p class="text-xs mt-1">El empleado recibió un correo con un c&oacute;digo de verificaci&oacute;n.</p>
        </div>

        <label class="block mb-4">
          <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">C&oacute;digo de verificaci&oacute;n</span>
          <input v-model="codigoVerificacion" type="text" maxlength="6" placeholder="000000"
                 class="input-base text-center text-2xl tracking-widest"
                 @input="codigoVerificacion = codigoVerificacion.replace(/\D/g, '')">
        </label>

        <div v-if="errorVerificacion" class="bg-ferchas-error/10 border-l-4 border-ferchas-error text-ferchas-error p-3 rounded mb-4">
          <p class="text-sm">{{ errorVerificacion }}</p>
        </div>

        <div class="flex gap-3 justify-end">
          <button type="button" @click="cerrarModal" class="btn-secundario">Cerrar</button>
          <button @click="verificarUsuario" :disabled="!codigoVerificacion || cargandoVerificacion" class="btn-principal">
            {{ cargandoVerificacion ? 'Verificando&hellip;' : 'Verificar' }}
          </button>
        </div>
      </template>
    </ModalBase>

    <!-- Modal Editar Usuario -->
    <ModalBase v-if="mostrandoModal === 'editar'" titulo="Editar usuario" :subtitulo="usuarioEditando?.nombre" @cerrar="cerrarModal">
      <form @submit.prevent="guardarEdicion">
        <label class="block mb-4">
          <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Nombre completo</span>
          <input v-model="formularioEditar.nombre" type="text" required class="input-base" maxlength="70">
        </label>

         <label class="block mb-4">
           <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Rol</span>
           <select v-model="formularioEditar.rol" required class="input-base">
             <option value="empleado">Empleado</option>
             <option v-if="almacenAuth.esPrincipal" value="admin">Administrador</option>
           </select>
         </label>

        <div v-if="error" class="bg-ferchas-error/10 border-l-4 border-ferchas-error text-ferchas-error p-3 rounded mb-4">
          <p class="text-sm">{{ error }}</p>
        </div>

        <div class="flex gap-3 justify-end">
          <button type="button" @click="cerrarModal" class="btn-secundario">Cancelar</button>
          <button type="submit" :disabled="cargando" class="btn-principal">
            {{ cargando ? 'Guardando&hellip;' : 'Guardar cambios' }}
          </button>
        </div>
      </form>
    </ModalBase>

    <!-- Modal Verificar Correo -->
    <ModalBase v-if="mostrandoModal === 'verificar'" titulo="Verificar correo" :subtitulo="'Ingresa el c&oacute;digo enviado al usuario'" @cerrar="cerrarModal">
      <div class="mb-4 p-3 bg-ferchas-fondo rounded-lg">
        <p class="text-sm text-ferchas-cafe">Usuario: <strong>{{ usuarioVerificando?.nombre }}</strong></p>
      </div>

      <label class="block mb-4">
        <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">C&oacute;digo de verificaci&oacute;n</span>
        <input v-model="codigoVerificacion" type="text" maxlength="6" placeholder="000000"
               class="input-base text-center text-2xl tracking-widest"
               @input="codigoVerificacion = codigoVerificacion.replace(/\D/g, '')">
      </label>

      <div v-if="errorVerificacion" class="bg-ferchas-error/10 border-l-4 border-ferchas-error text-ferchas-error p-3 rounded mb-4">
        <p class="text-sm">{{ errorVerificacion }}</p>
      </div>

      <div v-if="exitoVerificacion" class="bg-ferchas-exito/10 border-l-4 border-ferchas-exito text-ferchas-cafe p-3 rounded mb-4">
        <p class="text-sm font-semibold">{{ exitoVerificacion }}</p>
      </div>

      <div class="flex gap-3 justify-end">
        <button type="button" @click="cerrarModal" class="btn-secundario">Cerrar</button>
        <button @click="verificarUsuario" :disabled="!codigoVerificacion || cargandoVerificacion" class="btn-principal">
          {{ cargandoVerificacion ? 'Verificando&hellip;' : 'Verificar' }}
        </button>
      </div>
    </ModalBase>
  </LayoutPanel>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import LayoutPanel from '../components/shared/LayoutPanel.vue'
import ModalBase from '../components/shared/ModalBase.vue'
import Icono from '../components/shared/Icono.vue'
import { servicioPerfiles } from '../models/ModeloPerfiles.js'
import { servicioAutenticacion } from '../models/ModeloAutenticacion.js'
import { insforgeClient } from '../lib/insforge.js'
import { useAlmacenAutenticacion } from '../controllers/ControladorAutenticacion.js'

const almacenAuth = useAlmacenAutenticacion()

const usuarios = ref([])
const mostrandoModal = ref(null)
const cargando = ref(false)
const error = ref(null)
const usuarioCreado = ref(false)
const emailVerificar = ref('')

const codigoVerificacion = ref('')
const cargandoVerificacion = ref(false)
const errorVerificacion = ref(null)
const exitoVerificacion = ref(null)

const formularioInvitar = ref({
  correo: '', nombre: '', contrasena: '', rol: 'empleado'
})

const usuarioEditando = ref(null)
const formularioEditar = ref({
  nombre: '', rol: 'empleado'
})

const usuarioVerificando = ref(null)

const usuariosMapeados = computed(() => {
  let filtrados = usuarios.value
  
  // Admin solo puede ver empleados
  if (almacenAuth.esAdmin && !almacenAuth.esPrincipal) {
    filtrados = filtrados.filter(u => u.rol === 'empleado')
  }
  
  // Empleado no debería ver esta página (bloqueado por router)
  if (almacenAuth.esEmpleado) {
    return []
  }
  
  return filtrados.map(u => ({
    ...u,
    iniciales: u.nombre.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
  }))
})

function abrirModalInvitar() {
  formularioInvitar.value = { correo: '', nombre: '', contrasena: '', rol: 'empleado' }
  usuarioCreado.value = false
  codigoVerificacion.value = ''
  errorVerificacion.value = null
  error.value = null
  mostrandoModal.value = 'invitar'
}

function abrirModalEditar(usuario) {
  usuarioEditando.value = usuario
  formularioEditar.value = { nombre: usuario.nombre, rol: usuario.rol }
  error.value = null
  mostrandoModal.value = 'editar'
}

function abrirModalVerificar(usuario) {
  usuarioVerificando.value = usuario
  codigoVerificacion.value = ''
  errorVerificacion.value = null
  exitoVerificacion.value = null
  mostrandoModal.value = 'verificar'
  obtenerEmail(usuario.user_id)
}

function cerrarModal() {
  mostrandoModal.value = null
}

async function obtenerEmail(userId) {
  const { data, error: rpcError } = await insforgeClient.database
    .rpc('obtener_email_usuario', { p_user_id: userId })
  if (!rpcError && data) {
    emailVerificar.value = data
  }
}

async function invitarUsuario() {
  cargando.value = true
  error.value = null

  // Admin no puede crear otros admins
  if (almacenAuth.esAdmin && !almacenAuth.esPrincipal && formularioInvitar.value.rol === 'admin') {
    error.value = 'No tienes permiso para crear administradores'
    cargando.value = false
    return
  }

  const resultado = await servicioAutenticacion.registrarUsuario(
    formularioInvitar.value.correo,
    formularioInvitar.value.contrasena,
    formularioInvitar.value.nombre,
    formularioInvitar.value.rol
  )

  if (resultado.exito) {
    emailVerificar.value = formularioInvitar.value.correo
    usuarioCreado.value = true
    await cargarUsuarios()
    if (!resultado.requiereVerificacion) {
      setTimeout(cerrarModal, 1500)
    }
  } else {
    error.value = resultado.error
  }

  cargando.value = false
}

async function verificarUsuario() {
  if (!codigoVerificacion.value || codigoVerificacion.value.length !== 6) {
    errorVerificacion.value = 'Ingresa un c&oacute;digo v&aacute;lido de 6 d&iacute;gitos'
    return
  }

  if (!emailVerificar.value) {
    errorVerificacion.value = 'No se pudo obtener el correo del usuario'
    return
  }

  cargandoVerificacion.value = true
  errorVerificacion.value = null
  exitoVerificacion.value = null

  const resultado = await servicioAutenticacion.verificarEmailAdmin(emailVerificar.value, codigoVerificacion.value)

  if (resultado.exito) {
    exitoVerificacion.value = 'Correo verificado correctamente'
    codigoVerificacion.value = ''
    if (mostrandoModal.value === 'invitar') {
      setTimeout(cerrarModal, 1500)
    }
  } else {
    errorVerificacion.value = resultado.error || 'C&oacute;digo inv&aacute;lido o expirado'
  }

  cargandoVerificacion.value = false
}

async function guardarEdicion() {
  if (!usuarioEditando.value) return

  // Admin no puede cambiar roles de usuarios a admin
  if (almacenAuth.esAdmin && !almacenAuth.esPrincipal && formularioEditar.value.rol === 'admin') {
    error.value = 'No tienes permiso para asignar el rol de administrador'
    return
  }

  cargando.value = true
  error.value = null

  const resultado = await servicioPerfiles.actualizar(usuarioEditando.value.user_id, {
    nombre: formularioEditar.value.nombre,
    rol: formularioEditar.value.rol
  })

  if (resultado.exito) {
    await cargarUsuarios()
    cerrarModal()
  } else {
    error.value = resultado.error
  }

  cargando.value = false
}

async function cargarUsuarios() {
  const resultado = await servicioPerfiles.obtenerTodos()
  if (resultado.exito) {
    usuarios.value = resultado.perfiles
  }
}

onMounted(cargarUsuarios)
</script>
