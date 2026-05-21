import { createRouter, createWebHistory } from 'vue-router'
import { useAlmacenAutenticacion } from '../stores/almacenAutenticacion.js'

// Views
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import ProductosView from '../views/ProductosView.vue'
import PedidosView from '../views/PedidosView.vue'
import ClientesView from '../views/ClientesView.vue'
import ProveedoresView from '../views/ProveedoresView.vue'
import UsuariosView from '../views/UsuariosView.vue'
import CategoriasView from '../views/CategoriasView.vue'
import PerfilView from '../views/PerfilView.vue'

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
    path: '/categorias',
    name: 'Categorias',
    component: CategoriasView,
    meta: {
      requiereAutenticacion: true,
      requiereAdmin: true
    }
  },
  {
    path: '/perfil',
    name: 'Perfil',
    component: PerfilView,
    meta: {
      requiereAutenticacion: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: rutas
})

router.beforeEach((hacia, desde, siguiente) => {
  const almacenAuth = useAlmacenAutenticacion()

  // Si no estamos autenticados y tratamos de ir a una ruta protegida
  if (!almacenAuth.estaAutenticado && hacia.meta.requiereAutenticacion) {
    siguiente('/login')
    return
  }

  // Si ya estamos autenticados y tratamos de ir al login
  if (almacenAuth.estaAutenticado && hacia.path === '/login') {
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
