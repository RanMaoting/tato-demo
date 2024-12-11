<script setup lang="ts">
import { useTabbarStore } from '@/stores/tabbar'
import { storeToRefs } from 'pinia'

const { pageHeight } = storeToRefs(useTabbarStore())
</script>

<template>
  <scroll-view class=" w-full" :style="{ height: pageHeight }" :scroll-y="true">
    <div class="w-full p-4 box-border flex flex-col gap-4">
      <div class="text-sm w-full p-4 shadow-md box-border rounded-lg grid grid-cols-[1fr_minmax(50rpx,max-content)] grid-rows-[repeat(3,minmax(20rpx,max-content))]">
        <div class="font-bold text-base truncate">
          sanyo 投影仪
        </div>
        <NutTag type="success">
          已完成
        </NutTag>
        <div class="col-span-2 flex gap-4 py-2">
          <span>邮寄时间:</span>
          <span>2024-07-20</span>
        </div>
        <div class="col-span-2">
          <div class="flex items-center justify-between gap-2 text-primary text-sm font-500 border-t-2 border-gray-100 border-t-solid pt-4 ">
            <span>物流查询</span>
            <span class="i-material-symbols:chevron-right-rounded text-xl" />
          </div>
          <div v-show="false" class="flex gap-4">
            <span>邮寄时间:</span>
            <span>2024-07-20</span>
          </div>
        </div>
      </div>
    </div>
  </scroll-view>
</template>

<style scoped>

</style>
