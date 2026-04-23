<template>
  <Card class="restaurant-card" :class="{ 'checkedIn': isCheckedIn }">
    <div class="restaurant-header">
      <h3>{{ restaurant.name }}</h3>
      <div class="michelin-badge">
        <span v-if="getMichelinStars()" class="stars">{{ getMichelinStars() }}</span>
        <span v-if="restaurant.isHiddenGem" class="badge hidden-gem" title="Hidden Gem">💎</span>
        <span v-if="restaurant.isVisual" class="badge visual" title="Visual">📸</span>
        <span v-if="restaurant.isEco" class="badge eco" title="Écologique">🌱</span>
      </div>
    </div>

    <div v-if="restaurant.photoUrl" class="restaurant-image">
      <img :src="restaurant.photoUrl" :alt="restaurant.name" />
    </div>

    <div class="restaurant-info">
      <p v-if="restaurant.cuisine" class="cuisine">{{ restaurant.cuisine }}</p>
      <p class="address">📍 {{ restaurant.address }}</p>
      <p v-if="distance" class="distance">{{ distance.toFixed(0) }} m</p>
      <p class="budget">💰 {{ getBudgetLabel() }}</p>
    </div>

    <div class="restaurant-actions">
      <NuxtLink :to="`/restaurants/${restaurant.id}`">
        <Button variant="secondary" size="small">Détails</Button>
      </NuxtLink>
      <NuxtLink v-if="!isCheckedIn" :to="`/checkin/${restaurant.id}`">
        <Button variant="primary" size="small">Check-in</Button>
      </NuxtLink>
      <div v-else class="checked-badge">✓ Check-in effectué</div>
    </div>
  </Card>
</template>

<script setup lang="ts">
interface Props {
  restaurant: {
    id: number
    name: string
    address: string
    lat: number
    lng: number
    michelinType: string
    stars: number
    budget: string
    cuisine?: string
    photoUrl?: string
    isEco: boolean
    isHiddenGem: boolean
    isVisual: boolean
  }
  userLat?: number
  userLng?: number
  isCheckedIn?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isCheckedIn: false,
})

const distance = computed(() => {
  if (!props.userLat || !props.userLng) return null
  const R = 6371000 // Earth's radius in meters
  const dLat = (props.restaurant.lat - props.userLat) * Math.PI / 180
  const dLng = (props.restaurant.lng - props.userLng) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(props.userLat * Math.PI / 180) * Math.cos(props.restaurant.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
})

const getMichelinStars = () => {
  if (props.restaurant.michelinType === 'etoile_1') return '⭐'
  if (props.restaurant.michelinType === 'etoile_2') return '⭐⭐'
  if (props.restaurant.michelinType === 'etoile_3') return '⭐⭐⭐'
  if (props.restaurant.michelinType === 'bib') return '🍽️'
  return ''
}

const getBudgetLabel = () => {
  const budgets: Record<string, string> = {
    low: '€',
    medium: '€€',
    high: '€€€',
  }
  return budgets[props.restaurant.budget] || props.restaurant.budget
}
</script>

<style scoped>
.restaurant-card {
  cursor: default;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.restaurant-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.restaurant-card.checkedIn {
  border-left: 4px solid #28a745;
}

.restaurant-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.restaurant-header h3 {
  margin: 0;
  color: #C8102E;
}

.michelin-badge {
  display: flex;
  gap: 0.25rem;
  font-size: 1.2rem;
}

.michelin-badge .stars {
  font-weight: bold;
}

.badge {
  font-size: 1rem;
}

.restaurant-image {
  margin-bottom: 1rem;
}

.restaurant-image img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}

.restaurant-info {
  margin-bottom: 1rem;
}

.restaurant-info p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
  color: #666;
}

.cuisine {
  font-style: italic;
  color: #333;
}

.restaurant-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
}

.restaurant-actions a {
  text-decoration: none;
  flex: 1;
}

.checked-badge {
  flex: 1;
  text-align: center;
  padding: 0.75rem;
  background: #28a745;
  color: white;
  border-radius: 4px;
  font-weight: 500;
}
</style>