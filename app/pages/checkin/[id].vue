<template>
  <div class="checkin-page">
    <Card>
      <div class="header">
        <Button variant="secondary" size="small" @click="goBack">← Retour</Button>
        <h1>Check-in au restaurant</h1>
      </div>

      <div v-if="loading" class="loading">Chargement...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="success" class="success">
        <h2>✓ Check-in effectué!</h2>
        <p>Merci d'avoir visité {{ restaurant.name }}</p>
        <div v-if="newTampons && newTampons.length > 0" class="tampons">
          <h3>🎟️ Tampons récoltés :</h3>
          <p v-for="tampon in newTampons" :key="tampon.id">• {{ tampon.restaurantName }}</p>
        </div>
        <div v-if="unlockedHistoires && unlockedHistoires.length > 0" class="histoires">
          <h3>📖 Histoires débloquées :</h3>
          <p v-for="histoire in unlockedHistoires" :key="histoire.id">• {{ histoire.titre }}</p>
        </div>
        <Button @click="redirectHome" variant="primary">Retour à l'accueil</Button>
      </div>

      <form v-else @submit.prevent="handleCheckin" class="checkin-form">
        <div class="restaurant-info">
          <h2>{{ restaurant.name }}</h2>
          <p>{{ restaurant.address }}</p>
          <p v-if="restaurant.cuisine">Cuisine: {{ restaurant.cuisine }}</p>
        </div>

        <div class="location-check">
          <div class="location-status" :class="{ ok: locationOk, warning: !locationOk && userLocation }">
            <div class="status-text">
              <div v-if="locatingUser">📍 Localisation en cours...</div>
              <div v-else-if="userLocation && locationOk">✓ Vous êtes près du restaurant</div>
              <div v-else-if="userLocation && !locationOk">⚠️ Vous êtes trop loin du restaurant ({{ distance.toFixed(0) }}m)</div>
              <div v-else>📍 Cliquez pour vous localiser</div>
            </div>
          </div>
          <Button
            type="button"
            @click="getCurrentLocation"
            :disabled="locatingUser"
            variant="secondary"
          >
            {{ locatingUser ? 'Localisation...' : 'Actualiser position' }}
          </Button>
        </div>

        <div v-if="userLocation" class="visit-info">
          <div class="input-group">
            <label for="visitDate">Date de la visite</label>
            <input
              id="visitDate"
              v-model="visitDate"
              type="date"
              :max="today"
              required
            />
          </div>

          <div class="input-group">
            <label for="visitTime">Heure de la visite (hh:mm)</label>
            <input
              id="visitTime"
              v-model="visitTime"
              type="time"
              required
            />
          </div>

          <div class="input-group">
            <label for="notes">Notes (optionnel)</label>
            <textarea
              id="notes"
              v-model="notes"
              placeholder="Partagez votre expérience..."
              rows="4"
            ></textarea>
          </div>
        </div>

        <Button
          type="submit"
          :disabled="submitDisabled || !userLocation"
          variant="primary"
        >
          {{ submitting ? 'Enregistrement...' : 'Enregistrer le check-in' }}
        </Button>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const restaurantId = parseInt(route.params.id as string)

const restaurant = ref(null)
const userLocation = ref(null)
const locatingUser = ref(false)
const loading = ref(true)
const error = ref('')
const success = ref(false)
const submitting = ref(false)
const newTampons = ref(null)
const unlockedHistoires = ref(null)

const visitDate = ref(new Date().toISOString().split('T')[0])
const visitTime = ref(new Date().toTimeString().slice(0, 5))
const notes = ref('')

const today = computed(() => new Date().toISOString().split('T')[0])

const distance = computed(() => {
  if (!userLocation.value || !restaurant.value) return Infinity
  const R = 6371000
  const dLat = (restaurant.value.lat - userLocation.value.lat) * Math.PI / 180
  const dLng = (restaurant.value.lng - userLocation.value.lng) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(userLocation.value.lat * Math.PI / 180) * Math.cos(restaurant.value.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
})

const locationOk = computed(() => distance.value <= 200)

const submitDisabled = computed(() => !visitDate.value || !visitTime.value || !locationOk.value)

onMounted(async () => {
  await loadRestaurant()
  await getCurrentLocation()
}
)

const loadRestaurant = async () => {
  try {
    restaurant.value = await $fetch(`/api/restaurants/${restaurantId}`)
  } catch (err: any) {
    error.value = 'Restaurant non trouvé'
    loading.value = false
  }
  loading.value = false
}

const getCurrentLocation = async () => {
  locatingUser.value = true
  if (!navigator.geolocation) {
    error.value = 'Géolocalisation non disponible'
    locatingUser.value = false
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      userLocation.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      locatingUser.value = false
    },
    () => {
      error.value = 'Activez la géolocalisation pour faire un check-in'
      locatingUser.value = false
    }
  )
}

const handleCheckin = async () => {
  if (!locationOk.value || !userLocation.value) {
    error.value = 'Vous devez être près du restaurant'
    return
  }

  submitting.value = true
  error.value = ''

  try {
    const token = localStorage.getItem('token')
    
    // Combine date and time into ISO string
    const visitDateTime = new Date(`${visitDate.value}T${visitTime.value}:00`)

    const response = await $fetch('/api/passport/checkin', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        restaurant_id: restaurantId,
        lat: userLocation.value.lat,
        lng: userLocation.value.lng,
        visited_at: visitDateTime.toISOString(),
        notes: notes.value,
      },
    })

    newTampons.value = response.newTampons || []
    unlockedHistoires.value = response.unlockedHistoires || []
    success.value = true
  } catch (err: any) {
    error.value = err.data?.statusMessage || 'Erreur lors du check-in'
  } finally {
    submitting.value = false
  }
}

const goBack = () => {
  navigateTo('/restaurants')
}

const redirectHome = () => {
  navigateTo('/')
}
</script>

<style scoped>
.checkin-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.header h1 {
  margin: 0;
  flex: 1;
}

.loading, .error {
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.error {
  color: #C8102E;
  background: #ffe6e6;
}

.success {
  text-align: center;
  color: #28a745;
}

.success h2 {
  color: #28a745;
  margin-top: 1rem;
}

.tampons, .histoires {
  background: #f0f0f0;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
  text-align: left;
}

.tampons h3, .histoires h3 {
  margin: 0 0 0.5rem 0;
  color: #C8102E;
}

.tampons p, .histoires p {
  margin: 0.25rem 0;
}

.restaurant-info {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.restaurant-info h2 {
  margin: 0 0 0.5rem 0;
  color: #C8102E;
}

.restaurant-info p {
  margin: 0.25rem 0;
  color: #666;
}

.checkin-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.location-check {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.location-status {
  flex: 1;
  padding: 1rem;
  border-radius: 4px;
  background: #f0f0f0;
  border-left: 4px solid #ffc107;
  text-align: center;
}

.location-status.ok {
  background: #e8f5e9;
  border-left-color: #28a745;
}

.status-text {
  font-weight: 500;
  color: #333;
}

.visit-info {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group:last-child {
  margin-bottom: 0;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.input-group input,
.input-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  box-sizing: border-box;
}

.input-group input:focus,
.input-group textarea:focus {
  outline: none;
  border-color: #C8102E;
  box-shadow: 0 0 0 2px rgba(200, 16, 46, 0.1);
}

.input-group textarea {
  resize: vertical;
}
</style>