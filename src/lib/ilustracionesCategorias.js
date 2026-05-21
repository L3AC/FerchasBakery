/**
 * Ilustraciones SVG para las categorías de productos.
 * Se usan en la grid de productos como representación visual cuando
 * no hay imagen subida. Cada clave coincide con una "familia" de productos
 * y se asigna dinámicamente según el nombre de la categoría.
 */
export const ilustracionesProductos = {
  fresa:     `<svg viewBox="0 0 100 100" width="56" height="56"><circle cx="50" cy="55" r="28" fill="#C4889A"/><circle cx="50" cy="42" r="22" fill="#fff" opacity="0.85"/><path d="M30 40 Q50 30 70 40" stroke="#DF9CB4" stroke-width="3" fill="none"/><circle cx="42" cy="45" r="2" fill="#C47B7B"/><circle cx="55" cy="48" r="2" fill="#C47B7B"/></svg>`,
  vainilla:  `<svg viewBox="0 0 100 100" width="56" height="56"><path d="M30 60 L70 60 L65 88 L35 88 Z" fill="#D4A574"/><circle cx="50" cy="50" r="22" fill="#EBCED6"/><circle cx="50" cy="35" r="4" fill="#C47B7B"/></svg>`,
  pastel:    `<svg viewBox="0 0 100 100" width="56" height="56"><rect x="20" y="40" width="60" height="40" rx="3" fill="#fff" stroke="#C4889A" stroke-width="2"/><rect x="20" y="55" width="60" height="3" fill="#DF9CB4"/><path d="M50 28 L50 40 M44 28 Q50 22 50 28 Q50 22 56 28" stroke="#C47B7B" stroke-width="2.5" fill="none"/></svg>`,
  velvet:    `<svg viewBox="0 0 100 100" width="56" height="56"><path d="M30 60 L70 60 L65 88 L35 88 Z" fill="#5A3A3A"/><circle cx="50" cy="50" r="22" fill="#EBCED6"/><path d="M30 50 Q50 35 70 50" stroke="#C47B7B" stroke-width="2" fill="none"/></svg>`,
  galleta:   `<svg viewBox="0 0 100 100" width="56" height="56"><circle cx="50" cy="50" r="28" fill="#D4A574"/><circle cx="40" cy="42" r="3" fill="#381414"/><circle cx="55" cy="45" r="3" fill="#381414"/><circle cx="48" cy="58" r="3" fill="#381414"/><circle cx="60" cy="55" r="2.5" fill="#381414"/></svg>`,
  tartaleta: `<svg viewBox="0 0 100 100" width="56" height="56"><ellipse cx="50" cy="60" rx="32" ry="22" fill="#D4A574"/><ellipse cx="50" cy="55" rx="26" ry="16" fill="#fff" opacity="0.6"/><circle cx="42" cy="55" r="3" fill="#EBCED6"/><circle cx="58" cy="55" r="3" fill="#EBCED6"/></svg>`,
  cafe:      `<svg viewBox="0 0 100 100" width="56" height="56"><path d="M28 30 L72 30 L68 80 Q50 88 32 80 Z" fill="#381414"/><path d="M72 40 Q88 40 88 55 Q88 70 72 70" fill="none" stroke="#381414" stroke-width="4"/><path d="M40 20 Q42 12 45 20 M50 20 Q52 12 55 20 M60 20 Q62 12 65 20" stroke="#C4889A" stroke-width="2" fill="none"/></svg>`,
}
