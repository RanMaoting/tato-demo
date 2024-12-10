<script setup lang="ts">
import type { ContactInfoApi } from '@/api'
import type { DistrictApi } from '@/api/modules/districts'
import type { FormInstance } from '@nutui/nutui-taro'
import type { FormRules } from '@nutui/nutui-taro/dist/types/__VUE/form/types'
import { addContactInfo, getContactInfoDetail, updateContactInfo } from '@/api'
import { getDistricts } from '@/api/modules/districts'
import { ContactInfoSystemTypeEnum } from '@/enums'
import { useList } from '@/hooks'
import { $t } from '@/locales'
import { onMounted, ref } from 'vue'

const props = defineProps<{
  id?: number
  customerId: number
}>()

const emit = defineEmits<{
  update: [void]
}>()
const visible = defineModel<boolean>('visible')

function baseForm(): Omit<ContactInfoApi.AddBO, 'systemType' | 'customerId'> & { addressStr: string, addressIds: number[] } {
  return {
    addressIds: [],
    addressStr: '',
    address: '',
    city: '',
    country: 'CN',
    county: '',
    defaultContact: false,
    phone: '',
    province: '',
    postalCode: '',
    userName: '',
  }
}

const form = ref(baseForm())

const rules: FormRules = {
  addressStr: [{
    required: true,
    message: $t('common.form.pleaseSelect'),
  }],
  address: [{
    required: true,
    message: $t('common.form.pleaseInput'),
  }],
  defaultContact: [{
    required: true,
    message: $t('common.form.pleaseInput'),
  }],
  phone: [{
    required: true,
    message: $t('common.form.pleaseInput'),
  }],
  userName: [{
    required: true,
    message: $t('common.form.pleaseInput'),
  }],

}

const formInstance = ref<FormInstance>()

function handleOpen() {
  if (props.id) {
    getContactInfoDetail(props.id).then(({ address, city, country, county, defaultContact, phone, province, postalCode, userName }) => {
      form.value = {
        ...baseForm(),
        address,
        city,
        country,
        county,
        defaultContact,
        phone,
        province,
        postalCode,
        userName,
        addressStr: `${province} ${city} ${country}`,
      }
    })
  }
}

const { list: province, getList: getProvinces } = useList(getDistricts, { size: 100, level: 1, order: 'asc' })

// 市
const { list: city, getList: getCities } = useList(getDistricts, { size: 100, level: 2, order: 'asc' })

// 区
const { list: country, getList: getCountries } = useList(getDistricts, { size: 100, level: 3, order: 'asc' })

const showAddress = ref(false)

function handleAddressChange(cal: { next: string, value: DistrictApi.ListVO }) {
  switch (cal.next) {
    case 'city':
      getCities({ parentId: cal.value.id })
      break
    case 'country':
      getCountries({ parentId: cal.value.id })
      break

    default:
      break
  }
}

function handleAddressClose({ data }: {
  data: {
    addressIdStr: string
    addressStr: string
    city: DistrictApi.ListVO
    country: DistrictApi.ListVO
    province: DistrictApi.ListVO
  }
}) {
  form.value.addressStr = data.addressStr
  form.value.province = data.province.name
  form.value.city = data.city.name
  form.value.county = data.country.name
}

async function handleConfirm() {
  const { valid } = await formInstance.value?.validate() as any
  if (valid) {
    const { address, city, country, county, defaultContact, phone, province, postalCode, userName } = form.value
    const data: ContactInfoApi.AddBO = {
      address,
      city,
      country,
      county,
      customerId: props.customerId,
      defaultContact,
      phone,
      province,
      postalCode,
      systemType: ContactInfoSystemTypeEnum.CUSTOMER,
      userName,
    }

    try {
      await (props.id ? updateContactInfo(data, props.id) : addContactInfo(data))
      visible.value = false
      emit('update')
    }
    catch {

    }
  }
}

onMounted(() => {
  getProvinces()
  city.value = [{} as any]
  country.value = [{} as any]
})
</script>

<template>
  <NutPopup v-model:visible="visible" position="bottom" z-index="9999" :style="{ height: '100%' }" @open="handleOpen">
    <NutForm ref="formInstance" label-position="left" :rules="rules" :model-value="form">
      <NutFormItem :label="$t('mailing.contact-infos.contact-address')" prop="addressStr" :show-error-message="false">
        <div class="w-full h-full" @click="showAddress = true">
          {{ form.addressStr || $t('common.form.pleaseSelect') }}
        </div>
      </NutFormItem>
      <NutFormItem :label="$t('mailing.contact-infos.detailed-address')" prop="address" :show-error-message="false">
        <NutInput v-model="form.address" :placeholder="$t('common.form.pleaseInput')" type="text" />
      </NutFormItem>
      <NutFormItem :label="$t('mailing.contact-infos.postal-code')" prop="postalCode" :show-error-message="false">
        <NutInput v-model="form.postalCode" :placeholder="$t('common.form.pleaseInput')" type="text" />
      </NutFormItem>
      <NutFormItem :label="$t('mailing.contact-infos.contacts')" prop="userName" :show-error-message="false">
        <NutInput v-model="form.userName" :placeholder="$t('common.form.pleaseInput')" type="text" />
      </NutFormItem>
      <NutFormItem :label="$t('mailing.contact-infos.phone')" prop="phone" :show-error-message="false">
        <NutInput v-model="form.phone" :placeholder="$t('common.form.pleaseInput')" type="text" />
      </NutFormItem>
      <NutFormItem :label="$t('mailing.contact-infos.default')" prop="defaultContact" :show-error-message="false">
        <NutSwitch v-model="form.defaultContact" />
      </NutFormItem>
      <div class="p-4 w-full flex gap-4 justify-center box-border">
        <nut-button shape="round" plain type="info" @click="visible = false">
          {{ $t('common.cancel') }}
        </nut-button>
        <nut-button shape="round" type="primary" @click="handleConfirm">
          {{ $t('common.confirm') }}
        </nut-button>
      </div>
    </NutForm>
    <NutAddress
      v-model:visible="showAddress" v-model="form.addressIds" :country="country" :province="province"
      :city="city" @change="handleAddressChange" @close="handleAddressClose"
    />
  </NutPopup>
</template>

<style scoped></style>
