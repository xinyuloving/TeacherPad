import request from '@/utils/request'

// 文件预览
function filePreview(data) {
    return request({
        method: 'get',
        url: '/file/file_preview',
        params: data
    })
}

// 文件下载
function fileDownload(data) {
    return request({
        method: 'get',
        url: '/file/file_download',
        params: data
    })
}


export {
    filePreview,
    fileDownload
}