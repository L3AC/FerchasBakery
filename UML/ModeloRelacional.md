erDiagram
    auth_users ||--|| perfiles : "1:1"
    
    categorias_productos ||--o{ productos : "1:N"
    proveedores ||--o{ productos : "1:N"
    clientes ||--o{ pedidos : "1:N"
    perfiles ||--o{ pedidos : "1:N"
    pedidos ||--o{ detalles_pedido : "1:N"
    productos ||--o{ detalles_pedido : "1:N"
    auth_users {
        uuid id PK
    }
    categorias_productos {
        uuid id_categoria PK
        varchar nombre_categoria
    }
    clientes {
        uuid id_cliente PK
        varchar nombre
        varchar telefono
        varchar correo
        varchar direccion
        timestamp created_at
    }
    perfiles {
        uuid user_id PK
        varchar nombre
        varchar rol
        boolean activo
        timestamp created_at
    }
    proveedores {
        uuid id_proveedor PK
        varchar nombre
        varchar telefono
        varchar contacto
        varchar descripcion
    }
    productos {
        uuid id_producto PK
        uuid id_categoria FK
        uuid id_proveedor FK
        varchar nombre
        varchar descripcion
        numeric precio
        integer stock_disponible
        varchar tipo_origen
        boolean es_personalizable
        boolean activo
        timestamp created_at
    }
    pedidos {
        uuid id_pedido PK
        uuid id_cliente FK
        uuid user_id FK
        varchar tipo_pedido
        varchar estado_pedido
        varchar metodo_pago
        timestamp fecha_pedido
        date fecha_entrega
        numeric total
        text observaciones
        timestamp created_at
    }
    detalles_pedido {
        uuid id_detalle PK
        uuid id_pedido FK
        uuid id_producto FK
        integer cantidad
        numeric precio_unitario
        numeric subtotal
        text observaciones
    }