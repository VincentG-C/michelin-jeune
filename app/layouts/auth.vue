<template>
  <div class="auth-layout">
    <slot />
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  width: 100%;
  background-color: var(--color-michelin-red);
  color: var(--color-white);
  overflow-x: hidden;
}
</style>
