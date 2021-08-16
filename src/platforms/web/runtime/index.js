import Vue from '../../../core/index'
import {mountComponent} from "../../../core/instance/lifecycle";
import { patch } from "./patch"
import platformDirectives from './directives/index'
import { extend } from "../../../shared/util";

Vue.prototype.__patch__ = patch

extend(Vue.options.directives, platformDirectives)

Vue.prototype.$mount = function (el, hydrating) {
    return mountComponent(this, el, hydrating)
}
export default Vue
