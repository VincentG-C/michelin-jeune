<template>
  <div class="checkins-history">
    <div class="page-header">
      <h1>Mon historique de visites</h1>
      <p>Toutes vos visites gastronomiques</p>
    </div>

    <div v-if="loading" class="loading">Chargement de vos visites...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else class="stats-overview">
      <div class="stat">
        <span class="stat-number">{{ checkins.length }}</span>
        <span class="stat-label">Visites</span>
      </div>
      <div class="stat">
        <span class="stat-number">{{ uniqueRestaurants }}</span>
        <span class="stat-label">Restaurants</span>
      </div>
      <div class="stat">
        <span class="stat-number">{{ tamponsCount }}</span>
        <span class="stat-label">Tampons</span>
      </div>
    </div>

    <div class="filters">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher un restaurant..."
        class="search-input"
      />
      <select v-model="sortBy" class="sort-select">
        <option value="recent">Plus récentes</option>
        <option value="oldest">Plus anciennes</option>
        <option value="name">Par nom</option>
      </select>
    </div>

    <div v-if="filteredCheckins.length === 0" class="no-checkins">
      <p>Vous n'avez pas encore fait de visites.</p>
      <NuxtLink to="/restaurants">
        <Button variant="primary">Découvrir les restaurants</Button>
      </NuxtLink>
    </div>

    <div v-else class="checkins-list">
      <div
        v-for="checkin in filteredCheckins"
        :key="checkin.id"
        class="checkin-item"
      >
        <div class="checkin-date">
          {{ formatDate(checkin.checkedAt) }}
          <br>
          <small>{{ formatTime(checkin.checkedAt) }}</small>
        </div>

        <div class="checkin-restaurant">
          <h3>{{ checkin.restaurant.name }}</h3>
          <p class="address">📍 {{ checkin.restaurant.address }}</p>
          <p v-if="checkin.restaurant.cuisine" class="cuisine">
            🍽️ {{ checkin.restaurant.cuisine }}
          </p>
          <div class="michelin-info">
            <span v-if="getMichelinStars(checkin.restaurant)" class="stars">
              {{ getMichelinStars(checkin.restaurant) }}
            </span>
            <span class="budget">{{ getBudgetLabel(checkin.restaurant.budget) }}</span>
          </div>
        </div>

        <div class="checkin-badges">
          <span v-if="checkin.restaurant.isHiddenGem" class="badge" title="Hidden Gem">💎</span>
          <span v-if="checkin.restaurant.isVisual" class="badge" title="Visual">📸</span>
          <span v-if="checkin.restaurant.isEco" class="badge" title="Écologique">🌱</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const loading = ref(true)
const error = ref('')
const checkins = ref([])
const tamponsCount = ref(0)
const searchQuery = ref('')
const sortBy = ref('recent')

const uniqueRestaurants = computed(() => {
  return new Set(checkins.value.map(c => c.restaurant.id)).size
})

const filteredCheckins = computed(() => {
  let filtered = [...checkins.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(c =>
      c.restaurant.name.toLowerCase().includes(query) ||
      c.restaurant.address.toLowerCase().includes(query)
    )
  }

  if (sortBy.value === 'oldest') {
    filtered.sort((a, b) => new Date(a.checkedAt).getTime() - new Date(b.checkedAt).getTime())
  } else if (sortBy.value === 'name') {
    filtered.sort((a, b) => a.restaurant.name.localeCompare(b.restaurant.name))
  } else {
    // Default: recent first (already sorted from API)
    filtered.sort((a, b) => new Date(b.checkedAt).getTime() - new Date(a.checkedAt).getTime())
  }

  return filtered
})

onMounted(async () => {
  await loadCheckins()
})

const loadCheckins = async () => {
  try {
    loading.value = true
    error.value = ''

    const token = localStorage.getItem('token')
    if (!token) {
      error.value = 'Vous devez être connecté'
      return
    }

    const passport = await $fetch('/api/passport', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    checkins.value = passport.checkins || []
    tamponsCount.value = passport.tampons?.length || 0
  } catch (err: any) {
    error.value = 'Erreur lors du chargement de vos visites'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getMichelinStars = (restaurant: any) => {
  if (restaurant.michelinType === 'etoile_1') return '⭐'
  if (restaurant.michelinType === 'etoile_2') return '⭐⭐'
  if (restaurant.michelinType === 'etoile_3') return '⭐⭐⭐'
  if (restaurant.michelinType === 'bib') return '🍽️'
  return ''
}

const getBudgetLabel = (budget: string) => {
  const budgets: Record<string, string> = {
    low: '€',
    medium: '€€',
    high: '€€€',
  }
  return budgets[budget] || budget
}
</script>

<style scoped>
.checkins-history {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat {
  text-align: center;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-input,
.sort-select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.search-input {
  flex: 1;
  min-width: 200px;
}

.search-input:focus,
.sort-select:focus {
  outline: none;
  border-color: #C8102E;
  box-shadow: 0 0 0 2px rgba(200, 16, 46, 0.1);
}

.loading, .error {
  text-align: center;
  padding: 2rem;
}

.error {
  color: #C8102E;
  background: #ffe6e6;
  border-radius: 4px;
}

.no-checkins {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.checkins-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.checkin-item {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #C8102E;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.checkin-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.checkin-date {
  min-width: 150px;
  font-weight: 600;
  color: #C8102E;
  white-space: nowrap;
}

.checkin-date small {
  display: block;
  font-size: 0.85rem;
  color: #666;
  font-weight: normal;
  margin-top: 0.25rem;
}

.checkin-restaurant {
  flex: 1;
}

.checkin-restaurant h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.checkin-restaurant p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
  color: #666;
}

.michelin-info {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.michelin-info .stars {
  font-size: 1.1rem;
}

.michelin-info .budget {
  font-weight: 600;
}

.checkin-badges {
  display: flex;
  gap: 0.5rem;
  font-size: 1.2rem;
  align-items: center;
  flex-wrap: wrap;
}

.badge {
  display: inline-block;
}

@media (max-width: 768px) {
  .checkin-item {
    flex-direction: column;
    gap: 1rem;
  }

  .checkin-date {
    min-width: auto;
  }
}
</style>