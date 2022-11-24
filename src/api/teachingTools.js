import request from "../utils/request"

function getInClassTestList(data) {
    // 获取老师的随堂测试列表
    return request({
        url: "/in_class_test/teacher_list",
        method: "get",
        params: data,
        // headers: { 'Content-Type': 'application/json;charset=utf8' },
    })
}


export {
    getInClassTestList
}