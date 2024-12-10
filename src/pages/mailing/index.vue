<script setup lang="ts">
import type { FormInstance } from '@nutui/nutui-taro'
import type { FormRules } from '@nutui/nutui-taro/dist/types/__VUE/form/types'
import { getContactInfos, getRepairTaskMailInsures } from '@/api'
import { getMailCompanies } from '@/api/modules/mail-companies'
import { ContactInfoSystemTypeEnum } from '@/enums'
import { useList } from '@/hooks'
import { $t } from '@/locales'
import { useAuthStore } from '@/stores/auth'

import { useTabbarStore } from '@/stores/tabbar'
import Taro, { nextTick, useDidShow } from '@tarojs/taro'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import Address from './modules/address.vue'
import AddressModal from './modules/address-modal.vue'

interface FormBO {
  mailCompany: string[]
  itemInfo: string
  nodeRemark: string
  senderContactInfoId: number
  receiverContactInfoId: number
  insure: number | undefined
  insureType: string[]
}

function baseForm(): FormBO {
  return {
    mailCompany: [],
    itemInfo: '',
    nodeRemark: '',
    senderContactInfoId: 0,
    receiverContactInfoId: 0,
    insure: undefined,
    insureType: [],
  } as FormBO
}

const form = ref(baseForm())
const rules: FormRules = {}
const formInstance = ref<FormInstance>()

const { list, getList } = useList(getMailCompanies, { size: 100, order: 'asc', valid: true })

const showMailCompanies = ref(false)

const currentMailCompany = computed(() => {
  if (!form.value.mailCompany?.length)
    return

  return list.value.find(item => item.type === form.value.mailCompany[0])
})

const { getList: getMailInsures, list: mailInsures } = useList(getRepairTaskMailInsures)

function handleMailCompanyChange() {
  form.value.insureType = []
  nextTick(() => {
    getMailInsures(form.value.mailCompany[0])
    showMailCompanies.value = false
  })
}

const showSendAddress = ref(false)
const customerId = computed(() => useAuthStore().userInfo?.customerId)

async function handleGetAddress(systemType: ContactInfoSystemTypeEnum) {
  const id = systemType === ContactInfoSystemTypeEnum.CUSTOMER ? customerId.value : 0
  const { content } = await getContactInfos({ size: 100, systemType, customerId: id })
  if (content.length > 0) {
    if (systemType === ContactInfoSystemTypeEnum.CUSTOMER) {
      form.value.senderContactInfoId = content.find(v => v.defaultContact)?.id || 0
    }
  }
  return content.map((v) => {
    return {
      ...v,
      fullAddress: `${v.province}-${v.city}-${v.county}-${v.address}`,
    }
  })
}

// 获取客户联系地址
const { list: contactInfos, getList: getContactInfosList } = useList(handleGetAddress, ContactInfoSystemTypeEnum.CUSTOMER)
const customerContactInfo = computed(() => {
  return contactInfos.value.find(v => v.id === form.value.senderContactInfoId)
})

// 显示中心地址
const showCenterAddress = ref(false)

// 获取中心地址
const { list: centerInfos, getList: getCenterInfosList } = useList(handleGetAddress, ContactInfoSystemTypeEnum.SYSTEM)
const centerContactInfo = computed(() => {
  return centerInfos.value.find(v => v.id === form.value.receiverContactInfoId)
})

const showAddressModal = ref(false)

const addressId = ref(0)

function handleShowAddressModal(id?: number) {
  addressId.value = id || 0
  showAddressModal.value = true
}

const showMailInsures = ref(false)

const formatMailInsures = computed(() => {
  return mailInsures.value.find(v => v.type === form.value.insureType[0])?.name
})

function handleShowMailInsures() {
  if (!form.value.mailCompany?.length) {
    Taro.showToast({
      title: '请先选择快递公司',
      icon: 'none',
    })
  }
  else {
    showMailInsures.value = true
  }
}

