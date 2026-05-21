/*!
 * FerchasBakery — Lógica del prototipo
 *
 * Estructura del archivo (en orden):
 *
 *   1. Biblioteca de iconos SVG inline (objeto `iconos`)
 *   2. Generadores de layout reutilizable (header, sidebar, shell)
 *   3. Pantallas del prototipo (14 funciones, una por pantalla)
 *   4. Función `renderizarPantallas()` que las inyecta en el DOM
 *   5. Función `mostrarPantalla(id)` para cambiar entre pantallas
 *   6. Inicialización al cargar el DOM
 *
 * Mapeo conceptual con MVC clásico (para la documentación del proyecto):
 *   - Las funciones `pantalla*()` son las VISTAS (equivalentes a archivos .vue)
 *   - `mostrarPantalla()` simula el ROUTER (equivalente a vue-router)
 *   - Los datos hardcodeados en cada pantalla simulan lo que vendría
 *     del STORE (Pinia) -> SERVICE -> SDK Insforge -> PostgreSQL
 */

// Iconos SVG inline. Líneas de 2px, estilo limpio. Reemplazan los emojis.
const iconos = {
  dashboard: `<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>`,

  productos: `<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>`,

  pedidos: `<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>`,

  clientes: `<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>`,

  proveedores: `<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,

  usuarios: `<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,

  perfil: `<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`,

  buscar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,

  campana: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>`,

  editar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,

  basurero: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 01-2 2H9a2 2 0 01-2-2L5 6M10 11v6M14 11v6"/></svg>`,

  ojo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,

  cerrar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,

  mas: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,

  menos: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><line x1="5" y1="12" x2="19" y2="12"/></svg>`,

  flecha: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg>`,

  alerta: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,

  exito: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,

  dinero: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>`,

  reloj: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,

  caja: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,

  grupo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>`,

  flechaArriba: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="12" height="12"><polyline points="18 15 12 9 6 15"/></svg>`,

  salir: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
};


// Layout reutilizable: header + sidebar. Una sola fuente de verdad.
// Esto evita repetir el mismo HTML en cada pantalla.

function generarHeader() {
  return `
    <header class="bg-ferchas-vino text-white px-6 py-3.5 flex items-center justify-between shadow-md">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-ferchas-rosa rounded-full flex items-center justify-center font-titulo text-xl text-ferchas-vino font-bold">F</div>
        <div>
          <div class="font-titulo text-lg leading-none">Ferchas Bakery</div>
          <div class="text-xs text-ferchas-rosa-suave">Panel administrativo</div>
        </div>
      </div>
      <div class="flex items-center gap-5">
        <button class="relative text-white hover:text-ferchas-rosa-suave transition-colors" title="Notificaciones">
          ${iconos.campana}
          <span class="absolute -top-1 -right-1 w-4 h-4 bg-ferchas-rosa text-ferchas-vino text-[10px] font-bold rounded-full flex items-center justify-center">3</span>
        </button>
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 bg-ferchas-rosa rounded-full flex items-center justify-center font-bold text-ferchas-vino">LR</div>
          <div class="text-sm">
            <div class="font-semibold leading-none">Leslie Rivera</div>
            <div class="text-xs text-ferchas-rosa-suave">Administradora</div>
          </div>
        </div>
        <button onclick="mostrarPantalla('login')" class="flex items-center gap-1.5 text-sm bg-ferchas-vino-claro hover:bg-ferchas-rosa hover:text-ferchas-vino px-3 py-1.5 rounded-md transition-colors">
          ${iconos.salir} Cerrar sesión
        </button>
      </div>
    </header>
  `;
}

function generarSidebar(pantallaActiva) {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icono: iconos.dashboard },
    { id: 'productos', label: 'Productos', icono: iconos.productos },
    { id: 'pedidos', label: 'Pedidos', icono: iconos.pedidos },
    { id: 'clientes', label: 'Clientes', icono: iconos.clientes },
    { id: 'proveedores', label: 'Proveedores', icono: iconos.proveedores },
  ];

  const itemsAdmin = [
    { id: 'usuarios', label: 'Usuarios', icono: iconos.usuarios },
    { id: 'mi-perfil', label: 'Mi perfil', icono: iconos.perfil },
  ];

  // Mapear pantallas relacionadas (ej. form-producto resalta "productos")
  const mapeo = {
    'form-producto': 'productos',
    'form-pedido': 'pedidos',
    'detalle-pedido': 'pedidos',
    'error-stock': 'pedidos',
    'form-cliente': 'clientes',
    'form-proveedor': 'proveedores',
  };
  const activa = mapeo[pantallaActiva] || pantallaActiva;

  const renderItem = (item) => {
    const claseActiva = item.id === activa
      ? 'nav-item-activo'
      : 'text-ferchas-cafe hover:bg-ferchas-fondo hover:translate-x-1';
    return `
      <a href="#" onclick="mostrarPantalla('${item.id}'); return false;" class="flex items-center gap-3 px-5 py-3 transition-all duration-200 ${claseActiva}">
        ${item.icono}
        <span>${item.label}</span>
      </a>
    `;
  };

  return `
    <aside class="w-60 bg-ferchas-fondo-oscuro min-h-[calc(100vh-64px)] border-r-2 border-ferchas-cafe/10 py-5">
      <nav>
        ${items.map(renderItem).join('')}
        <div class="mt-4 pt-4 border-t border-ferchas-cafe/10">
          <div class="px-5 text-xs uppercase text-ferchas-cafe-claro font-bold tracking-wider mb-2">Administración</div>
          ${itemsAdmin.map(renderItem).join('')}
        </div>
      </nav>
    </aside>
  `;
}

// Genera el shell completo (header + sidebar + main) y mete el contenido específico
function generarShell(pantallaActiva, contenidoMain) {
  return `
    ${generarHeader()}
    <div class="flex">
      ${generarSidebar(pantallaActiva)}
      <main class="flex-1 bg-ferchas-fondo">
        ${contenidoMain}
      </main>
    </div>
  `;
}


// Pantallas del prototipo. Cada función devuelve el HTML de una pantalla.

// ====================================================================
// 1. LOGIN
// ====================================================================
function pantallaLogin() {
  return `
    <section id="login" class="pantalla min-h-screen flex items-center justify-center" style="background:#F0F0F0;background-image:radial-gradient(circle at 18% 30%,rgba(223,156,180,0.18) 0%,transparent 38%),radial-gradient(circle at 82% 70%,rgba(74,24,24,0.08) 0%,transparent 45%);">
      <div class="w-full max-w-md mx-6">
        <div class="text-center mb-7">
          <div class="inline-flex items-center justify-center w-20 h-20 mb-4 bg-ferchas-vino rounded-full shadow-md">
            <span class="font-titulo text-4xl text-ferchas-rosa font-bold">F</span>
          </div>
          <h1 class="font-titulo text-3xl text-ferchas-cafe">Ferchas Bakery</h1>
          <p class="text-sm text-ferchas-cafe-claro mt-1">Sistema administrativo interno</p>
        </div>

        <div class="bg-white border-2 border-ferchas-rosa/30 rounded-lg p-8 shadow-sm">
          <h2 class="font-titulo text-2xl text-ferchas-cafe mb-1">Iniciar sesión</h2>
          <p class="text-sm text-ferchas-cafe-claro mb-6">Ingresa con tu cuenta para continuar</p>

          <form onsubmit="event.preventDefault(); mostrarPantalla('dashboard');">
            <label class="block mb-4">
              <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Correo electrónico</span>
              <input type="email" value="leslie.rivera@ferchasbakery.com" class="w-full px-4 py-3 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe focus:border-ferchas-rosa focus:ring-2 focus:ring-ferchas-rosa/20 outline-none transition-all" required>
            </label>

            <label class="block mb-3">
              <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Contraseña</span>
              <div class="relative">
                <input type="password" value="ferchas2026" class="w-full px-4 py-3 pr-11 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe focus:border-ferchas-rosa focus:ring-2 focus:ring-ferchas-rosa/20 outline-none transition-all" required>
                <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-ferchas-cafe-claro hover:text-ferchas-vino">
                  ${iconos.ojo}
                </button>
              </div>
            </label>

            <div class="flex items-center justify-between mb-6">
              <label class="flex items-center cursor-pointer">
                <input type="checkbox" class="w-4 h-4 accent-ferchas-rosa">
                <span class="ml-2 text-sm text-ferchas-cafe-claro">Recordar sesión</span>
              </label>
              <a href="#" class="text-sm text-ferchas-vino hover:text-ferchas-rosa-oscuro underline">¿Olvidaste tu contraseña?</a>
            </div>

            <button type="submit" class="w-full bg-ferchas-rosa text-white font-cuerpo font-bold px-6 py-3 rounded-lg hover:bg-ferchas-rosa-oscuro transition-colors tracking-wide">
              Iniciar sesión
            </button>
          </form>
        </div>

        <p class="text-center text-xs text-ferchas-cafe-claro mt-6">© 2026 Ferchas Bakery — Repostería artesanal</p>
      </div>
    </section>
  `;
}

// la pantalla que se proyecta 👁️ proyectandose bien proyectoso

function pantallaDashboard() {
  const contenido = `
    <div class="p-7">
      <div class="mb-6">
        <h1 class="font-titulo text-3xl text-ferchas-cafe">Buenos días, Leslie</h1>
        <p class="text-sm text-ferchas-cafe-claro mt-1">Resumen del negocio para hoy, jueves 21 de mayo de 2026.</p>
      </div>

      <div class="grid grid-cols-4 gap-5 mb-7">
        <div class="bg-white border-2 border-ferchas-rosa/40 rounded-lg p-5 shadow-sm hover:shadow-md transition-all">
          <div class="flex items-start justify-between mb-3">
            <span class="text-xs uppercase text-ferchas-cafe-claro font-bold tracking-wider">Ventas del día</span>
            <div class="text-ferchas-rosa-oscuro">${iconos.dinero}</div>
          </div>
          <div class="font-titulo text-4xl text-ferchas-vino">$248.50</div>
          <div class="flex items-center gap-1 text-xs text-ferchas-exito font-semibold mt-1">
            <span class="text-ferchas-exito">${iconos.flechaArriba}</span> 18% vs ayer
          </div>
        </div>

        <div class="bg-white border-2 border-ferchas-advertencia/50 rounded-lg p-5 shadow-sm hover:shadow-md transition-all">
          <div class="flex items-start justify-between mb-3">
            <span class="text-xs uppercase text-ferchas-cafe-claro font-bold tracking-wider">Pedidos pendientes</span>
            <div class="text-ferchas-advertencia">${iconos.reloj}</div>
          </div>
          <div class="font-titulo text-4xl text-ferchas-vino">7</div>
          <div class="text-xs text-ferchas-cafe-claro mt-1">3 para entrega hoy</div>
        </div>

        <div class="bg-white border-2 border-ferchas-error/40 rounded-lg p-5 shadow-sm hover:shadow-md transition-all">
          <div class="flex items-start justify-between mb-3">
            <span class="text-xs uppercase text-ferchas-cafe-claro font-bold tracking-wider">Stock bajo</span>
            <div class="text-ferchas-error">${iconos.alerta}</div>
          </div>
          <div class="font-titulo text-4xl text-ferchas-vino">4</div>
          <div class="text-xs text-ferchas-error font-semibold mt-1">Productos críticos</div>
        </div>

        <div class="bg-white border-2 border-ferchas-cafe/15 rounded-lg p-5 shadow-sm hover:shadow-md transition-all">
          <div class="flex items-start justify-between mb-3">
            <span class="text-xs uppercase text-ferchas-cafe-claro font-bold tracking-wider">Clientes registrados</span>
            <div class="text-ferchas-cafe-claro">${iconos.grupo}</div>
          </div>
          <div class="font-titulo text-4xl text-ferchas-vino">142</div>
          <div class="text-xs text-ferchas-cafe-claro mt-1">+5 este mes</div>
        </div>
      </div>

      <div class="grid grid-cols-5 gap-6">
        <div class="col-span-2 bg-white border-2 border-ferchas-cafe/10 rounded-lg p-5 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-titulo text-xl text-ferchas-vino">Productos con stock bajo</h3>
            <button onclick="mostrarPantalla('productos')" class="text-xs text-ferchas-rosa-oscuro font-bold uppercase tracking-wider hover:underline">Ver todos</button>
          </div>
          <ul class="space-y-3">
            ${[
              { nombre: 'Cheesecake de fresa', cat: 'Postres · Especialidad', stock: 2, color: 'error' },
              { nombre: 'Tres leches en vaso', cat: 'Postres · Especialidad', stock: 3, color: 'error' },
              { nombre: 'Conchas tradicionales', cat: 'Pan dulce tradicional', stock: 6, color: 'advertencia' },
              { nombre: 'Frappé de caramelo', cat: 'Bebidas frías', stock: 8, color: 'advertencia' },
            ].map(p => `
              <li class="flex items-center justify-between pb-3 border-b border-ferchas-cafe/10 last:border-0 last:pb-0">
                <div>
                  <div class="font-semibold text-ferchas-cafe">${p.nombre}</div>
                  <div class="text-xs text-ferchas-cafe-claro">${p.cat}</div>
                </div>
                <div class="text-right">
                  <div class="font-titulo text-xl text-ferchas-${p.color}">${p.stock}</div>
                  <div class="text-[10px] uppercase text-ferchas-${p.color} font-bold tracking-wider">unidades</div>
                </div>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="col-span-3 bg-white border-2 border-ferchas-cafe/10 rounded-lg p-5 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-titulo text-xl text-ferchas-vino">Pedidos recientes</h3>
            <button onclick="mostrarPantalla('pedidos')" class="text-xs text-ferchas-rosa-oscuro font-bold uppercase tracking-wider hover:underline">Ver todos</button>
          </div>
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-ferchas-fondo-oscuro text-ferchas-cafe">
                <th class="text-left py-2 px-3 font-semibold">Cliente</th>
                <th class="text-left py-2 px-3 font-semibold">Tipo</th>
                <th class="text-left py-2 px-3 font-semibold">Estado</th>
                <th class="text-right py-2 px-3 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              ${[
                { cliente: 'María Hernández', tiempo: 'Hace 12 min', tipo: 'Mostrador', estado: 'entregado', total: '$8.50' },
                { cliente: 'Carlos Méndez', tiempo: 'Hace 38 min · WhatsApp', tipo: 'Encargo', estado: 'preparando', total: '$45.00' },
                { cliente: 'Lucía Ramírez', tiempo: 'Hace 1 h 15 min · Instagram', tipo: 'Domicilio', estado: 'pendiente', total: '$22.75' },
                { cliente: 'Cliente ocasional', tiempo: 'Hace 2 h', tipo: 'Mostrador', estado: 'entregado', total: '$6.00' },
                { cliente: 'Ana López', tiempo: 'Hace 3 h · Candy bar', tipo: 'Encargo', estado: 'cancelado', total: '$120.00' },
                { cliente: 'Fernanfloo', tiempo: 'Hace 6 h · Pastel de Uranio', tipo: 'Encargo', estado: 'cancelado', total: '$699,999.00' },
              ].map(p => `
                <tr class="hover:bg-ferchas-fondo border-b border-ferchas-cafe/10 last:border-0 cursor-pointer" onclick="mostrarPantalla('detalle-pedido')">
                  <td class="py-3 px-3">
                    <div class="font-semibold text-ferchas-cafe">${p.cliente}</div>
                    <div class="text-xs text-ferchas-cafe-claro">${p.tiempo}</div>
                  </td>
                  <td class="py-3 px-3 text-ferchas-cafe-claro">${p.tipo}</td>
                  <td class="py-3 px-3"><span class="estado-${p.estado} px-2.5 py-1 rounded-full text-xs font-bold capitalize">${p.estado}</span></td>
                  <td class="py-3 px-3 text-right font-bold text-ferchas-cafe">${p.total}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  return `<section id="dashboard" class="pantalla min-h-screen">${generarShell('dashboard', contenido)}</section>`;
}

// 3. productos productosos
function pantallaProductos() {
  const productos = [
    { nombre: 'Cheesecake de fresa', desc: 'Cheesecake horneado con fresas naturales. Disponible en porción o entero', precio: '4.50', stock: 2, tipo: 'INTERNO', color: 'rosa-suave', emoji: 'fresa', stockBajo: true },
    { nombre: 'Pastel de uranio', desc: 'Un delicioso pastel con uranio 67', precio: '6.7', stock: 99, tipo: 'INTERNO', color: 'verde-gris', emoji: 'calavera', stockBajo: false },
    { nombre: 'Tres leches clásico', desc: 'Bizcocho tradicional bañado en tres leches, decorado con merengue', precio: '3.50', stock: 12, tipo: 'INTERNO', color: 'rosa/40', emoji: 'pastel', stockBajo: false },
    { nombre: 'Cupcake', desc: 'Cupcake esponjoso con buttercream artesanal, varios sabores disponibles', precio: '1.75', stock: 18, tipo: 'INTERNO', color: 'advertencia/30', emoji: 'vainilla', stockBajo: false },
    { nombre: 'Concha tradicional', desc: 'Pan dulce tradicional con costra de azúcar, horneado en casa', precio: '0.75', stock: 6, tipo: 'INTERNO', color: 'rosa-suave', emoji: 'galleta', stockBajo: false, stockMedio: true },
    { nombre: 'Crepa de Nutella con fresa', desc: 'Crepa rellena de Nutella con fresas frescas', precio: '4.25', stock: 9, tipo: 'INTERNO', color: 'rosa/40', emoji: 'velvet', stockBajo: false },
    { nombre: 'Sándwich de pollo', desc: 'Sándwich con pechuga de pollo, vegetales y aderezo de la casa', precio: '5.00', stock: 7, tipo: 'INTERNO', color: 'advertencia/30', emoji: 'tartaleta', stockBajo: false, stockMedio: true },
    { nombre: 'Cappuccino', desc: 'Espresso con leche vaporizada y espuma cremosa', precio: '2.50', stock: 30, tipo: 'INTERNO', color: 'cafe/15', emoji: 'cafe', stockBajo: false },
    { nombre: 'Pastel personalizado 12 porc.', desc: 'Pastel para encargos especiales. Precio según diseño, tamaño y sabor', precio: '45.00', stock: 0, tipo: 'INTERNO', color: 'rosa-suave', emoji: 'pastel', stockBajo: false, stockMedio: false },
  ];

  const ilustraciones = {
    fresa: `<svg viewBox="0 0 100 100" width="56" height="56"><circle cx="50" cy="55" r="28" fill="#C4889A"/><circle cx="50" cy="42" r="22" fill="#fff" opacity="0.85"/><path d="M30 40 Q50 30 70 40" stroke="#DF9CB4" stroke-width="3" fill="none"/><circle cx="42" cy="45" r="2" fill="#C47B7B"/><circle cx="55" cy="48" r="2" fill="#C47B7B"/></svg>`,
    vainilla: `<svg viewBox="0 0 100 100" width="56" height="56"><path d="M30 60 L70 60 L65 88 L35 88 Z" fill="#D4A574"/><circle cx="50" cy="50" r="22" fill="#EBCED6"/><circle cx="50" cy="35" r="4" fill="#C47B7B"/></svg>`,
    pastel: `<svg viewBox="0 0 100 100" width="56" height="56"><rect x="20" y="40" width="60" height="40" rx="3" fill="#fff" stroke="#C4889A" stroke-width="2"/><rect x="20" y="55" width="60" height="3" fill="#DF9CB4"/><path d="M50 28 L50 40 M44 28 Q50 22 50 28 Q50 22 56 28" stroke="#C47B7B" stroke-width="2.5" fill="none"/></svg>`,
    soda: `<svg viewBox="0 0 100 100" width="56" height="56"><rect x="35" y="22" width="30" height="58" rx="3" fill="#4A1818"/><rect x="38" y="35" width="24" height="20" fill="#fff"/><text x="50" y="50" text-anchor="middle" font-size="10" font-weight="bold" fill="#4A1818">COLA</text></svg>`,
    velvet: `<svg viewBox="0 0 100 100" width="56" height="56"><path d="M30 60 L70 60 L65 88 L35 88 Z" fill="#5A3A3A"/><circle cx="50" cy="50" r="22" fill="#EBCED6"/><path d="M30 50 Q50 35 70 50" stroke="#C47B7B" stroke-width="2" fill="none"/></svg>`,
    galleta: `<svg viewBox="0 0 100 100" width="56" height="56"><circle cx="50" cy="50" r="28" fill="#D4A574"/><circle cx="40" cy="42" r="3" fill="#381414"/><circle cx="55" cy="45" r="3" fill="#381414"/><circle cx="48" cy="58" r="3" fill="#381414"/><circle cx="60" cy="55" r="2.5" fill="#381414"/></svg>`,
    tartaleta: `<svg viewBox="0 0 100 100" width="56" height="56"><ellipse cx="50" cy="60" rx="32" ry="22" fill="#D4A574"/><ellipse cx="50" cy="55" rx="26" ry="16" fill="#fff" opacity="0.6"/><circle cx="42" cy="55" r="3" fill="#EBCED6"/><circle cx="58" cy="55" r="3" fill="#EBCED6"/></svg>`,
    cafe: `<svg viewBox="0 0 100 100" width="56" height="56"><path d="M28 30 L72 30 L68 80 Q50 88 32 80 Z" fill="#381414"/><path d="M72 40 Q88 40 88 55 Q88 70 72 70" fill="none" stroke="#381414" stroke-width="4"/><path d="M40 20 Q42 12 45 20 M50 20 Q52 12 55 20 M60 20 Q62 12 65 20" stroke="#C4889A" stroke-width="2" fill="none"/></svg>`,
  };

  const contenido = `
    <div class="p-7">
      <div class="flex items-end justify-between mb-6">
        <div>
          <h1 class="font-titulo text-3xl text-ferchas-cafe">Productos</h1>
          <p class="text-sm text-ferchas-cafe-claro mt-1">38 productos activos · 4 con stock bajo</p>
        </div>
        <button onclick="mostrarPantalla('form-producto')" class="flex items-center gap-1.5 bg-ferchas-rosa text-white font-bold px-5 py-2.5 rounded-lg hover:bg-ferchas-rosa-oscuro transition-colors shadow-sm">
          ${iconos.mas} Nuevo producto
        </button>
      </div>

      <div class="bg-white border-2 border-ferchas-cafe/10 rounded-lg p-4 mb-6 flex gap-3 items-center">
        <div class="flex-1 relative">
          <input type="text" placeholder="Buscar por nombre o descripción..." class="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe focus:border-ferchas-rosa focus:ring-2 focus:ring-ferchas-rosa/20 outline-none">
          <div class="absolute left-3 top-1/2 -translate-y-1/2 text-ferchas-cafe-claro">${iconos.buscar}</div>
        </div>
        <select class="px-4 py-2.5 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe">
          <option>Todas las categorías</option>
          <option>Pan dulce tradicional</option>
          <option>Crepas y postres</option>
          <option>Postres y especialidades</option>
          <option>Pasteles personalizados</option>
          <option>Productos salados</option>
          <option>Bebidas</option>
        </select>
        <select class="px-4 py-2.5 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe">
          <option>Todos los tipos</option>
          <option>Internos</option>
          <option>De proveedor</option>
        </select>
      </div>

      <div class="grid grid-cols-4 gap-5">
        ${productos.map(p => `
          <div class="bg-white border-2 ${p.stockBajo ? 'border-ferchas-error/40' : 'border-ferchas-rosa/40'} rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div class="h-32 bg-ferchas-${p.color} flex items-center justify-center">
              ${ilustraciones[p.emoji]}
            </div>
            <div class="p-4">
              <div class="flex items-start justify-between mb-1.5 gap-2">
                <h4 class="font-titulo text-lg text-ferchas-cafe leading-tight">${p.nombre}</h4>
                ${p.stockBajo
                  ? `<span class="badge-stock-bajo whitespace-nowrap">Stock bajo</span>`
                  : `<span class="text-[10px] ${p.tipo === 'INTERNO' ? 'bg-ferchas-rosa-suave text-ferchas-vino' : 'bg-ferchas-cafe/15 text-ferchas-vino'} px-2 py-0.5 rounded font-bold whitespace-nowrap">${p.tipo}</span>`
                }
              </div>
              <p class="text-xs text-ferchas-cafe-claro mb-3 leading-snug">${p.desc}</p>
              <div class="flex items-end justify-between">
                <div>
                  <div class="font-titulo text-2xl text-ferchas-vino">$${p.precio}</div>
                  <div class="text-xs ${p.stockBajo ? 'text-ferchas-error' : p.stockMedio ? 'text-ferchas-advertencia' : 'text-ferchas-exito'} font-bold">${p.stockBajo ? 'Solo ' : ''}${p.stock} unidades</div>
                </div>
                <div class="flex gap-1">
                  <button onclick="mostrarPantalla('form-producto')" class="p-2 text-ferchas-cafe hover:bg-ferchas-fondo-oscuro rounded-md transition-colors" title="Editar">
                    ${iconos.editar}
                  </button>
                  <button class="p-2 text-ferchas-error hover:bg-ferchas-error/10 rounded-md transition-colors" title="Desactivar">
                    ${iconos.basurero}
                  </button>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="flex items-center justify-between mt-7 text-sm">
        <span class="text-ferchas-cafe-claro">Mostrando 8 de 38 productos</span>
        <div class="flex gap-1.5">
          <button class="px-3 py-1.5 border-2 border-ferchas-cafe/20 rounded-md text-ferchas-cafe-claro hover:bg-ferchas-fondo-oscuro">Anterior</button>
          <button class="px-3 py-1.5 bg-ferchas-rosa text-white rounded-md font-bold">1</button>
          <button class="px-3 py-1.5 border-2 border-ferchas-cafe/20 rounded-md text-ferchas-cafe hover:bg-ferchas-fondo-oscuro">2</button>
          <button class="px-3 py-1.5 border-2 border-ferchas-cafe/20 rounded-md text-ferchas-cafe hover:bg-ferchas-fondo-oscuro">3</button>
          <button class="px-3 py-1.5 border-2 border-ferchas-cafe/20 rounded-md text-ferchas-cafe hover:bg-ferchas-fondo-oscuro">Siguiente</button>
        </div>
      </div>
    </div>
  `;

  return `<section id="productos" class="pantalla min-h-screen">${generarShell('productos', contenido)}</section>`;
}

// la wea

function pantallaFormProducto() {
  const contenido = `
    <div class="p-7 relative">
      <div class="opacity-30 pointer-events-none select-none">
        <div class="flex items-end justify-between mb-6">
          <h1 class="font-titulo text-3xl text-ferchas-cafe">Productos</h1>
        </div>
        <div class="bg-white border-2 border-ferchas-cafe/10 rounded-lg h-16 mb-6"></div>
        <div class="grid grid-cols-4 gap-5">
          ${Array(4).fill('<div class="bg-white border-2 border-ferchas-rosa/40 rounded-lg h-64"></div>').join('')}
        </div>
      </div>

      <div class="fixed inset-0 bg-ferchas-vino/40 flex items-start justify-center pt-12 z-40 animacion-modal">
        <div class="bg-white w-full max-w-2xl mx-4 rounded-lg border-2 border-ferchas-rosa/30 shadow-xl max-h-[90vh] overflow-y-auto">
          <div class="px-6 py-4 border-b-2 border-ferchas-cafe/10 flex items-center justify-between bg-ferchas-rosa/10 sticky top-0">
            <h2 class="font-titulo text-2xl text-ferchas-vino">Nuevo producto</h2>
            <button onclick="mostrarPantalla('productos')" class="text-ferchas-cafe-claro hover:text-ferchas-vino p-1 rounded transition-colors">
              ${iconos.cerrar}
            </button>
          </div>

          <form class="p-6" onsubmit="event.preventDefault(); mostrarPantalla('productos');">
            <div class="grid grid-cols-2 gap-4 mb-4">
              <label class="block col-span-2">
                <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Nombre <span class="text-ferchas-error">*</span></span>
                <input type="text" placeholder="Ej. Cheesecake de fresa" class="w-full px-4 py-2.5 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe focus:border-ferchas-rosa focus:ring-2 focus:ring-ferchas-rosa/20 outline-none" required maxlength="70">
                <span class="text-[11px] text-ferchas-cafe-claro mt-1 block">Máximo 70 caracteres</span>
              </label>

              <label class="block col-span-2">
                <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Descripción</span>
                <textarea rows="2" placeholder="Descripción breve del producto..." maxlength="250" class="w-full px-4 py-2.5 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe focus:border-ferchas-rosa focus:ring-2 focus:ring-ferchas-rosa/20 outline-none resize-none"></textarea>
              </label>

              <label class="block">
                <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Categoría <span class="text-ferchas-error">*</span></span>
                <select class="w-full px-4 py-2.5 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe focus:border-ferchas-rosa outline-none" required>
                  <option value="">Selecciona una categoría</option>
                  <option>Pan dulce tradicional</option>
                  <option>Crepas y postres</option>
                  <option>Postres y especialidades</option>
                  <option>Pasteles personalizados</option>
                  <option>Productos salados</option>
                  <option>Bebidas frías y calientes</option>
                </select>
              </label>

              <div class="block">
                <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Tipo de origen <span class="text-ferchas-error">*</span></span>
                <div class="flex gap-2">
                  <label class="flex-1 px-3 py-2.5 bg-ferchas-rosa-suave/40 border-2 border-ferchas-rosa rounded-lg text-center cursor-pointer text-sm font-bold text-ferchas-vino">
                    <input type="radio" name="tipo" checked class="sr-only">
                    Interno
                  </label>
                  <label class="flex-1 px-3 py-2.5 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-center cursor-pointer text-sm text-ferchas-cafe hover:border-ferchas-cafe/40">
                    <input type="radio" name="tipo" class="sr-only">
                    De proveedor
                  </label>
                </div>
              </div>

              <label class="block">
                <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Precio (USD) <span class="text-ferchas-error">*</span></span>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-ferchas-cafe-claro font-bold">$</span>
                  <input type="number" step="0.01" min="0" placeholder="0.00" class="w-full pl-7 pr-4 py-2.5 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe focus:border-ferchas-rosa focus:ring-2 focus:ring-ferchas-rosa/20 outline-none" required>
                </div>
              </label>

              <label class="block">
                <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Stock disponible <span class="text-ferchas-error">*</span></span>
                <input type="number" min="0" placeholder="0" class="w-full px-4 py-2.5 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe focus:border-ferchas-rosa focus:ring-2 focus:ring-ferchas-rosa/20 outline-none" required>
              </label>
            </div>

            <label class="block mb-4 opacity-40">
              <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Proveedor <span class="text-xs text-ferchas-cafe-claro font-normal">(solo si es de proveedor)</span></span>
              <select disabled class="w-full px-4 py-2.5 bg-ferchas-fondo border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe-claro cursor-not-allowed">
                <option>Selecciona proveedor</option>
              </select>
            </label>

            <label class="flex items-center gap-2 mb-6 cursor-pointer">
              <input type="checkbox" class="w-4 h-4 accent-ferchas-rosa">
              <span class="text-sm text-ferchas-cafe">Este producto es personalizable (encargos especiales)</span>
            </label>

            <div class="flex justify-end gap-3 pt-4 border-t-2 border-ferchas-cafe/10">
              <button type="button" onclick="mostrarPantalla('productos')" class="bg-ferchas-fondo text-ferchas-cafe font-cuerpo px-6 py-2.5 rounded-lg border-2 border-ferchas-cafe/30 hover:bg-ferchas-fondo-oscuro transition-colors">
                Cancelar
              </button>
              <button type="submit" class="bg-ferchas-rosa text-white font-bold px-6 py-2.5 rounded-lg hover:bg-ferchas-rosa-oscuro transition-colors">
                Guardar producto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  return `<section id="form-producto" class="pantalla min-h-screen">${generarShell('form-producto', contenido)}</section>`;
}

function pantallaPedidos() {
  const pedidos = [
    { id: 'P-0142', cliente: 'María Hernández', fecha: '21/05/2026 09:48', tipo: 'Mostrador', metodo: 'Efectivo', items: 3, total: '8.50', estado: 'entregado' },
    { id: 'P-0141', cliente: 'Carlos Méndez', fecha: '21/05/2026 09:22', tipo: 'Encargo', metodo: 'Transferencia', items: 1, total: '45.00', estado: 'preparando' },
    { id: 'P-0140', cliente: 'Lucía Ramírez', fecha: '21/05/2026 08:45', tipo: 'Domicilio', metodo: 'Transferencia', items: 4, total: '22.75', estado: 'pendiente' },
    { id: 'P-0139', cliente: 'Cliente ocasional', fecha: '21/05/2026 08:02', tipo: 'Mostrador', metodo: 'Efectivo', items: 2, total: '6.00', estado: 'entregado' },
    { id: 'P-0138', cliente: 'Ana López', fecha: '20/05/2026 18:30', tipo: 'Encargo', metodo: 'Transferencia', items: 1, total: '120.00', estado: 'cancelado' },
    { id: 'P-0137', cliente: 'José Martínez', fecha: '20/05/2026 17:15', tipo: 'Mostrador', metodo: 'Efectivo', items: 4, total: '14.25', estado: 'entregado' },
    { id: 'P-0136', cliente: 'Patricia Aguilar', fecha: '20/05/2026 16:48', tipo: 'Encargo', metodo: 'Transferencia', items: 1, total: '85.00', estado: 'pendiente' },
    { id: 'P-0135', cliente: 'Roberto Cruz', fecha: '20/05/2026 15:20', tipo: 'Domicilio', metodo: 'Transferencia', items: 3, total: '18.50', estado: 'preparando' },
  ];

  const contenido = `
    <div class="p-7">
      <div class="flex items-end justify-between mb-6">
        <div>
          <h1 class="font-titulo text-3xl text-ferchas-cafe">Pedidos</h1>
          <p class="text-sm text-ferchas-cafe-claro mt-1">142 pedidos totales · 7 pendientes</p>
        </div>
        <button onclick="mostrarPantalla('form-pedido')" class="flex items-center gap-1.5 bg-ferchas-rosa text-white font-bold px-5 py-2.5 rounded-lg hover:bg-ferchas-rosa-oscuro transition-colors shadow-sm">
          ${iconos.mas} Nuevo pedido
        </button>
      </div>

      <div class="flex gap-2 mb-5">
        <button class="px-4 py-2 bg-ferchas-vino text-white rounded-lg text-sm font-bold">Todos (142)</button>
        <button class="px-4 py-2 bg-white border-2 border-ferchas-cafe/20 text-ferchas-cafe rounded-lg text-sm hover:border-ferchas-rosa transition-colors">Pendientes (7)</button>
        <button class="px-4 py-2 bg-white border-2 border-ferchas-cafe/20 text-ferchas-cafe rounded-lg text-sm hover:border-ferchas-rosa transition-colors">Preparando (3)</button>
        <button class="px-4 py-2 bg-white border-2 border-ferchas-cafe/20 text-ferchas-cafe rounded-lg text-sm hover:border-ferchas-rosa transition-colors">Entregados (128)</button>
        <button class="px-4 py-2 bg-white border-2 border-ferchas-cafe/20 text-ferchas-cafe rounded-lg text-sm hover:border-ferchas-rosa transition-colors">Cancelados (4)</button>
      </div>

      <div class="bg-white border-2 border-ferchas-cafe/10 rounded-lg p-4 mb-5 flex gap-3 items-center">
        <div class="flex-1 relative">
          <input type="text" placeholder="Buscar por código de pedido, cliente o teléfono..." class="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe focus:border-ferchas-rosa focus:ring-2 focus:ring-ferchas-rosa/20 outline-none">
          <div class="absolute left-3 top-1/2 -translate-y-1/2 text-ferchas-cafe-claro">${iconos.buscar}</div>
        </div>
        <select class="px-4 py-2.5 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe">
          <option>Todos los tipos</option>
          <option>Mostrador</option>
          <option>Encargo</option>
          <option>Domicilio</option>
        </select>
        <input type="date" value="2026-05-21" class="px-4 py-2.5 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe">
      </div>

      <div class="bg-white border-2 border-ferchas-cafe/10 rounded-lg overflow-hidden shadow-sm">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-ferchas-fondo-oscuro text-ferchas-cafe">
              <th class="text-left py-3 px-4 font-semibold">Código</th>
              <th class="text-left py-3 px-4 font-semibold">Cliente</th>
              <th class="text-left py-3 px-4 font-semibold">Fecha</th>
              <th class="text-left py-3 px-4 font-semibold">Tipo</th>
              <th class="text-left py-3 px-4 font-semibold">Pago</th>
              <th class="text-center py-3 px-4 font-semibold">Items</th>
              <th class="text-right py-3 px-4 font-semibold">Total</th>
              <th class="text-center py-3 px-4 font-semibold">Estado</th>
              <th class="text-right py-3 px-4 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${pedidos.map(p => `
              <tr class="hover:bg-ferchas-fondo border-b border-ferchas-cafe/10 last:border-0 cursor-pointer" onclick="mostrarPantalla('detalle-pedido')">
                <td class="py-3 px-4 font-mono font-bold text-ferchas-vino">${p.id}</td>
                <td class="py-3 px-4 font-semibold text-ferchas-cafe">${p.cliente}</td>
                <td class="py-3 px-4 text-ferchas-cafe-claro text-xs">${p.fecha}</td>
                <td class="py-3 px-4 text-ferchas-cafe-claro">${p.tipo}</td>
                <td class="py-3 px-4 text-ferchas-cafe-claro">${p.metodo}</td>
                <td class="py-3 px-4 text-center text-ferchas-cafe">${p.items}</td>
                <td class="py-3 px-4 text-right font-bold text-ferchas-cafe">$${p.total}</td>
                <td class="py-3 px-4 text-center"><span class="estado-${p.estado} px-2.5 py-1 rounded-full text-xs font-bold capitalize">${p.estado}</span></td>
                <td class="py-3 px-4 text-right">
                  <button onclick="event.stopPropagation(); mostrarPantalla('detalle-pedido')" class="text-ferchas-rosa-oscuro hover:text-ferchas-vino font-semibold text-xs uppercase tracking-wider">Ver</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between mt-5 text-sm">
        <span class="text-ferchas-cafe-claro">Mostrando 8 de 142 pedidos</span>
        <div class="flex gap-1.5">
          <button class="px-3 py-1.5 border-2 border-ferchas-cafe/20 rounded-md text-ferchas-cafe-claro hover:bg-ferchas-fondo-oscuro">Anterior</button>
          <button class="px-3 py-1.5 bg-ferchas-rosa text-white rounded-md font-bold">1</button>
          <button class="px-3 py-1.5 border-2 border-ferchas-cafe/20 rounded-md text-ferchas-cafe hover:bg-ferchas-fondo-oscuro">2</button>
          <button class="px-3 py-1.5 border-2 border-ferchas-cafe/20 rounded-md text-ferchas-cafe hover:bg-ferchas-fondo-oscuro">3</button>
          <button class="px-3 py-1.5 border-2 border-ferchas-cafe/20 rounded-md text-ferchas-cafe hover:bg-ferchas-fondo-oscuro">Siguiente</button>
        </div>
      </div>
    </div>
  `;

  return `<section id="pedidos" class="pantalla min-h-screen">${generarShell('pedidos', contenido)}</section>`;
}

function pantallaFormPedido() {
  const contenido = `
    <div class="p-7 relative">
      <div class="opacity-30 pointer-events-none select-none">
        <h1 class="font-titulo text-3xl text-ferchas-cafe mb-6">Pedidos</h1>
        <div class="bg-white border-2 border-ferchas-cafe/10 rounded-lg h-96"></div>
      </div>

      <div class="fixed inset-0 bg-ferchas-vino/40 flex items-start justify-center pt-8 z-40 animacion-modal">
        <div class="bg-white w-full max-w-4xl mx-4 rounded-lg border-2 border-ferchas-rosa/30 shadow-xl max-h-[92vh] overflow-y-auto">
          <div class="px-6 py-4 border-b-2 border-ferchas-cafe/10 flex items-center justify-between bg-ferchas-rosa/10 sticky top-0 z-10">
            <div>
              <h2 class="font-titulo text-2xl text-ferchas-vino">Nuevo pedido</h2>
              <p class="text-xs text-ferchas-cafe-claro mt-0.5">Registra una venta o un encargo especial</p>
            </div>
            <button onclick="mostrarPantalla('pedidos')" class="text-ferchas-cafe-claro hover:text-ferchas-vino p-1 rounded transition-colors">
              ${iconos.cerrar}
            </button>
          </div>

          <form class="p-6" onsubmit="event.preventDefault(); mostrarPantalla('pedidos');">

            <!-- Sección 1: Cliente y tipo de pedido -->
            <div class="mb-6">
              <h3 class="font-titulo text-base text-ferchas-vino mb-3 pb-2 border-b-2 border-ferchas-rosa/30">1. Cliente y tipo de pedido</h3>
              <div class="grid grid-cols-3 gap-4">
                <label class="block col-span-2">
                  <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Cliente <span class="text-ferchas-error">*</span></span>
                  <div class="flex gap-2">
                    <select class="flex-1 px-4 py-2.5 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe focus:border-ferchas-rosa outline-none">
                      <option>Cliente ocasional (sin registrar)</option>
                      <option selected>María Hernández — 7777-1234</option>
                      <option>Carlos Méndez — 7888-5678</option>
                      <option>Lucía Ramírez — 7666-9012</option>
                    </select>
                    <button type="button" onclick="mostrarPantalla('form-cliente')" class="flex items-center gap-1.5 px-4 py-2.5 bg-ferchas-fondo border-2 border-ferchas-cafe/20 text-ferchas-cafe rounded-lg hover:bg-ferchas-fondo-oscuro transition-colors text-sm font-semibold whitespace-nowrap">
                      ${iconos.mas} Nuevo
                    </button>
                  </div>
                </label>

                <label class="block">
                  <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Tipo de pedido <span class="text-ferchas-error">*</span></span>
                  <select class="w-full px-4 py-2.5 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe focus:border-ferchas-rosa outline-none">
                    <option>Mostrador</option>
                    <option selected>Encargo</option>
                    <option>Domicilio</option>
                  </select>
                </label>
              </div>
            </div>

            <!-- Sección 2: Productos -->
            <div class="mb-6">
              <h3 class="font-titulo text-base text-ferchas-vino mb-3 pb-2 border-b-2 border-ferchas-rosa/30">2. Productos del pedido</h3>

              <div class="relative mb-3">
                <input type="text" placeholder="Buscar producto y agregar al pedido..." class="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe focus:border-ferchas-rosa focus:ring-2 focus:ring-ferchas-rosa/20 outline-none">
                <div class="absolute left-3 top-1/2 -translate-y-1/2 text-ferchas-cafe-claro">${iconos.buscar}</div>
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
                    <tr class="border-b border-ferchas-cafe/10">
                      <td class="py-3 px-4">
                        <div class="font-semibold text-ferchas-cafe">Tres leches clásico</div>
                        <div class="text-xs text-ferchas-cafe-claro">Postres y especialidades · Interno</div>
                      </td>
                      <td class="py-3 px-3 text-center">
                        <span class="text-ferchas-exito font-bold">12</span>
                      </td>
                      <td class="py-3 px-3">
                        <div class="flex items-center justify-center gap-1.5">
                          <button type="button" class="w-7 h-7 flex items-center justify-center border-2 border-ferchas-cafe/20 rounded text-ferchas-cafe hover:bg-ferchas-fondo">${iconos.menos}</button>
                          <input type="number" value="2" min="1" class="w-12 px-1 py-1 text-center bg-white border-2 border-ferchas-cafe/20 rounded text-ferchas-cafe font-bold">
                          <button type="button" class="w-7 h-7 flex items-center justify-center border-2 border-ferchas-cafe/20 rounded text-ferchas-cafe hover:bg-ferchas-fondo">${iconos.mas}</button>
                        </div>
                      </td>
                      <td class="py-3 px-3 text-right text-ferchas-cafe">$3.50</td>
                      <td class="py-3 px-3 text-right font-bold text-ferchas-cafe">$7.00</td>
                      <td class="py-3 px-3 text-center">
                        <button type="button" class="text-ferchas-error hover:bg-ferchas-error/10 p-1.5 rounded">${iconos.basurero}</button>
                      </td>
                    </tr>
                    <tr class="border-b border-ferchas-cafe/10">
                      <td class="py-3 px-4">
                        <div class="font-semibold text-ferchas-cafe">Cappuccino</div>
                        <div class="text-xs text-ferchas-cafe-claro">Bebidas calientes · Interno</div>
                      </td>
                      <td class="py-3 px-3 text-center">
                        <span class="text-ferchas-exito font-bold">30</span>
                      </td>
                      <td class="py-3 px-3">
                        <div class="flex items-center justify-center gap-1.5">
                          <button type="button" class="w-7 h-7 flex items-center justify-center border-2 border-ferchas-cafe/20 rounded text-ferchas-cafe hover:bg-ferchas-fondo">${iconos.menos}</button>
                          <input type="number" value="2" min="1" class="w-12 px-1 py-1 text-center bg-white border-2 border-ferchas-cafe/20 rounded text-ferchas-cafe font-bold">
                          <button type="button" class="w-7 h-7 flex items-center justify-center border-2 border-ferchas-cafe/20 rounded text-ferchas-cafe hover:bg-ferchas-fondo">${iconos.mas}</button>
                        </div>
                      </td>
                      <td class="py-3 px-3 text-right text-ferchas-cafe">$2.50</td>
                      <td class="py-3 px-3 text-right font-bold text-ferchas-cafe">$5.00</td>
                      <td class="py-3 px-3 text-center">
                        <button type="button" class="text-ferchas-error hover:bg-ferchas-error/10 p-1.5 rounded">${iconos.basurero}</button>
                      </td>
                    </tr>
                    <tr>
                      <td class="py-3 px-4">
                        <div class="font-semibold text-ferchas-cafe">Crepa de Nutella con fresa</div>
                        <div class="text-xs text-ferchas-cafe-claro">Crepas y postres · Interno</div>
                      </td>
                      <td class="py-3 px-3 text-center">
                        <span class="text-ferchas-exito font-bold">9</span>
                      </td>
                      <td class="py-3 px-3">
                        <div class="flex items-center justify-center gap-1.5">
                          <button type="button" class="w-7 h-7 flex items-center justify-center border-2 border-ferchas-cafe/20 rounded text-ferchas-cafe hover:bg-ferchas-fondo">${iconos.menos}</button>
                          <input type="number" value="1" min="1" class="w-12 px-1 py-1 text-center bg-white border-2 border-ferchas-cafe/20 rounded text-ferchas-cafe font-bold">
                          <button type="button" class="w-7 h-7 flex items-center justify-center border-2 border-ferchas-cafe/20 rounded text-ferchas-cafe hover:bg-ferchas-fondo">${iconos.mas}</button>
                        </div>
                      </td>
                      <td class="py-3 px-3 text-right text-ferchas-cafe">$4.25</td>
                      <td class="py-3 px-3 text-right font-bold text-ferchas-cafe">$4.25</td>
                      <td class="py-3 px-3 text-center">
                        <button type="button" class="text-ferchas-error hover:bg-ferchas-error/10 p-1.5 rounded">${iconos.basurero}</button>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div class="bg-ferchas-fondo px-4 py-3 flex justify-between items-center border-t-2 border-ferchas-cafe/10">
                  <span class="text-sm text-ferchas-cafe-claro">3 productos · 5 unidades</span>
                  <div class="text-right">
                    <div class="text-xs text-ferchas-cafe-claro">Total</div>
                    <div class="font-titulo text-2xl text-ferchas-vino">$16.25</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sección 3: Pago y entrega -->
            <div class="mb-6">
              <h3 class="font-titulo text-base text-ferchas-vino mb-3 pb-2 border-b-2 border-ferchas-rosa/30">3. Pago y entrega</h3>
              <div class="grid grid-cols-2 gap-4">
                <label class="block">
                  <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Método de pago <span class="text-ferchas-error">*</span></span>
                  <div class="flex gap-2">
                    <label class="flex-1 px-2 py-2.5 bg-ferchas-rosa-suave/40 border-2 border-ferchas-rosa rounded-lg text-center cursor-pointer text-sm font-bold text-ferchas-vino">
                      <input type="radio" name="pago" checked class="sr-only">
                      Efectivo
                    </label>
                    <label class="flex-1 px-2 py-2.5 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-center cursor-pointer text-sm text-ferchas-cafe hover:border-ferchas-cafe/40">
                      <input type="radio" name="pago" class="sr-only">
                      Transferencia
                    </label>
                  </div>
                </label>

                <label class="block">
                  <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Fecha de entrega <span class="text-xs text-ferchas-cafe-claro font-normal">(encargos)</span></span>
                  <input type="date" value="2026-05-24" class="w-full px-4 py-2.5 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe focus:border-ferchas-rosa outline-none">
                </label>
              </div>

              <label class="block mt-4">
                <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Observaciones</span>
                <textarea rows="2" placeholder="Notas adicionales (decoración, mensaje, alergias, etc.)" class="w-full px-4 py-2.5 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe focus:border-ferchas-rosa focus:ring-2 focus:ring-ferchas-rosa/20 outline-none resize-none">Tres leches con mensaje "Feliz cumpleaños Sofía" en color rosa</textarea>
              </label>
            </div>

            <!-- Aviso de stock -->
            <div class="bg-ferchas-exito/15 border-2 border-ferchas-exito/40 rounded-lg px-4 py-3 mb-4 flex items-start gap-3">
              <div class="text-ferchas-exito mt-0.5">${iconos.exito}</div>
              <div class="text-sm text-ferchas-cafe">
                <strong>Stock validado.</strong> Al registrar el pedido se descontarán automáticamente las unidades del inventario.
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t-2 border-ferchas-cafe/10">
              <button type="button" onclick="mostrarPantalla('pedidos')" class="bg-ferchas-fondo text-ferchas-cafe font-cuerpo px-6 py-2.5 rounded-lg border-2 border-ferchas-cafe/30 hover:bg-ferchas-fondo-oscuro transition-colors">
                Cancelar
              </button>
              <button type="submit" class="bg-ferchas-rosa text-white font-bold px-6 py-2.5 rounded-lg hover:bg-ferchas-rosa-oscuro transition-colors">
                Registrar pedido — $16.25
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  return `<section id="form-pedido" class="pantalla min-h-screen">${generarShell('form-pedido', contenido)}</section>`;
}

function pantallaDetallePedido() {
  const contenido = `
    <div class="p-7">
      <div class="flex items-center gap-2 mb-1">
        <button onclick="mostrarPantalla('pedidos')" class="text-sm text-ferchas-cafe-claro hover:text-ferchas-vino flex items-center gap-1">
          Pedidos
        </button>
        <span class="text-ferchas-cafe-claro">/</span>
        <span class="text-sm font-bold text-ferchas-vino">P-0141</span>
      </div>

      <div class="flex items-end justify-between mb-6">
        <div>
          <h1 class="font-titulo text-3xl text-ferchas-cafe">Pedido P-0141</h1>
          <p class="text-sm text-ferchas-cafe-claro mt-1">Registrado el 21 de mayo de 2026 a las 09:22 por Leslie Rivera</p>
        </div>
        <div class="flex gap-2">
          <button class="px-4 py-2.5 bg-white border-2 border-ferchas-cafe/30 text-ferchas-cafe rounded-lg hover:bg-ferchas-fondo-oscuro transition-colors text-sm font-semibold">
            Imprimir
          </button>
          <select class="px-4 py-2.5 bg-ferchas-rosa text-white rounded-lg font-bold text-sm border-2 border-ferchas-rosa">
            <option>Cambiar estado</option>
            <option>Marcar como entregado</option>
            <option>Cancelar pedido</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-5">
        <!-- Columna izquierda: detalles -->
        <div class="col-span-2 space-y-5">
          <!-- Línea de tiempo del estado -->
          <div class="bg-white border-2 border-ferchas-cafe/10 rounded-lg p-5 shadow-sm">
            <h3 class="font-titulo text-lg text-ferchas-vino mb-4">Estado del pedido</h3>
            <div class="flex items-center justify-between">
              <div class="flex flex-col items-center flex-1">
                <div class="w-10 h-10 bg-ferchas-exito text-white rounded-full flex items-center justify-center font-bold">${iconos.exito}</div>
                <div class="text-xs font-bold text-ferchas-cafe mt-2">Pendiente</div>
                <div class="text-[10px] text-ferchas-cafe-claro">09:22</div>
              </div>
              <div class="flex-1 h-1 bg-ferchas-exito"></div>
              <div class="flex flex-col items-center flex-1">
                <div class="w-10 h-10 bg-ferchas-rosa text-white rounded-full flex items-center justify-center font-bold animate-pulse">2</div>
                <div class="text-xs font-bold text-ferchas-vino mt-2">Preparando</div>
                <div class="text-[10px] text-ferchas-cafe-claro">09:45</div>
              </div>
              <div class="flex-1 h-1 bg-ferchas-cafe/15"></div>
              <div class="flex flex-col items-center flex-1">
                <div class="w-10 h-10 bg-ferchas-fondo-oscuro text-ferchas-cafe-claro rounded-full flex items-center justify-center font-bold border-2 border-ferchas-cafe/20">3</div>
                <div class="text-xs text-ferchas-cafe-claro mt-2">Entregado</div>
                <div class="text-[10px] text-ferchas-cafe-claro">—</div>
              </div>
            </div>
          </div>

          <!-- Productos -->
          <div class="bg-white border-2 border-ferchas-cafe/10 rounded-lg overflow-hidden shadow-sm">
            <div class="px-5 py-3 bg-ferchas-rosa/10 border-b-2 border-ferchas-rosa/30">
              <h3 class="font-titulo text-lg text-ferchas-vino">Productos del pedido</h3>
            </div>
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-ferchas-fondo-oscuro text-ferchas-cafe">
                  <th class="text-left py-2 px-4 font-semibold">Producto</th>
                  <th class="text-center py-2 px-4 font-semibold">Cantidad</th>
                  <th class="text-right py-2 px-4 font-semibold">Precio</th>
                  <th class="text-right py-2 px-4 font-semibold">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-ferchas-cafe/10">
                  <td class="py-3 px-4">
                    <div class="font-semibold text-ferchas-cafe">Pastel personalizado 12 porciones</div>
                    <div class="text-xs text-ferchas-cafe-claro mt-0.5">Encargo · Decoración rosa, sabor tres leches</div>
                  </td>
                  <td class="py-3 px-4 text-center font-bold">1</td>
                  <td class="py-3 px-4 text-right">$45.00</td>
                  <td class="py-3 px-4 text-right font-bold text-ferchas-vino">$45.00</td>
                </tr>
              </tbody>
              <tfoot class="bg-ferchas-fondo">
                <tr>
                  <td colspan="3" class="py-3 px-4 text-right font-bold text-ferchas-cafe">Total</td>
                  <td class="py-3 px-4 text-right font-titulo text-2xl text-ferchas-vino">$45.00</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Observaciones -->
          <div class="bg-white border-2 border-ferchas-cafe/10 rounded-lg p-5 shadow-sm">
            <h3 class="font-titulo text-lg text-ferchas-vino mb-2">Observaciones</h3>
            <p class="text-sm text-ferchas-cafe leading-relaxed">Pedido recibido por WhatsApp. Pastel de cumpleaños para Sofía. Decoración con buttercream rosa y mensaje "Feliz cumpleaños Sofía" en letras de chocolate. Cliente recoge el sábado a las 4:00 PM. Sin nueces por alergia.</p>
          </div>
        </div>

        <!-- Columna derecha: info del cliente y pago -->
        <div class="space-y-5">
          <div class="bg-white border-2 border-ferchas-rosa/30 rounded-lg p-5 shadow-sm">
            <h3 class="font-titulo text-lg text-ferchas-vino mb-3">Cliente</h3>
            <div class="space-y-2 text-sm">
              <div class="font-bold text-ferchas-cafe text-base">Carlos Méndez</div>
              <div class="text-ferchas-cafe-claro">7888-5678</div>
              <div class="text-ferchas-cafe-claro">carlos.mendez@correo.com</div>
              <div class="text-ferchas-cafe-claro leading-snug">Col. San Benito, Calle La Reforma #45, San Salvador</div>
            </div>
            <button class="mt-4 text-xs text-ferchas-rosa-oscuro font-bold uppercase tracking-wider hover:underline">Ver historial</button>
          </div>

          <div class="bg-white border-2 border-ferchas-cafe/10 rounded-lg p-5 shadow-sm">
            <h3 class="font-titulo text-lg text-ferchas-vino mb-3">Información del pedido</h3>
            <dl class="space-y-2 text-sm">
              <div class="flex justify-between">
                <dt class="text-ferchas-cafe-claro">Tipo</dt>
                <dd class="font-semibold text-ferchas-cafe">Encargo</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-ferchas-cafe-claro">Método de pago</dt>
                <dd class="font-semibold text-ferchas-cafe">Transferencia</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-ferchas-cafe-claro">Fecha de pedido</dt>
                <dd class="font-semibold text-ferchas-cafe">21/05/2026</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-ferchas-cafe-claro">Fecha de entrega</dt>
                <dd class="font-semibold text-ferchas-cafe">24/05/2026</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-ferchas-cafe-claro">Registró</dt>
                <dd class="font-semibold text-ferchas-cafe">Leslie Rivera</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  `;

  return `<section id="detalle-pedido" class="pantalla min-h-screen">${generarShell('detalle-pedido', contenido)}</section>`;
}

function pantallaErrorStock() {
  const contenido = `
    <div class="p-7 relative">
      <div class="opacity-30 pointer-events-none select-none">
        <h1 class="font-titulo text-3xl text-ferchas-cafe mb-6">Pedidos</h1>
        <div class="bg-white border-2 border-ferchas-cafe/10 rounded-lg h-96"></div>
      </div>

      <div class="fixed inset-0 bg-ferchas-vino/40 flex items-start justify-center pt-12 z-40 animacion-modal">
        <div class="bg-white w-full max-w-2xl mx-4 rounded-lg border-2 border-ferchas-error/40 shadow-xl">
          <div class="px-6 py-4 border-b-2 border-ferchas-cafe/10 flex items-center justify-between bg-ferchas-error/10">
            <h2 class="font-titulo text-2xl text-ferchas-vino">Nuevo pedido</h2>
            <button onclick="mostrarPantalla('pedidos')" class="text-ferchas-cafe-claro hover:text-ferchas-vino p-1 rounded">
              ${iconos.cerrar}
            </button>
          </div>

          <div class="p-6">
            <div class="bg-ferchas-error/15 border-2 border-ferchas-error rounded-lg px-5 py-4 mb-5 flex items-start gap-3">
              <div class="text-ferchas-error mt-0.5">${iconos.alerta}</div>
              <div class="flex-1">
                <h4 class="font-bold text-ferchas-vino mb-1">Stock insuficiente</h4>
                <p class="text-sm text-ferchas-cafe leading-relaxed mb-3">No hay stock suficiente para completar este pedido. Revisa las cantidades de los siguientes productos:</p>
                <ul class="space-y-1.5 text-sm">
                  <li class="flex items-center justify-between bg-white px-3 py-2 rounded border border-ferchas-error/30">
                    <span class="font-semibold text-ferchas-cafe">Cheesecake de fresa</span>
                    <span class="text-xs text-ferchas-error font-bold">Solicitado: 5 · Disponible: 2</span>
                  </li>
                  <li class="flex items-center justify-between bg-white px-3 py-2 rounded border border-ferchas-error/30">
                    <span class="font-semibold text-ferchas-cafe">Cupcake red velvet</span>
                    <span class="text-xs text-ferchas-error font-bold">Solicitado: 6 · Disponible: 3</span>
                  </li>
                </ul>
              </div>
            </div>

            <div class="bg-ferchas-fondo border-2 border-ferchas-cafe/15 rounded-lg p-4 mb-5">
              <h4 class="text-sm font-bold text-ferchas-cafe mb-2">¿Qué hacer ahora?</h4>
              <ul class="text-sm text-ferchas-cafe-claro space-y-1.5 list-disc pl-5">
                <li>Reduce las cantidades a las disponibles en stock</li>
                <li>Elimina los productos sin stock del pedido</li>
                <li>O cancela este pedido y vuelve a intentar más tarde</li>
              </ul>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t-2 border-ferchas-cafe/10">
              <button onclick="mostrarPantalla('pedidos')" class="bg-ferchas-fondo text-ferchas-cafe font-cuerpo px-6 py-2.5 rounded-lg border-2 border-ferchas-cafe/30 hover:bg-ferchas-fondo-oscuro transition-colors">
                Cancelar pedido
              </button>
              <button onclick="mostrarPantalla('form-pedido')" class="bg-ferchas-rosa text-white font-bold px-6 py-2.5 rounded-lg hover:bg-ferchas-rosa-oscuro transition-colors">
                Ajustar cantidades
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  return `<section id="error-stock" class="pantalla min-h-screen">${generarShell('error-stock', contenido)}</section>`;
}

// los papus
function pantallaClientes() {
  const clientes = [
    { iniciales: 'MH', nombre: 'María Hernández', tel: '7777-1234', correo: 'maria.h@correo.com', direccion: 'Col. Escalón, San Salvador', pedidos: 18, ultimo: '21/05/2026' },
    { iniciales: 'CM', nombre: 'Carlos Méndez', tel: '7888-5678', correo: 'carlos.mendez@correo.com', direccion: 'Col. San Benito, Calle La Reforma #45', pedidos: 12, ultimo: '21/05/2026' },
    { iniciales: 'LR', nombre: 'Lucía Ramírez', tel: '7666-9012', correo: 'lucia.r@correo.com', direccion: 'Col. Layco, Avenida Bolívar', pedidos: 8, ultimo: '21/05/2026' },
    { iniciales: 'AL', nombre: 'Ana López', tel: '7555-3456', correo: 'ana.lopez@correo.com', direccion: 'Soyapango, Reparto Las Margaritas', pedidos: 22, ultimo: '20/05/2026' },
    { iniciales: 'JM', nombre: 'José Martínez', tel: '7444-7890', correo: 'jmartinez@correo.com', direccion: 'Mejicanos, Col. Zacamil #12', pedidos: 5, ultimo: '20/05/2026' },
    { iniciales: 'PA', nombre: 'Patricia Aguilar', tel: '7333-2345', correo: 'pat.aguilar@correo.com', direccion: 'Santa Tecla, Residencial El Roble', pedidos: 15, ultimo: '20/05/2026' },
    { iniciales: 'RC', nombre: 'Roberto Cruz', tel: '7222-6789', correo: 'roberto.c@correo.com', direccion: 'Antiguo Cuscatlán, Calle Las Cumbres', pedidos: 9, ultimo: '20/05/2026' },
    { iniciales: 'SF', nombre: 'Sofía Flores', tel: '7111-0123', correo: 'sofia.flores@correo.com', direccion: 'Col. Médica, San Salvador', pedidos: 3, ultimo: '18/05/2026' },
  ];

  const contenido = `
    <div class="p-7">
      <div class="flex items-end justify-between mb-6">
        <div>
          <h1 class="font-titulo text-3xl text-ferchas-cafe">Clientes</h1>
          <p class="text-sm text-ferchas-cafe-claro mt-1">142 clientes registrados</p>
        </div>
        <button onclick="mostrarPantalla('form-cliente')" class="flex items-center gap-1.5 bg-ferchas-rosa text-white font-bold px-5 py-2.5 rounded-lg hover:bg-ferchas-rosa-oscuro transition-colors shadow-sm">
          ${iconos.mas} Nuevo cliente
        </button>
      </div>

      <div class="bg-white border-2 border-ferchas-cafe/10 rounded-lg p-4 mb-5">
        <div class="relative">
          <input type="text" placeholder="Buscar por nombre, teléfono o correo..." class="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe focus:border-ferchas-rosa focus:ring-2 focus:ring-ferchas-rosa/20 outline-none">
          <div class="absolute left-3 top-1/2 -translate-y-1/2 text-ferchas-cafe-claro">${iconos.buscar}</div>
        </div>
      </div>

      <div class="bg-white border-2 border-ferchas-cafe/10 rounded-lg overflow-hidden shadow-sm">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-ferchas-fondo-oscuro text-ferchas-cafe">
              <th class="text-left py-3 px-4 font-semibold">Cliente</th>
              <th class="text-left py-3 px-4 font-semibold">Teléfono</th>
              <th class="text-left py-3 px-4 font-semibold">Correo</th>
              <th class="text-left py-3 px-4 font-semibold">Dirección</th>
              <th class="text-center py-3 px-4 font-semibold">Pedidos</th>
              <th class="text-left py-3 px-4 font-semibold">Último</th>
              <th class="text-right py-3 px-4 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${clientes.map(c => `
              <tr class="hover:bg-ferchas-fondo border-b border-ferchas-cafe/10 last:border-0">
                <td class="py-3 px-4">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 bg-ferchas-rosa-suave text-ferchas-vino rounded-full flex items-center justify-center font-bold text-xs">${c.iniciales}</div>
                    <span class="font-semibold text-ferchas-cafe">${c.nombre}</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-ferchas-cafe-claro font-mono">${c.tel}</td>
                <td class="py-3 px-4 text-ferchas-cafe-claro">${c.correo}</td>
                <td class="py-3 px-4 text-ferchas-cafe-claro text-xs">${c.direccion}</td>
                <td class="py-3 px-4 text-center"><span class="bg-ferchas-rosa-suave text-ferchas-vino font-bold px-2.5 py-1 rounded-full text-xs">${c.pedidos}</span></td>
                <td class="py-3 px-4 text-ferchas-cafe-claro text-xs">${c.ultimo}</td>
                <td class="py-3 px-4">
                  <div class="flex items-center justify-end gap-1">
                    <button onclick="mostrarPantalla('form-cliente')" class="p-2 text-ferchas-cafe hover:bg-ferchas-fondo-oscuro rounded-md transition-colors" title="Editar">
                      ${iconos.editar}
                    </button>
                    <button class="p-2 text-ferchas-rosa-oscuro hover:bg-ferchas-rosa-suave rounded-md transition-colors" title="Ver historial">
                      ${iconos.ojo}
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  return `<section id="clientes" class="pantalla min-h-screen">${generarShell('clientes', contenido)}</section>`;
}

function pantallaFormCliente() {
  const contenido = `
    <div class="p-7 relative">
      <div class="opacity-30 pointer-events-none select-none">
        <h1 class="font-titulo text-3xl text-ferchas-cafe mb-6">Clientes</h1>
        <div class="bg-white border-2 border-ferchas-cafe/10 rounded-lg h-96"></div>
      </div>

      <div class="fixed inset-0 bg-ferchas-vino/40 flex items-start justify-center pt-16 z-40 animacion-modal">
        <div class="bg-white w-full max-w-xl mx-4 rounded-lg border-2 border-ferchas-rosa/30 shadow-xl">
          <div class="px-6 py-4 border-b-2 border-ferchas-cafe/10 flex items-center justify-between bg-ferchas-rosa/10">
            <h2 class="font-titulo text-2xl text-ferchas-vino">Nuevo cliente</h2>
            <button onclick="mostrarPantalla('clientes')" class="text-ferchas-cafe-claro hover:text-ferchas-vino p-1 rounded">
              ${iconos.cerrar}
            </button>
          </div>

          <form class="p-6" onsubmit="event.preventDefault(); mostrarPantalla('clientes');">
            <label class="block mb-4">
              <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Nombre completo <span class="text-ferchas-error">*</span></span>
              <input type="text" placeholder="Ej. María Hernández" maxlength="70" class="w-full px-4 py-2.5 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe focus:border-ferchas-rosa focus:ring-2 focus:ring-ferchas-rosa/20 outline-none" required>
              <span class="text-[11px] text-ferchas-cafe-claro mt-1 block">Máximo 70 caracteres</span>
            </label>

            <div class="grid grid-cols-2 gap-4 mb-4">
              <label class="block">
                <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Teléfono</span>
                <input type="tel" placeholder="7777-1234" maxlength="30" class="w-full px-4 py-2.5 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe focus:border-ferchas-rosa focus:ring-2 focus:ring-ferchas-rosa/20 outline-none">
              </label>

              <label class="block">
                <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Correo electrónico</span>
                <input type="email" placeholder="cliente@correo.com" maxlength="90" class="w-full px-4 py-2.5 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe focus:border-ferchas-rosa focus:ring-2 focus:ring-ferchas-rosa/20 outline-none">
              </label>
            </div>

            <label class="block mb-6">
              <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Dirección</span>
              <textarea rows="2" placeholder="Dirección completa para entregas a domicilio" maxlength="200" class="w-full px-4 py-2.5 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe focus:border-ferchas-rosa focus:ring-2 focus:ring-ferchas-rosa/20 outline-none resize-none"></textarea>
              <span class="text-[11px] text-ferchas-cafe-claro mt-1 block">Máximo 200 caracteres</span>
            </label>

            <div class="bg-ferchas-rosa-suave/30 border-2 border-ferchas-rosa/40 rounded-lg px-4 py-3 mb-5 text-sm text-ferchas-cafe">
              <strong>Nota:</strong> solo el nombre es obligatorio. El resto de campos son opcionales pero útiles para pedidos a domicilio y contacto.
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t-2 border-ferchas-cafe/10">
              <button type="button" onclick="mostrarPantalla('clientes')" class="bg-ferchas-fondo text-ferchas-cafe font-cuerpo px-6 py-2.5 rounded-lg border-2 border-ferchas-cafe/30 hover:bg-ferchas-fondo-oscuro transition-colors">
                Cancelar
              </button>
              <button type="submit" class="bg-ferchas-rosa text-white font-bold px-6 py-2.5 rounded-lg hover:bg-ferchas-rosa-oscuro transition-colors">
                Guardar cliente
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  return `<section id="form-cliente" class="pantalla min-h-screen">${generarShell('form-cliente', contenido)}</section>`;
}

function pantallaProveedores() {
  const proveedores = [
    { nombre: 'Distribuidora de Harinas', tel: '2222-3344', contacto: 'Julio Pérez', desc: 'Harina, levadura y materia prima base para repostería', productos: 4 },
    { nombre: 'Insumos Generales La Salud', tel: '2233-5566', contacto: 'Marina Castillo', desc: 'Sal, azúcar y otros insumos básicos para producción', productos: 6 },
  ];

  const contenido = `
    <div class="p-7">
      <div class="flex items-end justify-between mb-6">
        <div>
          <h1 class="font-titulo text-3xl text-ferchas-cafe">Proveedores</h1>
          <p class="text-sm text-ferchas-cafe-claro mt-1">2 proveedores activos · 10 productos asociados</p>
        </div>
        <button onclick="mostrarPantalla('form-proveedor')" class="flex items-center gap-1.5 bg-ferchas-rosa text-white font-bold px-5 py-2.5 rounded-lg hover:bg-ferchas-rosa-oscuro transition-colors shadow-sm">
          ${iconos.mas} Nuevo proveedor
        </button>
      </div>

      <div class="bg-white border-2 border-ferchas-cafe/10 rounded-lg p-4 mb-5">
        <div class="relative">
          <input type="text" placeholder="Buscar proveedor por nombre o contacto..." class="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe focus:border-ferchas-rosa focus:ring-2 focus:ring-ferchas-rosa/20 outline-none">
          <div class="absolute left-3 top-1/2 -translate-y-1/2 text-ferchas-cafe-claro">${iconos.buscar}</div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-5">
        ${proveedores.map(p => `
          <div class="bg-white border-2 border-ferchas-rosa/30 rounded-lg p-5 shadow-sm hover:shadow-md transition-all">
            <div class="flex items-start justify-between mb-3">
              <div>
                <h4 class="font-titulo text-xl text-ferchas-vino">${p.nombre}</h4>
                <p class="text-xs text-ferchas-cafe-claro mt-1">${p.contacto}</p>
              </div>
              <span class="bg-ferchas-rosa-suave text-ferchas-vino font-bold px-2.5 py-1 rounded-full text-xs">${p.productos} productos</span>
            </div>
            <p class="text-sm text-ferchas-cafe leading-snug mb-4">${p.desc}</p>
            <div class="flex items-center justify-between pt-3 border-t border-ferchas-cafe/10">
              <span class="text-sm font-mono font-bold text-ferchas-cafe">${p.tel}</span>
              <div class="flex gap-1">
                <button onclick="mostrarPantalla('form-proveedor')" class="p-2 text-ferchas-cafe hover:bg-ferchas-fondo-oscuro rounded-md transition-colors" title="Editar">
                  ${iconos.editar}
                </button>
                <button class="p-2 text-ferchas-error hover:bg-ferchas-error/10 rounded-md transition-colors" title="Eliminar">
                  ${iconos.basurero}
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  return `<section id="proveedores" class="pantalla min-h-screen">${generarShell('proveedores', contenido)}</section>`;
}

function pantallaFormProveedor() {
  const contenido = `
    <div class="p-7 relative">
      <div class="opacity-30 pointer-events-none select-none">
        <h1 class="font-titulo text-3xl text-ferchas-cafe mb-6">Proveedores</h1>
        <div class="grid grid-cols-2 gap-5">
          ${Array(4).fill('<div class="bg-white border-2 border-ferchas-rosa/30 rounded-lg h-40"></div>').join('')}
        </div>
      </div>

      <div class="fixed inset-0 bg-ferchas-vino/40 flex items-start justify-center pt-16 z-40 animacion-modal">
        <div class="bg-white w-full max-w-xl mx-4 rounded-lg border-2 border-ferchas-rosa/30 shadow-xl">
          <div class="px-6 py-4 border-b-2 border-ferchas-cafe/10 flex items-center justify-between bg-ferchas-rosa/10">
            <h2 class="font-titulo text-2xl text-ferchas-vino">Nuevo proveedor</h2>
            <button onclick="mostrarPantalla('proveedores')" class="text-ferchas-cafe-claro hover:text-ferchas-vino p-1 rounded">
              ${iconos.cerrar}
            </button>
          </div>

          <form class="p-6" onsubmit="event.preventDefault(); mostrarPantalla('proveedores');">
            <label class="block mb-4">
              <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Nombre del proveedor <span class="text-ferchas-error">*</span></span>
              <input type="text" placeholder="Ej. Distribuidora Central" maxlength="70" class="w-full px-4 py-2.5 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe focus:border-ferchas-rosa focus:ring-2 focus:ring-ferchas-rosa/20 outline-none" required>
            </label>

            <div class="grid grid-cols-2 gap-4 mb-4">
              <label class="block">
                <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Teléfono</span>
                <input type="tel" placeholder="2222-3344" maxlength="30" class="w-full px-4 py-2.5 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe focus:border-ferchas-rosa focus:ring-2 focus:ring-ferchas-rosa/20 outline-none">
              </label>

              <label class="block">
                <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Persona de contacto</span>
                <input type="text" placeholder="Nombre del contacto" maxlength="90" class="w-full px-4 py-2.5 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe focus:border-ferchas-rosa focus:ring-2 focus:ring-ferchas-rosa/20 outline-none">
              </label>
            </div>

            <label class="block mb-6">
              <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Descripción</span>
              <textarea rows="3" placeholder="Qué productos suministra, condiciones de pago, etc." maxlength="200" class="w-full px-4 py-2.5 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe focus:border-ferchas-rosa focus:ring-2 focus:ring-ferchas-rosa/20 outline-none resize-none"></textarea>
            </label>

            <div class="flex justify-end gap-3 pt-4 border-t-2 border-ferchas-cafe/10">
              <button type="button" onclick="mostrarPantalla('proveedores')" class="bg-ferchas-fondo text-ferchas-cafe font-cuerpo px-6 py-2.5 rounded-lg border-2 border-ferchas-cafe/30 hover:bg-ferchas-fondo-oscuro transition-colors">
                Cancelar
              </button>
              <button type="submit" class="bg-ferchas-rosa text-white font-bold px-6 py-2.5 rounded-lg hover:bg-ferchas-rosa-oscuro transition-colors">
                Guardar proveedor
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  return `<section id="form-proveedor" class="pantalla min-h-screen">${generarShell('form-proveedor', contenido)}</section>`;
}

function pantallaUsuarios() {
  const usuarios = [
    { iniciales: 'LR', nombre: 'Leslie Rivera Escobar',     correo: 're251913@ferchasbakery.com',  rol: 'admin',    activo: true,  ultimoAcceso: 'Hoy, 08:15',  registrado: '15/01/2026' },
    { iniciales: 'RD', nombre: 'Ricardo Duran Linares',     correo: 'dl251291@ferchasbakery.com',  rol: 'admin', activo: true,  ultimoAcceso: 'Hoy, 09:02',  registrado: '20/01/2026' },
    { iniciales: 'AM', nombre: 'Angel Miranda Rodriguez',   correo: 'mr241687@ferchasbakery.com',  rol: 'admin', activo: true,  ultimoAcceso: 'Hoy, 09:30',  registrado: '20/01/2026' },
    { iniciales: 'FG', nombre: 'Francisco García Ramos',    correo: 'gr250170@ferchasbakery.com',  rol: 'admin', activo: true,  ultimoAcceso: 'Ayer, 18:30', registrado: '22/01/2026' },
    { iniciales: 'LA', nombre: 'Luis Alvarenga Claros',     correo: 'ac250260@ferchasbakery.com',  rol: 'admin', activo: true, ultimoAcceso: '15/04/2026',  registrado: '22/01/2026' },
    { iniciales: 'JP', nombre: 'Juanito Perez',     correo: 'jp049012@ferchasbakery.com',  rol: 'empleado', activo: true, ultimoAcceso: '15/04/2026',  registrado: '22/01/2026' },
    { iniciales: 'HL', nombre: 'Hector Landaverde',     correo: 'hl250170@ferchasbakery.com',  rol: 'empleado', activo: false, ultimoAcceso: '15/04/2026',  registrado: '22/01/2026' },
  ];

  const contenido = `
    <div class="p-7">
      <div class="flex items-end justify-between mb-6">
        <div>
          <h1 class="font-titulo text-3xl text-ferchas-cafe">Gestión de usuarios</h1>
          <p class="text-sm text-ferchas-cafe-claro mt-1">5 usuarios registrados · 4 activos</p>
        </div>
        <button class="flex items-center gap-1.5 bg-ferchas-rosa text-white font-bold px-5 py-2.5 rounded-lg hover:bg-ferchas-rosa-oscuro transition-colors shadow-sm">
          ${iconos.mas} Invitar usuario
        </button>
      </div>

      <!-- Aviso de permisos -->
      <div class="bg-ferchas-vino/5 border-2 border-ferchas-vino/20 rounded-lg px-5 py-4 mb-6 flex items-start gap-3">
        <div class="text-ferchas-vino mt-0.5">${iconos.usuarios}</div>
        <div class="text-sm text-ferchas-cafe">
          <strong>Permisos por rol:</strong> Los administradores tienen acceso completo al sistema. Los empleados solo pueden registrar ventas, pedidos y clientes; no pueden gestionar usuarios, proveedores ni eliminar información.
        </div>
      </div>

      <div class="bg-white border-2 border-ferchas-cafe/10 rounded-lg overflow-hidden shadow-sm">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-ferchas-fondo-oscuro text-ferchas-cafe">
              <th class="text-left py-3 px-4 font-semibold">Usuario</th>
              <th class="text-left py-3 px-4 font-semibold">Correo</th>
              <th class="text-left py-3 px-4 font-semibold">Rol</th>
              <th class="text-left py-3 px-4 font-semibold">Último acceso</th>
              <th class="text-left py-3 px-4 font-semibold">Registrado</th>
              <th class="text-center py-3 px-4 font-semibold">Estado</th>
              <th class="text-right py-3 px-4 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${usuarios.map(u => `
              <tr class="hover:bg-ferchas-fondo border-b border-ferchas-cafe/10 last:border-0 ${!u.activo ? 'opacity-60' : ''}">
                <td class="py-3 px-4">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 ${u.rol === 'admin' ? 'bg-ferchas-vino text-ferchas-rosa-suave' : 'bg-ferchas-rosa-suave text-ferchas-vino'} rounded-full flex items-center justify-center font-bold text-xs">${u.iniciales}</div>
                    <span class="font-semibold text-ferchas-cafe">${u.nombre}</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-ferchas-cafe-claro">${u.correo}</td>
                <td class="py-3 px-4">
                  <span class="${u.rol === 'admin' ? 'bg-ferchas-vino text-white' : 'bg-ferchas-rosa-suave text-ferchas-vino'} px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">${u.rol}</span>
                </td>
                <td class="py-3 px-4 text-ferchas-cafe-claro text-xs">${u.ultimoAcceso}</td>
                <td class="py-3 px-4 text-ferchas-cafe-claro text-xs">${u.registrado}</td>
                <td class="py-3 px-4 text-center">
                  ${u.activo
                    ? '<span class="estado-entregado px-2.5 py-1 rounded-full text-xs font-bold">Activo</span>'
                    : '<span class="estado-cancelado px-2.5 py-1 rounded-full text-xs font-bold">Inactivo</span>'
                  }
                </td>
                <td class="py-3 px-4">
                  <div class="flex items-center justify-end gap-1">
                    <button class="p-2 text-ferchas-cafe hover:bg-ferchas-fondo-oscuro rounded-md transition-colors" title="Editar">
                      ${iconos.editar}
                    </button>
                    <button class="px-3 py-1.5 text-xs text-ferchas-rosa-oscuro hover:bg-ferchas-rosa-suave rounded font-bold uppercase tracking-wider transition-colors">Cambiar rol</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  return `<section id="usuarios" class="pantalla min-h-screen">${generarShell('usuarios', contenido)}</section>`;
}

function pantallaMiPerfil() {
  const contenido = `
    <div class="p-7 max-w-4xl">
      <h1 class="font-titulo text-3xl text-ferchas-cafe mb-1">Mi perfil</h1>
      <p class="text-sm text-ferchas-cafe-claro mb-6">Administra tu información personal y la seguridad de tu cuenta.</p>

      <div class="grid grid-cols-3 gap-6">
        <!-- Columna izquierda: avatar y resumen -->
        <div class="bg-white border-2 border-ferchas-rosa/30 rounded-lg p-6 shadow-sm text-center">
          <div class="w-24 h-24 bg-ferchas-vino text-ferchas-rosa rounded-full flex items-center justify-center font-titulo text-4xl font-bold mx-auto mb-4">LR</div>
          <h3 class="font-titulo text-xl text-ferchas-cafe">Leslie Alejandra Rivera Escobar</h3>
          <span class="inline-block mt-2 bg-ferchas-vino text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Administradora</span>
          <p class="text-xs text-ferchas-cafe-claro mt-4 leading-relaxed">Carné RE251913<br>Cuenta creada el 15 de enero de 2026.<br>Último acceso: hoy, 08:15.</p>

          <div class="mt-5 pt-5 border-t border-ferchas-cafe/10 text-left">
            <div class="text-xs uppercase text-ferchas-cafe-claro font-bold tracking-wider mb-2">Actividad</div>
            <ul class="text-sm text-ferchas-cafe space-y-1.5">
              <li class="flex justify-between"><span>Pedidos registrados</span><strong>87</strong></li>
              <li class="flex justify-between"><span>Productos creados</span><strong>23</strong></li>
              <li class="flex justify-between"><span>Clientes agregados</span><strong>41</strong></li>
            </ul>
          </div>
        </div>

        <!-- Columna derecha: formularios -->
        <div class="col-span-2 space-y-5">
          <!-- Datos personales -->
          <div class="bg-white border-2 border-ferchas-cafe/10 rounded-lg p-6 shadow-sm">
            <h3 class="font-titulo text-xl text-ferchas-vino mb-4 pb-2 border-b-2 border-ferchas-rosa/30">Información personal</h3>

            <div class="grid grid-cols-2 gap-4">
              <label class="block">
                <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Nombre completo</span>
                <input type="text" value="Leslie Alejandra Rivera Escobar" class="w-full px-4 py-2.5 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe focus:border-ferchas-rosa focus:ring-2 focus:ring-ferchas-rosa/20 outline-none">
              </label>

              <label class="block">
                <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Correo electrónico</span>
                <input type="email" value="re251913@ferchasbakery.com" disabled class="w-full px-4 py-2.5 bg-ferchas-fondo border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe-claro cursor-not-allowed">
                <span class="text-[11px] text-ferchas-cafe-claro mt-1 block">El correo no puede modificarse. Contacta soporte si necesitas cambiarlo.</span>
              </label>

              <label class="block">
                <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Rol asignado</span>
                <input type="text" value="Administradora" disabled class="w-full px-4 py-2.5 bg-ferchas-fondo border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe-claro cursor-not-allowed">
              </label>

              <label class="block">
                <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Estado</span>
                <input type="text" value="Activo" disabled class="w-full px-4 py-2.5 bg-ferchas-exito/15 border-2 border-ferchas-exito/40 rounded-lg text-ferchas-exito font-bold cursor-not-allowed">
              </label>
            </div>

            <div class="flex justify-end mt-5">
              <button class="bg-ferchas-rosa text-white font-bold px-6 py-2.5 rounded-lg hover:bg-ferchas-rosa-oscuro transition-colors">
                Guardar cambios
              </button>
            </div>
          </div>

          <!-- Cambiar contraseña -->
          <div class="bg-white border-2 border-ferchas-cafe/10 rounded-lg p-6 shadow-sm">
            <h3 class="font-titulo text-xl text-ferchas-vino mb-4 pb-2 border-b-2 border-ferchas-rosa/30">Cambiar contraseña</h3>

            <div class="space-y-4">
              <label class="block">
                <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Contraseña actual</span>
                <input type="password" placeholder="Ingresa tu contraseña actual" class="w-full px-4 py-2.5 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe focus:border-ferchas-rosa focus:ring-2 focus:ring-ferchas-rosa/20 outline-none">
              </label>

              <div class="grid grid-cols-2 gap-4">
                <label class="block">
                  <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Nueva contraseña</span>
                  <input type="password" placeholder="Mínimo 8 caracteres" class="w-full px-4 py-2.5 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe focus:border-ferchas-rosa focus:ring-2 focus:ring-ferchas-rosa/20 outline-none">
                </label>

                <label class="block">
                  <span class="text-sm font-semibold text-ferchas-cafe block mb-1.5">Confirmar contraseña</span>
                  <input type="password" placeholder="Repite la nueva contraseña" class="w-full px-4 py-2.5 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe focus:border-ferchas-rosa focus:ring-2 focus:ring-ferchas-rosa/20 outline-none">
                </label>
              </div>

              <div class="bg-ferchas-fondo border-2 border-ferchas-cafe/15 rounded-lg p-3 text-xs text-ferchas-cafe-claro">
                <strong class="text-ferchas-cafe">Requisitos de contraseña:</strong> mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número.
              </div>
            </div>

            <div class="flex justify-end mt-5">
              <button class="bg-ferchas-vino text-white font-bold px-6 py-2.5 rounded-lg hover:bg-ferchas-vino-claro transition-colors">
                Actualizar contraseña
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  return `<section id="mi-perfil" class="pantalla min-h-screen">${generarShell('mi-perfil', contenido)}</section>`;
}

function renderizarPantallas() {
  const contenedor = document.getElementById('contenedor-pantallas');
  contenedor.innerHTML = [
    pantallaLogin(),
    pantallaDashboard(),
    pantallaProductos(),
    pantallaFormProducto(),
    pantallaPedidos(),
    pantallaFormPedido(),
    pantallaDetallePedido(),
    pantallaClientes(),
    pantallaFormCliente(),
    pantallaProveedores(),
    pantallaFormProveedor(),
    pantallaUsuarios(),
    pantallaMiPerfil(),
    pantallaErrorStock(),
  ].join('');
}

function mostrarPantalla(id) {
  document.querySelectorAll('.pantalla').forEach(p => p.classList.remove('activa'));
  const pantalla = document.getElementById(id);
  if (pantalla) {
    pantalla.classList.add('activa');
    window.scrollTo(0, 0);
    document.getElementById('selectorPantalla').value = id;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarPantallas();
  mostrarPantalla('login');
});