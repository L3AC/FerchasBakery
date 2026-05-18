# FerchasBakery - Flujo, Navegación y Arquitectura del Sistema

# Contexto General

FerchasBakery es una pequeña repostería/cafetería que necesita un sistema administrativo interno para gestionar:

- ventas,
- pedidos,
- productos,
- clientes,
- y control básico de stock.

El sistema será utilizado únicamente por:

- la dueña (admin),
- y empleados.

NO existirá:

- panel para clientes,
- ecommerce,
- pagos online,
- delivery tracking,
- control industrial de producción.

Los pedidos continuarán llegando principalmente por:

- WhatsApp,
- Instagram,
- atención presencial.

---

# Objetivo del Sistema

Digitalizar y simplificar la administración interna del negocio.

El sistema debe ser:

- rápido,
- simple,
- fácil de usar,
- intuitivo,
- y optimizado para registrar ventas rápidamente.

---

# Tecnologías del Proyecto

## Frontend
- Vue.js
- Vite

## Backend
- Insforge (alternativa de Supabase)

## Base de Datos
- PostgreSQL

## Arquitectura
- MVC
- SPA (Single Page Application)

---

# Roles del Sistema

## 1. Admin (Dueña)

Acceso completo al sistema.

### Puede:
- gestionar productos,
- gestionar categorías,
- gestionar clientes,
- gestionar proveedores,
- gestionar empleados,
- gestionar pedidos,
- actualizar stock,
- consultar reportes,
- consultar ventas.

---

## 2. Empleado

Acceso operativo.

### Puede:
- registrar ventas,
- registrar pedidos,
- consultar productos,
- consultar clientes,
- actualizar estados básicos de pedidos.

### No puede:
- administrar usuarios,
- eliminar información crítica,
- acceder a configuraciones administrativas.

---

# Arquitectura General MVC

## Model

Responsable de:

- conexión con Insforge,
- consultas SQL,
- manejo de entidades,
- validaciones básicas.

### Entidades principales
- perfiles
- clientes
- categorias_productos
- proveedores
- productos
- pedidos
- detalles_pedido

---

## View

Interfaz construida con Vue.js.

### Vistas principales
- LoginView
- DashboardView
- ProductosView
- PedidosView
- ClientesView
- ProveedoresView
- ReportesView

---

## Controller

Responsable de:

- lógica de negocio,
- autenticación,
- validaciones,
- control de stock,
- comunicación frontend/backend.

---

# Flujo General del Sistema

## 1. Inicio de sesión

### Flujo

1. Usuario abre el sistema
2. Ingresa correo y contraseña
3. Insforge Auth valida credenciales
4. Se obtiene el perfil del usuario
5. El sistema identifica el rol:
   - admin
   - empleado
6. Redirección al Dashboard

---

## 2. Dashboard

### Objetivo

Mostrar información rápida del negocio.

### Debe mostrar

- ventas del día,
- pedidos pendientes,
- productos bajos en stock,
- pedidos recientes,
- resumen general.

---

# Navegación Principal

## Sidebar / Menú lateral

### Opciones visibles para admin

```txt
Dashboard
Productos
Categorías
Pedidos
Clientes
Proveedores
Usuarios
Reportes
Cerrar sesión
```

---

### Opciones visibles para empleado

```txt
Dashboard
Productos
Pedidos
Clientes
Cerrar sesión
```

---

# Flujo del Módulo Productos

## Objetivo

Administrar productos vendidos por la repostería.

---

## Tipos de productos

### Productos internos

Hechos por la repostería.

Ejemplos:
- Cheesecake
- Cupcakes
- Pasteles

```txt
tipo_origen = 'interno'
id_proveedor = NULL
```

---

### Productos externos

Productos de reventa.

Ejemplos:
- sodas,
- jugos,
- snacks.

```txt
tipo_origen = 'proveedor'
id_proveedor = UUID válido
```

---

## Navegación Productos

### Lista de productos

Mostrar:
- nombre,
- categoría,
- precio,
- stock,
- tipo origen,
- estado.

---

### Acciones disponibles

#### Admin
- crear producto,
- editar producto,
- desactivar producto,
- actualizar stock.

#### Empleado
- consultar productos.

---

## Flujo crear producto

