/*
* 解析url参数
* @example ?id=123
* @return Object {id:123,a:b}
* */

export function urlParse () {
  let url = window.location.search
  let obj = {}
  // [?&] 包含？或者&   [^?&]非包含？或者&
  let reg = /[?&][^?&]+=[^?&]+/g
  let arr = url.match(reg)

  // ['?id=123','&a=b']
  if (arr) {
    arr.forEach((item) => {
      // 将 arr 从 = 左右分成两个 分别获取key 和val
      let tempArr = item.substring(1).split('=')
      let key = decodeURIComponent(tempArr[0])
      let val = decodeURIComponent(tempArr[1])
      obj[key] = val
    })
  }
  return obj
}
