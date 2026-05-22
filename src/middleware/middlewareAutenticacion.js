import { useAlmacenAutenticacion } from '../controllers/ControladorAutenticacion.js'

export function crearMiddlewareAutenticacion(hacia, desde, siguiente) {
  const almacenAuth = useAlmacenAutenticacion()

  // Si no estamos autenticados y tratamos de ir a una ruta protegida
  if (!almacenAuth.estaAutenticado && hacia.meta.requiereAutenticacion) {
    return '/login'
  }

  // Si ya estamos autenticados y tratamos de ir al login
  if (almacenAuth.estaAutenticado && hacia.path === '/login') {
    return '/dashboard'
  }

  // Si la ruta requiere admin y no somos admin
  if (hacia.meta.requiereAdmin && !almacenAuth.esAdmin) {
    return '/dashboard'
  }

  // Si la ruta requiere empleado
  if (hacia.meta.requiereEmpleado && !almacenAuth.esEmpleado && !almacenAuth.esAdmin) {
    return '/dashboard'
  }

  siguiente()
}
