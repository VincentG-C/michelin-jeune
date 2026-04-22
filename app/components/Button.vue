<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="['button', variant, { disabled }]"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  disabled: false,
})

defineEmits<{
  click: []
}>()
</script>

<style scoped>
.button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.primary {
  background-color: #C8102E;
  color: white;
}

.primary:hover:not(.disabled) {
  background-color: #a00d25;
}

.secondary {
  background-color: #f0f0f0;
  color: #333;
}

.secondary:hover:not(.disabled) {
  background-color: #e0e0e0;
}

.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>