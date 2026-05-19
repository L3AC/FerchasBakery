# FerchasBakery - Narrativas UML de Casos de Uso

## Formato de Narrativa Estándar

Cada narrativa sigue este formato:

**Nombre**: Breve identificación del caso de uso
**Propósito**: Objetivo principal
**Actores**: Quiénes intervienen
**Cómo se activa**: Cuándo y dónde ocurre
**Paso a Paso**: Interacción detallada entre usuario y sistema

---

## 1. AUTENTICACIÓN

### CU-001: Iniciar Sesión

**Nombre**: Iniciar Sesión en el Sistema

**Propósito**: Permitir que usuarios (admin, empleado) accedan al sistema con sus credenciales

**Actores Principales**:
- Usuario (Admin o Empleado)
- Sistema de Autenticación Insforge

**Cómo se activa**:
- El usuario abre la aplicación web
- Ve la pantalla de login
- Ingresa sus credenciales

**Paso a Paso**:

1. El usuario ingresa su correo electrónico en el campo "Correo Electrónico"
2. El usuario ingresa su contraseña en el campo "Contraseña"
3. El usuario hace clic en el botón "Iniciar Sesión"
4. El sistema valida las credenciales contra Insforge Auth
5. Si las credenciales son válidas:
   - El sistema obtiene el usuario registrado
   - El sistema consulta el perfil del usuario (tabla: perfiles)
   - El sistema almacena el token de sesión localmente
   - El usuario es redirigido al Dashboard
6. Si las credenciales son inválidas:
   - El sistema muestra error: "Credenciales inválidas"
   - El usuario permanece en la pantalla de login

**Resultado Exitoso**: Usuario autenticado, redirección a Dashboard

**Resultado Fallido**: Mensaje de error, usuario permanece en login

---

### CU-002: Cerrar Sesión

**Nombre**: Cerrar Sesión

**Propósito**: Permitir que el usuario termine su sesión de forma segura

**Actores Principales**:
- Usuario autenticado
- Sistema

**Cómo se activa**:
- Usuario hace clic en "Cerrar Sesión" en el encabezado

**Paso a Paso**:

1. El usuario hace clic en el botón "Cerrar Sesión"
2. El sistema:
   - Limpia el token de sesión
   - Limpia el almacenamiento local
   - Llama a `auth.signOut()` de Insforge
3. El usuario es redirigido a la pantalla de login

**Resultado Exitoso**: Sesión cerrada, usuario en login

---

## 2. DASHBOARD

### CU-003: Ver Resumen del Día

**Nombre**: Visualizar Dashboard Administrativo

**Propósito**: Mostrar un resumen rápido del estado del negocio (ventas, pedidos pendientes, stock bajo)

**Actores Principales**:
- Usuario autenticado (admin o empleado)
- Sistema

**Cómo se activa**:
- Usuario accede a `/dashboard` después de autenticarse

**Paso a Paso**:

1. El usuario entra al Dashboard
2. El sistema carga datos en paralelo:
   - **Ventas del Día**: Suma total de pedidos con estado "Entregado" del día actual
   - **Pedidos Pendientes**: Conteo de pedidos con estado "Pendiente"
   - **Stock Bajo**: Conteo de productos con stock < 10 unidades
   - **Clientes Registrados**: Conteo total de clientes
3. El sistema muestra 4 tarjetas con estos indicadores
4. Debajo muestra:
   - Tabla de productos con stock bajo
   - Tabla de pedidos pendientes (últimos 5)
5. Si todo está en orden, muestra mensaje: "¡Todo está en orden!"

**Resultado Exitoso**: Dashboard cargado con información actualizada

---

## 3. PRODUCTOS

### CU-004: Listar Productos

**Nombre**: Consultar Lista de Productos

**Propósito**: Ver todos los productos disponibles con filtrado

**Actores Principales**:
- Usuario autenticado (admin, empleado)
- Sistema

**Cómo se activa**:
- Usuario hace clic en "Productos" en la barra lateral
- URL: `/productos`

**Paso a Paso**:

1. El sistema carga todos los productos activos de la BD
2. El sistema muestra tarjetas de producto con:
   - Nombre
   - Descripción
   - Precio
   - Stock disponible
   - Badge de "Stock Bajo" si aplica
