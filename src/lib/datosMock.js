/**
 * Datos mock del prototipo de la sección 14.2 (Diseño de interfaz).
 *
 * Cuando el sistema real con Insforge esté funcionando, cada view debe
 * reemplazar el import de aquí por la llamada al store correspondiente.
 */

export const mockUsuarioActual = {
  iniciales: 'LR',
  nombreCompleto: 'Leslie Alejandra Rivera Escobar',
  nombreCorto: 'Leslie Rivera',
  primerNombre: 'Leslie',
  correo: 're251913@ferchasbakery.com',
  rol: 'admin',
  rolEtiqueta: 'Administradora',
  carne: 'RE251913',
  registrado: '15 de enero de 2026',
  ultimoAcceso: 'hoy, 08:15',
  estadisticas: { pedidosRegistrados: 87, productosCreados: 23, clientesAgregados: 41 },
}

export const mockUsuarios = [
  { iniciales: 'LR', nombre: 'Leslie Rivera Escobar',   correo: 're251913@ferchasbakery.com', rol: 'admin',    activo: true,  ultimoAcceso: 'Hoy, 08:15',  registrado: '15/01/2026' },
  { iniciales: 'RD', nombre: 'Ricardo Duran Linares',   correo: 'dl251291@ferchasbakery.com', rol: 'empleado', activo: true,  ultimoAcceso: 'Hoy, 09:02',  registrado: '20/01/2026' },
  { iniciales: 'AM', nombre: 'Angel Miranda Rodriguez', correo: 'mr241687@ferchasbakery.com', rol: 'empleado', activo: true,  ultimoAcceso: 'Hoy, 09:30',  registrado: '20/01/2026' },
  { iniciales: 'FG', nombre: 'Francisco García Ramos',  correo: 'gr250170@ferchasbakery.com', rol: 'empleado', activo: true,  ultimoAcceso: 'Ayer, 18:30', registrado: '22/01/2026' },
  { iniciales: 'LA', nombre: 'Luis Alvarenga Claros',   correo: 'ac250260@ferchasbakery.com', rol: 'empleado', activo: false, ultimoAcceso: '15/04/2026',  registrado: '22/01/2026' },
]

export const mockKpis = {
  ventasDelDia: 248.50, variacionVsAyer: 18,
  pedidosPendientes: 7, pedidosEntregaHoy: 3,
  stockBajo: 4, clientesRegistrados: 142, clientesNuevosEsteMes: 5,
}

export const mockProductosStockBajo = [
  { nombre: 'Cheesecake de fresa',   categoria: 'Postres · Especialidad',  stock: 2, severidad: 'error' },
  { nombre: 'Tres leches en vaso',   categoria: 'Postres · Especialidad',  stock: 3, severidad: 'error' },
  { nombre: 'Conchas tradicionales', categoria: 'Pan dulce tradicional',   stock: 6, severidad: 'advertencia' },
  { nombre: 'Frappé de caramelo',    categoria: 'Bebidas frías',           stock: 8, severidad: 'advertencia' },
]

export const mockPedidosRecientes = [
  { cliente: 'María Hernández',   tiempo: 'Hace 12 min',                 tipo: 'Mostrador', estado: 'entregado',  total: '$8.50' },
  { cliente: 'Carlos Méndez',     tiempo: 'Hace 38 min · WhatsApp',      tipo: 'Encargo',   estado: 'preparando', total: '$45.00' },
  { cliente: 'Lucía Ramírez',     tiempo: 'Hace 1 h 15 min · Instagram', tipo: 'Domicilio', estado: 'pendiente',  total: '$22.75' },
  { cliente: 'Cliente ocasional', tiempo: 'Hace 2 h',                    tipo: 'Mostrador', estado: 'entregado',  total: '$6.00' },
  { cliente: 'Ana López',         tiempo: 'Hace 3 h · Candy bar',        tipo: 'Encargo',   estado: 'cancelado',  total: '$120.00' },
]

