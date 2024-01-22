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
</style>
