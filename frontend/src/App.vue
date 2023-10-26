<script setup lang="ts">
import { useStore } from 'vuex';

const store = useStore()
const inc = (event: MouseEvent) => {
  console.log(event)
  
  if (event.button == 1) store.commit('inc')
  else store.commit('dec')
}
</script>

<template>
  <div class="d" @click="inc">{{ store.getters.val }}</div>
  <router-view />
</template>