export const mockProductos = [
  { id: 1, nombre: 'Cheesecake de fresa',        descripcion: 'Cheesecake horneado con fresas naturales. Disponible en porción o entero',  precio: 4.50,  stock: 2,  tipo: 'INTERNO', ilustracion: 'fresa',     fondoColor: 'rosa-suave',     stockBajo: true,  stockMedio: false },
  { id: 2, nombre: 'Tres leches clásico',        descripcion: 'Bizcocho tradicional bañado en tres leches, decorado con merengue',          precio: 3.50,  stock: 12, tipo: 'INTERNO', ilustracion: 'pastel',    fondoColor: 'rosa/40',        stockBajo: false, stockMedio: false },
  { id: 3, nombre: 'Cupcake',                    descripcion: 'Cupcake esponjoso con buttercream artesanal, varios sabores disponibles',    precio: 1.75,  stock: 18, tipo: 'INTERNO', ilustracion: 'vainilla',  fondoColor: 'advertencia/30', stockBajo: false, stockMedio: false },
  { id: 4, nombre: 'Concha tradicional',         descripcion: 'Pan dulce tradicional con costra de azúcar, horneado en casa',               precio: 0.75,  stock: 6,  tipo: 'INTERNO', ilustracion: 'galleta',   fondoColor: 'rosa-suave',     stockBajo: false, stockMedio: true  },
  { id: 5, nombre: 'Crepa de Nutella con fresa', descripcion: 'Crepa rellena de Nutella con fresas frescas',                                 precio: 4.25,  stock: 9,  tipo: 'INTERNO', ilustracion: 'velvet',    fondoColor: 'rosa/40',        stockBajo: false, stockMedio: false },
  { id: 6, nombre: 'Sándwich de pollo',          descripcion: 'Sándwich con pechuga de pollo, vegetales y aderezo de la casa',              precio: 5.00,  stock: 7,  tipo: 'INTERNO', ilustracion: 'tartaleta', fondoColor: 'advertencia/30', stockBajo: false, stockMedio: true  },
  { id: 7, nombre: 'Cappuccino',                 descripcion: 'Espresso con leche vaporizada y espuma cremosa',                              precio: 2.50,  stock: 30, tipo: 'INTERNO', ilustracion: 'cafe',      fondoColor: 'cafe/15',        stockBajo: false, stockMedio: false },
  { id: 8, nombre: 'Pastel personalizado 12 p.', descripcion: 'Pastel para encargos especiales. Precio según diseño, tamaño y sabor',       precio: 45.00, stock: 0,  tipo: 'INTERNO', ilustracion: 'pastel',    fondoColor: 'rosa-suave',     stockBajo: false, stockMedio: false },
]

export const mockPedidos = [
  { id: 'P-0142', cliente: 'María Hernández',   fecha: '21/05/2026 09:48', tipo: 'Mostrador', metodo: 'Efectivo',      items: 3, total: 8.50,   estado: 'entregado' },
  { id: 'P-0141', cliente: 'Carlos Méndez',     fecha: '21/05/2026 09:22', tipo: 'Encargo',   metodo: 'Transferencia', items: 1, total: 45.00,  estado: 'preparando' },
  { id: 'P-0140', cliente: 'Lucía Ramírez',     fecha: '21/05/2026 08:45', tipo: 'Domicilio', metodo: 'Transferencia', items: 4, total: 22.75,  estado: 'pendiente' },
  { id: 'P-0139', cliente: 'Cliente ocasional', fecha: '21/05/2026 08:02', tipo: 'Mostrador', metodo: 'Efectivo',      items: 2, total: 6.00,   estado: 'entregado' },
  { id: 'P-0138', cliente: 'Ana López',         fecha: '20/05/2026 18:30', tipo: 'Encargo',   metodo: 'Transferencia', items: 1, total: 120.00, estado: 'cancelado' },
  { id: 'P-0137', cliente: 'José Martínez',     fecha: '20/05/2026 17:15', tipo: 'Mostrador', metodo: 'Efectivo',      items: 4, total: 14.25,  estado: 'entregado' },
  { id: 'P-0136', cliente: 'Patricia Aguilar',  fecha: '20/05/2026 16:48', tipo: 'Encargo',   metodo: 'Transferencia', items: 1, total: 85.00,  estado: 'pendiente' },
  { id: 'P-0135', cliente: 'Roberto Cruz',      fecha: '20/05/2026 15:20', tipo: 'Domicilio', metodo: 'Transferencia', items: 3, total: 18.50,  estado: 'preparando' },
]

