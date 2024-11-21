<script>
import { ref } from 'vue'
import { useCounterStore } from '../stores/counter'

export default {
  setup() {
    const counter = ref(1)

    const onAdd = () => {
      counter.value++
      console.log(counter.value)

      // with autocompletion ✨
      // counter.$patch({count: counter.count + 1})

      // or using an action instead
      // counter.increment()
    }

    return {
      counter,
      onAdd,
    }
  },
}
</script>

<template>
  <view class="bg-red h-100vh">
    <text class="title">
      {{ counter }}
    </text>
    <view class="button" @tap="onAdd">
      ADD
    </view>
  </view>
</template>

<style>
.title {
  font-size: 32px;
}

.button {
  border: 1px solid lightgray;
  padding: 5px 10px;
  background-color: red;
}
</style>
