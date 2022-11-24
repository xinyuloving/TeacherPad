import Vue from "vue";

import TMessage from "./TMessage.vue";

const TMessageConstructor = Vue.extend(TMessage);


export function tMessage(options = {}, closed, opened) {
    if (typeof options === 'string') {
        options = {
            title: options
        };
    }
    return new Promise((resolve, reject) => {

        const messageDom = new TMessageConstructor({ el: document.createElement('div') });

        messageDom.title = options.title || messageDom.title;
        messageDom.tips = options.tips || messageDom.tips;
        messageDom.type = options.type || messageDom.type;
        messageDom.wrapperStyle = options.wrapperStyle || messageDom.wrapperStyle;
        messageDom.msgBoxStyle = options.msgBoxStyle || messageDom.msgBoxStyle;
        messageDom.customClass = options.customClass || messageDom.customClass;

        messageDom.duration = options.duration === 0 ? 0 : options.duration || messageDom.duration;

        console.log("duration：", messageDom.duration);

        messageDom.animate = options.animate || messageDom.animate;
        messageDom.top = options.top || messageDom.top;

        messageDom.visible = true;

        messageDom.close = function () {
            messageDom.visible = false;
            resolve();
        }

        if (closed)
            messageDom.afterLeave = function () {
                closed();
            }

        if (opened)
            messageDom.afterEnter = function () {
                opened();
            }

    })
}

export default function registryTMessage() {
    Vue.prototype.$tMessage = tMessage;
}
