<script setup>
import { ref } from 'vue'

const min = new Date(2020, 0, 1)
const max = new Date(2025, 10, 1)
const val = ref(new Date(2022, 4, 10))
function confirm() {
}
</script>

<template>
  <nut-date-picker
    v-model="val"
    :min-date="min"
    :max-date="max"
    :three-dimensional="false"
    @confirm="confirm"
  />
</template>
