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

-- Función que se ejecuta al registrar un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.perfiles (user_id, nombre, rol, activo)
    VALUES (
        NEW.id, 
        COALESCE(NEW.raw_user_meta_data->>'nombre', 'Nuevo Empleado'),
        'empleado', -- Rol por defecto
        true
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que activa la función anterior
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();