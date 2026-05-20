# 🚀 GUÍA DE EJECUCIÓN Y PRUEBA - FerchasBakery

## Inicio Rápido

### 1. Instalar Dependencias
```bash
cd FerchasBakery
pnpm install
```

### 2. Iniciar Servidor de Desarrollo
```bash
pnpm run dev
```

El servidor iniciará en: `http://localhost:5173`

### 3. Acceder a la Aplicación
```
URL: http://localhost:5173
```

## Credenciales de Prueba

### Usuario Admin
- **Correo**: admin@ejemplo.com
- **Contraseña**: password123
- **Rol**: admin (acceso completo)

### Usuario Empleado
- **Correo**: empleado@ejemplo.com
- **Contraseña**: password123
- **Rol**: empleado (acceso limitado)

## Flujo de Prueba Recomendado

### 1️⃣ Autenticación
1. Ir a `http://localhost:5173/login`
2. Ingresar correo y contraseña de admin
3. Verificar redirección a Dashboard

### 2️⃣ Explorar Dashboard
1. Ver tarjetas con resumen del día
2. Verificar que muestra:
   - Ventas del día ($0 inicialmente)
   - Pedidos pendientes (0 inicialmente)
   - Stock bajo (0 inicialmente)
   - Total de clientes

### 3️⃣ Crear Productos
1. Hacer clic en "🧁 Productos" en barra lateral
2. Hacer clic en "+ Nuevo Producto"
3. Ingresa:
   - Nombre: "Cheesecake Artesanal"
   - Descripción: "Cheesecake hecho con amor"
   - Precio: 45000
   - Stock: 10
4. Hacer clic en "Guardar"
5. Verificar que aparece en lista
6. Repetir con más productos:
   - "Cupcakes de Vainilla" - $8000 - Stock: 20
   - "Tres Leches" - $35000 - Stock: 5

### 4️⃣ Crear Clientes
1. Hacer clic en "👥 Clientes"
2. Hacer clic en "+ Nuevo Cliente"
3. Ingresa:
   - Nombre: "Maria García"
   - Teléfono: "3001234567"
   - Correo: "maria@ejemplo.com"
   - Dirección: "Calle 5 #123"
4. Hacer clic en "Guardar"
5. Repetir con más clientes:
   - "Juan López" - "3109876543"
   - "Ana Martínez" - "3211234567"

### 5️⃣ Registrar Pedidos
1. Hacer clic en "📦 Pedidos"
2. Hacer clic en "+ Nuevo Pedido"
3. Ingresa:
   - Cliente: "Maria García"
   - Tipo: "Mostrador"
   - Método Pago: "Efectivo"
   - Total: $45000
4. Hacer clic en "Registrar Pedido"
5. Verificar confirmación

### 6️⃣ Verificar Descuento de Stock
1. Ir a "🧁 Productos"
2. Verificar que el stock de "Cheesecake" cambió de 10 a 9
3. ✅ Stock automático funcionando

### 7️⃣ Actualizar Estado de Pedido
1. Ir a "📦 Pedidos"
2. Hacer clic en un pedido "Pendiente"
3. Ver botones de filtro
4. Hacer clic en "Preparando"
5. Verificar que el pedido se movió a esa categoría

### 8️⃣ Probar Restricciones de Empleado
1. Cerrar sesión (botón en encabezado)
2. Login con credenciales de empleado
3. Verificar que:
   - ✅ Ve Dashboard
   - ✅ Ve Productos (solo lectura)
   - ✅ Puede registrar Pedidos
   - ✅ Ve Clientes
   - ❌ NO ve "🚚 Proveedores"
   - ❌ NO ve "👨‍💼 Usuarios"
   - ❌ Botones "Editar" y "Eliminar" NO aparecen en productos

### 9️⃣ Probar Búsqueda y Filtros
1. En Clientes, escribir "maria" en busqueda
2. Verificar que solo muestra "Maria García"
3. En Pedidos, hacer clic en "Entregados"
4. Verificar filtrado correcto

