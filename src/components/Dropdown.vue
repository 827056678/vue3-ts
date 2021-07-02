<template>
  <div class="dropdown" ref="dropdownRef">
    <a
      @click.prevent="toggleOpen"
      class="btn btn-outline-light my-2 dropdown-toggle"
      href="#"
    >
      {{ title }}
    </a>
    <ul v-if="isOpen" class="dropdown-menu" :style="{ display: 'block' }">
      <slot></slot>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import useClickOutside from '../hooks/useClickOutside';

export default defineComponent({
  name: 'Dropdown',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  setup() {
    const dropdownRef = ref<null | HTMLElement>(null);
    const isOpen = ref(false);
    const toggleOpen = () => {
      isOpen.value = !isOpen.value;
    };

    const isClickOutside = useClickOutside(dropdownRef);

    watch(isClickOutside, () => {
      if (isOpen.value && isClickOutside.value) {
        isOpen.value = false;
      }
    });
    return { dropdownRef, isOpen, toggleOpen };
  },
});
</script>

<style scoped></style>