3. El usuario puede:
   - **Buscar**: Escribir en el campo de búsqueda (filtra por nombre en tiempo real)
   - **Si es Admin**: Ver botones "Editar" y "Eliminar"
   - **Si es Empleado**: Ver solo información (lectura)
4. El usuario hace clic en "Editar" o "Eliminar" si tiene permisos

**Resultado Exitoso**: Productos listados y filtrados correctamente

---

### CU-005: Crear Producto (Admin Only)

**Nombre**: Registrar Nuevo Producto

**Propósito**: Agregar un nuevo producto al inventario

**Actores Principales**:
- Admin
- Sistema

**Cómo se activa**:
- Admin hace clic en "+ Nuevo Producto" en la vista de Productos

**Paso a Paso**:

1. Se abre un modal con formulario
2. Admin ingresa:
   - Nombre del producto
   - Descripción
   - Precio (validar >= 0)
   - Stock disponible (validar >= 0)
3. Si es producto de proveedor:
   - Selecciona el proveedor
   - Sistema establece `tipo_origen = 'proveedor'`
4. Si es producto interno (repostería):
   - Sistema establece `tipo_origen = 'interno'`
   - Sin proveedor asociado
5. Admin hace clic en "Guardar"
6. El sistema valida todos los campos obligatorios
7. Si son válidos:
   - Se inserta en tabla `productos`
   - Se actualiza la lista en tiempo real
   - Se muestra confirmación: "Producto creado"
8. Si hay error:
   - Se muestra mensaje de error específico

**Resultado Exitoso**: Producto creado y visible en la lista

**Validaciones**:
- Nombre: Requerido, máx 70 caracteres
- Precio: Requerido, >= 0
- Stock: Requerido, >= 0

---

### CU-006: Editar Producto (Admin Only)

**Nombre**: Modificar Información de Producto

**Propósito**: Actualizar detalles de un producto existente

**Actores Principales**:
- Admin
- Sistema

**Cómo se activa**:
- Admin hace clic en "Editar" en una tarjeta de producto

**Paso a Paso**:

1. Se abre modal con datos precargados del producto
2. Admin modifica los campos necesarios
3. Admin hace clic en "Guardar"
4. El sistema valida cambios
5. Si son válidos:
   - Se actualiza el registro
   - Se refresca la lista
   - Se muestra: "Producto actualizado"
6. Si hay validación fallida:
   - Se muestra error

**Resultado Exitoso**: Producto actualizado

---

### CU-007: Actualizar Stock de Producto

**Nombre**: Modificar Cantidad Disponible de Producto

**Propósito**: Ajustar manualmente el stock de un producto

**Actores Principales**:
- Admin
- Sistema

**Cómo se activa**:
- Admin abre detalles de producto
- Ajusta cantidad de stock

**Paso a Paso**:

1. Admin ingresa la nueva cantidad
2. Sistema valida: cantidad >= 0
3. Si válido:
   - Actualiza `stock_disponible` en BD
   - Muestra nueva cantidad en tiempo real
4. Si inválido:
   - Muestra error de validación

**Resultado Exitoso**: Stock actualizado

---

## 4. PEDIDOS

### CU-008: Registrar Pedido (Empleado/Admin)

**Nombre**: Crear Nuevo Pedido

**Propósito**: Registrar una venta o pedido especial

**Actores Principales**:
- Empleado o Admin
- Sistema
- Cliente (indirectamente)

**Cómo se activa**:
- Usuario hace clic en "+ Nuevo Pedido" en vista Pedidos

**Paso a Paso**:

1. Se abre modal de nuevo pedido
2. Usuario selecciona/ingresa cliente
3. Usuario selecciona tipo de pedido:
   - Mostrador (venta al instante)
   - Encargo (pedido especial con fecha)
   - Domicilio (envío a domicilio)
4. Usuario agrega productos:
   - Selecciona producto
   - Ingresa cantidad
   - Sistema valida que hay stock suficiente
   - Sistema calcula subtotal (cantidad × precio)
5. Usuario selecciona método de pago:
   - Efectivo
   - Transferencia
   - Tarjeta
6. Sistema calcula total automáticamente
7. Usuario hace clic en "Registrar Pedido"
8. El sistema:
   - Crea registro en tabla `pedidos`
   - Crea detalles en tabla `detalles_pedido`
   - Descuenta stock automáticamente (IMPORTANTE)
   - Muestra confirmación
