import { videoFormat, imageFormat, audioFormat, wordFormat, excelFormat } from '@/utils/fileFormat'
const myVideo = videoFormat();
const myImage = imageFormat();
const myAudio = audioFormat();
const myWord = wordFormat();
const myExcel = excelFormat();

// 获取后缀所对应的图片
function getSuffixImg(val) {
    const suffix = val.slice(val.lastIndexOf('.'));
    const reg = new RegExp(suffix, 'gi');
    if (reg.test(myVideo)) {
        return 'mp4'
    } else if (reg.test(myImage)) {
        return 'jpg'
    } else if (reg.test(myAudio)) {
        return 'audio'
    } else if (reg.test(myWord)) {
        return 'doc'
    } else if (reg.test(myExcel)) {
        return 'xlsx'
    } else if (suffix === '.pdf') {
        return 'pdf'
    } else if (suffix === '.ppt' || suffix === '.pptx') {
        return 'ppt'
    } else {
        return 'doc'
    }
}

// table表格数据格式化
function dataFormatting(data) {
    if (data && !data.length) return data;
    const folderArr = [];
    const coursewareArr = [];
    data.forEach(item => {
        item.isCheck = false;
        item.isInput = false;
        if (item.type) {
            // 如果type为1就是课件
            if (item.tencentCosName) {
                item.icon = getSuffixImg(item.tencentCosName);
            } else {
                item.icon = 'courseware';
            }
            coursewareArr.push(item)
        } else {
            // 如果type为0就是文件夹
            item.icon = 'folder';
            folderArr.push(item)
        }
    });
    return [...folderArr, ...coursewareArr]
}


// 通过链接获取腾讯云文件名
function getCosFileName(url) {
    return url.slice(url.lastIndexOf('/') + 1)
}

// 文件下载
function getBlob(url, progress) {
    let xhr = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
        xhr.open('GET', url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.responseType = "blob";
        xhr.onprogress = function (event) {
            progress && progress(parseFloat((event.loaded / event.total) * 100).toFixed(2))
        };
        xhr.onload = function () {
            resolve(xhr.response)
        }
        xhr.send()
    })
}

/**
 * 保存
 * @param  {Blob} blob     
 * @param  {String} filename 想要保存的文件名称
 */
function saveAs(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
    } else {
        const link = document.createElement('a');
        const body = document.querySelector('body');

        link.href = window.URL.createObjectURL(blob);
        link.download = filename;

        // fix Firefox
        link.style.display = 'none';
        body.appendChild(link);
        
        link.click();
        body.removeChild(link);

        window.URL.revokeObjectURL(link.href);
    }
}

/**
 * 下载
 * @param  {String} url 目标文件地址
 * @param  {String} filename 想要保存的文件名称
 * @param  {String} progress 进度回调
 */
function download(url, filename, progress) {
    getBlob(url, progress).then(blob => {
        saveAs(blob, filename);
    });
}

export {
    getSuffixImg,
    dataFormatting,
    getCosFileName,
    download,
}