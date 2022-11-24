import request from "../utils/request"

function createCreate(data) {
    // 创建群
    // data: {
    //     teacherIMId,
    //     gradeId,
    //     clazz
    // }
    return request({
        url: "/class_active/mession_start",
        method: "post",
        params: data
    })
}

function disbandGroup(data) {
    // 解散群
    return request({
        url: "/class_active/mession_end",
        method: "post",
        params: data
    })
}


export {
    createCreate,
    disbandGroup
}