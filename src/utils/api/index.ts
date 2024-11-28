export function getRMSApiUrl(url: string) {
  return `/rms/api${url}`
}

export function getAccountApiUrl(url: string) {
  return `/account/api${url}`
}

export function getPublicApiUrl(url: string) {
  return `/public/api${url}`
}

/*
  获取静态资源的路径
*/
export function getStaticUrl(url: string) {
  // eslint-disable-next-line node/prefer-global/process
  return `${process.env.TARO_APP_GLOB_API_URL}/mini-program/rms${url}`
}
