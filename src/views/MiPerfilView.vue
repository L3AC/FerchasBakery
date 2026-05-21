<template>
  <LayoutPanel>
    <div class="p-7 max-w-5xl">
      <h1 class="font-titulo text-3xl text-ferchas-cafe">Mi perfil</h1>
      <p class="text-sm text-ferchas-cafe-claro mt-1">Información de tu cuenta y opciones personales</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <!-- Tarjeta del usuario -->
        <div class="bg-white border border-ferchas-cafe/10 rounded-lg p-6 text-center">
          <div class="w-24 h-24 bg-ferchas-vino text-ferchas-rosa rounded-full flex items-center justify-center font-titulo text-4xl font-bold mx-auto mb-4">
            {{ usuario.iniciales }}
          </div>
          <h3 class="font-titulo text-xl text-ferchas-cafe">{{ usuario.nombreCompleto }}</h3>
          <span class="inline-block mt-2 bg-ferchas-vino text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {{ usuario.rolEtiqueta }}
          </span>
          <p class="text-xs text-ferchas-cafe-claro mt-4 leading-relaxed">
            Carné {{ usuario.carne }}<br>
            Cuenta creada el {{ usuario.registrado }}.<br>
            Último acceso: {{ usuario.ultimoAcceso }}.
          </p>

          <!-- Estadísticas -->
          <div class="grid grid-cols-3 gap-2 mt-5 pt-5 border-t border-ferchas-cafe/10">
            <div>
              <div class="font-titulo text-xl text-ferchas-vino">{{ usuario.estadisticas.pedidosRegistrados }}</div>
              <div class="text-[10px] text-ferchas-cafe-claro uppercase tracking-wider">Pedidos</div>
            </div>
            <div>
              <div class="font-titulo text-xl text-ferchas-vino">{{ usuario.estadisticas.productosCreados }}</div>
              <div class="text-[10px] text-ferchas-cafe-claro uppercase tracking-wider">Productos</div>
            </div>
            <div>
              <div class="font-titulo text-xl text-ferchas-vino">{{ usuario.estadisticas.clientesAgregados }}</div>
              <div class="text-[10px] text-ferchas-cafe-claro uppercase tracking-wider">Clientes</div>
            </div>
          </div>
        </div>

        <!-- Formularios -->
        <div class="md:col-span-2 space-y-6">
          <!-- Información personal -->
          <div class="bg-white border border-ferchas-cafe/10 rounded-lg p-6">
            <h2 class="font-titulo text-lg text-ferchas-vino mb-4 pb-2 border-b-2 border-ferchas-rosa/30">Información personal</h2>
            <form @submit.prevent="guardarInformacion" class="space-y-4">
              <label class="block">
                <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Nombre completo</span>
                <input v-model="formulario.nombre" type="text" class="input-base">
              </label>
              <label class="block">
                <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Correo electrónico</span>
                <input v-model="formulario.correo" type="email" disabled class="input-base bg-ferchas-fondo text-ferchas-cafe-claro cursor-not-allowed">
                <span class="text-[11px] text-ferchas-cafe-claro mt-1 block">El correo no puede modificarse desde el perfil</span>
              </label>
              <div class="flex justify-end">
                <button type="submit" class="btn-principal">Guardar cambios</button>
              </div>
            </form>
          </div>

          <!-- Cambio de contraseña -->
          <div class="bg-white border border-ferchas-cafe/10 rounded-lg p-6">
            <h2 class="font-titulo text-lg text-ferchas-vino mb-4 pb-2 border-b-2 border-ferchas-rosa/30">Cambiar contraseña</h2>
            <form @submit.prevent="cambiarContrasena" class="space-y-4">
              <label class="block">
                <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Contraseña actual</span>
                <input v-model="contrasenas.actual" type="password" placeholder="••••••••" class="input-base">
              </label>
              <div class="grid grid-cols-2 gap-4">
                <label class="block">
                  <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Nueva contraseña</span>
                  <input v-model="contrasenas.nueva" type="password" placeholder="Mínimo 8 caracteres" class="input-base">
                </label>
                <label class="block">
                  <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Confirmar nueva</span>
                  <input v-model="contrasenas.confirmar" type="password" placeholder="Repite la contraseña" class="input-base">
                </label>
              </div>
              <div class="flex justify-end">
                <button type="submit" class="btn-vino">Actualizar contraseña</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </LayoutPanel>
</template>

<script setup>
import { ref } from 'vue'
import LayoutPanel from '../components/shared/LayoutPanel.vue'
import { mockUsuarioActual } from '../lib/datosMock.js'

const usuario = mockUsuarioActual
const formulario = ref({ nombre: usuario.nombreCompleto, correo: usuario.correo })
const contrasenas = ref({ actual: '', nueva: '', confirmar: '' })

function guardarInformacion() {
  // En el sistema real: await servicioPerfiles.actualizar(...)
  console.log('Guardar info (mock):', formulario.value)
}
function cambiarContrasena() {
  // En el sistema real: await servicioAutenticacion.cambiarContrasena(...)
  console.log('Cambiar contraseña (mock)')
}
</script>
