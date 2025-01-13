<template>
  <button class="back-button" @click="router.back()" title="Go back to previous page">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="feather feather-chevron-left"
    >
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  </button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<style scoped>
.back-button {
  position: fixed;
  top: 40px;
  left: 20px;
  width: 40px;
  height: 40px;
  background-color: #fff;
  border-radius: 50%;
  border-width: 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button:hover {
  background-color: #f5f5f5;
  opacity: 1;
}

.back-button svg {
  width: 20px;
  height: 20px;
  stroke: #666;
}
</style>
