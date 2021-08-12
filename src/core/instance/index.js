import { initMixin } from "./init";
import { renderMixin } from "./render"
import { lifecycleMixin } from "./lifecycle"
import { eventsMixin } from "./events";

function Vue (options) {
    this._init(options)
}
initMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
export default Vue
