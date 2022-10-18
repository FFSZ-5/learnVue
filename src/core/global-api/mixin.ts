/*
 * @FilePath: \learnVue\src\core\global-api\mixin.ts
 * @Version: 2.0
 * @LastEditors: lhl
 * @LastEditTime: 2022-09-14 11:22:44
 * @Description:
 */
import type { GlobalAPI } from 'types/global-api'
import { mergeOptions } from '../util/index'

export function initMixin(Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
