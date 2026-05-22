
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS categorias_productos (
    id_categoria UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    nombre_categoria VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS clientes (
    id_cliente UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    nombre VARCHAR(70) NOT NULL,

    telefono VARCHAR(30),

    correo VARCHAR(90),

    direccion VARCHAR(200),

    created_at TIMESTAMP DEFAULT now()
);


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


CREATE TABLE IF NOT EXISTS proveedores (
    id_proveedor UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    nombre VARCHAR(70) NOT NULL,

    telefono VARCHAR(30),

    contacto VARCHAR(90),

    descripcion VARCHAR(200)
);


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


INSERT INTO categorias_productos (id_categoria, nombre_categoria) VALUES
('a1000000-0000-0000-0000-000000000001', 'Panes'),
('a1000000-0000-0000-0000-000000000002', 'Pasteles'),
('a1000000-0000-0000-0000-000000000003', 'Repostería'),
('a1000000-0000-0000-0000-000000000004', 'Bebidas'),
('a1000000-0000-0000-0000-000000000005', 'Galletas'),
('a1000000-0000-0000-0000-000000000006', 'Salados');


INSERT INTO proveedores (id_proveedor, nombre, telefono, contacto, descripcion) VALUES
('b2000000-0000-0000-0000-000000000001', 'Harina del Sur S.A.', '555-0101', 'Carlos Mendoza', 'Proveedor principal de harinas y mezclas'),
('b2000000-0000-0000-0000-000000000002', 'Distribuidora La Moderna', '555-0102', 'María López', 'Distribuidora de insumos de repostería'),
('b2000000-0000-0000-0000-000000000003', 'Lácteos San José', '555-0103', 'Pedro Ramírez', 'Productos lácteos y cremas'),
('b2000000-0000-0000-0000-000000000004', 'Frutas y Más', '555-0104', 'Lucía Fernández', 'Frutas frescas y congeladas'),
('b2000000-0000-0000-0000-000000000005', 'Empaques del Centro', '555-0105', 'Jorge Castillo', 'Empaques y envolturas para panadería');

INSERT INTO clientes (id_cliente, nombre, telefono, correo, direccion) VALUES
('c3000000-0000-0000-0000-000000000001', 'Ana García', '555-1001', 'ana.garcia@email.com', 'Calle Real 123, Colonia Centro'),
('c3000000-0000-0000-0000-000000000002', 'Roberto Martínez', '555-1002', 'roberto.mtz@email.com', 'Av. Principal 456, Colonia Norte'),
('c3000000-0000-0000-0000-000000000003', 'Carmen Hernández', '555-1003', 'carmen.hernandez@email.com', 'Callejón del Río 789, Colonia Sur'),
('c3000000-0000-0000-0000-000000000004', 'José López', '555-1004', 'jose.lopez@email.com', 'Blvd. Independencia 321, Colonia Oeste'),
('c3000000-0000-0000-0000-000000000005', 'Laura Sánchez', '555-1005', 'laura.sanchez@email.com', 'Calle 5 de Mayo 654, Colonia Oriente'),
('c3000000-0000-0000-0000-000000000006', 'Miguel Torres', '555-1006', 'miguel.torres@email.com', 'Av. Reforma 987, Colonia Centro'),
('c3000000-0000-0000-0000-000000000007', 'Sofía Ramírez', '555-1007', 'sofia.ramirez@email.com', 'Calle Hidalgo 147, Colonia Norte'),
('c3000000-0000-0000-0000-000000000008', 'Diego Flores', '555-1008', 'diego.flores@email.com', 'Av. Juárez 258, Colonia Sur'),
('c3000000-0000-0000-0000-000000000009', 'Valentina Díaz', '555-1009', 'valentina.diaz@email.com', 'Calle Zaragoza 369, Colonia Oeste'),
('c3000000-0000-0000-0000-000000000010', 'Andrés Vega', '555-1010', 'andres.vega@email.com', 'Blvd. Forjadores 741, Colonia Oriente');

INSERT INTO productos (id_producto, id_categoria, id_proveedor, nombre, descripcion, precio, stock_disponible, tipo_origen, es_personalizable, activo) VALUES
('d4000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', NULL, 'Pan Bolillo', 'Pan salado crujiente, pieza individual', 3.50, 200, 'interno', false, true),
('d4000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', NULL, 'Pan Telera', 'Pan suave para tortas, pieza individual', 4.00, 150, 'interno', false, true),
('d4000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', NULL, 'Concha de Vainilla', 'Pan dulce con cubierta de vainilla', 7.00, 80, 'interno', false, true),
('d4000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', NULL, 'Concha de Chocolate', 'Pan dulce con cubierta de chocolate', 7.50, 75, 'interno', false, true),
('d4000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000001', NULL, 'Oreja de Mantequilla', 'Hojaldre dulce espolvoreado con azúcar', 8.00, 60, 'interno', false, true),
('d4000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000002', NULL, 'Pastel de Chocolate', 'Pastel de chocolate con relleno de crema', 250.00, 10, 'interno', true, true),
('d4000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000002', NULL, 'Pastel de Tres Leches', 'Pastel húmedo bañado en tres leches', 280.00, 8, 'interno', true, true),
('d4000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000002', NULL, 'Pastel de Fresa', 'Pastel con fresas naturales y crema', 300.00, 5, 'interno', true, true),
('d4000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000003', NULL, 'Flan Napolitano', 'Flan cremoso con caramelo', 22.00, 30, 'interno', false, true),
('d4000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000003', NULL, 'Carlota de Limón', 'Postre frío de limón con galleta', 20.00, 25, 'interno', false, true),
('d4000000-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000003', NULL, 'Churros Rellenos', 'Churros rellenos de cajeta (6 pzas)', 35.00, 20, 'interno', false, true),
('d4000000-0000-0000-0000-000000000012', 'a1000000-0000-0000-0000-000000000004', 'b2000000-0000-0000-0000-000000000004', 'Jugo de Naranja Natural', 'Jugo de naranja recién exprimido 500ml', 25.00, 40, 'proveedor', false, true),
('d4000000-0000-0000-0000-000000000013', 'a1000000-0000-0000-0000-000000000004', 'b2000000-0000-0000-0000-000000000004', 'Agua de Horchata', 'Agua fresca de horchata 500ml', 18.00, 50, 'proveedor', false, true),
('d4000000-0000-0000-0000-000000000014', 'a1000000-0000-0000-0000-000000000004', 'b2000000-0000-0000-0000-000000000004', 'Café Americano', 'Café americano tradicional 300ml', 20.00, 60, 'proveedor', false, true),
('d4000000-0000-0000-0000-000000000015', 'a1000000-0000-0000-0000-000000000005', NULL, 'Polvorones', 'Galletas de mantequilla espolvoreadas con azúcar (200g)', 25.00, 45, 'interno', false, true),
('d4000000-0000-0000-0000-000000000016', 'a1000000-0000-0000-0000-000000000005', NULL, 'Galletas de Avena', 'Galletas de avena con pasas (200g)', 22.00, 35, 'interno', false, true),
('d4000000-0000-0000-0000-000000000017', 'a1000000-0000-0000-0000-000000000005', NULL, 'Mantecadas', 'Panqué individual esponjoso de vainilla', 10.00, 55, 'interno', false, true),
('d4000000-0000-0000-0000-000000000018', 'a1000000-0000-0000-0000-000000000006', NULL, 'Empanada de Carne', 'Empanada rellena de carne sazonada', 15.00, 30, 'interno', false, true),
('d4000000-0000-0000-0000-000000000019', 'a1000000-0000-0000-0000-000000000006', NULL, 'Pizza congelada', 'Pizza vegetal congelada 400g (proveedor)', 85.00, 20, 'proveedor', false, true),
('d4000000-0000-0000-0000-000000000020', 'a1000000-0000-0000-0000-000000000006', NULL, 'Croissant de Jamón y Queso', 'Croissant horneado relleno de jamón y queso', 22.00, 25, 'interno', false, true);

INSERT INTO pedidos (id_pedido, id_cliente, tipo_pedido, estado_pedido, metodo_pago, fecha_pedido, fecha_entrega, total, observaciones) VALUES
('e5000000-0000-0000-0000-000000000001', 'c3000000-0000-0000-0000-000000000001', 'Mostrador', 'Entregado', 'Efectivo', '2026-05-01 09:30:00', '2026-05-01', 87.00, 'Cliente llevó sus propias bolsas'),
('e5000000-0000-0000-0000-000000000002', 'c3000000-0000-0000-0000-000000000002', 'Encargo', 'Entregado', 'Transferencia', '2026-05-02 14:00:00', '2026-05-05', 280.00, 'Pastel para cumpleaños infantil'),
('e5000000-0000-0000-0000-000000000003', 'c3000000-0000-0000-0000-000000000003', 'Domicilio', 'Preparando', 'Tarjeta', '2026-05-10 11:00:00', '2026-05-10', 145.50, 'Entregar en recepción del edificio'),
('e5000000-0000-0000-0000-000000000004', 'c3000000-0000-0000-0000-000000000004', 'Mostrador', 'Pendiente', 'Efectivo', '2026-05-12 10:15:00', '2026-05-12', 35.00, 'Sin observaciones'),
('e5000000-0000-0000-0000-000000000005', 'c3000000-0000-0000-0000-000000000005', 'Encargo', 'Entregado', 'Transferencia', '2026-05-08 16:30:00', '2026-05-10', 520.00, 'Pastel de boda - 3 niveles'),
('e5000000-0000-0000-0000-000000000006', 'c3000000-0000-0000-0000-000000000006', 'Domicilio', 'Cancelado', 'Tarjeta', '2026-05-11 08:00:00', '2026-05-11', 75.00, 'Cliente canceló por cambio de planes'),
('e5000000-0000-0000-0000-000000000007', 'c3000000-0000-0000-0000-000000000007', 'Mostrador', 'Entregado', 'Efectivo', '2026-05-03 12:00:00', '2026-05-03', 44.00, ''),
('e5000000-0000-0000-0000-000000000008', 'c3000000-0000-0000-0000-000000000008', 'Encargo', 'Preparando', 'Transferencia', '2026-05-13 15:00:00', '2026-05-16', 320.00, 'Pastel personalizado con nombre "Diego"'),
('e5000000-0000-0000-0000-000000000009', 'c3000000-0000-0000-0000-000000000009', 'Domicilio', 'Pendiente', 'Efectivo', '2026-05-14 10:00:00', '2026-05-14', 132.00, 'Llamar al llegar al domicilio'),
('e5000000-0000-0000-0000-000000000010', 'c3000000-0000-0000-0000-000000000010', 'Mostrador', 'Entregado', 'Tarjeta', '2026-05-06 11:30:00', '2026-05-06', 98.50, 'Cliente frecuente');

INSERT INTO detalles_pedido (id_detalle, id_pedido, id_producto, cantidad, precio_unitario, subtotal, observaciones) VALUES
('f6000000-0000-0000-0000-000000000001', 'e5000000-0000-0000-0000-000000000001', 'd4000000-0000-0000-0000-000000000001', 10, 3.50, 35.00, NULL),
('f6000000-0000-0000-0000-000000000002', 'e5000000-0000-0000-0000-000000000001', 'd4000000-0000-0000-0000-000000000003', 4, 7.00, 28.00, NULL),
('f6000000-0000-0000-0000-000000000003', 'e5000000-0000-0000-0000-000000000001', 'd4000000-0000-0000-0000-000000000014', 3, 20.00, 60.00, 'Café para llevar'),
('f6000000-0000-0000-0000-000000000004', 'e5000000-0000-0000-0000-000000000002', 'd4000000-0000-0000-0000-000000000007', 1, 280.00, 280.00, 'Escribir "Feliz cumpleaños Roberto"'),
('f6000000-0000-0000-0000-000000000005', 'e5000000-0000-0000-0000-000000000003', 'd4000000-0000-0000-0000-000000000009', 3, 22.00, 66.00, NULL),
('f6000000-0000-0000-0000-000000000006', 'e5000000-0000-0000-0000-000000000003', 'd4000000-0000-0000-0000-000000000014', 2, 20.00, 40.00, NULL),
('f6000000-0000-0000-0000-000000000007', 'e5000000-0000-0000-0000-000000000003', 'd4000000-0000-0000-0000-000000000020', 1, 22.00, 22.00, NULL),
('f6000000-0000-0000-0000-000000000008', 'e5000000-0000-0000-0000-000000000004', 'd4000000-0000-0000-0000-000000000001', 5, 3.50, 17.50, NULL),
('f6000000-0000-0000-0000-000000000009', 'e5000000-0000-0000-0000-000000000004', 'd4000000-0000-0000-0000-000000000018', 1, 15.00, 15.00, NULL),
('f6000000-0000-0000-0000-000000000010', 'e5000000-0000-0000-0000-000000000005', 'd4000000-0000-0000-0000-000000000006', 1, 250.00, 250.00, 'Pastel de bodas - decoración floral blanca'),
('f6000000-0000-0000-0000-000000000011', 'e5000000-0000-0000-0000-000000000005', 'd4000000-0000-0000-0000-000000000010', 8, 20.00, 160.00, NULL),
('f6000000-0000-0000-0000-000000000012', 'e5000000-0000-0000-0000-000000000006', 'd4000000-0000-0000-0000-000000000020', 3, 22.00, 66.00, NULL),
('f6000000-0000-0000-0000-000000000013', 'e5000000-0000-0000-0000-000000000007', 'd4000000-0000-0000-0000-000000000004', 2, 7.50, 15.00, NULL),
('f6000000-0000-0000-0000-000000000014', 'e5000000-0000-0000-0000-000000000007', 'd4000000-0000-0000-0000-000000000017', 3, 10.00, 30.00, NULL),
('f6000000-0000-0000-0000-000000000015', 'e5000000-0000-0000-0000-000000000009', 'd4000000-0000-0000-0000-000000000011', 2, 35.00, 70.00, NULL);
