<template>
  <!-- A Pokédex: lens and status lights above the hinge line, a dex entry on the screen. -->
  <svg viewBox="0 0 40 48" class="logo" aria-hidden="true">
    <path d="M8 2h13l4 5h7a6 6 0 0 1 6 6v27a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8a6 6 0 0 1 6-6Z" class="body" />
    <path d="M2 18h14l4-4h18" fill="none" class="line" stroke-width="2" />
    <circle cx="10.5" cy="10" r="5.6" class="ring" />
    <circle cx="10.5" cy="10" r="4" fill="#2e8fd8" />
    <circle cx="9.1" cy="8.6" r="1.4" fill="#c8ecff" />
    <circle cx="22" cy="11" r="1.5" fill="#ff5a5f" />
    <circle cx="26.5" cy="11" r="1.5" fill="#ffd23f" />
    <circle cx="31" cy="11" r="1.5" fill="#5bd16d" />
    <rect x="7" y="23" width="26" height="17" rx="2.5" fill="#1b2a3a" />
    <rect x="9.5" y="25.5" width="21" height="12" rx="1" fill="#a8e6b0" />
    <circle cx="15" cy="31.5" r="3.4" fill="#1b2a3a" />
    <path d="M21 29h7M21 32h7M21 35h4" stroke="#1b2a3a" stroke-width="1.5" stroke-linecap="round" />
  </svg>
</template>

<style scoped>
/* Drawn for the red header: a white device with red details. */
.body {
  fill: #fff;
}

.line {
  stroke: var(--red);
}

.ring {
  fill: var(--red);
}
</style>
