// 文件格式

// 上传文件的格式
function theUpload() {
    if (process.env.NODE_ENV === 'development') {
        return '.mp4,.wmv,.avi,.3gp,.mkv,.vob,.mpg,.bmp,.jpg,.jpeg,.png,.webp,.mp3,.aac,.ppt,.pptx,.doc,.docx,.docm,.pdf,.xls,.xlsx,.xlsb,.xlsm,.xlst'
    } else {
        return '.mp4,.bmp,.jpg,.jpeg,.png,.webp,.mp3,.aac,.ppt,.pptx,.doc,.docx,.docm,.pdf,.xls,.xlsx,.xlsb,.xlsm,.xlst'
    }
}

// 视频格式
function videoFormat() {
    if (process.env.NODE_ENV === 'development') {
        return '.mp4,.wmv,.avi,.3gp,.mkv,.vob,.mpg'
    } else {
        return '.mp4'
    }
}

// 图片格式
function imageFormat() {
    return '.bmp,.jpg,.jpeg,.png,.webp'
}

// 音频格式
function audioFormat() {
    return '.mp3,.aac'
}

// word文件格式
function wordFormat() {
    return '.doc,.docx,.docm'
}

// excel文件格式
function excelFormat() {
    return '.xls,.xlsx,.xlsb,.xlsm,.xlst'
}

export {
    theUpload,
    videoFormat,
    imageFormat,
    audioFormat,
    wordFormat,
    excelFormat
}