# FerchasBakery - Contexto Completo del Proyecto

# Descripción General

FerchasBakery es una pequeña repostería artesanal/cafetería que actualmente administra:

- ventas,
- pedidos,
- clientes,
- productos,
- y control operativo

mediante procesos manuales y registros en papel.

El objetivo del proyecto es desarrollar un sistema web administrativo interno que permita:

- registrar ventas,
- controlar productos disponibles,
- administrar pedidos,
- consultar historial de clientes,
- y mejorar la organización del negocio.

---

# Contexto Real del Negocio

El negocio funciona principalmente mediante:

- pedidos presenciales,
- WhatsApp,
- Instagram,
- y atención directa en la repostería.

NO existirá:

- ecommerce,
- carrito de compras,
- panel para clientes,
- pagos online,
- delivery tracking.

El sistema será utilizado únicamente por:

- la dueña,
- y empleados internos.

---

# Tipos de Productos

FerchasBakery maneja dos tipos de productos:

## 1. Productos internos

Productos hechos artesanalmente dentro de la repostería.

Ejemplos:

- Cheesecake
- Tres leches
- Cupcakes
- Pasteles personalizados
- Tartaletas

Estos productos NO dependen directamente de proveedores.

---

## 2. Productos externos

Productos comprados a proveedores para reventa.

Ejemplos:

- sodas,
- jugos,
- algunos panes,
- snacks,
- café empaquetado.

Estos productos SÍ tienen proveedor.

---

# Decisión de Diseño Importante

El sistema NO manejará inventario industrial de materias primas.

NO se controlará:

- harina,
- huevos,
- azúcar,
- leche,
- mantequilla.

Porque:

- el negocio es pequeño,
- el proyecto académico no requiere producción industrial,
- el objetivo principal es el control de ventas y pedidos,
- el sistema debe mantenerse simple y fácil de usar.

El inventario se manejará únicamente a nivel de productos terminados.

Ejemplo:

- Cheesecake → stock disponible: 5
- Cupcakes → stock disponible: 12
- Coca Cola → stock disponible: 20

---

# Tecnologías del Proyecto

## Backend

- Insforge (Backend as a Service)
- PostgreSQL
- API REST
- Autenticación integrada

## Frontend

- Vue.js
- Vite

## Arquitectura

- MVC
- SPA (Single Page Application)

---

# Roles del Sistema

# 1. Dueño (Admin)

Acceso completo al sistema.

## Funciones:

- gestionar empleados,
- gestionar productos,
- gestionar pedidos,
- gestionar clientes,
- gestionar proveedores,
- modificar stock,
- ver reportes,
- ver ventas.

---

# 2. Empleado

Acceso operativo.

## Funciones:

- registrar ventas,
- registrar pedidos,
- consultar productos,
- consultar clientes,
- actualizar estados básicos de pedidos.

## Restricciones:

- no administra usuarios,
- no elimina información crítica,
- no accede a configuraciones administrativas.

---

# Arquitectura MVC

# Model

Responsable de:

- conexión con Insforge,
- consultas a PostgreSQL,
- validaciones básicas,
- entidades del sistema.

## Entidades principales

- usuarios
- clientes
- categorias_productos
- proveedores
- productos
- pedidos
- detalles_pedido

---

# View

Interfaz desarrollada con Vue.js.

## Pantallas principales

- Login
- Dashboard
- Productos
- Pedidos
- Clientes
- Proveedores
- Reportes

---

# Controller

Responsable de:

- autenticación,
- lógica de negocio,
- control de stock,
- validaciones,
- comunicación frontend/backend.

Ejemplos:

- registrar pedido,
- calcular total,
- descontar stock,
- actualizar estado.

---

# Flujo Principal del Sistema

# Flujo de venta

1. Empleado inicia sesión
2. Registra pedido
3. Selecciona cliente
4. Agrega productos
5. Sistema calcula total
6. Sistema descuenta stock
7. Pedido queda registrado

---

# Flujo de pedidos especiales

