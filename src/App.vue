<template>
  <div class="container">
    <global-header :user="currentUser"></global-header>
    <loader v-if="isLoading"></loader>
    <router-view />
    <global-footer></global-footer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, watch } from 'vue';
import axios from './utils/http';
import { useStore } from 'vuex';
import { GlobalDataProps } from './store';
import GlobalHeader from './components/GlobalHeader.vue';
import GlobalFooter from './components/GlobalFooter.vue';
import Loader from './components/Loader.vue';
import useCreateMessage from './hooks/useCreateMessage';

export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    GlobalFooter,
    Loader,
  },
  setup() {
    const store = useStore<GlobalDataProps>();
    const currentUser = computed(() => store.state.user);
    const isLoading = computed(() => store.state.loading);
    const token = computed(() => store.state.token);
    const error = computed(() => store.state.error);

    onMounted(() => {
      if (!currentUser.value.isLogin && token.value) {
        axios.defaults.headers.common.Authorization = `Bearer ${token.value}`;
        store.dispatch('fetchCurrentUser');
      }
    });

    watch(
      () => error.value.status,
      () => {
        const { status, message } = error.value;
        if (status && message) {
          useCreateMessage(message, 'error');
        }
      }
    );

    return {
      currentUser,
      isLoading,
      error,
    };
  },
});
</script>

<style scoped></style>
