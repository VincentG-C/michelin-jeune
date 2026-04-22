<template>
  <nav class="navbar">
    <div class="nav-container">
      <NuxtLink to="/" class="nav-brand">
        <span class="brand-text">Michelin Pulse</span>
      </NuxtLink>

      <div class="nav-links" v-if="isLoggedIn">
        <NuxtLink to="/" class="nav-link">Accueil</NuxtLink>
        <NuxtLink to="/histoires" class="nav-link">Histoires</NuxtLink>
        <Button variant="secondary" size="small" @click="logout">Déconnexion</Button>
      </div>

      <div class="nav-links" v-else>
        <NuxtLink to="/login" class="nav-link">Connexion</NuxtLink>
        <NuxtLink to="/register" class="nav-link">Inscription</NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const isLoggedIn = ref(false)

onMounted(() => {
  checkAuthStatus()
})

const checkAuthStatus = () => {
  const token = localStorage.getItem('token')
  isLoggedIn.value = !!token
}

const logout = () => {
  localStorage.removeItem('token')
  isLoggedIn.value = false
  navigateTo('/')
}
</script>

<style scoped>
.navbar {
  background: #C8102E;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  text-decoration: none;
  color: white;
}

.brand-text {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>