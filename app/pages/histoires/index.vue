<template>
  <div class="stories-page">
    <div class="page-header">
      <h1>Histoires Michelin</h1>
      <p>Découvrez les récits gastronomiques de votre région</p>
    </div>

    <div class="tabs">
      <button
        :class="{ active: activeTab === 'all' }"
        @click="activeTab = 'all'"
      >
        Toutes les histoires
      </button>
      <button
        :class="{ active: activeTab === 'unlocked' }"
        @click="activeTab = 'unlocked'"
        v-if="isLoggedIn"
      >
        Mes histoires débloquées
      </button>
    </div>

    <div v-if="loading" class="loading">
      Chargement des histoires...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else>
      <StoryList
        :stories="currentStories"
        :is-unlocked-view="activeTab === 'unlocked'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const activeTab = ref('all')
const allStories = ref([])
const unlockedStories = ref([])
const loading = ref(true)
const error = ref('')
const isLoggedIn = ref(false)

const currentStories = computed(() => {
  return activeTab.value === 'unlocked' ? unlockedStories.value : allStories.value
})

onMounted(async () => {
  await loadStories()
  checkAuthStatus()
})

const loadStories = async () => {
  try {
    loading.value = true
    error.value = ''

    // Load all stories
    allStories.value = await $fetch('/api/histoires')

    // Load unlocked stories if logged in
    const token = localStorage.getItem('token')
    if (token) {
      try {
        unlockedStories.value = await $fetch('/api/histoires/unlocked', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      } catch (err) {
        // User not authenticated, that's ok
        unlockedStories.value = []
      }
    }
  } catch (err: any) {
    error.value = 'Erreur lors du chargement des histoires'
  } finally {
    loading.value = false
  }
}

const checkAuthStatus = () => {
  const token = localStorage.getItem('token')
  isLoggedIn.value = !!token
}

watch(activeTab, async (newTab) => {
  if (newTab === 'unlocked' && unlockedStories.value.length === 0) {
    await loadStories()
  }
})
</script>

<style scoped>
.stories-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.tabs button {
  padding: 0.75rem 1.5rem;
  border: 2px solid #C8102E;
  background: white;
  color: #C8102E;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tabs button.active {
  background: #C8102E;
  color: white;
}

.tabs button:hover {
  background: #C8102E;
  color: white;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
}

.error {
  color: #C8102E;
}
</style>