1. Cliente solicita pedido
2. Empleado registra pedido
3. Se asigna fecha de entrega
4. Estado inicial:

```txt
Pendiente
```

5. Estado intermedio:

```txt
Preparando
```

6. Estado final:

```txt
Entregado
```

---

# Módulos del Sistema

# 1. Autenticación

## Funciones

- login
- logout
- control de roles
- persistencia de sesión

---

# 2. Dashboard

## Mostrar:

- ventas del día,
- pedidos pendientes,
- productos bajos en stock,
- pedidos recientes.

---

# 3. Productos

## Funciones:

- crear productos,
- editar productos,
- actualizar stock,
- listar productos,
- filtrar productos.

---

# 4. Clientes

## Funciones:

- registrar clientes,
- editar clientes,
- consultar historial,
- buscar clientes.

---

# 5. Pedidos

## Funciones:

- registrar pedidos,
- agregar productos,
- calcular subtotal,
- calcular total,
- actualizar estados,
- consultar pedidos.

---

# 6. Proveedores

## Funciones:

- registrar proveedores,
- consultar proveedores,
- editar proveedores.

---

# Estructura Recomendada del Proyecto

```txt
src/
│
├── components/
│   ├── dashboard/
│   ├── productos/
│   ├── pedidos/
│   ├── clientes/
│   └── shared/
│
├── views/
│   ├── LoginView.vue
│   ├── DashboardView.vue
│   ├── ProductosView.vue
│   ├── PedidosView.vue
│   ├── ClientesView.vue
│   └── ReportesView.vue
│
├── router/
│   └── index.js
│
├── services/
│   ├── authService.js
│   ├── productoService.js
│   ├── pedidoService.js
│   ├── clienteService.js
│   └── proveedorService.js
│
├── stores/
│   └── authStore.js
│
├── middleware/
│   └── authMiddleware.js
│
├── layouts/
│   └── AdminLayout.vue
│
└── main.js
```

---

# Base de Datos Final

# Script SQL

-- ============================================
-- FERCHASBAKERY - INSFORGE DATABASE
-- PostgreSQL Compatible
-- ============================================

-- EXTENSION UUID
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- TABLA: categorias_productos
-- ============================================

CREATE TABLE IF NOT EXISTS categorias_productos (
    id_categoria UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    nombre_categoria VARCHAR(50) NOT NULL UNIQUE
);

-- ============================================
-- TABLA: clientes
-- ============================================

CREATE TABLE IF NOT EXISTS clientes (
    id_cliente UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    nombre VARCHAR(70) NOT NULL,

    telefono VARCHAR(30),

    correo VARCHAR(90),

    direccion VARCHAR(200),

    created_at TIMESTAMP DEFAULT now()
);

-- ============================================
-- TABLA: perfiles
-- Relacionada con auth.users
-- ============================================

CREATE TABLE IF NOT EXISTS perfiles (
    user_id UUID PRIMARY KEY
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    nombre VARCHAR(70) NOT NULL,

    rol VARCHAR(15) NOT NULL
        CHECK (rol IN ('admin', 'empleado')),

    activo BOOLEAN DEFAULT true,

    created_at TIMESTAMP DEFAULT now()
);

-- ============================================
-- TABLA: proveedores
-- ============================================

CREATE TABLE IF NOT EXISTS proveedores (
    id_proveedor UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    nombre VARCHAR(70) NOT NULL,

    telefono VARCHAR(30),

    contacto VARCHAR(90),

    descripcion VARCHAR(200)
);

-- ============================================
-- TABLA: productos
-- ============================================

