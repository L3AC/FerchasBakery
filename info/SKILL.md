---
name: info
description: "Usa cuando trabajes en la interfaz Vue.js de FerchasBakery. Proporciona guías de diseño artesanal, colores cálidos pasteles, tipografía y componentes que no parecen generados por IA."
---

# FerchasBakery - Guía de Diseño UI/UX

## REGLAS IMPORTANTES

1. **NO usar tipografía de tipo IA**: Evitar fuentes como Inter, Roboto, system-ui. Usar Playfair Display para títulos y Lato para cuerpo.
2. **NO usar emojis como iconos**: Los emojis se ven genéricos y feitos. Usar iconos SVG inline o de librerías como Heroicons/Lucide pero con estilo fill (no line), o mejor aún, crear iconos SVG personalizados que combinen con la paleta.
3. **NO interfaces genéricas de IA**: Evitar layouts muy estructurados, bordes redondeados excesivos, gradientes azul/purple, spacing perfectamente uniforme.
4. **USAR el logo de la repostería**: Located at `img/logo.jpg`. Incluir en el login y como favicon.
5. **USAR la paleta de colores del logo**: Colores cálidos pasteles - rosa, café, vino.

## filosofía de diseño

Evitar el aspecto "AI-generated" significa:
- NO usar gradientes genéricos azul/purple
- NO usar tarjetas con bordes redondeados excesivos (border-radius everywhere)
- NO usar espaciado uniforme robotico
- NO usar icons de linea genericos (lucide, heroicons default) - usar version fill
- NO emojis como reemplazo de iconos

## Logo

- **Ubicación**: `img/logo.jpg`
- **Uso obligatorio**: Incluir en la página de login, navbar, y como favicon
- **Aplicación**: 
  - Login: Mostrar logo pequeño arriba del título
  - Favicon: Usar el logo como icono del navegador

## Iconos (NO EMOJIS)

Los emojis parecen genéricos y "feitos". Opciones preferidas:

1. **Iconos SVG inline personalizados**: Crear iconos que usen la paleta de colores de Ferchas (rosa, café, vino)
2. **Heroicons/Lucide versión fill**: No usar versión outline/line
3. **Iconos simples sin detalles**: Menos es más, artesanal

```html
<!-- Ejemplo icono SVG artesanal (rosa) -->
<svg class="w-6 h-6 text-ferchas-rosa" fill="currentColor" viewBox="0 0 24 24">
  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
</svg>
```

## Colores del Logo (BASE)

Estos colores vienen directamente del logo original:

| Nombre | Hex | Uso |
|--------|-----|-----|
| Rosa principal | `#DF9CB4` | Botones principales, acentos |
| Rosa claro / fondo | `#F0F0F0` | Fondos, backgrounds |
| Café oscuro / texto | `#381414` | Texto principal, bordes |
| Café vino oscuro | `#4A1818` | Headers, textos importantes |

En `tailwind.config.js`:

```js
colors: {
  // Originales del logo
  'ferchas-rosa': '#DF9CB4',
  'ferchas-rosa-oscuro': '#C4889A',
  'ferchas-rosa-suave': '#EBCED6',
  'ferchas-fondo': '#F0F0F0',
  'ferchas-fondo-oscuro': '#E5E5E5',
  'ferchas-cafe': '#381414',
  'ferchas-cafe-claro': '#5A3A3A',
  'ferchas-vino': '#4A1818',
  'ferchas-vino-claro': '#6B2828',

  // Estados (combinan con la paleta)
  'ferchas-exito': '#8FB996',
  'ferchas-advertencia': '#D4A574',
  'ferchas-error': '#C47B7B',
}
```

**Regla clave**: Usa SIEMPRE estos colores del logo. NO uses blancos puros ni colors genéricos.

## Tipografía

Evitar: Inter, Roboto, system-ui default

Usar en su lugar (añadir al HTML head):
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
```

Aplicar en Tailwind:
```js
fontFamily: {
  'titulo': ['Playfair Display', 'serif'],
  'cuerpo': ['Lato', 'sans-serif'],
}
```

- **Títulos**: Playfair Display (serif, elegante, artesanal)
- **Cuerpo**: Lato (limpio pero no robotico)

## Espaciado (NO uniforme)

Los diseños de IA usan spacing = 4, 8, 16, 24, 32... todo perfecto.

Tu spacing debe ser:
- Base: 4px
- Pero usa valores "organicos": 6, 14, 22, 38, 52
- Las tarjetas NO todas del mismo padding
- grouping con spacing irregular feels mas artesanal

```html
<!-- AI-generated (evitar) -->
<div class="p-4 space-y-4">

