<template>
  <div class="story-page">
    <div v-if="loading" class="loading">
      Chargement de l'histoire...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="story" class="story-content">
      <div class="story-header">
        <Button variant="secondary" @click="goBack">
          ← Retour aux histoires
        </Button>
        <h1>{{ story.titre }}</h1>
      </div>

      <div class="story-body">
        <div v-if="story.imageCarteUrl" class="story-image">
          <img :src="story.imageCarteUrl" :alt="story.titre" />
        </div>

        <div class="story-text" v-html="formattedContent"></div>
      </div>
    </div>

    <div v-else class="not-found">
      <h2>Histoire non trouvée</h2>
      <p>Cette histoire n'existe pas ou n'est pas accessible.</p>
      <Button @click="goBack">Retour aux histoires</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const storyId = parseInt(route.params.id as string)
const story = ref(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  await loadStory()
})

const loadStory = async () => {
  try {
    loading.value = true
    error.value = ''

    const token = localStorage.getItem('token')
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    story.value = await $fetch(`/api/histoires/${storyId}`, { headers })
  } catch (err: any) {
    if (err.statusCode === 404) {
      story.value = null
    } else {
      error.value = err.data?.statusMessage || 'Erreur lors du chargement de l\'histoire'
    }
  } finally {
    loading.value = false
  }
}

const formattedContent = computed(() => {
  if (!story.value?.contenu) return ''
  // Simple text formatting - could be enhanced with markdown parsing
  return story.value.contenu.replace(/\n/g, '<br>')
})

const goBack = () => {
  navigateTo('/histoires')
}
</script>

<style scoped>
.story-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
}

.error {
  color: #C8102E;
}

.story-header {
  margin-bottom: 2rem;
}

.story-header h1 {
  margin-top: 1rem;
  color: #C8102E;
}

.story-body {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.story-image {
  margin-bottom: 2rem;
  text-align: center;
}

.story-image img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.story-text {
  line-height: 1.8;
  color: #333;
}

.not-found {
  text-align: center;
  padding: 2rem;
}

.not-found h2 {
  color: #C8102E;
}
</style>