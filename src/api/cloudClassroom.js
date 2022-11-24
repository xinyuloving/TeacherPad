import request from "../utils/request"

function getCourseware(data) {
    // 获取课件
    return request({
        url: "/file/file_preview",
        method: "get",
        params: data
    })
}



export {
    getCourseware
}