### 🔟 Ver Alertas de Stock Bajo
1. Dashboard mostrará productos con stock < 10
2. Crear pedido grande para que algún producto quede con stock bajo
3. Verificar que aparece en sección "⚠️ Productos con Stock Bajo"

## Validaciones a Probar

### Validación de Campos Obligatorios
✅ Intentar crear producto sin nombre → Error
✅ Intentar crear cliente sin nombre → Error
✅ Intentar registrar pedido sin cliente → Error

### Validación de Datos
✅ Intentar precio negativo → Error
✅ Intentar cantidad 0 en pedido → Error
✅ Correo sin @ → Error de validación

### Validación de Stock
✅ Intentar comprar más stock que disponible → Error
✅ Comprar exactamente el stock disponible → OK
✅ Stock descuenta correctamente

## Estructura de Base de Datos

Las tablas se crearán automáticamente desde `script.sql`:

```
categorias_productos    - Categorías de productos
clientes               - Información de clientes
perfiles               - Roles de usuarios (admin/empleado)
proveedores            - Datos de proveedores
productos              - Catálogo de productos
pedidos                - Órdenes registradas
detalles_pedido        - Líneas de cada orden
```

## Comandos Útiles

```bash
# Instalar dependencias
pnpm install

# Iniciar dev server
pnpm run dev

# Compilar para producción
pnpm run build

# Vista previa de compilación
pnpm run preview

# Ver lista de dependencias
pnpm list
```

## Resolución de Problemas

### "Error: Cannot find module '@insforge/sdk'"
```bash
pnpm install @insforge/sdk@latest
```

### "Puerto 5173 ya está en uso"
```bash
pnpm run dev -- --port 3000  # Usar otro puerto
```

### "Error de autenticación"
- Verificar que las credenciales son correctas
- Verificar conexión a internet
- Verificar que Insforge está disponible

### "No aparecen los datos"
- Recargar página (F5)
- Verificar console (F12 → Console)
- Verificar que tienes conexión a internet

## Archivos Clave a Revisar

### Autenticación
- `src/services/servicioAutenticacion.js` - Métodos de login/logout
- `src/stores/almacenAutenticacion.js` - Estado global de auth

### Servicios de API
- `src/services/servicioPedidos.js` - Lógica de descuento de stock (línea ~85)
- `src/services/servicioProductos.js` - Actualización de stock

### Vistas
- `src/views/LoginView.vue` - Pantalla de login
- `src/views/DashboardView.vue` - Resumen del negocio
- `src/views/PedidosView.vue` - Gestión de pedidos

### Configuración
- `tailwind.config.js` - Colores personalizados
- `vite.config.js` - Configuración de Vite

## Características Implementadas

✅ Autenticación con email/contraseña
✅ Dashboard con resumen de ventas
✅ CRUD de productos
✅ CRUD de pedidos
✅ CRUD de clientes
✅ CRUD de proveedores (admin only)
✅ Gestión de usuarios y roles (admin only)
✅ Descuento automático de stock al registrar pedido
✅ Búsqueda y filtrado
✅ Validaciones de formularios
✅ Control de acceso por rol
✅ Diseño artesanal con colores del logo
✅ Responsivo

## Próximas Funcionalidades (Futuro)

🔄 Reportes PDF
📈 Gráficos de ventas
🔔 Notificaciones en tiempo real
📱 Aplicación móvil
💾 Backup automático
🌙 Modo oscuro

## Notas Importantes

1. **Stock Automático**: Cuando se registra un pedido, el stock se descuenta AUTOMÁTICAMENTE
2. **Roles**: Los permisos se aplican inmediatamente
3. **Sesión**: Se mantiene en localStorage (perderá datos al borrar cache)
4. **Validaciones**: Todos los campos críticos están validados
5. **Errores**: Se muestran mensajes claros en español

## Contacto y Soporte

En caso de problemas:
1. Revisar console del navegador (F12)
2. Verificar conexión a Insforge
3. Verificar que los datos están correctos
4. Consultar README.md para más información

---

**¡Listo para empezar!** 🎉

Sigue los pasos de prueba y verifica que todas las funcionalidades funcionen correctamente.
