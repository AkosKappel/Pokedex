<template>
  <div>
    <h1>Page not found</h1>
    <img src="../assets/custom-404.png" alt="404" />
    <span>Sorry, the page you are looking for does not exist.</span>
    <router-link to="/">
      <button>Go Back Home</button>
    </router-link>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}

img {
  width: 100%;
  height: auto;
  margin: 1rem 0;
}

h1 {
  font-size: 2rem;
  margin: 0;
}

span {
  font-size: 1.2rem;
  margin: 1rem 0;
}

button {
  text-decoration: none;
  color: #eee;
  background-color: #5c82a9;
  font-weight: 700;
  font-size: 1.2rem;
  border: 2px solid #111;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  margin-top: 1rem;
}

button:hover {
  background-color: #466483;
  color: #f1c40f;
}
</style>
