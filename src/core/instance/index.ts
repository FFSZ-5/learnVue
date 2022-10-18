/*
 * @FilePath: \learnVue\src\core\instance\index.ts
 * @Version: 2.0
 * @LastEditors: lhl
 * @LastEditTime: 2022-09-14 11:35:57
 * @Description:
 */
import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'
import type { GlobalAPI } from 'types/global-api'
function Vue(options) {
  debugger
  if (__DEV__ && !(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  console.log(this == Vue)
  debugger
  this._init(options)
}
//@ts-expect-error Vue has function type
initMixin(Vue) //给vue添加_init函数
//@ts-expect-error Vue has function type
stateMixin(Vue) //定义$data、$props、$set、$delete、$watch
//@ts-expect-error Vue has function type
eventsMixin(Vue) //定义$on、$once、$off、$emit
//@ts-expect-error Vue has function type
lifecycleMixin(Vue) //定义_update、$forceUpdate、$destroy
//@ts-expect-error Vue has function type
renderMixin(Vue) //定义$nextTick、_render
export default Vue as unknown as GlobalAPI