export const mockDetallePedido = {
  id: 'P-0141',
  fechaRegistro: '21 de mayo de 2026 a las 09:22',
  registradoPor: 'Leslie Rivera',
  estado: 'preparando',
  estadoTimeline: [
    { etapa: 'Pendiente',  hora: '09:22', completado: true,  activo: false },
    { etapa: 'Preparando', hora: '09:45', completado: false, activo: true  },
    { etapa: 'Entregado',  hora: '—',     completado: false, activo: false },
  ],
  productos: [
    { nombre: 'Pastel personalizado 12 porciones', descripcion: 'Encargo · Decoración rosa, sabor tres leches', cantidad: 1, precio: 45.00, subtotal: 45.00 },
  ],
  total: 45.00,
  observaciones: 'Pedido recibido por WhatsApp. Pastel de cumpleaños para Sofía. Decoración con buttercream rosa y mensaje "Feliz cumpleaños Sofía" en letras de chocolate. Cliente recoge el sábado a las 4:00 PM. Sin nueces por alergia.',
  cliente: {
    nombre: 'Carlos Méndez',
    telefono: '7888-5678',
    correo: 'carlos.mendez@correo.com',
    direccion: 'Col. San Benito, Calle La Reforma #45, San Salvador',
  },
  info: { tipo: 'Encargo', metodoPago: 'Transferencia', fechaPedido: '21/05/2026', fechaEntrega: '24/05/2026' },
}

export const mockProductosFormPedido = [
  { nombre: 'Tres leches clásico',        categoria: 'Postres y especialidades · Interno', stockDisponible: 12, stockSeveridad: 'exito', cantidad: 2, precio: 3.50, subtotal: 7.00 },
  { nombre: 'Cappuccino',                 categoria: 'Bebidas calientes · Interno',         stockDisponible: 30, stockSeveridad: 'exito', cantidad: 2, precio: 2.50, subtotal: 5.00 },
  { nombre: 'Crepa de Nutella con fresa', categoria: 'Crepas y postres · Interno',          stockDisponible: 9,  stockSeveridad: 'exito', cantidad: 1, precio: 4.25, subtotal: 4.25 },
]

export const mockErroresStock = [
  { nombre: 'Cheesecake de fresa', solicitado: 5, disponible: 2 },
  { nombre: 'Cupcake red velvet',  solicitado: 6, disponible: 3 },
]

export const mockClientes = [
  { iniciales: 'MH', nombre: 'María Hernández',   telefono: '7777-1234', correo: 'maria.h@correo.com',       direccion: 'Col. Escalón, San Salvador',            pedidos: 18, ultimo: '21/05/2026' },
  { iniciales: 'CM', nombre: 'Carlos Méndez',     telefono: '7888-5678', correo: 'carlos.mendez@correo.com', direccion: 'Col. San Benito, Calle La Reforma #45', pedidos: 12, ultimo: '21/05/2026' },
  { iniciales: 'LR', nombre: 'Lucía Ramírez',     telefono: '7666-9012', correo: 'lucia.r@correo.com',       direccion: 'Col. Layco, Avenida Bolívar',           pedidos: 8,  ultimo: '21/05/2026' },
  { iniciales: 'AL', nombre: 'Ana López',         telefono: '7555-3456', correo: 'ana.lopez@correo.com',     direccion: 'Soyapango, Reparto Las Margaritas',     pedidos: 22, ultimo: '20/05/2026' },
  { iniciales: 'JM', nombre: 'José Martínez',     telefono: '7444-7890', correo: 'jmartinez@correo.com',     direccion: 'Mejicanos, Col. Zacamil #12',           pedidos: 5,  ultimo: '20/05/2026' },
  { iniciales: 'PA', nombre: 'Patricia Aguilar',  telefono: '7333-2345', correo: 'pat.aguilar@correo.com',   direccion: 'Santa Tecla, Residencial El Roble',     pedidos: 15, ultimo: '20/05/2026' },
  { iniciales: 'RC', nombre: 'Roberto Cruz',      telefono: '7222-6789', correo: 'roberto.c@correo.com',     direccion: 'Antiguo Cuscatlán, Calle Las Cumbres',  pedidos: 9,  ultimo: '20/05/2026' },
  { iniciales: 'SF', nombre: 'Sofía Flores',      telefono: '7111-0123', correo: 'sofia.flores@correo.com',  direccion: 'Col. Médica, San Salvador',             pedidos: 3,  ultimo: '18/05/2026' },
]