CREATE TABLE IF NOT EXISTS productos (
    id_producto UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    id_categoria UUID
        REFERENCES categorias_productos(id_categoria)
        ON DELETE SET NULL,

    id_proveedor UUID NULL
        REFERENCES proveedores(id_proveedor)
        ON DELETE SET NULL,

    nombre VARCHAR(70) NOT NULL,

    descripcion VARCHAR(250),

    precio NUMERIC(10,2) NOT NULL
        CHECK (precio >= 0),

    stock_disponible INTEGER NOT NULL DEFAULT 0
        CHECK (stock_disponible >= 0),

    tipo_origen VARCHAR(20) NOT NULL
        CHECK (
            tipo_origen IN (
                'interno',
                'proveedor'
            )
        ),

    es_personalizable BOOLEAN DEFAULT false,

    activo BOOLEAN DEFAULT true,

    created_at TIMESTAMP DEFAULT now()
);

-- ============================================
-- TABLA: pedidos
-- ============================================

CREATE TABLE IF NOT EXISTS pedidos (
    id_pedido UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    id_cliente UUID
        REFERENCES clientes(id_cliente)
        ON DELETE SET NULL,

    user_id UUID
        REFERENCES perfiles(user_id)
        ON DELETE SET NULL,

    tipo_pedido VARCHAR(20) NOT NULL
        CHECK (
            tipo_pedido IN (
                'Mostrador',
                'Encargo',
                'Domicilio'
            )
        ),

    estado_pedido VARCHAR(20) NOT NULL DEFAULT 'Pendiente'
        CHECK (
            estado_pedido IN (
                'Pendiente',
                'Preparando',
                'Entregado',
                'Cancelado'
            )
        ),

    metodo_pago VARCHAR(30)
        CHECK (
            metodo_pago IN (
                'Efectivo',
                'Transferencia',
                'Tarjeta'
            )
        ),

    fecha_pedido TIMESTAMP DEFAULT now(),

    fecha_entrega DATE,

    total NUMERIC(10,2) NOT NULL
        CHECK (total >= 0),

    observaciones TEXT,

    created_at TIMESTAMP DEFAULT now()
);

-- ============================================
-- TABLA: detalles_pedido
-- ============================================

CREATE TABLE IF NOT EXISTS detalles_pedido (
    id_detalle UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    id_pedido UUID NOT NULL
        REFERENCES pedidos(id_pedido)
        ON DELETE CASCADE,

    id_producto UUID
        REFERENCES productos(id_producto)
        ON DELETE SET NULL,

    cantidad INTEGER NOT NULL
        CHECK (cantidad > 0),

    precio_unitario NUMERIC(10,2) NOT NULL
        CHECK (precio_unitario >= 0),

    subtotal NUMERIC(10,2) NOT NULL
        CHECK (subtotal >= 0),

    observaciones TEXT
);

-- ============================================
-- ÍNDICES RECOMENDADOS
-- ============================================

CREATE INDEX IF NOT EXISTS idx_productos_categoria
ON productos(id_categoria);

CREATE INDEX IF NOT EXISTS idx_productos_proveedor
ON productos(id_proveedor);

CREATE INDEX IF NOT EXISTS idx_pedidos_cliente
ON pedidos(id_cliente);

CREATE INDEX IF NOT EXISTS idx_pedidos_usuario
ON pedidos(user_id);

CREATE INDEX IF NOT EXISTS idx_detalles_pedido
ON detalles_pedido(id_pedido);

CREATE INDEX IF NOT EXISTS idx_detalles_producto
ON detalles_pedido(id_producto);

-- ============================================
-- COMENTARIOS IMPORTANTES
-- ============================================

-- Productos internos:
-- tipo_origen = 'interno'
-- id_proveedor = NULL

-- Productos externos:
-- tipo_origen = 'proveedor'
-- id_proveedor = UUID válido

-- La tabla perfiles está vinculada
-- directamente con auth.users de Insforge.

-- Los usuarios se crean desde el sistema
-- de autenticación de Insforge.

-- Roles disponibles:
-- admin
-- empleado
```

---

# Objetivo Final del Proyecto

Desarrollar un sistema administrativo simple, funcional y fácil de usar que permita a FerchasBakery mejorar el control de:

- ventas,
- pedidos,
- clientes,
- productos,
- y stock básico,

mediante una plataforma moderna basada en Insforge y Vue.js.

