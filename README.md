# 🎂 FerchasBakery - Sistema Administrativo Interno

Sistema web administrativo moderno para FerchasBakery, una pequeña repostería artesanal. Diseñado para gestionar ventas, pedidos, productos, clientes y proveedores de forma simple e intuitiva.

## ✨ Características

### Módulos Implementados

1. **Autenticación**
   - Login con email y contraseña
   - Control de sesión persistente
   - Recuperación automática de sesión

2. **Dashboard**
   - Resumen de ventas del día
   - Contador de pedidos pendientes
   - Alertas de productos con stock bajo
   - Visualización rápida de información crítica

3. **Productos**
   - Crear, editar, listar productos
   - Búsqueda en tiempo real
   - Control de stock disponible
   - Clasificación: productos internos vs. de proveedores
   - Alertas de stock bajo

4. **Pedidos**
   - Registro de pedidos con clientes
   - Cálculo automático de totales
   - Estados: Pendiente → Preparando → Entregado
   - Descontaje automático de stock al registrar
   - Filtrado por estado

5. **Clientes**
   - Registro de clientes
   - Búsqueda por nombre, teléfono o correo
   - Consulta de historial de pedidos
   - Información de contacto

6. **Proveedores** (Admin)
   - Gestión de proveedores
   - Asociación con productos

7. **Usuarios** (Admin)
   - Gestión de roles (Admin/Empleado)
   - Cambio de permisos de usuarios

### Roles y Permisos

**Admin (Dueña)**
- Acceso completo a todos los módulos
- Crear, editar, eliminar productos
- Gestionar proveedores y usuarios
- Ver reportes

**Empleado**
- Registrar ventas y pedidos
- Consultar productos y clientes
- Actualizar estados de pedidos
- No puede eliminar información
- No accede a configuraciones administrativas

## 🛠 Tecnologías

- **Frontend**: Vue.js 3 (Composition API), Vite
- **Estilos**: Tailwind CSS 3.4
- **Estado Global**: Pinia
- **Backend**: Insforge (Backend as a Service)
- **Base de Datos**: PostgreSQL
- **Autenticación**: Insforge Auth

## 📁 Estructura del Proyecto

```
FerchasBakery/
├── src/
│   ├── components/
│   │   └── shared/
│   │       ├── EncabezadoPrincipal.vue      # Header con usuario y logout
│   │       └── BarralateralPrincipal.vue    # Navegación lateral
│   ├── views/
│   │   ├── LoginView.vue                    # Pantalla de autenticación
│   │   ├── DashboardView.vue               # Resumen del negocio
│   │   ├── ProductosView.vue               # Gestión de productos
│   │   ├── PedidosView.vue                 # Gestión de pedidos
│   │   ├── ClientesView.vue                # Gestión de clientes
│   │   ├── ProveedoresView.vue             # Gestión de proveedores
│   │   └── UsuariosView.vue                # Gestión de usuarios
│   ├── services/
│   │   ├── servicioAutenticacion.js        # Auth con Insforge
│   │   ├── servicioProductos.js            # CRUD productos
│   │   ├── servicioPedidos.js              # CRUD pedidos
│   │   ├── servicioClientes.js             # CRUD clientes
│   │   ├── servicioProveedores.js          # CRUD proveedores
│   │   ├── servicioPerfiles.js             # Gestión de roles
│   │   └── servicioCategorias.js           # Categorías
│   ├── stores/
│   │   ├── almacenAutenticacion.js         # Estado auth global
│   │   ├── almacenProductos.js             # Estado productos
│   │   ├── almacenPedidos.js               # Estado pedidos
│   │   └── almacenClientes.js              # Estado clientes
│   ├── router/
│   │   └── index.js                        # Rutas y guards
│   ├── middleware/
│   │   └── middlewareAutenticacion.js      # Middleware de rutas
│   ├── lib/
│   │   └── insforge.js                     # Cliente Insforge
│   ├── App.vue                             # Root component
│   ├── main.js                             # Entry point
│   └── style.css                           # Estilos globales
├── info/
│   ├── contexto.md                         # Descripción del negocio
│   ├── flujo.md                            # Flujos del sistema
│   ├── SKILL.md                            # Guía de diseño
│   ├── rubrica.md                          # Criterios de evaluación
│   └── NARRATIVAS_UML.md                   # Casos de uso detallados
├── uml/                                     # Diagramas UML
├── script.sql                              # Script de base de datos
├── package.json                            # Dependencias
├── vite.config.js                          # Config Vite
├── tailwind.config.js                      # Customizaciones Tailwind
├── postcss.config.js                       # PostCSS config
└── index.html                              # HTML principal
```

## 🚀 Instalación

### Requisitos
- Node.js 16+
- pnpm

### Pasos

