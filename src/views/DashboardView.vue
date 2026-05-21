<template>
  <LayoutPanel>
    <div class="p-7">
      <h1 class="font-titulo text-3xl text-ferchas-cafe">Buenos días, {{ usuario.primerNombre }}</h1>
      <p class="text-sm text-ferchas-cafe-claro mt-1">Resumen del negocio para hoy, jueves 21 de mayo de 2026.</p>

      <!-- KPIs -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div class="bg-white border-l-4 border-ferchas-rosa rounded-lg p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs uppercase font-bold tracking-wider text-ferchas-cafe-claro">Ventas del día</span>
            <span class="text-ferchas-rosa"><Icono nombre="dinero" :tamano="18" /></span>
          </div>
          <p class="font-titulo text-3xl text-ferchas-vino">${{ kpis.ventasDelDia.toFixed(2) }}</p>
          <p class="text-xs text-ferchas-exito font-semibold mt-2 flex items-center gap-1">
            <Icono nombre="flechaArriba" :tamano="12" /> {{ kpis.variacionVsAyer }}% vs ayer
          </p>
        </div>

        <div class="bg-white border-l-4 border-ferchas-advertencia rounded-lg p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs uppercase font-bold tracking-wider text-ferchas-cafe-claro">Pedidos pendientes</span>
            <span class="text-ferchas-advertencia"><Icono nombre="reloj" :tamano="18" /></span>
          </div>
          <p class="font-titulo text-3xl text-ferchas-cafe">{{ kpis.pedidosPendientes }}</p>
          <p class="text-xs text-ferchas-cafe-claro mt-2">{{ kpis.pedidosEntregaHoy }} para entrega hoy</p>
        </div>

        <div class="bg-white border-l-4 border-ferchas-error rounded-lg p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs uppercase font-bold tracking-wider text-ferchas-cafe-claro">Stock bajo</span>
            <span class="text-ferchas-error"><Icono nombre="alerta" :tamano="18" /></span>
          </div>
          <p class="font-titulo text-3xl text-ferchas-cafe">{{ kpis.stockBajo }}</p>
          <p class="text-xs text-ferchas-error font-semibold mt-2">Productos críticos</p>
        </div>

        <div class="bg-white border-l-4 border-ferchas-exito rounded-lg p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs uppercase font-bold tracking-wider text-ferchas-cafe-claro">Clientes registrados</span>
            <span class="text-ferchas-exito"><Icono nombre="grupo" :tamano="18" /></span>
          </div>
          <p class="font-titulo text-3xl text-ferchas-cafe">{{ kpis.clientesRegistrados }}</p>
          <p class="text-xs text-ferchas-cafe-claro mt-2">+{{ kpis.clientesNuevosEsteMes }} este mes</p>
        </div>
      </div>

      <!-- Stock bajo + Pedidos recientes -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div class="bg-white rounded-lg shadow-sm border border-ferchas-cafe/10 overflow-hidden">
          <div class="flex items-center justify-between px-5 py-4 border-b-2 border-ferchas-rosa/30 bg-ferchas-rosa/5">
            <h2 class="font-titulo text-lg text-ferchas-vino">Productos con stock bajo</h2>
            <router-link to="/productos" class="text-xs font-bold text-ferchas-rosa-oscuro uppercase tracking-wider hover:underline">Ver todos</router-link>
          </div>
          <ul>
            <li v-for="(p, i) in productosStockBajo" :key="i"
                class="flex items-center justify-between px-5 py-3.5 border-b border-ferchas-cafe/10 last:border-0 hover:bg-ferchas-fondo transition-colors">
              <div>
                <div class="font-semibold text-ferchas-cafe">{{ p.nombre }}</div>
                <div class="text-xs text-ferchas-cafe-claro">{{ p.categoria }}</div>
              </div>
              <div class="text-right">
                <div :class="['font-bold text-2xl', p.severidad === 'error' ? 'text-ferchas-error' : 'text-ferchas-advertencia']">{{ p.stock }}</div>
                <div class="text-[10px] text-ferchas-cafe-claro uppercase tracking-wider">unidades</div>
              </div>
            </li>
          </ul>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-ferchas-cafe/10 overflow-hidden">
          <div class="flex items-center justify-between px-5 py-4 border-b-2 border-ferchas-rosa/30 bg-ferchas-rosa/5">
            <h2 class="font-titulo text-lg text-ferchas-vino">Pedidos recientes</h2>
            <router-link to="/pedidos" class="text-xs font-bold text-ferchas-rosa-oscuro uppercase tracking-wider hover:underline">Ver todos</router-link>
          </div>
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-ferchas-fondo-oscuro text-ferchas-cafe text-xs uppercase tracking-wider">
                <th class="text-left py-2.5 px-5 font-bold">Cliente</th>
                <th class="text-left py-2.5 px-3 font-bold">Tipo</th>
                <th class="text-left py-2.5 px-3 font-bold">Estado</th>
                <th class="text-right py-2.5 px-5 font-bold">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, i) in pedidosRecientes" :key="i"
                  class="border-b border-ferchas-cafe/10 last:border-0 hover:bg-ferchas-fondo transition-colors">
                <td class="py-3 px-5">
                  <div class="font-semibold text-ferchas-cafe">{{ p.cliente }}</div>
                  <div class="text-xs text-ferchas-cafe-claro">{{ p.tiempo }}</div>
                </td>
                <td class="py-3 px-3 text-ferchas-cafe">{{ p.tipo }}</td>
                <td class="py-3 px-3">
                  <span :class="['px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider', `estado-${p.estado}`]">{{ p.estado }}</span>
                </td>
                <td class="py-3 px-5 text-right font-bold text-ferchas-cafe">{{ p.total }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </LayoutPanel>
</template>

<script setup>
import LayoutPanel from '../components/shared/LayoutPanel.vue'
import Icono from '../components/shared/Icono.vue'
import { mockUsuarioActual, mockKpis, mockProductosStockBajo, mockPedidosRecientes } from '../lib/datosMock.js'

// Datos del prototipo (mock). Cuando el sistema real con Insforge esté listo,
// reemplazar por las llamadas a los stores correspondientes:
// import { useAlmacenProductos } from '../stores/almacenProductos.js'
// import { useAlmacenPedidos } from '../stores/almacenPedidos.js'
// import { useAlmacenClientes } from '../stores/almacenClientes.js'

const usuario = mockUsuarioActual
const kpis = mockKpis
const productosStockBajo = mockProductosStockBajo
const pedidosRecientes = mockPedidosRecientes
</script>
