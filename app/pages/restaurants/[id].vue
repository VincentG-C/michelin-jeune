<template>
  <div class="restaurant-detail">
    <div class="back-button">
      <Button variant="secondary" size="small" @click="goBack">← Retour aux restaurants</Button>
    </div>

    <div v-if="loading" class="loading">Chargement du restaurant...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else-if="restaurant" class="restaurant-content">
      <div v-if="restaurant.photoUrl" class="restaurant-hero">
        <img :src="restaurant.photoUrl" :alt="restaurant.name" />
      </div>

      <div class="restaurant-main">
        <div class="restaurant-header">
          <h1>{{ restaurant.name }}</h1>
          <div class="badges">
            <span v-if="getMichelinStars()" class="badge stars">{{ getMichelinStars() }}</span>
            <span v-if="restaurant.isHiddenGem" class="badge" title="Hidden Gem">💎 Hidden Gem</span>
            <span v-if="restaurant.isVisual" class="badge" title="Visual">📸 Visual</span>
            <span v-if="restaurant.isEco" class="badge" title="Écologique">🌱 Écologique</span>
          </div>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <h3>📍 Adresse</h3>
            <p>{{ restaurant.address }}</p>
          </div>

          <div class="info-item">
            <h3>🍽️ Cuisine</h3>
            <p>{{ restaurant.cuisine || 'Non spécifiée' }}</p>
          </div>

          <div class="info-item">
            <h3>💰 Budget</h3>
            <p>{{ getBudgetLabel() }}</p>
          </div>

          <div class="info-item">
            <h3>🎭 Ambiance</h3>
            <p>{{ restaurant.ambiance || 'Non spécifiée' }}</p>
          </div>
        </div>

        <div v-if="restaurant.description" class="description">
          <h3>À propos</h3>
          <p>{{ restaurant.description }}</p>
        </div>

        <div class="actions">
          <NuxtLink v-if="!isCheckedIn" :to="`/checkin/${restaurant.id}`">
            <Button variant="primary" size="large">✓ Effectuer un check-in</Button>
          </NuxtLink>
          <div v-else class="checked-info">
            <p>✓ Vous avez déjà visité ce restaurant</p>
            <NuxtLink :to="`/checkin/${restaurant.id}`">
              <Button variant="secondary">Faire un nouveau check-in</Button>
            </NuxtLink>
          </div>
        </div>

        <div v-if="recentCheckins.length > 0" class="recent-checkins">
          <h3>Vos visites récentes</h3>
          <div class="checkin-list">
            <div v-for="checkin in recentCheckins" :key="checkin.id" class="checkin-entry">
              <span class="date">{{ formatDate(checkin.checkedAt) }}</span>
              <span class="time">{{ formatTime(checkin.checkedAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="not-found">
      <h2>Restaurant non trouvé</h2>
      <Button @click="goBack">Retour aux restaurants</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const restaurantId = parseInt(route.params.id as string)

const restaurant = ref(null)
const recentCheckins = ref([])
const loading = ref(true)
const error = ref('')
const isCheckedIn = ref(false)

onMounted(async () => {
  await loadRestaurant()
  await loadUserCheckins()
})

const loadRestaurant = async () => {
  try {
    restaurant.value = await $fetch(`/api/restaurants/${restaurantId}`)
  } catch (err: any) {
    error.value = 'Restaurant non trouvé'
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

    const restaurantCheckins = passport.checkins.filter(
      (c: any) => c.restaurant.id === restaurantId
    )
    recentCheckins.value = restaurantCheckins.slice(0, 5)
    isCheckedIn.value = restaurantCheckins.length > 0
  } catch (err) {
    // Silent error
  }
}

const getMichelinStars = () => {
  if (!restaurant.value) return ''
  if (restaurant.value.michelinType === 'etoile_1') return '⭐'
  if (restaurant.value.michelinType === 'etoile_2') return '⭐⭐'
  if (restaurant.value.michelinType === 'etoile_3') return '⭐⭐⭐'
  if (restaurant.value.michelinType === 'bib') return '🍽️'
  return ''
}

const getBudgetLabel = () => {
  if (!restaurant.value) return ''
  const budgets: Record<string, string> = {
    low: '€',
    medium: '€€',
    high: '€€€',
  }
  return budgets[restaurant.value.budget] || restaurant.value.budget
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
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

const goBack = () => {
  navigateTo('/restaurants')
}
</script>

<style scoped>
.restaurant-detail {
  padding: 2rem;
}

.back-button {
  margin-bottom: 1rem;
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

.restaurant-hero {
  width: 100%;
  height: 400px;
  margin-bottom: 2rem;
  border-radius: 8px;
  overflow: hidden;
}

.restaurant-hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.restaurant-main {
  max-width: 1000px;
  margin: 0 auto;
}

.restaurant-header {
  margin-bottom: 2rem;
}

.restaurant-header h1 {
  margin: 0 0 1rem 0;
  color: #C8102E;
}

.badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #f0f0f0;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.badge.stars {
  background: #C8102E;
  color: white;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.info-item {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-item h3 {
  margin: 0 0 0.5rem 0;
  color: #C8102E;
}

.info-item p {
  margin: 0;
  color: #666;
}

.description {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.description h3 {
  margin-top: 0;
  color: #C8102E;
}

.description p {
  line-height: 1.6;
  color: #333;
}

.actions {
  margin-bottom: 2rem;
}

.actions a {
  text-decoration: none;
}

.checked-info {
  background: #e8f5e9;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #28a745;
}

.checked-info p {
  margin: 0 0 1rem 0;
  color: #28a745;
  font-weight: 500;
}

.recent-checkins {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recent-checkins h3 {
  margin-top: 0;
  color: #C8102E;
}

.checkin-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkin-entry {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background: #f5f5f5;
  border-radius: 4px;
}

.date {
  font-weight: 500;
  color: #333;
}

.time {
  color: #666;
}

.not-found {
  text-align: center;
  padding: 2rem;
}

.not-found h2 {
  color: #C8102E;
}

@media (max-width: 768px) {
  .restaurant-hero {
    height: 250px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>