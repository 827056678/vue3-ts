<template>
  <teleport to="#message">
    <div
      class="
        message-info
        alert
        fixed-top
        w-50
        mx-auto
        d-flex
        justify-content-between
        mt-2
      "
      :class="classObject"
      v-if="isVisible"
    >
      <span>{{ message }}</span>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        @click.prevent="hide"
      ></button>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRefs } from 'vue';
import useDomCreate from '../hooks/useDomCreate';
export type MessageType = 'success' | 'error' | 'default';

export default defineComponent({
  props: {
    message: {
      type: String,
    },
    type: {
      type: String as PropType<MessageType>,
      default: 'default',
    },
  },
  emits: ['close-message'],
  setup(props, context) {
    useDomCreate('message');

    const data = reactive({
      isVisible: true,
      classObject: {
        'alert-success': props.type === 'success',
        'alert-danger': props.type === 'error',
        'alert-primary': props.type === 'default',
      },
      hide: () => {
        data.isVisible = false;
        context.emit('close-message', true);
      },
    });
    return {
      ...toRefs(data),
    };
  },
});
</script>

<style scoped></style>
