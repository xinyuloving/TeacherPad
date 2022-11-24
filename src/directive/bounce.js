/**
 * 将指定的DOM元素通过改变 Boolean bounceState 的值，进行弹起和落下，距离通过distance配置。
 * 适用于 Pad 端，某些元素被键盘遮挡。
 * 接收一个对象，对象中存在一个 Boolean bounceState 和 String distance
 * Expects: Object -> Boolean bounceState | String distance
 */

import { isPc } from "@/utils/util"

function handleUpdate(el, value) {
    const { bounceState, distance } = value;

    const { mode } = el.dataset;

    let modeValue = "";

    if (mode === "transform") {
        modeValue = `translateY(-${distance})`;
    } else {
        modeValue = `-${distance}`;
    }

    if (bounceState) {
        // if (mode === "top") el.style.position = "absolute";
        el.style.transition = 'all 0.3s';
        el.style[mode] = modeValue;

    } else {

        el.style[mode] = "";
        // if (mode === "top") el.style.position = "";
        setTimeout(() => {
            el.style.transition = "";
        }, 300)
    }


}

function setMode(el) {
    const styles = getComputedStyle(el);

    const modeList = [
        ['transform', "none"],
        // ['top', "auto"],
        ['marginTop', "0px"],
    ];

    for (let i = 0; i < modeList.length; i++) {
        const e = modeList[i];
        if (styles[e[0]] !== e[1]) {
            if (i === modeList.length - 1) {
                el.dataset.mode = modeList[modeList.length - 1][0];
                return;
            }
            continue;
        } else {
            el.dataset.mode = e[0];
            return;
        }

    }
}

export default {
    inserted(el, binding) {
        const { value } = binding;
        if (!value) return;

        if (!isPc())
            setMode(el);
    },
    update(el, binding) {
        const { value } = binding;
        if (!value) return;

        if (!isPc())
            handleUpdate(el, value);

    }
}