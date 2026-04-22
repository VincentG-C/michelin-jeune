<template>
  <Card class="story-card" @click="$emit('click')">
    <div class="story-image" v-if="imageUrl">
      <img :src="imageUrl" :alt="title" />
    </div>
    <div class="story-content">
      <h3>{{ title }}</h3>
      <div class="unlock-condition" v-if="showCondition && condition">
        <small>{{ formatCondition(condition) }}</small>
      </div>
      <div class="unlock-status" v-if="unlockedAt">
        <small>Débloquée le {{ formatDate(unlockedAt) }}</small>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
interface Props {
  title: string
  imageUrl?: string
  condition?: any
  unlockedAt?: string
  showCondition?: boolean
}

withDefaults(defineProps<Props>(), {
  showCondition: false,
})

defineEmits<{
  click: []
}>()

const formatCondition = (condition: any) => {
  if (!condition) return ''
  // Simple formatting for unlock conditions
  if (condition.type === 'checkins') {
    return `${condition.count} check-ins requis`
  }
  if (condition.type === 'restaurants') {
    return `${condition.count} restaurants visités requis`
  }
  return 'Condition spéciale'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}
</script>

<style scoped>
.story-card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.story-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.story-image {
  margin-bottom: 1rem;
}

.story-image img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}

.story-content h3 {
  margin: 0 0 0.5rem 0;
  color: #C8102E;
}

.unlock-condition {
  color: #666;
  font-style: italic;
}

.unlock-status {
  color: #28a745;
  font-weight: 500;
}
</style>