<script lang="ts" setup>
import type { UserApi } from '@/api'
import type { FormInstance } from '@nutui/nutui-taro'
import type { FormRules } from '@nutui/nutui-taro/dist/types/__VUE/form/types'
import { smsCode, smsWechatToken, wechatTokenWithPassword } from '@/api'
import { SmsCodeTypeEnum, WechatTokenTypeEnum } from '@/enums'
import { $t } from '@/locales'
import { useAccessStore } from '@/stores'
import { getStaticUrl } from '@/utils/api'
import { encryptString } from '@/utils/shard'
import Taro from '@tarojs/taro'
import { ref } from 'vue'

defineOptions({
  name: 'Login',
})

enum TabKeyEnum {
  USER_NAME = 'USER_NAME',
  CODE = 'CODE',
}

const value = ref<TabKeyEnum>(TabKeyEnum.USER_NAME)

const tabs = ref<BaseVO<TabKeyEnum>[]>([
  {
    name: $t('login.account-login'),
    id: TabKeyEnum.USER_NAME,
  },
  {
    name: $t('login.code-login'),
    id: TabKeyEnum.CODE,
  },
])

const loginForm = ref<UserApi.SmsWechatTokenBO & UserApi.WechatTokenWithPasswordBO>({
  username: 'A02750',
  password: 'hyx20181030',
  code: '',
  phone: '',
  smsCode: '',
  type: WechatTokenTypeEnum.MINI_PROGRAM,
})

const rules: FormRules = {
  username: [
    {

      message: $t('common.form.pleaseInput'),
      validator: (str: string) => {
        if (value.value === TabKeyEnum.USER_NAME) {
          return !!str
        }
        else {
          return true
        }
      },
    },
  ],
  password: [
    {

      message: $t('common.form.pleaseInput'),
      validator: (str: string) => {
        if (value.value === TabKeyEnum.USER_NAME) {
          return !!str
        }
        else {
          return true
        }
      },
    },
  ],
  smsCode: [
    {

      message: $t('common.form.pleaseInput'),
      validator: (str: string) => {
        if (value.value === TabKeyEnum.CODE) {
          return !!str
        }
        else {
          return true
        }
      },
    },
  ],
  phone: [
    {

      message: $t('common.form.pleaseInput'),
      validator: (str: string) => {
        if (value.value === TabKeyEnum.CODE) {
          return !!str
        }
        else {
          return true
        }
      },
    },
  ],
}

const formInstance = ref<FormInstance>()

const num = ref(0)
let timer: NodeJS.Timeout
function handleSendSmsCode() {
  if (timer) {
    clearInterval(timer)
  }
  smsCode({
    phone: loginForm.value.phone,
    type: SmsCodeTypeEnum.LOGIN,
  }).then(() => {
    num.value = 60
    timer = setInterval(() => {
      num.value--
      if (num.value === 0) {
        clearInterval(timer)
      }
    }, 1000)
  })
}

const accessStore = useAccessStore()

async function handleConfirm() {
  const { valid } = await formInstance.value?.validate() as any

  if (valid) {
    const { username, password, phone, smsCode, type } = loginForm.value
    const { code } = await Taro.login()
    if (code) {
      try {
        let data: UserApi.WechatTokenVO

        if (value.value === TabKeyEnum.USER_NAME) {
          data = await wechatTokenWithPassword({
            username,
            password: encryptString(password),
            code,
            type,
          })
        }
        else {
          data = await smsWechatToken({
            phone,
            smsCode,
            type,
            code,
          })
        }

        accessStore.setAccessToken(data.access_token)
        accessStore.setRefreshToken(data.refresh_token)
        // 跳转至homePage页面进行其他判断
        Taro.reLaunch({
          url: '/pages/homePage/index',
        })
      }
      catch (error) {
        if (error.data?.msg) {
          Taro.showToast({
            icon: 'none',
            title: error.data.msg,
          })
        }
      }
    }
  }
}
</script>

<template>
  <view class="h-100vh relative w-full ">
    <div
      class="h-40% flex flex-col justify-center pl-10 text-white bg-cover bg-blue bg-no-repeat"
      :style="{ backgroundImage: `url(${getStaticUrl('/login-bg.png')})` }"
    >
      <h1 class="text-3xl mb-4">
        欢迎登录
      </h1>
      <p>
        航材维护管理小程序
      </p>
    </div>
    <div class="h-70% bg-white rounded-t-lg p-4 box-border absolute bottom-0 w-full">
      <NutForm ref="formInstance" label-position="left" :rules :model-value="loginForm">
        <nut-tabs v-model="value">
          <nut-tab-pane v-for="item in tabs" :key="item.id" :title="item.name" :pane-key="item.id">
            <template v-if="item.id === TabKeyEnum.USER_NAME">
              <nut-form-item :label="$t('login.username')" prop="username" :show-error-message="false">
                <nut-input v-model="loginForm.username" :placeholder="$t('common.form.pleaseInput')" type="text" />
              </nut-form-item>
              <nut-form-item :label="$t('login.password')" prop="password" :show-error-message="false">
                <nut-input v-model="loginForm.password" :placeholder="$t('common.form.pleaseInput')" type="text" />
              </nut-form-item>
            </template>
            <template v-else>
              <nut-form-item :label="$t('login.phone-number')" prop="phone" :show-error-message="false">
                <nut-input v-model="loginForm.phone" :placeholder="$t('common.form.pleaseInput')" type="text" />
              </nut-form-item>
              <nut-form-item :label="$t('login.code')" prop="smsCode" :show-error-message="false">
                <nut-input v-model="loginForm.smsCode" :placeholder="$t('common.form.pleaseInput')" type="text">
                  <template #right>
                    <NutButton
                      size="small" type="primary" shape="square" :disabled="num > 0 || !loginForm.phone"
                      @click="handleSendSmsCode"
                    >
                      <span v-show="num === 0">{{ $t('login.get-code') }}</span>
                      <span v-show="num > 0">{{ num }}s</span>
                    </NutButton>
                  </template>
                </nut-input>
              </nut-form-item>
            </template>
          </nut-tab-pane>
        </nut-tabs>
        <nut-space class="w-full flex justify-center">
          <nut-button type="primary" size="small" @click="handleConfirm">
            提交
          </nut-button>
          <!-- <nut-button size="small" @click="reset">重置提示状态</nut-button> -->
        </nut-space>
      </NutForm>
    </div>
  </view>
</template>
