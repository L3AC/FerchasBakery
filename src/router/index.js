import { createRouter, createWebHistory } from 'vue-router'
import { useAlmacenAutenticacion } from '../controllers/ControladorAutenticacion.js'
import { insforgeClient } from '../lib/insforge.js'

// Views
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import ProductosView from '../views/ProductosView.vue'
import PedidosView from '../views/PedidosView.vue'
import ClientesView from '../views/ClientesView.vue'
import ProveedoresView from '../views/ProveedoresView.vue'
import CategoriasView from '../views/CategoriasView.vue'
import UsuariosView from '../views/UsuariosView.vue'
import MiPerfilView from '../views/MiPerfilView.vue'

const rutas = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      requiereAutenticacion: false
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: {
      requiereAutenticacion: false
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: {
      requiereAutenticacion: true
    }
  },
  {
    path: '/productos',
    name: 'Productos',
    component: ProductosView,
    meta: {
      requiereAutenticacion: true
    }
  },
  {
    path: '/pedidos',
    name: 'Pedidos',
    component: PedidosView,
    meta: {
      requiereAutenticacion: true
    }
  },
  {
    path: '/clientes',
    name: 'Clientes',
    component: ClientesView,
    meta: {
      requiereAutenticacion: true
    }
  },
  {
    path: '/categorias',
    name: 'Categorias',
    component: CategoriasView,
    meta: {
      requiereAutenticacion: true,
      requiereAdmin: true
    }
  },
  {
    path: '/proveedores',
    name: 'Proveedores',
    component: ProveedoresView,
    meta: {
      requiereAutenticacion: true,
      requiereAdmin: true
    }
  },
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: UsuariosView,
    meta: {
      requiereAutenticacion: true,
      requiereAdmin: true
    }
  },
  {
    path: '/mi-perfil',
    name: 'MiPerfil',
    component: MiPerfilView,
    meta: {
      requiereAutenticacion: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: rutas
})

// Variable para evitar verificación múltiple
let verificandoUsuarios = false
let existenUsuarios = null

async function verificarSiExistenUsuarios() {
  if (existenUsuarios !== null) return existenUsuarios
  if (verificandoUsuarios) {
    // Esperar a que termine la verificación
    return new Promise(resolve => {
      const verificar = setInterval(() => {
        if (!verificandoUsuarios) {
          clearInterval(verificar)
          resolve(existenUsuarios)
        }
      }, 100)
    })
  }

  verificandoUsuarios = true
  try {
    const { data, error } = await insforgeClient.database
      .from('perfiles')
      .select('user_id')
      .limit(1)
    
    existenUsuarios = !error && data && data.length > 0
  } catch (err) {
    existenUsuarios = true
  }
  verificandoUsuarios = false
  return existenUsuarios
}

router.beforeEach(async (hacia, desde, siguiente) => {
  const almacenAuth = useAlmacenAutenticacion()

  // Si va a /login o /register, verificar si existen usuarios
  if ((hacia.path === '/login' || hacia.path === '/register') && !almacenAuth.estaAutenticado) {
    const existenUsuarios = await verificarSiExistenUsuarios()
    if (!existenUsuarios && hacia.path !== '/register') {
      siguiente('/register')
      return
    }
    if (existenUsuarios && hacia.path !== '/login') {
      siguiente('/login')
      return
    }
  }

  // Intentar restaurar sesión si no está autenticado y va a ruta protegida
  if (!almacenAuth.estaAutenticado && hacia.meta.requiereAutenticacion) {
    await almacenAuth.obtenerUsuarioActual()
    if (!almacenAuth.estaAutenticado) {
      siguiente('/login')
      return
    }
  }

  // Si ya estamos autenticados y tratamos de ir al login
  if (almacenAuth.estaAutenticado && hacia.path === '/login') {
    siguiente('/dashboard')
    return
  }

  // Si ya estamos autenticados y tratamos de ir al register
  if (almacenAuth.estaAutenticado && hacia.path === '/register') {
    siguiente('/dashboard')
    return
  }

  // Si la ruta requiere admin y no somos admin
  if (hacia.meta.requiereAdmin && !almacenAuth.esAdmin) {
    siguiente('/dashboard')
    return
  }

  siguiente()
})

export default router
