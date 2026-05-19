# FerchasBakery - Sistema Administrativo Interno
## Descripción del Proyecto
Desarrolla un sistema web administrativo interno para FerchasBakery, una repostería artesanal/cafetería. El sistema debe permitir:
- Registrar ventas y pedidos
- Controlar productos disponibles
- Administrar pedidos
- Consultar historial de clientes
- Gestionar proveedores
**IMPORTANTE**: NO es ecommerce, NO hay panel para clientes, NO hay pagos online, NO hay delivery tracking. Solo para uso interno (dueña y empleados).
---
## Archivos de Referencia Disponibles
Tienes acceso a los siguientes archivos de referencia en este proyecto:
- **info/contexto.md** - Descripción completa del negocio, tecnologías, estructura de base de datos, entidades, módulos, flujos y estándares de código
- **info/flujo.md** - Flujos detallados del sistema, navegación según roles, estructura de tablas, automatización de stock
- **info/rubrica.md** - Criterios de evaluación: narrativas UML y software/interfaces
- **info/SKILL.md** - Guía de diseño UI/UX con colores del logo (rosa #DF9CB4, café #381414, vino #4A1818), tipografía (Playfair Display, Lato), y componentes artesanalessin aspecto "AI-generated"
- **script.sql** - Script de base de datos PostgreSQL con todas las tablas ya definidas
- **uml/** - Diagramas UML existentes (DiagramaComponentes, CasosDeUso, ActividadesCarriles, EntidadRelacion)
---
## Tecnologías
- **Frontend**: Vue.js (Composition API con <script setup>), Vite, Tailwind CSS
- **Backend**: Insforge (Backend as a Service), PostgreSQL, API REST
- **Arquitectura**: MVC, SPA (Single Page Application)
- **Estado global**: Pinia
---
## Roles del Sistema
### Admin (Dueña)
- Acceso completo: gestionar productos, categorías, clientes, proveedores, empleados, pedidos, stock, reportes, ventas
### Empleado
- Acceso operativo: registrar ventas, registrar pedidos, consultar productos, consultar clientes, actualizar estados básicos de pedidos
- Restricciones: NO administra usuarios, NO elimina información crítica, NO accede a configuraciones administrativas
---
## Estructura de Base de Datos (ya definida en script.sql)
### Tablas principales:
- `perfiles` (user_id, nombre, rol: admin/empleado, activo)
- `clientes` (id_cliente, nombre, telefono, correo, direccion)
- `categorias_productos` (id_categoria, nombre_categoria)
- `proveedores` (id_proveedor, nombre, telefono, contacto, descripcion)
- `productos` (id_producto, id_categoria, id_proveedor NULL, nombre, descripcion, precio, stock_disponible, tipo_origen: interno/proveedor, es_personalizable, activo)
- `pedidos` (id_pedido, id_cliente, user_id, tipo_pedido: Mostrador/Encargo/Domicilio, estado_pedido: Pendiente/Preparando/Entregado/Cancelado, metodo_pago, fecha_pedido, fecha_entrega, total, observaciones)
- `detalles_pedido` (id_detalle, id_pedido, id_producto, cantidad, precio_unitario, subtotal, observaciones)
---
## Flujos Principales
### 1. Autenticación
1. Usuario ingresa correo y contraseña
2. Insforge Auth valida credenciales
3. Sistema obtiene perfil y redirige según rol
### 2. Registrar Pedido
1. Seleccionar cliente
2. Agregar productos con cantidades
3. Sistema calcula subtotal y total
4. Seleccionar método de pago (Efectivo/Transferencia/Tarjeta)
5. Seleccionar tipo pedido (Mostrador/Encargo/Domicilio)
6. Guardar pedido → sistema descuenta stock automáticamente
### 3. Productos
- **Internos**: hechos en la repostería (cheesecake, cupcakes, pasteles). tipo_origen='interno'
- **Externos**: de proveedores (sodas, jugos). tipo_origen='proveedor'
---
## Requisitos de la Rúbrica
### UML y Documentación
- Crear narrativa clara para cada caso de uso (nombre, propósito, actores, cómo se activa, paso a paso de la interacción)
- El lenguaje debe ser entendible para el cliente
### Software/Interfaces
- Cada pantalla debe mostrar TODO lo que el usuario necesita
- Manejo de estados: carga, éxito, error
- Restricciones de seguridad, calidad y manejo de errores
- Validar stock antes de confirmar pedido
- Validar campos obligatorios en formularios
---
## Guía de Diseño (SKILL - IMPORTANTE SEGUIR)
### Colores del Logo (USAR SIEMPRE)
- Rosa principal: `#DF9CB4`
- Rosa claro/fondo: `#F0F0F0`
- Café oscuro: `#381414`
- Café vino: `#4A1818`
### Tailwind config:
```js
colors: {
  'ferchas-rosa': '#DF9CB4',
  'ferchas-rosa-oscuro': '#C4889A',
  'ferchas-rosa-suave': '#EBCED6',
  'ferchas-fondo': '#F0F0F0',
  'ferchas-fondo-oscuro': '#E5E5E5',
  'ferchas-cafe': '#381414',
  'ferchas-cafe-claro': '#5A3A3A',
  'ferchas-vino': '#4A1818',
  'ferchas-vino-claro': '#6B2828',
  'ferchas-exito': '#8FB996',
  'ferchas-advertencia': '#D4A574',
  'ferchas-error': '#C47B7B',
}
##Tipografía
- Títulos: Playfair Display (serif, elegante)
- Cuerpo: Lato (limpio pero no robótico)
- Añadir al HTML: <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
## EVITAR aspecto "AI-generated"
- NO gradientes genéricos azul/purple
- NO border-radius excesiva (usar rounded-lg sparingly)
- NO spacing uniforme robótico (usar valores "orgánicos": 6, 14, 22, 38)
- NO usar bg-white como fondo principal (usar bg-ferchas-fondo)
- NO icons de línea genéricos muy finos
## Componentes recomendados
- Cards: bg-ferchas-fondo border-2 border-ferchas-rosa/40 rounded-lg shadow-sm
- Botón principal: bg-ferchas-rosa text-white px-6 py-2.5 rounded-lg
- Botón secundario: bg-ferchas-fondo text-ferchas-cafe border-2 border-ferchas-cafe/30
- Inputs: bg-white border-2 border-ferchas-cafe/20 rounded-lg
- Header: bg-ferchas-vino text-white
## Estándares de Código
## Naming
- Variables, funciones, componentes en ESPAÑOL
- camelCase para variables, PascalCase para componentes Vue 
## Vue.js
- Usar Composition API con <script setup>
- NO usar Options API
- Estado global con Pinia
## Manejo de Errores
- Toda llamada API debe estar en try/catch
- Mostrar mensajes de error claros al usuario
- Validar datos antes de enviar al backend
## Validaciones
- Validar stock disponible antes de confirmar pedido
- Validar campos obligatorios en formularios
- Validar rangos de precios (>= 0)
## Seguridad
- No exponer credenciales ni API keys en frontend
- Usar métodos de Insforge SDK para consultas
- Verificar rol del usuario antes de mostrar acciones administrativas

## Estructura del Proyecto:
src/
├── components/
│   ├── dashboard/
│   ├── productos/
│   ├── pedidos/
│   ├── clientes/
│   └── shared/
├── views/
│   ├── LoginView.vue
│   ├── DashboardView.vue
│   ├── ProductosView.vue
│   ├── PedidosView.vue
│   ├── ClientesView.vue
│   ├── ProveedoresView.vue
│   └── ReportesView.vue
├── router/
├── services/
├── stores/
├── middleware/
├── layouts/
└── main.js

## Entregables Esperados:
1. Interfaces completas para todos los módulos con diseño artesanal (colores del logo, tipografía Playfair/Lato)
2. Navegación según rol (admin vs empleado)
3. Funcionalidades de registro, edición, listado, búsqueda en cada módulo
4. Control automático de stock al registrar pedidos
5. Validaciones y manejo de errores en todos los formularios
6. Documentación UML con narrativas de casos de uso