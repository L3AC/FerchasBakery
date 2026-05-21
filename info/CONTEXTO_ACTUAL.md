# FerchasBakery - Contexto Actual del Proyecto

## Estado General: ~95% Listo para conexión con Insforge

## Resumen de lo que se hizo

Se eliminó TODO el código mock/hardcodeado y se conectaron todas las vistas, modales, servicios y almacenes a Insforge (PostgreSQL). La interfaz diseñada por el compañero se mantiene intacta (colores, tipografía, modales, layout).

### Archivos Modificados/Refactorizados

#### Servicios (conexión directa a Insforge)
- `src/services/servicioAutenticacion.js` — Agregado método `cambiarContrasena()`
- `src/services/servicioClientes.js` — Agregado método `eliminar()`

#### Almacenes (Pinia stores, capa intermedia vistas ↔ servicios)
- `src/stores/almacenAutenticacion.js` — Agregado método `cambiarContrasena()`
- `src/stores/almacenPedidos.js` — Agregado método `cancelar()`
- `src/stores/almacenClientes.js` — Agregado método `eliminar()`

#### Modales
- `src/components/productos/ModalProducto.vue`
  - Antes: categorías y proveedores hardcodeados como strings
  - Ahora: carga dinámica desde BD (categorías → `id_categoria` UUID, proveedores → `id_proveedor` UUID)
  - Campos alineados con BD: `categoria` → `id_categoria`, `tipoOrigen` → `tipo_origen`, `stock` → `stock_disponible`, `personalizable` → `es_personalizable`

- `src/components/pedidos/ModalPedido.vue`
  - Antes: cliente hardcodeado "María Hernández — 7777-1234", productos desde mock, sin validación de stock
  - Ahora: clientes cargados desde BD, buscador de productos con resultados en dropdown, validación de stock en tiempo real, submit bloqueado si stock insuficiente
  - Datos emitidos con UUIDs (`id_cliente`, `id_producto`) y nombres de campo correctos para BD

- `src/components/pedidos/ModalDetallePedido.vue`
  - Antes: datos fijos desde `mockDetallePedido`
  - Ahora: recibe `pedido` como prop, timeline de estados dinámico, carga `detalles_pedido` desde BD al abrir, permite cambiar estado

- `src/components/shared/EncabezadoPrincipal.vue`
  - Antes: datos desde `mockUsuarioActual`
  - Ahora: nombre, iniciales, rol desde `almacenAutenticacion`, cierre de sesión real

#### Vistas
- `src/views/ProductosView.vue`
  - Antes: `mockProductos` + `ilustracionesProductos`, filtros hardcodeados, `guardar()` era console.log
  - Ahora: datos desde `almacenProductos`, ilustraciones SVG mapeadas por categoría de BD, filtros cargan desde `almacenCategorias`, guardar llama a `almacenProductos.crear()`

- `src/views/ClientesView.vue`
  - Antes: `mockClientes` con campos `iniciales`, `pedidos`, `ultimo` (mock)
  - Ahora: datos desde `almacenClientes`, iniciales computadas, muestra `created_at` de BD, eliminar llama a `almacenClientes.eliminar()`

- `src/views/PedidosView.vue`
  - Antes: `mockPedidos`, guardar era console.log, modal de error stock (demo)
  - Ahora: datos desde `almacenPedidos`, guardar crea pedido + detalles en BD, filtra por estado real (Pendiente/Preparando/Entregado/Cancelado)

- `src/views/ProveedoresView.vue`
  - Antes: `mockProveedores` con `productos` (mock count)
  - Ahora: datos desde `almacenProveedores`, guardar llama a `almacenProveedores.crear()`, eliminar llama a `almacenProveedores.eliminar()`

- `src/views/DashboardView.vue`
  - Antes: `mockUsuarioActual`, `mockKpis`, `mockProductosStockBajo`, `mockPedidosRecientes`
  - Ahora: KPIs computados desde almacenes reales, fecha dinámica, productos con stock bajo filtrados, pedidos recientes desde BD

- `src/views/UsuariosView.vue`
  - Antes: `mockUsuarios`
  - Ahora: datos desde `servicioPerfiles.obtenerTodos()`

- `src/views/MiPerfilView.vue`
  - Antes: `mockUsuarioActual` con campos `carne`, `ultimoAcceso`, `estadisticas` (mock)
  - Ahora: datos desde `almacenAutenticacion`, cambio de contraseña funcional con validaciones

- `src/views/LoginView.vue`
  - Antes: bypass mock que hidrataba almacén con datos falsos
  - Ahora: autenticación real contra Insforge Auth

- `src/App.vue`
  - Antes: modo prototipo que restauraba sesión mock en F5
  - Ahora: solo restauración de sesión real mediante `almacenAuth.obtenerUsuarioActual()`

### No se modificó (diseño original del compañero)
- `src/components/shared/Icono.vue` — Sistema de iconos SVG
- `src/lib/iconos.js` — Biblioteca de iconos
- `src/components/shared/LayoutPanel.vue` — Layout base
- `src/components/shared/ModalBase.vue` — Modal base
- `src/components/shared/BuscadorSelect.vue` — Componente de búsqueda
- `src/components/clientes/ModalCliente.vue` — Modal de cliente (emite, no necesita cambios)
- `src/components/proveedores/ModalProveedor.vue` — Modal de proveedor (emite, no necesita cambios)
- Estilos y colores (Tailwind, paleta Ferchas)
- `src/router/index.js` — Rutas (ya tenía guard de autenticación funcional)

### Archivos con código legacy (no eliminados, ya no importados)
- `src/lib/datosMock.js` — Ya no se importa en ninguna vista/componente activo
- `src/components/pedidos/ModalErrorStock.vue` — Ya no se usa (era demo)

### BD: Mapeo Vista ↔ PostgreSQL
```
productos:    nombre, descripcion, precio, stock_disponible, tipo_origen, 
              es_personalizable, activo, id_categoria (FK), id_proveedor (FK nullable)
clientes:     nombre, telefono, correo, direccion
pedidos:      id_cliente (FK), tipo_pedido, estado_pedido, metodo_pago, 
              fecha_pedido, fecha_entrega, total, observaciones
detalles_pedido: id_pedido (FK), id_producto (FK), cantidad, precio_unitario, subtotal
categorias_productos: nombre_categoria
proveedores:  nombre, telefono, contacto, descripcion
perfiles:     user_id (FK auth.users), nombre, rol (admin/empleado), activo
```

### Lo que falta / pendiente
1. Verificar que la conexión a Insforge esté activa (credenciales en `src/lib/insforge.js`)
2. Probar flujo completo: registro → login → crear categoría → crear producto → crear cliente → crear pedido
3. Los métodos `cambiarContrasena` de servicioAutenticación usan `auth.updateUser()` de Insforge - verificar disponibilidad
4. ModalErrorStock.vue no se usa pero puede reactivarse si se quiere mostrar errores de stock
5. La paginación en las vistas es placeholder (botones disabled) - no implementada