1. **Clonar repositorio**
```bash
git clone https://github.com/L3AC/FerchasBakery.git
cd FerchasBakery
```

2. **Instalar dependencias**
```bash
pnpm install
```

3. **Iniciar servidor de desarrollo**
```bash
pnpm run dev
```

4. **Compilar para producción**
```bash
pnpm run build
```

5. **Vista previa de producción**
```bash
pnpm run preview
```

## 🎨 Guía de Diseño

### Paleta de Colores (Basada en Logo)

- **Rosa Principal**: `#DF9CB4` (botones, acentos)
- **Rosa Oscuro**: `#C4889A` (hover)
- **Rosa Suave**: `#EBCED6` (fondos suaves)
- **Fondo Claro**: `#F0F0F0` (fondo principal)
- **Café Oscuro**: `#381414` (texto principal)
- **Café Claro**: `#5A3A3A` (texto secundario)
- **Vino Oscuro**: `#4A1818` (headers)

### Tipografía

- **Títulos**: Playfair Display (serif, elegante)
- **Cuerpo**: Lato (limpio, legible)

### Componentes Base

```html
<!-- Botón Principal -->
<button class="btn-principal">Guardar</button>

<!-- Botón Secundario -->
<button class="btn-secundario">Cancelar</button>

<!-- Input -->
<input class="input-base" type="text" />

<!-- Card -->
<div class="card-base">Contenido</div>

<!-- Tabla -->
<table class="tabla-base">...</table>

<!-- Badges de Estado -->
<span class="badge-exito">Entregado</span>
<span class="badge-error">Cancelado</span>
<span class="badge-advertencia">Stock Bajo</span>
<span class="badge-info">Mostrador</span>
```

## 🔐 Seguridad

### Autenticación
- Email/contraseña con Insforge Auth
- Tokens JWT almacenados localmente
- Validación de sesión al iniciar app

### Autorización
- Guard de rutas por rol
- Verificación de permisos antes de mostrar elementos
- Endpoints protegidos por JWT

### Validaciones
- Validación de campos obligatorios
- Validación de formato (email, teléfono)
- Validación de stock antes de pedidos
- Validación de precios >= 0

## 📊 Flujos Principales

### Registrar Pedido (Flujo Automático de Stock)

```
1. Empleado/Admin abre formulario nuevo pedido
2. Selecciona cliente y tipo de pedido
3. Agrega productos con cantidades
4. Sistema valida stock disponible
5. Usuario confirma pedido
6. Sistema:
   - Crea pedido en BD
   - Crea detalles_pedido
   - DESCUENTA STOCK AUTOMÁTICAMENTE (*)
   - Muestra confirmación
(*) Sin intervención adicional del usuario
```

### Cambiar Estado Pedido

```
Pendiente → Preparando → Entregado
         → Cancelado
```

## 🧪 Testing

### Credenciales de Prueba

Usar cualquier correo de prueba. El sistema creará perfiles automáticamente.

**Usuarios de Prueba**:
- Email: `admin@test.com` (crea perfil admin)
- Email: `empleado@test.com` (crea perfil empleado)

### Casos de Prueba Recomendados

1. ✅ Login como admin y empleado
2. ✅ Crear producto y verificar en lista
3. ✅ Registrar pedido y verificar descuento de stock
4. ✅ Cambiar estado de pedido
5. ✅ Buscar cliente por nombre/teléfono
6. ✅ Verificar restricciones de empleado (no puede acceder a proveedores)
7. ✅ Ver dashboard con datos reales

## 📱 Responsividad

- Optimizado para pantallas de escritorio (1024px+)
- Barra lateral colapsable en mobile (futura mejora)
- Tablas responsivas con scroll horizontal

## 🐛 Troubleshooting

### "Error al conectar con Insforge"
- Verificar conexión a internet
- Verificar que la URL y claves de Insforge son correctas

### "No aparece el stock descontado"
- Recargar página para ver cambios
- Verificar que el pedido se registró exitosamente

### "No puedo crear productos"
- Verificar que eres admin
- Completar todos los campos obligatorios

## 📚 Documentación Adicional

- **NARRATIVAS_UML.md**: Descripción detallada de cada caso de uso
- **contexto.md**: Descripción del negocio
- **flujo.md**: Flujos del sistema
- **SKILL.md**: Guía de diseño UI/UX

## 🎯 Próximas Mejoras

- [ ] Exportar reportes a PDF
- [ ] Gráficos de ventas por período
- [ ] Notificaciones en tiempo real
- [ ] Backup automático de datos
- [ ] Aplicación móvil
- [ ] Integración con WhatsApp para notificaciones

## 📄 Licencia

Proyecto académico para FerchasBakery

## 👤 Autor

Desarrollado como sistema administrativo para FerchasBakery

---

**Última actualización**: Mayo 2026

¡Gracias por usar FerchasBakery System! 🧁
