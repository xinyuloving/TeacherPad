import request from "../utils/request"

function getDeskList(data) {
    // 获取教室的设备
    return request({
        url: "/classroom/bound_list",
        method: "get",
        params: data,
    })
}


export {
    getDeskList
}