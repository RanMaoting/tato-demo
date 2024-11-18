<template>
  <view class="index">
    <Counter />
  </view>
</template>

<script>
import './index.scss'
import Counter from '../../components/Counter.vue'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Index',
  components: {
    Counter
  }
}
</script>
