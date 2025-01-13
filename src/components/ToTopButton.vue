<template>
  <button v-show="showButton" class="to-top-button" @click="scrollToTop">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="feather feather-chevron-up"
    >
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineProps } from 'vue';

const props = defineProps({
  scrollThreshold: {
    type: Number,
    default: 320,
  },
});

const showButton = ref(false);

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function onScroll() {
  showButton.value = window.scrollY > props.scrollThreshold;
}

onMounted(() => {
  window.addEventListener('scroll', onScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>

<style scoped>
.to-top-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #fff;
  border: none;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s ease-in-out;
}

.to-top-button:hover {
  background-color: #f5f5f5;
  opacity: 1;
}

.to-top-button svg {
  width: 20px;
  height: 20px;
  stroke: #666;
}
</style>
