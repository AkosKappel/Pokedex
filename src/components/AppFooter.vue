<template>
  <footer class="footer">
    <div class="footer-container">
      <p>&copy; {{ title }} 2024</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  title: String,
});
</script>

<style scoped>
.footer {
  background-color: #2c3e50;
  padding: 24px 0;
  text-align: center;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
}

p {
  margin: 0;
  font-size: 14px;
  color: #ccc;
}
</style>
