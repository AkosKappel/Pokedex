<template>
  <div id="app">
    <AppHeader />
    <router-view/>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #466483;
}

body {
  margin: 0;
  background-color: #f4f2de;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0.5rem 0 2rem 0;
  column-gap: 10px;
}

.paginate-buttons {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  cursor: pointer;
  background-color: #5c82a9;
  color: #fff;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
  font-weight: 700;
  border: none;
}

.paginate-buttons:hover {
  background-color: #466483;
  color: #f1c40f;
}

.active-page {
  background-color: #466483;
  color: #f1c40f;
}
</style>
