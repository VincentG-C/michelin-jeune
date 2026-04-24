<template>
  <div class="page-container">
    <div class="main-content">
      <slot />
    </div>
    
    <nav class="bottom-nav">
      <NuxtLink to="/histoires" class="nav-item" active-class="active">
        <img src="/images/icon-histoire.png" alt="Histoire" class="nav-icon nav-icon-histoire" />
      </NuxtLink>
      
      <NuxtLink to="/" class="nav-item" active-class="active" exact-active-class="active">
        <img src="/images/icon-map.svg" alt="Map" class="nav-icon nav-icon-map" />
      </NuxtLink>
      
      <NuxtLink to="/profil" class="nav-item" active-class="active">
        <img src="/images/icon-profil.svg" alt="Profil" class="nav-icon" />
      </NuxtLink>
    </nav>
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding-bottom: 100px;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 64px;
  background-color: #F4F1EA;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-bottom: env(safe-area-inset-bottom, 8px);
  z-index: 1000;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-dark-gray);
  transition: all 0.3s ease;
  width: 33%;
  height: 100%;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 4px;
  background-color: #BA0B2F;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}

.nav-item .nav-icon {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  width: 24px;
  height: 24px;
  object-fit: contain;
}

/* The histoire/flower icon needs more space to not get squished */
.nav-item .nav-icon-histoire {
  width: 28px;
  height: 28px;
}

.nav-item.active {
  color: var(--color-michelin-red);
}

.nav-item.active .nav-icon {
  transform: scale(1.15);
  /* Filter to convert black to #BA0B2F */
  filter: invert(12%) sepia(87%) saturate(5484%) hue-rotate(345deg) brightness(85%) contrast(106%);
}

/* Specific rule for map icon since it's naturally red */
.nav-item:not(.active) .nav-icon-map {
  filter: grayscale(100%) brightness(0);
  opacity: 0.8;
}

/* Ensure map icon active state doesn't stack multiple filters */
.nav-item.active .nav-icon-map {
  filter: none !important;
}
</style>