1. Usuario abre formulario
2. Ingresa:
   - nombre,
   - categoría,
   - precio,
   - stock,
   - tipo origen
3. Si:
   - tipo_origen = proveedor
   entonces seleccionar proveedor
4. Guardar producto

---

# Flujo del Módulo Pedidos

## Objetivo

Registrar ventas y pedidos especiales.

---

## Estados de pedidos

```txt
Pendiente
Preparando
Entregado
Cancelado
```

---

## Tipos de pedido

```txt
Mostrador
Encargo
Domicilio
```

---

## Flujo registrar pedido

1. Usuario abre módulo pedidos
2. Selecciona cliente
3. Agrega productos
4. Define cantidades
5. Sistema calcula:
   - subtotal,
   - total
6. Selecciona:
   - método pago,
   - tipo pedido
7. Guardar pedido
8. Sistema descuenta stock automáticamente

---

## Flujo pedidos especiales

### Ejemplo

Cliente pide pastel personalizado.

#### Flujo

1. Registrar pedido
2. Tipo:

```txt
Encargo
```

3. Estado inicial:

```txt
Pendiente
```

4. Agregar observaciones:

```txt
Pastel cumpleaños color azul
```

5. Registrar fecha entrega

6. Actualizar estados:

```txt
Pendiente → Preparando → Entregado
```

---

# Flujo del Módulo Clientes

## Objetivo

Gestionar clientes frecuentes y contactos.

---

## Funciones

- crear cliente,
- editar cliente,
- buscar cliente,
- consultar historial.

---

## Flujo registrar cliente

1. Abrir formulario
2. Ingresar:
   - nombre,
   - teléfono,
   - correo,
   - dirección
3. Guardar

---

# Flujo del Módulo Proveedores

## Objetivo

Gestionar proveedores de productos externos.

---

## Funciones

- registrar proveedor,
- editar proveedor,
- consultar proveedores.

---

## Productos que usan proveedor

Ejemplos:
- Coca Cola
- Jugos
- Snacks

---

## Productos sin proveedor

Productos artesanales internos.

---

# Flujo del Módulo Usuarios

## Solo admin

### Funciones

- visualizar empleados,
- cambiar roles,
- activar/desactivar usuarios.

---

# Flujo Técnico de Autenticación

## Insforge Auth

### Flujo

1. Usuario se registra/login mediante Insforge Auth
2. Insforge crea registro en:

```txt
auth.users
```

3. Se crea perfil asociado en:

```txt
perfiles
```

4. El sistema obtiene:
- nombre,
- rol,
- permisos.

---

# Estructura Base de Datos

## Tabla: perfiles

```txt
user_id
nombre
rol
activo
created_at
```

---

## Tabla: clientes

```txt
id_cliente
nombre
telefono
correo
direccion
created_at
```

---

## Tabla: categorias_productos

```txt
id_categoria
nombre_categoria
```

---

## Tabla: proveedores

```txt
id_proveedor
nombre
telefono
contacto
descripcion
```

---

## Tabla: productos

```txt
id_producto
id_categoria
id_proveedor NULL

nombre
descripcion
precio
stock_disponible

tipo_origen
es_personalizable

activo
created_at
```

---

## Tabla: pedidos

```txt
id_pedido
id_cliente
user_id

tipo_pedido
estado_pedido
metodo_pago

fecha_pedido
fecha_entrega

total
observaciones
created_at
```

---

## Tabla: detalles_pedido

```txt
id_detalle
id_pedido
id_producto

cantidad
precio_unitario
subtotal

observaciones
```

---

# Flujo Automático de Stock

## Cuando se registra un pedido

El sistema debe:

1. recorrer productos del pedido,
2. descontar cantidades del stock,
3. actualizar productos automáticamente.

---

## Ejemplo

Pedido:
- 2 cheesecakes

Sistema:

```txt
stock_disponible = stock_disponible - 2
```

---

# Restricciones Importantes

## El sistema NO debe incluir

- control de materias primas,
- recetas automáticas,
- producción industrial,
- ecommerce,
- clientes online,
- delivery tracking,
- procesos complejos.

---

# Objetivo Final

Crear un sistema administrativo simple, moderno y funcional que permita a FerchasBakery mejorar el control de:

- ventas,
- pedidos,
- clientes,
- productos,
- y stock básico,

mediante una interfaz rápida y fácil de usar.