<!-- Artesanal (usar) -->
<div class="p-5 space-y-3">
```

## Componentes Recomendados

### Cards de Productos
```html
<div class="bg-ferchas-fondo border-2 border-ferchas-rosa/40 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
  <!-- contenido -->
</div>
```

### Botones
```html
<!-- Principal (rosa del logo) -->
<button class="bg-ferchas-rosa text-white font-cuerpo px-6 py-2.5 rounded-lg hover:bg-ferchas-rosa-oscuro transition-colors duration-200">
  Registrar
</button>

<!-- Secundario (café del logo) -->
<button class="bg-ferchas-fondo text-ferchas-cafe font-cuerpo px-6 py-2.5 rounded-lg border-2 border-ferchas-cafe/30 hover:bg-ferchas-fondo-oscuro transition-colors duration-200">
  Cancelar
</button>
```

### Inputs
```html
<input class="w-full px-4 py-3 bg-white border-2 border-ferchas-cafe/20 rounded-lg text-ferchas-cafe placeholder-ferchas-cafe-claro focus:border-ferchas-rosa focus:ring-2 focus:ring-ferchas-rosa/20 outline-none transition-all duration-200" />
```

### Header / Navbar
```html
<header class="bg-ferchas-vino text-white px-6 py-4">
```

### Tablas
- NO striped rows alternating
- Header con `bg-ferchas-fondo-oscuro`
- Filas con hover: `hover:bg-ferchas-fondo`
- Bordes: `border-ferchas-cafe/10`

### Sidebar/Navegación
```html
<aside class="bg-ferchas-fondo-oscuro min-h-screen border-r-2 border-ferchas-cafe/10">
  <a class="block px-5 py-3 text-ferchas-cafe hover:bg-ferchas-fondo transition-all duration-200 hover:translate-x-1">
</aside>
```

## Lo que EVITAR (Look AI)

| ❌ Evitar | ✅ Usar |
|----------|---------|
| `rounded-2xl` o `rounded-3xl` everywhere | `rounded-lg` sparingly |
| `bg-gradient-to-r` genéricos | `bg-ferchas-rosa` plano |
| `bg-white` como fondo principal | `bg-ferchas-fondo` |
| `text-gray-600` | `text-ferchas-cafe-claro` |
| `border-gray-200` | `border-ferchas-cafe/20` |
| `shadow-xl` | `shadow-sm` o `shadow-md` |
| Icons linea muy finos | Icons fill o más gruesos |
| Emojis como iconos | Iconos SVG fill o inline |
| Inter, Roboto, system-ui | Playfair Display, Lato |

## Layout Sugerido

```
+------------------------------------------+
|  HEADER (bg-ferchas-vino, texto blanco) |
+------------------------------------------+
| SIDEBAR  |       CONTENIDO              |
| (ferchas- |  (bg-ferchas-fondo)         |
|  fondo)  |  Cards con bg-white         |
|          |  Titulos Playfair           |
+----------+-------------------------------+
```

## Para el Login

- Background: `bg-ferchas-fondo`
- Card: `bg-white border-2 border-ferchas-rosa/30`
- **Logo**: Mostrar `img/logo.jpg` arriba del título (tamaño apropiado, ej: 80x80px)
- Titulo: Playfair Display, color `ferchas-cafe`
- Botón: `bg-ferchas-rosa`
- NO usar emojis en botones o mensajes

## Para el Dashboard

- Cards con números grandes en Playfair
- Header de cards: `bg-ferchas-rosa/10`
- Iconos grandes (no pequeños)
- Máximo 4 cards por fila

## Notas de implementación

1. NUNCA uses `bg-white` como fondo principal - usa `bg-ferchas-fondo`
2. Los bordes deben usar `border-ferchas-cafe/10` o `/20`
3. El shadow: `shadow-sm` la mayoría, `shadow-md` en hover
4. Hover states con `duration-200` o `duration-300` (no instant)
5. Textos: `text-ferchas-cafe` principal, `text-ferchas-cafe-claro` secundario
6. Puedes usar emojis para iconos si los de librería se ven muy "default"