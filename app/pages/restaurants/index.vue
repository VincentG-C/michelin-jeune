<template>
  <div class="restaurants-page">
    <div class="page-header">
      <h1>Restaurants</h1>
      <p>Découvrez les excellents restaurants près de vous</p>
    </div>

    <div class="search-controls">
      <div class="location-button">
        <Button @click="getCurrentLocation" :disabled="locatingUser" variant="primary">
          {{ locatingUser ? 'Localisation...' : '📍 Ma position' }}
        </Button>
      </div>

      <div v-if="userLocation" class="location-info">
        Vous êtes ici: {{ userLocation.lat.toFixed(4) }}, {{ userLocation.lng.toFixed(4) }}
      </div>

      <div class="filter-controls">
        <select v-model="filters.budget" class="filter-select">
          <option value="">Budget</option>
          <option value="low">€</option>
          <option value="medium">€€</option>
          <option value="high">€€€</option>
        </select>

        <select v-model="filters.michelin_type" class="filter-select">
          <option value="">Type Michelin</option>
          <option value="etoile_1">⭐ 1 étoile</option>
          <option value="etoile_2">⭐⭐ 2 étoiles</option>
          <option value="etoile_3">⭐⭐⭐ 3 étoiles</option>
          <option value="bib">🍽️ Bib Gourmand</option>
        </select>

        <label class="filter-checkbox">
          <input v-model="filters.vibe_hidden" type="checkbox" /> Hidden Gem
        </label>
        <label class="filter-checkbox">
          <input v-model="filters.vibe_visual" type="checkbox" /> Visual
        </label>
        <label class="filter-checkbox">
          <input v-model="filters.vibe_eco" type="checkbox" /> Écologique
        </label>
      </div>
    </div>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="loading" class="loading">Recherche de restaurants...</div>

    <div v-else class="restaurants-grid">
      <div v-if="restaurants.length === 0" class="no-results">
        <p>Aucun restaurant trouvé. Veuillez activer votre localisation ou ajuster vos filtres.</p>
      </div>
      <RestaurantCard
        v-for="restaurant in restaurants"
        :key="restaurant.id"
        :restaurant="restaurant"
        :user-lat="userLocation?.lat"
        :user-lng="userLocation?.lng"
        :is-checked-in="isRestaurantCheckedIn(restaurant.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const userLocation = ref(null)
const locatingUser = ref(false)
const loading = ref(false)
const error = ref('')
const restaurants = ref([])
const checkedInRestaurantIds = ref(new Set())

const filters = ref({
  budget: '',
  michelin_type: '',
  vibe_hidden: false,
  vibe_visual: false,
  vibe_eco: false,
})

onMounted(async () => {
  await loadUserCheckins()
})

const getCurrentLocation = async () => {
  locatingUser.value = true
  error.value = ''

  if (!navigator.geolocation) {
    error.value = 'La géolocalisation n\'est pas disponible'
    locatingUser.value = false
    return
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      userLocation.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      await searchRestaurants()
      locatingUser.value = false
    },
    (err) => {
      error.value = 'Impossible d\'accéder à votre position. Activez la géolocalisation.'
      locatingUser.value = false
    }
  )
}

const searchRestaurants = async () => {
  if (!userLocation.value) return

  loading.value = true
  error.value = ''

  try {
    const params: any = {
      lat: userLocation.value.lat,
      lng: userLocation.value.lng,
      radius: 10,
    }

    if (filters.value.budget) params.budget = filters.value.budget
    if (filters.value.michelin_type) params.michelin_type = filters.value.michelin_type

    const vibes = []
    if (filters.value.vibe_hidden) vibes.push('hidden_gem')
    if (filters.value.vibe_visual) vibes.push('visual')
    if (filters.value.vibe_eco) vibes.push('eco')
    if (vibes.length > 0) params.vibe = vibes.join(',')

    restaurants.value = await $fetch('/api/restaurants', { query: params })
  } catch (err: any) {
    error.value = 'Erreur lors de la recherche des restaurants'
  } finally {
    loading.value = false
  }
}

const loadUserCheckins = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return

    const passport = await $fetch('/api/passport', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    checkedInRestaurantIds.value = new Set(
      passport.checkins?.map((c: any) => c.restaurant.id) || []
    )
  } catch (err) {
    // Silent error
  }
}

const isRestaurantCheckedIn = (restaurantId: number) => {
  return checkedInRestaurantIds.value.has(restaurantId)
}

watch(() => [filters.value.budget, filters.value.michelin_type, filters.value.vibe_eco, filters.value.vibe_hidden, filters.value.vibe_visual], () => {
  if (userLocation.value) {
    searchRestaurants()
  }
})
</script>

<style scoped>
.restaurants-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.search-controls {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.location-button {
  margin-bottom: 1rem;
}

.location-info {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: #f5f5f5;
  border-radius: 4px;
}

.filter-controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.filter-checkbox input {
  width: 18px;
  height: 18px;
}

.error {
  color: #C8102E;
  padding: 1rem;
  background: #ffe6e6;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.restaurants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.no-results {
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem;
  color: #666;
}
</style>