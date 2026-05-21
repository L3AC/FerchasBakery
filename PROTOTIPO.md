# Prototipo FerchasBakery — Guía rápida

Este es el prototipo funcional del panel administrativo, hecho en **Vue 3 + Vite + Tailwind**.
Sirve para tomar las capturas de la sección 14.2 del segundo avance.

## Requisitos

- Node.js 18 o superior (https://nodejs.org)
- Un navegador moderno (Chrome, Firefox, Edge)

## Cómo correrlo

Desde una terminal, parado en la carpeta del proyecto:

```bash
npm install   # solo la primera vez
npm run dev
```

Abrir en el navegador la URL que muestra Vite (por defecto `http://localhost:5173`).

## Cómo iniciar sesión

El formulario de login viene pre-llenado:

- **Correo:** `re251913@ferchasbakery.com`
- **Contraseña:** cualquier valor (acepta lo que sea)

Apretar **Iniciar sesión** y entra al dashboard como administradora (Leslie Rivera).

> Nota: el login no se conecta a la base de datos real (Insforge). Funciona
> en modo prototipo con datos hardcodeados. La sesión sobrevive a refrescos
> (F5) porque se guarda en localStorage.

## Las 14 pantallas del prototipo

| # | Pantalla | Cómo llegar |
|---|---|---|
| 1 | **Login** | Pantalla inicial. Si ya iniciaste sesión, primero cerrá sesión (botón arriba a la derecha) |
| 2 | **Dashboard** | Sidebar → Dashboard. KPIs del día + productos con stock bajo + pedidos recientes |
| 3 | **Lista de productos** | Sidebar → Productos. Catálogo en grid con filtros |
| 4 | **Modal Nuevo producto** | En Productos, botón "+ Nuevo producto" |
| 5 | **Lista de pedidos** | Sidebar → Pedidos. Tabla con filtros por estado |
| 6 | **Modal Nuevo pedido** | En Pedidos, botón "+ Nuevo pedido" |
| 7 | **Modal Detalle de pedido** | En Pedidos, click en cualquier fila o en el ícono del ojo |
| 8 | **Modal Error de stock** | En Pedidos, botón "Demo: error stock" (solo visible en modo prototipo) |
| 9 | **Lista de clientes** | Sidebar → Clientes |
| 10 | **Modal Nuevo cliente** | En Clientes, botón "+ Nuevo cliente" |
| 11 | **Lista de proveedores** | Sidebar → Proveedores |
| 12 | **Modal Nuevo proveedor** | En Proveedores, botón "+ Nuevo proveedor" |
| 13 | **Gestión de usuarios** | Sidebar → Usuarios (sección Administración). Muestra los 5 integrantes del equipo |
| 14 | **Mi perfil** | Sidebar → Mi perfil |

## Tips para capturas limpias

- Resolución recomendada del navegador: **1440 × 900** o mayor
- Para que no salgan menús del navegador en las capturas:
  - Windows: usá Recortes (Win+Shift+S) o herramienta de Snipping
  - macOS: Cmd+Shift+4 y arrastrá sobre el área
- Para los modales: abrílos y capturá; el fondo se oscurece automáticamente para destacar

## Cuando construyan el sistema real

Las views (`src/views/*.vue`) usan datos mock importados de `src/lib/datosMock.js`.
En cada view hay comentarios indicando qué descomentar para usar los stores y servicios reales:

```js
// import { useAlmacenProductos } from '../stores/almacenProductos.js'
// const almacenProductos = useAlmacenProductos()
// onMounted(() => almacenProductos.obtenerTodos())
const productos = mockProductos   // ← reemplazar por almacenProductos.lista
```

Los services (`src/services/`) y stores (`src/stores/`) **ya están conectados a Insforge**
y no se tocaron — solo falta enchufarlos a las views cuando esté el sistema final.

## Cerrar sesión

Botón "Cerrar sesión" arriba a la derecha del header. Limpia la sesión y vuelve al login.
