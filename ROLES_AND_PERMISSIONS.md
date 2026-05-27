# FerchasBakery - Role-Based Access Control (RBAC)

## Overview

This document describes the role-based access control system for the FerchasBakery administrative platform. The system implements three distinct roles with specific permissions and restrictions.

## Roles

### 1. **Principal** (Superuser)
- **Assignment**: Automatically assigned to the first user who registers in the system
- **Permissions**:
  - Access to all modules and features
  - Full user management (create, edit, delete users of any role)
  - Can assign and manage both `admin` and `empleado` roles
  - Access to Proveedores (Suppliers) management
  - Access to Categorías (Categories) management
  - Access to Usuarios (Users) management
  - Cannot be deleted; system always maintains at least one principal user

### 2. **Admin** (Administrator)
- **Assignment**: Can only be created by a principal user
- **Permissions**:
  - Dashboard access
  - Productos (Products) - read-only and management
  - Pedidos (Orders) - full management
  - Clientes (Clients) - full management
  - Categorías (Categories) - read-only (only principal can manage)
  - Proveedores (Suppliers) - read-only (only principal can manage)
  - Usuarios (Users) - can only create and manage `empleado` users
  - Cannot create or manage other `admin` users
  - Cannot see or interact with other `admin` or `principal` users
- **Restrictions**:
  - Cannot access Usuarios module to create admins
  - Cannot view other admins or the principal user in the user list

### 3. **Empleado** (Employee)
- **Assignment**: Assigned to all regular user registrations after the first user
- **Permissions**:
  - Dashboard access
  - Productos (Products) - read-only
  - Pedidos (Orders) - full management (create, view, edit)
  - Clientes (Clients) - full management
- **Restrictions**:
  - Cannot access Proveedores module
  - Cannot access Categorías module
  - Cannot access Usuarios (Users) management module
  - Cannot see user management interface

## Module Access Matrix

| Module | Principal | Admin | Empleado |
|--------|-----------|-------|----------|
| Dashboard | ✅ | ✅ | ✅ |
| Productos | ✅ | ✅ | 📖 (Read-only) |
| Pedidos | ✅ | ✅ | ✅ |
| Clientes | ✅ | ✅ | ✅ |
| Proveedores | ✅ | 📖 (Read-only) | ❌ |
| Categorías | ✅ | 📖 (Read-only) | ❌ |
| Usuarios | ✅ | ✅ (empleado only) | ❌ |
| Mi Perfil | ✅ | ✅ | ✅ |

## User Management Rules

### Creating Users
- **Principal** can create users with any role (principal, admin, empleado)
- **Admin** can only create `empleado` users
- **Empleado** cannot create any users

### Editing Users
- **Principal** can edit any user and change any role
- **Admin** can only edit `empleado` users
- **Empleado** cannot edit any users

### User Visibility
- **Principal** sees all users in the system
- **Admin** sees only `empleado` users (cannot see other admins or principal)
- **Empleado** cannot access the Usuarios module at all

## Implementation Details

### Database Schema
The `perfiles` table includes a `rol` column with a CHECK constraint:
```sql
rol VARCHAR(15) NOT NULL
    CHECK (rol IN ('principal', 'admin', 'empleado'))
```

### Frontend Components

#### Authentication Store (`ControladorAutenticacion.js`)
Provides computed properties:
- `esPrincipal`: Boolean - user is principal
- `esAdmin`: Boolean - user is admin
- `esEmpleado`: Boolean - user is employee
- `puedeManejarTodo`: Boolean - user is principal (can manage everything)
- `puedeManejarAdmins`: Boolean - user is principal (can manage admin users)

#### Router Guards (`src/router/index.js`)
- Routes requiring admin access check: `!almacenAuth.esAdmin && !almacenAuth.esPrincipal`
- All three roles can access basic operational routes

#### Sidebar Navigation (`BarralateralPrincipal.vue`)
Dynamically filters menu items based on user role:
- Empleado: Cannot see Proveedores, Usuarios, or Categorías
- Admin: Cannot see Categorías
- Principal: Sees all menu items

#### User Management (`UsuariosView.vue`)
- Lists users based on role
- Principal sees all users
- Admin sees only empleados
- Empleado has no access (blocked by router)
- Role selection dropdowns are filtered to prevent unauthorized role assignments

### Authentication Flow

1. **First User Registration** → Automatically assigned `principal` role
2. **Subsequent Registrations** → Assigned `empleado` role by default
3. **Admin Creates User** → Can only assign `empleado` role
4. **Principal Creates User** → Can assign `principal`, `admin`, or `empleado` role

## Security Considerations

1. **Role Validation**: All role assignments are validated both on the frontend and backend (via CHECK constraint)
2. **Route Protection**: Router guards prevent unauthorized access to admin-only routes
3. **View Filtering**: UI components filter content based on user role before displaying
4. **Database Constraints**: Role validation at the database level ensures data integrity
5. **First User Protection**: System ensures the first user is always principal to prevent lockout

## Testing the RBAC System

### Test Scenario 1: First User Registration
1. Clear the database or use a new Insforge project
2. Register a new user
3. Verify the user is assigned the `principal` role

### Test Scenario 2: Admin Creates Empleado
1. Login as `admin`
2. Navigate to Usuarios
3. Try to create a user with role `admin` (should not be possible)
4. Create a user with role `empleado` (should succeed)

### Test Scenario 3: Empleado Access Restrictions
1. Login as `empleado`
2. Try to access `/proveedores` (should redirect to dashboard)
3. Try to access `/categorias` (should redirect to dashboard)
4. Try to access `/usuarios` (should redirect to dashboard)
5. Verify sidebar doesn't show these modules

### Test Scenario 4: Principal Full Access
1. Login as `principal`
2. Verify access to all modules
3. Verify ability to create users with any role
4. Verify ability to see all users in user management

## Future Enhancements

- [ ] Role-based API permissions (ensure backend respects roles)
- [ ] Audit logging for role changes and admin actions
- [ ] Two-factor authentication for principal users
- [ ] Delegated admin functionality (principal delegates admin tasks)
- [ ] Custom role creation for more granular permissions
- [ ] Session timeout and re-authentication for sensitive operations

## Files Modified

- `src/models/ModeloAutenticacion.js` - Authentication logic with role assignment
- `src/controllers/ControladorAutenticacion.js` - Auth store with role computed properties
- `src/router/index.js` - Route guards updated for multi-role support
- `src/views/UsuariosView.vue` - User management with role-based filtering
- `src/components/shared/BarralateralPrincipal.vue` - Sidebar with role-based menu filtering
- `script.sql` - Database schema with role constraint