9. Si hay error (p.ej., sin stock):
   - Muestra error
   - No descuenta stock
   - Pedido no se crea

**Validaciones Críticas**:
- Cliente: Requerido
- Stock disponible >= cantidad solicitada
- Precio unitario >= 0
- Cantidad > 0

**Resultado Exitoso**: 
- Pedido creado
- Stock descontado automáticamente
- Confirmación mostrada

**Nota Importante**: El descuento de stock es automático y ocurre sin intervención del usuario

---

### CU-009: Actualizar Estado de Pedido

**Nombre**: Cambiar Estado de Pedido

**Propósito**: Seguimiento del estado de un pedido a través del proceso

**Actores Principales**:
- Usuario autenticado
- Sistema

**Cómo se activa**:
- Usuario abre detalles de un pedido
- Hace clic en cambiar estado

**Paso a Paso**:

1. Usuario ve estado actual: Pendiente, Preparando, Entregado, o Cancelado
2. Usuario selecciona nuevo estado permitido
3. Usuario confirma cambio
4. Sistema actualiza `estado_pedido` en tabla `pedidos`
5. Sistema muestra confirmación
6. Pantalla se refresca con nuevo estado

**Estados Válidos**:
- Pendiente → Preparando o Cancelado
- Preparando → Entregado o Cancelado
- Entregado → (terminal)
- Cancelado → (terminal)

**Resultado Exitoso**: Estado actualizado

---

### CU-010: Ver Pedidos Filtrados

**Nombre**: Consultar Pedidos por Estado

**Propósito**: Filtrar pedidos para seguimiento rápido

**Actores Principales**:
- Usuario autenticado
- Sistema

**Cómo se activa**:
- Usuario en vista Pedidos
- Hace clic en botón de filtro (Todos, Pendientes, Preparando, Entregados)

**Paso a Paso**:

1. Usuario hace clic en filtro
2. Sistema filtra lista de pedidos
3. Muestra solo pedidos del estado seleccionado
4. Mostración incluye:
   - Nombre del cliente
   - Total
   - Tipo de pedido
   - Fecha

**Resultado Exitoso**: Pedidos filtrados

---

## 5. CLIENTES

### CU-011: Registrar Cliente

**Nombre**: Crear Nuevo Cliente

**Propósito**: Agregar un nuevo cliente a la BD

**Actores Principales**:
- Usuario autenticado
- Sistema

**Cómo se activa**:
- Usuario hace clic en "+ Nuevo Cliente" en vista Clientes

**Paso a Paso**:

1. Se abre modal de formulario
2. Usuario ingresa:
   - Nombre (requerido)
   - Teléfono (opcional)
   - Correo (opcional)
   - Dirección (opcional)
3. Usuario hace clic en "Guardar"
4. Sistema valida:
   - Nombre no vacío
   - Teléfono (si se ingresa) con formato válido
   - Correo (si se ingresa) con formato válido
5. Si válido:
   - Se inserta en tabla `clientes`
   - Se actualiza lista
   - Muestra: "Cliente registrado"
6. Si inválido:
   - Muestra errores específicos

**Validaciones**:
- Nombre: Requerido, máx 70 caracteres
- Teléfono: Opcional, máx 30 caracteres
- Correo: Opcional, formato email válido
- Dirección: Opcional, máx 200 caracteres

**Resultado Exitoso**: Cliente creado

---

### CU-012: Buscar Cliente

**Nombre**: Localizar Cliente

**Propósito**: Encontrar cliente rápidamente por búsqueda

**Actores Principales**:
- Usuario autenticado
- Sistema

**Cómo se activa**:
- Usuario en vista Clientes
- Escribe en campo de búsqueda

**Paso a Paso**:

1. Usuario escribe término (nombre, teléfono o correo)
2. Sistema filtra en tiempo real
3. Muestra clientes coincidentes
4. Resultado puede estar vacío si no hay coincidencias

**Búsqueda en Campos**:
- Nombre (insensible a mayúsculas)
- Teléfono (búsqueda exacta)
- Correo (insensible a mayúsculas)

**Resultado Exitoso**: Clientes encontrados listados

---

## 6. PROVEEDORES (ADMIN ONLY)

