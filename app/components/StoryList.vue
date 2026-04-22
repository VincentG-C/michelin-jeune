<template>
  <div class="story-list">
    <div class="story-grid">
      <StoryCard
        v-for="story in stories"
        :key="story.id"
        :title="story.titre"
        :image-url="story.imageCarteUrl"
        :condition="story.conditionUnlock"
        :unlocked-at="story.unlockedAt"
        :show-condition="!isUnlockedView"
        @click="handleStoryClick(story)"
      />
    </div>
    <div v-if="stories.length === 0" class="no-stories">
      <p>{{ isUnlockedView ? 'Aucune histoire débloquée pour le moment.' : 'Aucune histoire disponible.' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Story {
  id: number
  titre: string
  imageCarteUrl?: string
  conditionUnlock?: any
  unlockedAt?: string
}

interface Props {
  stories: Story[]
  isUnlockedView?: boolean
}

withDefaults(defineProps<Props>(), {
  isUnlockedView: false,
})

const handleStoryClick = (story: Story) => {
  if (story.unlockedAt || !story.conditionUnlock) {
    navigateTo(`/histoires/${story.id}`)
  } else {
    // Could show a message about unlock condition
    alert('Cette histoire n\'est pas encore débloquée.')
  }
}
</script>

<style scoped>
.story-list {
  padding: 1rem 0;
}

.story-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.no-stories {
  text-align: center;
  padding: 2rem;
  color: #666;
}
</style>