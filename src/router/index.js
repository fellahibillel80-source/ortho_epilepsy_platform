import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth';
import Login from '../views/Login.vue';
import SuperAdminDashboard from '../views/SuperAdminDashboard.vue';
import ClinicAdminDashboard from '../views/ClinicAdminDashboard.vue';
import SpecialistDashboard from '../views/SpecialistDashboard.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guest: true }
  },
  {
    path: '/admin',
    name: 'SuperAdminDashboard',
    component: SuperAdminDashboard,
    meta: { auth: true, role: 'super_admin' }
  },
  {
    path: '/clinic',
    name: 'ClinicAdminDashboard',
    component: ClinicAdminDashboard,
    meta: { auth: true, role: 'clinic_admin' }
  },
  {
    path: '/specialist',
    name: 'SpecialistDashboard',
    component: SpecialistDashboard,
    meta: { auth: true, role: 'specialist' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.auth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.meta.guest && authStore.isAuthenticated) {
    // Redirect based on role
    const role = authStore.userRole;
    if (role === 'super_admin') next('/admin');
    else if (role === 'clinic_admin') next('/clinic');
    else if (role === 'specialist') next('/specialist');
    else next('/login');
  } else if (to.meta.role && authStore.userRole !== to.meta.role) {
    // Unauthorized, redirect appropriately
    const role = authStore.userRole;
    if (role === 'super_admin') next('/admin');
    else if (role === 'clinic_admin') next('/clinic');
    else if (role === 'specialist') next('/specialist');
    else next('/login');
  } else {
    next();
  }
});

export default router;
