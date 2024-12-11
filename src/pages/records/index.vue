<script setup lang="ts">
import { onMounted, ref } from 'vue'
// @unocss-include
const icon = ref('i-assets_cl_mailing')

// onMounted(() => {
//   setTimeout(() => {
//     icon.value = 'i-assets:mailing'
//   }, 5000)
// })
</script>

<template>
  <div>
    123
    <div class="i-assets:mailing text-primary w-250 h-250" />
    <div class=" text-primary w-250 h-250" :class="icon" />
  </div>
</template>

<style scoped>

</style>
