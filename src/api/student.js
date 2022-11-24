import request from "../utils/request"

function getStudentList(data) {
    // 获取学生列表
    return request({
        url: "/student/get_list_by_rule",
        method: "post",
        data,
        headers: { 'Content-Type': 'application/json;charset=utf8' },
    })
}

function getStudentIMList(data) {
    // 获取学生列表
    return request({
        url: "/student/get_account_list_by_rule",
        method: "post",
        data,
        headers: { 'Content-Type': 'application/json;charset=utf8' },
    })
}


export {
    getStudentList,
    getStudentIMList
}