export const mockProveedores = [
  { nombre: 'Distribuidora de Harinas',   telefono: '2222-3344', contacto: 'Julio Pérez',     descripcion: 'Harina, levadura y materia prima base para repostería', productos: 4 },
  { nombre: 'Insumos Generales La Salud', telefono: '2233-5566', contacto: 'Marina Castillo', descripcion: 'Sal, azúcar y otros insumos básicos para producción',   productos: 6 },
]

export const ilustracionesProductos = {
  fresa:     `<svg viewBox="0 0 100 100" width="56" height="56"><circle cx="50" cy="55" r="28" fill="#C4889A"/><circle cx="50" cy="42" r="22" fill="#fff" opacity="0.85"/><path d="M30 40 Q50 30 70 40" stroke="#DF9CB4" stroke-width="3" fill="none"/><circle cx="42" cy="45" r="2" fill="#C47B7B"/><circle cx="55" cy="48" r="2" fill="#C47B7B"/></svg>`,
  vainilla:  `<svg viewBox="0 0 100 100" width="56" height="56"><path d="M30 60 L70 60 L65 88 L35 88 Z" fill="#D4A574"/><circle cx="50" cy="50" r="22" fill="#EBCED6"/><circle cx="50" cy="35" r="4" fill="#C47B7B"/></svg>`,
  pastel:    `<svg viewBox="0 0 100 100" width="56" height="56"><rect x="20" y="40" width="60" height="40" rx="3" fill="#fff" stroke="#C4889A" stroke-width="2"/><rect x="20" y="55" width="60" height="3" fill="#DF9CB4"/><path d="M50 28 L50 40 M44 28 Q50 22 50 28 Q50 22 56 28" stroke="#C47B7B" stroke-width="2.5" fill="none"/></svg>`,
  velvet:    `<svg viewBox="0 0 100 100" width="56" height="56"><path d="M30 60 L70 60 L65 88 L35 88 Z" fill="#5A3A3A"/><circle cx="50" cy="50" r="22" fill="#EBCED6"/><path d="M30 50 Q50 35 70 50" stroke="#C47B7B" stroke-width="2" fill="none"/></svg>`,
  galleta:   `<svg viewBox="0 0 100 100" width="56" height="56"><circle cx="50" cy="50" r="28" fill="#D4A574"/><circle cx="40" cy="42" r="3" fill="#381414"/><circle cx="55" cy="45" r="3" fill="#381414"/><circle cx="48" cy="58" r="3" fill="#381414"/><circle cx="60" cy="55" r="2.5" fill="#381414"/></svg>`,
  tartaleta: `<svg viewBox="0 0 100 100" width="56" height="56"><ellipse cx="50" cy="60" rx="32" ry="22" fill="#D4A574"/><ellipse cx="50" cy="55" rx="26" ry="16" fill="#fff" opacity="0.6"/><circle cx="42" cy="55" r="3" fill="#EBCED6"/><circle cx="58" cy="55" r="3" fill="#EBCED6"/></svg>`,
  cafe:      `<svg viewBox="0 0 100 100" width="56" height="56"><path d="M28 30 L72 30 L68 80 Q50 88 32 80 Z" fill="#381414"/><path d="M72 40 Q88 40 88 55 Q88 70 72 70" fill="none" stroke="#381414" stroke-width="4"/><path d="M40 20 Q42 12 45 20 M50 20 Q52 12 55 20 M60 20 Q62 12 65 20" stroke="#C4889A" stroke-width="2" fill="none"/></svg>`,
}
