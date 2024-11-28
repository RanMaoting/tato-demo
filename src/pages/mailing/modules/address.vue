<script setup lang="ts">
import { type ContactInfoApi, deleteContactInfo } from '@/api'
import { $t } from '@/locales'
import Taro from '@tarojs/taro'
import { ref } from 'vue'

defineProps<{
  list: ContactInfoApi.ListVO[]
}>()

const emit = defineEmits<{
  update: [void]
}>()

const visible = defineModel<boolean>('visible')

const selectedId = defineModel<number | null>()

let addressId: number
const showRemoveAddress = ref(false)

function handleRemoveAddress(_: PointerEvent, item: ContactInfoApi.ListVO) {
  addressId = item.id
  showRemoveAddress.value = true
}

function handleRemoveAddressConfirm() {
  // showRemoveAddress.value = false
  if (addressId) {
    deleteContactInfo(addressId).then(() => {
      Taro.showToast({ title: $t('common.status.operation-successful'), icon: 'success' })
      emit('update')
      if (selectedId.value === addressId) {
        selectedId.value = 0
      }
    })
  }
}

function handleChooseAddress(_: PointerEvent, item: ContactInfoApi.ListVO) {
  selectedId.value = item.id
  visible.value = false
  Taro.showToast({ title: $t('common.status.operation-successful'), icon: 'success' })
}
</script>

<template>
  <NutPopup
    v-model:visible="visible"
    position="bottom" z-index="9999"
    :style="{ height: '70%' }"
    round
  >
    <NutAddressList
      :data="list"
      :data-options="{
        addressName: 'userName',
        defaultAddress: 'defaultContact',
      }"
      @del-icon="handleRemoveAddress"
      @click-item="handleChooseAddress"
    />
  </NutPopup>
  <NutDialog v-model:visible="showRemoveAddress" :title="$t('common.tips.title')" @ok="handleRemoveAddressConfirm">
    {{ $t('common.tips.delete') }}
  </NutDialog>
</template>

<style scoped></style>
