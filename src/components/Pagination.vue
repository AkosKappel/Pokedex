<template>
</template>

<script setup lang="ts">
</script>

<style scoped>
.side-navigation {
  position: fixed;
  top: 50%;
}

.side-navigation button {
  background-color: #5c82a9;
  color: #fff;
  border: none;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1.5rem;
  padding: 0.5rem 1rem;
  margin: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 0.5rem;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease-in-out;
  border-radius: 50%;
  opacity: 0.8;
}

.side-navigation button:hover {
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.5);
  background-color: #466483;
  color: #f1c40f;
  opacity: 1;
}

.side-navigation button:disabled {
  display: none;
}

.side-navigation.prev {
  left: 0;
}

.side-navigation.next {
  right: 0;
}
</style>
