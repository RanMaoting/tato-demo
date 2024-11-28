<script setup lang="ts">
import type { FormInstance } from '@nutui/nutui-taro'
import type { FormRules } from '@nutui/nutui-taro/dist/types/__VUE/form/types'
import { getContactInfos } from '@/api'
import { getMailCompanies } from '@/api/modules/mail-companies'
import { ContactInfoSystemTypeEnum } from '@/enums'
import { useList } from '@/hooks'
import { $t } from '@/locales'
import { computed, onMounted, ref } from 'vue'

import Address from './modules/address.vue'

interface FormBO {
  mailCompany: string[]
  itemInfo: string
  nodeRemark: string
  customerContactInfoId: number
}

function baseForm(): FormBO {
  return {
    mailCompany: [],
    itemInfo: '',
    nodeRemark: '',
    customerContactInfoId: 0,
  } as FormBO
}

const form = ref(baseForm())
const rules: FormRules = {}
const formInstance = ref<FormInstance>()

const { list, getList } = useList(getMailCompanies, { size: 100 })

const showMailCompanies = ref(false)

const currentMailCompany = computed(() => {
  if (!form.value.mailCompany?.length)
    return

  return list.value.find(item => item.type === form.value.mailCompany[0])
})

function handleMailCompanyChange() {
  // nextTick(() => {
  //   console.log(form.value.mailCompany)
  // })

  showMailCompanies.value = false
}

const showAddress = ref(false)

async function handleGetAddress(systemType: ContactInfoSystemTypeEnum) {
  const { content } = await getContactInfos({ size: 100, systemType })
  return content.map((v) => {
    return {
      ...v,
      fullAddress: `${v.province}-${v.city}-${v.county}-${v.address}`,
    }
  })
}

// 获取客户联系地址
const { list: contactInfos, getList: getContactInfosList } = useList(handleGetAddress, ContactInfoSystemTypeEnum.CUSTOMER)

onMounted(() => {
  getList()
  getContactInfosList()
})
</script>

<template>
  <NutForm ref="formInstance" label-position="top" :rules="rules" :model-value="form">
    <NutFormItem label="维修件名称">
      <NutInput v-model="form.itemInfo" :placeholder="$t('common.form.pleaseInput')" type="text" />
    </NutFormItem>
    <NutFormItem label="送修说明">
      <NutTextarea v-model="form.nodeRemark" :placeholder="$t('common.form.pleaseInput')" />
    </NutFormItem>

    <NutCell title="快递公司" @click="showMailCompanies = true">
      <template #desc>
        <div>
          {{ currentMailCompany?.name || $t('common.form.pleaseSelect') }}
        </div>
      </template>
    </NutCell>

    <NutCell desc-text-align="left" center @click="showAddress = true">
      <template #icon>
        <div class="w-50 h-50 rounded-full bg-black text-white flex justify-center items-center">
          寄
        </div>
      </template>
      <template #desc>
        <div>
          123
        </div>
      </template>
    </NutCell>

    <NutFormItem label="维修件名称">
      <NutInput v-model="form.name" :placeholder="$t('common.form.pleaseInput')" type="text" />
    </NutFormItem>
    <NutFormItem label="维修件名称">
      <NutInput v-model="form.name" :placeholder="$t('common.form.pleaseInput')" type="text" />
    </NutFormItem>
  </NutForm>
  <NutPopup v-model:visible="showMailCompanies" position="bottom" z-index="9999" @close="showMailCompanies = false">
    <NutPicker
      v-model="form.mailCompany" :columns="list" :field-names="{ text: 'name', value: 'type' }"
      @confirm="handleMailCompanyChange" @cancel="showMailCompanies = false"
    />
  </NutPopup>
  <Address
    v-model:visible="showAddress" v-model="form.customerContactInfoId" :list="contactInfos"
    @update="getContactInfosList()"
  />
</template>

<style scoped></style>