### CU-013: Registrar Proveedor

**Nombre**: Crear Nuevo Proveedor

**Propósito**: Agregar proveedor para productos externos

**Actores Principales**:
- Admin
- Sistema

**Cómo se activa**:
- Admin hace clic en "+ Nuevo Proveedor" en vista Proveedores

**Paso a Paso**:

1. Se abre modal
2. Admin ingresa:
   - Nombre (requerido)
   - Teléfono (opcional)
   - Contacto (opcional)
   - Descripción (opcional)
3. Admin hace clic en "Guardar"
4. Sistema valida y crea en tabla `proveedores`
5. Se actualiza lista

**Resultado Exitoso**: Proveedor creado

---

## 7. USUARIOS / ROLES (ADMIN ONLY)

### CU-014: Cambiar Rol de Usuario

**Nombre**: Modificar Rol de Usuario

**Propósito**: Cambiar permisos de un usuario entre admin y empleado

**Actores Principales**:
- Admin
- Sistema
- Usuario destino

**Cómo se activa**:
- Admin en vista Usuarios
- Hace clic en "Cambiar Rol" de un usuario

**Paso a Paso**:

1. Se muestra confirmación
2. Admin confirma cambio
3. Sistema actualiza `rol` en tabla `perfiles`
4. Si el usuario está actualmente en sesión, cambios surten efecto al siguiente login
5. Se muestra confirmación

**Roles Disponibles**:
- admin (acceso completo)
- empleado (acceso operativo limitado)

**Resultado Exitoso**: Rol actualizado

---

## RESTRICCIONES DE SEGURIDAD

### Por Rol

**Admin**:
- ✅ Todo acceso completo
- ✅ Crear, editar, eliminar productos
- ✅ Ver todos los pedidos
- ✅ Gestionar usuarios
- ✅ Gestionar proveedores

**Empleado**:
- ✅ Ver productos (lectura)
- ✅ Registrar pedidos
- ✅ Ver pedidos
- ✅ Actualizar estado de pedidos
- ✅ Registrar clientes
- ❌ NO puede eliminar productos
- ❌ NO puede cambiar rol de usuarios
- ❌ NO puede acceder a proveedores
- ❌ NO puede acceder a usuarios

### Por Pantalla

| Pantalla | Admin | Empleado |
|----------|-------|----------|
| Dashboard | ✅ | ✅ |
| Productos | ✅ (CRUD) | ✅ (Lectura) |
| Pedidos | ✅ (Todo) | ✅ (Crear, actualizar) |
| Clientes | ✅ (CRUD) | ✅ (Crear, consultar) |
| Proveedores | ✅ (CRUD) | ❌ |
| Usuarios | ✅ (Gestionar) | ❌ |

---

## FLUJO DE STOCK AUTOMÁTICO

**Cuando se registra un pedido**:

1. Sistema recibe detalles del pedido
2. Para cada producto en el pedido:
   ```
   stock_nuevo = stock_actual - cantidad_pedida
   ```
3. Sistema actualiza en BD automáticamente
4. Si stock sería negativo → Rechaza pedido con error
5. Si stock es válido → Descuenta y crea pedido

**Ejemplo**:
- Producto: Cheesecake
- Stock actual: 5
- Cantidad pedida: 2
- Stock después: 5 - 2 = 3

---

## VALIDACIONES GLOBALES

### Campos Obligatorios por Módulo

**Productos**:
- Nombre ✓
- Precio ✓
- Stock ✓

**Pedidos**:
- Cliente ✓
- Tipo de pedido ✓
- Método de pago ✓
- Al menos 1 producto ✓

**Clientes**:
- Nombre ✓

**Proveedores**:
- Nombre ✓

---

## MENSAJES DE ERROR

El sistema muestra errores claros en español:

- "Por favor completa todos los campos requeridos"
- "Precio debe ser mayor o igual a 0"
- "No hay stock suficiente para este producto"
- "Credenciales inválidas"
- "Cliente no encontrado"
- "Error al guardar. Por favor intenta de nuevo"

---

## CONCLUSIÓN

Estas narrativas definen claramente cómo el usuario interactúa con cada caso de uso del sistema, manteniendo el lenguaje entendible para el cliente y especificando los requisitos técnicos para el desarrollador.
