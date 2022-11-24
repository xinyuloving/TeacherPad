import { pinyin } from 'pinyin-pro';
import _ from "lodash";
import { getSuffixImg } from "./tableTreating"
const imEnv = process.env.NODE_ENV === "development" ? 'dev' : process.env.NODE_ENV === "testing" ? 'test' : '';

/**
 * 
 * @param {String} n 汉字姓名
 */
function turnPinyin(n) {
    // 将姓名转成拼音
    const arr = pinyin(n, { pattern: 'first', toneType: 'none', type: 'array' })
    return arr.map(item => item.toLocaleUpperCase());
}

// 节流
function throttle(callback, timer, time = 500) {
    if (timer) return;
    timer = setTimeout(() => {
        callback();
        clearTimeout(timer);
        timer = undefined;
    }, time)
}



/**
 * 
 * @param {Object} dom 要运动的 DOM 元素
 * @param {Number} h 运动的距离
 * @param {Function} fun 运动完成之后的回调函数
 */
function startMove(dom, h, fun) {
    // 运动函数
    clearInterval(dom.moveTimer);
    // 快速开始，慢速结束，将整个移动的过程分成两个时间段，第一个时间段做加速，第二个时间段做减速。当 移动的距离等于 h 时停止
    let speed = 0; // 起始速度
    const g = 0.009;  // 加速度
    const t = parseInt(h / 2); // 临界值，用以控制速度

    let distance = 0; // 移动的距离
    dom.moveTimer = setInterval(() => {
        if (distance < t) {
            // 加速度
            speed += g;
            distance += speed;
            dom.style.bottom = `${-distance}rem`;
        }
        if (distance >= t && distance < h) {
            // 减速度
            if (speed > 0.02) {
                speed += g * -1;
            } else {
                speed = 0.02;
            }
            distance += speed;
            dom.style.bottom = `${-distance}rem`;
        }
        if (distance >= h) {
            dom.style.bottom = `${-h}rem`;
            clearInterval(dom.moveTimer);
            if (fun) {
                // 动画执行结束
                fun();
            }
        }
    }, 30)
}


/**
 * 
 * @param {Array} arr  需要打乱的数组
 * @param {Object} target  选出的对象
 * @param {Boolean} order  将找到的这个对象元素，放到数组开头或是末尾（true表示末尾，false表示开头，默认放开头）
 * 
 */
function repaintArray(arr, target, order) {
    // 数组重绘：将一个数组的顺序随机打乱重排。
    // 逻辑：在动画执行前，我们会拿到随机选中的学生id，在这个数组中把这个学生找出，并且将它从原数组中删除，之后将这个数组的顺序打乱，把找到的学生对象放到打乱数组的末尾，最后控制动画停到末尾。
    let lastArr;
    if (arr.length < 15) {
        lastArr = [...arr, ...arr, ...arr];
    } else if (arr.length < 30) {
        lastArr = [...arr, ...arr];
    } else {
        lastArr = arr;
    }
    const temArr = _.shuffle(lastArr);

    if (!order) {
        temArr.unshift(target);
    } else {
        temArr.push(target);
    }

    return temArr;
}

// 指定范围的随机数
function rnd(n, m) {
    return Math.floor(Math.random() * (m - n + 1) + n);
}


function recursiveTraversal(lastData, fileNameArr, e) {
    // 递归遍历函数
    for (let i = 0; i < fileNameArr.length; i++) {
        const m = fileNameArr[i];
        const t = lastData.find(item => item.label === m);
        const isLastOne = m.includes('.');
        const obj = {
            label: m, // 展示的名字
            lastModified: e.lastModified,
            size: e.size,
            name: e.name, // 存储桶的名字
            // suffix: 1, // 图标
        }
        if (isLastOne) {
            obj.suffix = m.slice(m.lastIndexOf('.') + 1);
        } else {
            obj.suffix = "folder";
        }
        if (t) {
            t.children = t.children || [];
            recursiveTraversal(t.children, fileNameArr.slice(1), e);
            return;
        } else {
            if (isLastOne) {
                lastData.push(obj);
            } else {
                obj.children = [];
                lastData.push(obj);
                recursiveTraversal(obj.children, fileNameArr.slice(1), e);
                return;
            }
        }
    }

}


