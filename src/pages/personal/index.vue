<script lang="ts" setup>
import type { FormInstance } from '@nutui/nutui-taro'
import type { FormRules } from '@nutui/nutui-taro/dist/types/__VUE/form/types'
import { changePassword, smsCode, type UserApi } from '@/api'
import { SmsCodeTypeEnum } from '@/enums'
import { $t } from '@/locales'
import { useAuthStore } from '@/stores/auth'
import { encryptString } from '@/utils/shard'
import Taro from '@tarojs/taro'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'

const { statusBarHeight } = Taro.getSystemInfoSync()
const themeVars = ref({
  navbarBackground: 'transparent',
  navbarBoxShadow: 'none',
})

const authStore = useAuthStore()

const { userInfo } = storeToRefs(authStore)

const { fetchUserInfo } = authStore

const { logout } = useAuthStore()

function handleLogout() {
  logout()
}

const visible = ref(false)

const form = ref<UserApi.ChangePasswordBO & { confirmPassword: string }>({
  password: '',
  oldPassword: '',
  smsCode: '',
  confirmPassword: '',
})

const rules: FormRules = {
  oldPassword: [{
    required: true,
    message: $t('common.form.pleaseInput'),
  }],
  password: [{
    required: true,
    message: $t('common.form.pleaseInput'),
    validator(value: string) {
      if (form.value.confirmPassword) {
        if (value !== form.value.confirmPassword) {
          return Promise.reject($t('两次密码不一致'))
        }
      }
      else {
        if (!value) {
          return Promise.reject($t('common.form.pleaseInput'))
        }
      }
      return Promise.resolve()
    },
  }],
  confirmPassword: [{
    required: true,
    message: $t('common.form.pleaseInput'),
    validator(value: string) {
      if (form.value.password) {
        if (value !== form.value.password) {
          return Promise.reject($t('两次密码不一致'))
        }
      }
      else {
        if (!value) {
          return Promise.reject($t('common.form.pleaseInput'))
        }
      }
      return Promise.resolve()
    },
  }],
  smsCode: [{
    required: true,
    message: $t('common.form.pleaseInput'),
  }],
}

const formInstance = ref<FormInstance>()

const showCode = ref(false)
const disabledCode = ref(false)

let timer: any
const num = ref(0)
async function handleGetCode() {
  await smsCode({
    phone: userInfo.value!.phone,
    type: SmsCodeTypeEnum.VERIFY_PHONE,
  })
  disabledCode.value = true
  if (timer) {
    clearInterval(timer)
  }
  num.value = 60
  timer = setInterval(() => {
    num.value--
    if (num.value === 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const showToast = ref(false)

async function handleConfirm() {
  const { valid } = await formInstance.value?.validate() as any
  if (!valid)
    return
  const { oldPassword, smsCode, password } = form.value
  const data: UserApi.ChangePasswordBO = {
    password: encryptString(password),
    oldPassword: oldPassword ? encryptString(oldPassword) : undefined,
    smsCode: smsCode || undefined,
  }
  await changePassword(data)
  visible.value = false
  showToast.value = true
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<template>
  <div
    class="h-screen relative box-border p-4"
    style="background: linear-gradient( 180deg, #F3F7FF 30%, rgba(255,243,243,0) 60%, transparent 100%)"
    :style="{ paddingTop: `${statusBarHeight}px` }"
  >
    <div class="w-400 h-500 absolute -right-100 -top-200 rounded-full" style="background: #90B5FF; filter: blur(100rpx);" />
    <NutConfigProvider :theme-vars="themeVars">
      <nut-navbar title="我的" placeholder safe-area-inset-top />
    </NutConfigProvider>
    <div class="w-full my-10 flex items-center px-4">
      <NutAvatar size="large" bg-color="#90B5FF" color="#fff">
        <span class="text-56">
          {{ userInfo?.name[0] }}
        </span>
      </NutAvatar>
      <div class="ml-3 text-32 font-bold">
        {{ userInfo?.name }}
      </div>
    </div>
    <NutCell title="修改密码" @click="visible = true">
      <template #icon>
        <div class="i-material-symbols:passkey-outline bg-primary text-xl" />
      </template>
    </NutCell>
    <NutCell title="退出登录" @click="handleLogout">
      <template #icon>
        <div class="i-material-symbols:logout bg-primary text-xl" />
      </template>
    </NutCell>
    <NutPopup v-model:visible="visible" position="bottom" z-index="9999" :style="{ height: '70%' }" round>
      <NutForm ref="formInstance" label-position="left" :rules="rules" :model-value="form">
        <NutCell title="登录账号" :desc="userInfo?.username" />
        <NutCell title="手机号" :desc="userInfo?.phone" />
        <NutCell v-if="userInfo?.phone" @click="showCode = !showCode">
          <div class="text-primary w-full text-center">
            {{ showCode ? '已有密码?' : '忘记密码?' }}
          </div>
        </NutCell>
        <NutFormItem v-if="!showCode" label="旧密码" prop="oldPassword">
          <NutInput v-model="form.oldPassword" :placeholder="$t('common.form.pleaseInput')" type="text" />
        </NutFormItem>
        <NutFormItem v-if="showCode" label="验证码" prop="smsCode">
          <NutInput v-model="form.smsCode" :placeholder="$t('common.form.pleaseInput')" type="text">
            <template #right>
              <NutButton size="small" type="primary" class="!w-300" :disabled="disabledCode" @click="handleGetCode">
                <div class="w-250 flex items-center justify-center">
                  获取验证码 <span v-show="num > 0">({{ num }}s)</span>
                </div>
              </NutButton>
            </template>
          </NutInput>
        </NutFormItem>
        <NutFormItem label="新密码" prop="password">
          <NutInput v-model="form.password" :placeholder="$t('common.form.pleaseInput')" type="password" />
        </NutFormItem>
        <NutFormItem label="确认密码" prop="confirmPassword">
          <NutInput v-model="form.confirmPassword" :placeholder="$t('common.form.pleaseInput')" type="password" />
        </NutFormItem>
        <NutCell>
          <div class="text-primary w-full flex justify-center gap-4">
            <NutButton @click="visible = false">
              {{ $t('common.cancel') }}
            </NutButton>
            <NutButton type="primary" @click="handleConfirm">
              {{ $t('common.confirm') }}
            </NutButton>
          </div>
        </NutCell>
      </NutForm>
    </NutPopup>
    <NutToast v-model:visible="showToast" type="success" :title="$t('common.status.operation-successful')" />
  </div>
</template>