function formatNumberStr(input: string): string {
  // 提取数字部分
  const numStr = input.replace(/[^\d.]/g, '')
  if (numStr === '') {
    return ''
  }
  const num = Number.parseFloat(numStr)
  let result: string
  if (numStr.includes('.')) {
    // 保留两位小数
    result = num.toFixed(2)
  }
  else {
    result = num.toString()
  }
  // 添加千分位
  return result.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const { tabbarHeight } = storeToRefs(useTabbarStore())

onMounted(() => {
  getList().then(() => {
    if (list.value.length === 1) {
      form.value.mailCompany.push(list.value[0].type)
      handleMailCompanyChange()
    }
  })
  getContactInfosList()
  getCenterInfosList()
})

function handleConfirm() {

}
</script>

<template>
  <div :style="{ height: `calc(100vh - ${tabbarHeight} - 72px)` }" class="overflow-auto">
    <NutForm ref="formInstance" label-position="top" :rules="rules" :model-value="form">
      <NutFormItem label="维修件名称">
        <NutInput v-model="form.itemInfo" :placeholder="$t('common.form.pleaseInput')" type="text" />
      </NutFormItem>
      <NutFormItem label="送修说明">
        <NutTextarea v-model="form.nodeRemark" class="h-80" :placeholder="$t('common.form.pleaseInput')" />
      </NutFormItem>

      <NutCell title="快递公司" @click="showMailCompanies = true">
        <template #desc>
          <div>
            {{ currentMailCompany?.name || $t('common.form.pleaseSelect') }}
          </div>
        </template>
      </NutCell>

      <NutCell desc-text-align="left" center @click="showSendAddress = true">
        <template #icon>
          <div class="w-50 h-50 rounded-full bg-black text-white flex justify-center items-center">
            寄
          </div>
        </template>
        <template #desc>
          <div v-show="!customerContactInfo">
            {{ $t('mailing.tips.shipping-address') }}
          </div>
          <div v-show="customerContactInfo">
            <p class="flex gap-4">
              <span>{{ customerContactInfo?.userName }}</span>
              <span>{{ customerContactInfo?.phone }}</span>
            </p>
            <p>{{ customerContactInfo?.fullAddress }}</p>
          </div>
        </template>
      </NutCell>
      <NutCell desc-text-align="left" center @click="showCenterAddress = true">
        <template #icon>
          <div class="w-50 h-50 rounded-full bg-red text-white flex justify-center items-center">
            收
          </div>
        </template>
        <template #desc>
          <div v-show="!centerContactInfo">
            {{ $t('mailing.tips.receiving-address') }}
          </div>
          <div v-show="centerContactInfo">
            <p class="flex gap-4">
              <span>{{ centerContactInfo?.userName }}</span>
              <span>{{ centerContactInfo?.phone }}</span>
            </p>
            <p>{{ centerContactInfo?.fullAddress }}</p>
          </div>
        </template>
      </NutCell>

      <NutFormItem label="物品信息">
        <NutTextarea v-model="form.itemInfo" class="h-80" :placeholder="$t('common.form.pleaseInput')" type="text" />
      </NutFormItem>

      <NutCell title="保价方式" @click="handleShowMailInsures">
        <template #desc>
          <div>
            {{ formatMailInsures || $t('common.form.pleaseSelect') }}
          </div>
        </template>
      </NutCell>
      <NutFormItem v-if="form.insureType?.length" label="保价金额">
        <NutInput
          v-model="form.insure" :placeholder="$t('common.form.pleaseInput')" :formatter="formatNumberStr"
          format-trigger="onBlur"
        />
      </NutFormItem>
    </NutForm>
    <NutCell class="!fixed !m-0" :style="{ bottom: tabbarHeight }">
      <NutButton block type="primary" @click="handleConfirm">
        提交
      </NutButton>
    </NutCell>
    <NutPopup v-model:visible="showMailCompanies" position="bottom" z-index="9999" @close="showMailCompanies = false">
      <NutPicker
        v-model="form.mailCompany" :columns="list" :field-names="{ text: 'name', value: 'type' }"
        @confirm="handleMailCompanyChange" @cancel="showMailCompanies = false"
      />
    </NutPopup>
    <NutPopup v-model:visible="showMailInsures" position="bottom" z-index="9999" @close="showMailInsures = false">
      <NutPicker
        v-model="form.insureType" :columns="mailInsures" :field-names="{ text: 'name', value: 'type' }"
        @confirm="showMailInsures = false" @cancel="showMailCompanies = false"
      />
    </NutPopup>
    <Address
      v-model:visible="showSendAddress" v-model="form.senderContactInfoId" :show-action="true"
      :list="contactInfos" @update="getContactInfosList()" @action="handleShowAddressModal"
    />
    <Address
      v-model:visible="showCenterAddress" v-model="form.receiverContactInfoId" :show-action="false"
      :list="centerInfos"
    />
    <AddressModal
      :id="addressId" v-model:visible="showAddressModal" :customer-id="customerId!"
      @update="getContactInfosList()"
    />
  </div>
</template>

<style scoped></style>
