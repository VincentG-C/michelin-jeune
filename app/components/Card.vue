<template>
  <div class="card">
    <slot />
  </div>
</template>

<script setup lang="ts">
// No props needed for basic card
</script>

<style scoped>
.card {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>