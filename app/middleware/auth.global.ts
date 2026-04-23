export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client
  if (import.meta.server) return

  const token = localStorage.getItem('token')
  const publicRoutes = ['/login', '/register']

  // If no token and trying to access a protected route
  if (!token && !publicRoutes.includes(to.path)) {
    return navigateTo('/login')
  }

  // If token exists and trying to access login/register, redirect to home
  if (token && publicRoutes.includes(to.path)) {
    return navigateTo('/')
  }
})
