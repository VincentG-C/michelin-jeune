<template>
  <div class="home">
    <h1>Bienvenue sur Michelin Pulse</h1>
    <p>Votre passeport gastronomique Michelin</p>
    <div v-if="user" class="user-info">
      <h2>Bonjour, {{ user.username }} !</h2>
      <div class="stats">
        <div class="stat">
          <span class="stat-number">{{ user.stats.checkins }}</span>
          <span class="stat-label">Check-ins</span>
        </div>
        <div class="stat">
          <span class="stat-number">{{ user.stats.uniqueRestaurants }}</span>
          <span class="stat-label">Restaurants</span>
        </div>
        <div class="stat">
          <span class="stat-number">{{ user.stats.tampons }}</span>
          <span class="stat-label">Tampons</span>
        </div>
        <div class="stat">
          <span class="stat-number">{{ user.stats.histoires }}</span>
          <span class="stat-label">Histoires</span>
        </div>
      </div>
      <p class="level">Niveau: {{ user.stats.level.emoji }} {{ user.stats.level.name }}</p>
      <Button @click="logout" variant="secondary">Se déconnecter</Button>
    </div>
    <div v-else class="auth-links">
      <NuxtLink to="/login">
        <Button variant="primary">Se connecter</Button>
      </NuxtLink>
      <NuxtLink to="/register">
        <Button variant="secondary">S'inscrire</Button>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const user = ref(null)
const token = ref(localStorage.getItem('token'))

onMounted(async () => {
  if (token.value) {
    try {
      // Assuming there's a profile API
      const profile = await $fetch('/api/profil', {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })
      user.value = profile
    } catch (err) {
      // Token invalid, logout
      logout()
    }
  }
})

const logout = () => {
  localStorage.removeItem('token')
  user.value = null
  token.value = null
}
</script>

<style scoped>
.home {
  text-align: center;
  padding: 2rem;
}

.user-info {
  margin-top: 2rem;
}

.stats {
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin: 2rem 0;
  flex-wrap: wrap;
}

.stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: #C8102E;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.level {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.auth-links {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
}
</style>