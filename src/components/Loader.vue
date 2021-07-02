<template>
  <teleport to="#loader">
    <div
      class="
        loading-container
        d-flex
        justify-content-center
        align-items-center
        h-100
      "
      :style="{ backgroundColor: background || '' }"
    >
      <div class="loading-content">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">{{ text || 'Loading...' }}</span>
        </div>
        <div>
          <p v-if="text" class="text-primary small">{{ text }}</p>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useDomCreate from '../hooks/useDomCreate';

export default defineComponent({
  props: {
    text: {
      type: String,
    },
    background: {
      type: String,
    },
  },
  setup() {
    useDomCreate('loader');
  },
});
</script>

<style scoped>
.loading-container {
  background: rgba(255, 255, 255, 0.5);
  width: 100%;
  height: 100%;
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  text-align: center;
}
</style>
