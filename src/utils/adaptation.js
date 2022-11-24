// rem 适配
// 元素大小取值方法：
// 1 最后的公式：页面元素的rem值 = 页面元素值(px) / (屏幕宽度/划分的份数:20)
// 2 屏幕宽度/划分的份数就是 html font-size的大小
// 3 或者：页面元素的rem值 = 页面元素值(px) / html font-size字体大小

function setFontSize() {
    // 动态 设置 html 的字体大小
    const width = document.body.offsetWidth;
    const h = document.documentElement;
    const fz = parseInt(width / 20);
    h.style.fontSize = `${fz}px`;
}

setFontSize();

window.onresize = function () {
    setFontSize();
}