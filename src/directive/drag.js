/**
 * 将指定的DOM元素设置为可移动。
 * 无需表达式或接收一个对象，对象中可以有start({top, left, pointX, pointY})，moving({ pointX, pointY, offsetTop, offsetLeft })，end({ pointX, pointY, top, left })三个函数分别在元素按下，移动，松开时执行。函数参数都是一个对象，包含如上一些字段。
 */

// utils
import { isPc } from "@/utils/util"
function getElToPagePosition(el) {
    // 获取该元素到body的距离
    let t = el.offsetTop; // 获取该元素对应父容器的上边距
    let l = el.offsetLeft; // 对应父容器的上边距
    // 判断是否有父容器，如果存在则累加其边距
    while (el = el.offsetParent) {
        // 等效 el = el.offsetParent; while (el != undefined)
        t += el.offsetTop; // 叠加父容器的上边距
        l += el.offsetLeft; // 叠加父容器的左边距
    }
    return { top: parseInt(t), left: parseInt(l) }
}


const deviceFlag = isPc();

// main
function press(evt, el, binding) {

    // el.dataset.isPress = true; // 按下标识，只有在按下时才可以拖拽，兼容pc !

    // 设置定位与默认属性
    el.style.cursor = "move";

    const { top, left } = getElToPagePosition(el);

    el.style.top = `${top}px`;
    el.style.left = `${left}px`;

    // el.dataset.top = top;
    // el.dataset.left = left; // 每次点击按下时重新赋值top和left !

    // const e = deviceFlag ? evt : evt.targetTouches[0];
    // const e = evt.targetTouches ? evt.targetTouches[0] : evt;
    const e = evt?.targetTouches?.[0] || evt;


    const sharedData = {
        isPress: true, // 按下标识，只有在按下时才可以拖拽，兼容pc !
        isMove: false, // 如果没有发生移动，则清除按下时添加的一些style
        top,
        left,
        pointX: parseInt(e.clientX),
        pointY: parseInt(e.clientY),
    }

    // const pointX = parseInt(e.clientX);
    // const pointY = parseInt(e.clientY); // 设置鼠标按下的点位 !
    // el.dataset.pointX = pointX;
    // el.dataset.pointY = pointY;

    // 绑定其他事件
    if (deviceFlag) {
        document.onmousemove = (_evt) => {
            move(_evt, el, binding, sharedData)
        };
    } else {
        el.ontouchmove = (_evt) => {
            move(_evt, el, binding, sharedData)
        };
    }

    el[`${deviceFlag ? "onmouseup" : "ontouchend"}`] = (evt) => {
        lift(evt, el, binding, sharedData)
    };

    // ----------------

    const { value } = binding;
    if (value?.start) {
        const params = { ...sharedData };
        delete params.isPress;
        delete params.isMove;
        value.start(params);
        // 初始点位X/Y 元素初始坐标top/left
    }

}


function move(evt, el, binding, sharedData) {

    // const { isPress, isMove, pointX, pointY, top, left } = el.dataset;

    // const e = evt.targetTouches ? evt.targetTouches[0] : evt;
    const e = evt?.targetTouches?.[0] || evt;

    const { isPress, isMove, pointX, pointY, top, left } = sharedData;

    const x = parseInt(e.clientX);
    const y = parseInt(e.clientY); // 鼠标的点位

    if (pointX === x && pointY === y) return;

    const styles = getComputedStyle(el);


    // if (isPress === "false") {
    //     return;
    // } else {
    //     if (isMove === "false") el.dataset.isMove = true;
    // }

    if (isPress) {
        if (!isMove) sharedData.isMove = true;
    } else {
        return;
    }

    // hack 在移动的时候初始化一些css属性
    if (styles.zIndex !== "999") el.style.zIndex = "999";
    if (styles.transition !== "none") el.style.transition = "none";
    if (styles.position !== "fixed") el.style.position = 'fixed';
    // ----------------


    const { body } = document;

    const width = body.offsetWidth - el.offsetWidth;
    const height = body.offsetHeight - el.offsetHeight;


    let offsetTop = parseInt(Number(top) + (y - Number(pointY)));
    let offsetLeft = parseInt(Number(left) + (x - Number(pointX)));  // 偏移量

    offsetTop = offsetTop > 0 ? offsetTop > height ? height : offsetTop : 0;

    offsetLeft = offsetLeft > 0 ? offsetLeft > width ? width : offsetLeft : 0;

    el.style.top = `${offsetTop}px`;
    el.style.left = `${offsetLeft}px`;

    const { value } = binding;
    if (value?.moving) {
        value.moving({ pointX: x, pointY: y, offsetTop, offsetLeft });
        // 鼠标点位X/Y  元素偏移量(坐标)offsetTop/offsetLeft
    }

}

function lift(evt, el, binding, sharedData) {

    sharedData.isPress = false;

    // el.dataset.isPress = false; !

    // if (el.style.zIndex === "999") {
    //     el.style.zIndex = "";
    //     el.style.transition = "";
    // }

    const { isMove } = sharedData;
    if (!isMove) {
        // 没有移动的话 style 的 top 和 left 不可清除
        el.style.position = '';
    } else {
        el.style.zIndex = "";
        el.style.transition = "";
    }
    el.style.cursor = "pointer";


    // 解绑事件
    if (deviceFlag) {
        document.onmousemove = null;
        document.onmouseup = null;

    } else {
        el.ontouchmove = null;
        el.ontouchend = null;
    }
    // -----------


    const { value } = binding;
    if (value?.end) {
        // const e = evt.targetTouches ? evt.targetTouches[0] : evt;
        const e = evt?.targetTouches?.[0] || evt;


        value.end({ pointX: parseInt(e.clientX), pointY: parseInt(e.clientY), top: el.offsetTop, left: el.offsetLeft });
        // 鼠标点位X/Y  元素最终坐标top/left
    }
}



export default {
    bind(el, binding) {
        // 默认样式
        if (deviceFlag) {
            el.style.cursor = "pointer";
            el.style.userSelect = "none";
            // el.dataset.isPress = false; // 是否按下，兼容pc !
            el.draggable = false; // 防止图片等默认的拖拽，但无法影响到子元素
        }

        // el.dataset.isMove = false; // 如果没有发生移动，则清除按下时添加的一些style !

        el.addEventListener(`${deviceFlag ? "mousedown" : "touchstart"}`, (evt) => {
            press(evt, el, binding)
        });

    },
    inserted(el, binding) {
        // const { top, left } = getElToPagePosition(el);
        // el.dataset.top = top;
        // el.dataset.left = left; // 获取并设置该元素距离页面顶部的位置，在按下时设置为其初始点位
    }
}