function formatCoursewareBucket(data) {
    // 格式化课件存储桶数据
    const initData = [];  // 根目录下的文件
    const handleData = [];  // 文件夹，分开处理可以最终把文件夹放在最上方
    for (let i = 0; i < data.length; i++) {
        const e = data[i];
        const target = {
            label: e.Key,
            lastModified: e.LastModified,
            size: Number(e.Size),
            name: e.Key,
            // checked: false,
        }
        if (e.Key.includes('/')) {
            target.children = [];
            // target.expanded = false;
            handleData.push(target)
        } else {
            // target.suffix = target.label.includes('.') ? target.label.slice(target.label.lastIndexOf('.') + 1).toLocaleLowerCase() : 'pdf'
            target.suffix = getSuffixImg(target.label);
            initData.push(target);
        }
    }
    const lastData = []; // 处理好的数据
    for (let i = 0; i < handleData.length; i++) {
        const e = handleData[i];
        const fileNameArr = e.label.split('/');
        if (fileNameArr[fileNameArr.length - 1] === "") fileNameArr.pop();
        recursiveTraversal(lastData, fileNameArr, e)
    }
    return lastData.concat(initData);
}


/**
 * 适用于腾讯云存储桶中获取的数据
 * @param {Array} data 要查询的原数组
 * @param {String} target 查询的目标节点
 * @param {String} matchItem 查询的匹配项
 * @param {Array} condition 遍历条件
 * @returns 查找到的数据
 */
function recursiveQuery(data, target, matchItem, condition) {
    let m;
    for (let i = 0; i < condition.length; i++) {
        const e = condition[i];
        const t = data.find(item => item[matchItem] === e);
        if (t && i !== condition.length - 1 && t[target] && (condition.length - 1) !== 0) {
            m = recursiveQuery(t[target], target, matchItem, condition.slice(1));
            return m;
        } else {
            // m = t;
            return t;
        }
    }
    return m;
}

function formatCoursewareList(list) {
    const fileList = [];
    const folderList = [];
    for (let i = 0; i < list.length; i++) {
        const e = list[i];
        if (e.type) {
            delete e.children;
            e.suffix = e.tencentCosName.slice(e.tencentCosName.lastIndexOf('.') + 1).toLocaleLowerCase();
            fileList.push(e);
        } else {
            e.suffix = 'folder';
            folderList.push(e);
            if (e.children.length) e.children = formatCoursewareList(e.children);
        }
    }
    return [...folderList, ...fileList]
}

function recursive(data, matchList, target) {
    let r;
    const e = matchList.shift();
    const t = data.find(item => item[target] === e);
    if (matchList.length > 0) {
        r = recursive(t.children, matchList, target);
        return r;
    } else {
        return t;
    }
}


/**
 * 根据文件后缀判断文件是那种类型
 * @param {String} suffix 文件后缀名
 * @returns 标识符：1 -->  图片； 2 --> 视频； 3 -->  各种可用 iframe 预览的 pdf
 */
function judgeFileSuffix(suffix) {
    const imgArr = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
    const video = ['AVI', 'mov', 'rmvb', 'rm', 'FLV', 'mp4', '3GP'];
    let flag;
    if (imgArr.includes(suffix)) {
        flag = 1;
    } else if (video.includes(suffix)) {
        flag = 2;
    } else {
        flag = 3;
    }
    return flag;
}


function formatCwResult(data) {
    if (data) {
        const fileList = [];
        const folderList = [];
        for (let i = 0; i < data.length; i++) {
            const e = data[i];
            const temObj = { ...e };
            if (!temObj.type) {
                temObj.children = [];
                temObj.suffix = "folder";
                folderList.push(temObj);
            } else {
                // temObj.suffix = temObj.tencentCosName.slice(temObj.tencentCosName.lastIndexOf('.') + 1).toLocaleLowerCase();
                temObj.suffix = getSuffixImg(temObj.tencentCosName);
                fileList.push(temObj);
            }
        }
        return folderList.concat(fileList);
    } else {
        return [];
    }

}

function isPc() {
    if ((navigator.userAgent.toLowerCase().match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        return false; // mobile
    } else {
        return true; // pc
    }
}

/**
 * 
 * @param {HTMLElement} currentDom 当前需要插入的DOM元素
 * @param {HTMLElement} targetDom 插入到的目标元素，默认body
 * @param {Boolean} type 插入或移除，默认插入
 */
function insertDom(currentDom, targetDom = document.body, type = true) {
    if (type) {
        if (targetDom.append) {
            targetDom.append(currentDom);
        } else {
            targetDom.appendChild(currentDom);
        }
    } else {
        targetDom.removeChild(currentDom);
    }
}

// 获取文件的本地地址
/******
 * 
 * @param {Object} file 文件对象
 * 
 * ********/
function getObjectURL(file) {
    let url = null;
    if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    }
    return url;
}

function createTeacherIM(teacherId) {
    return `${imEnv}2000${teacherId}`
}

function createStudentIM(studentId) {
    return `${imEnv}1000${studentId}`
}

export {
    turnPinyin,
    throttle,
    startMove,
    repaintArray,
    rnd,
    formatCoursewareBucket,
    recursiveQuery,
    formatCoursewareList,
    recursive,
    judgeFileSuffix,
    formatCwResult,
    isPc,
    insertDom,
    getObjectURL,
    createTeacherIM,
    createStudentIM
}