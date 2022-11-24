import request from "../utils/request"

// 获取试卷列表
function getTestList(data) {
    return request({
        method: 'get',
        url: '/in_class_test/teacher/list',
        params: data,
    })
}

// 获取试卷详情
function getTestInfo(data) {
    return request({
        method: 'get',
        url: '/in_class_test/exam_paper_info',
        params: data
    })
}

// 获取学生列表
function getStudentList(data) {
    return request({
        method: 'get',
        url: '/in_class_test/teacher/stu_list',
        params: data
    })
}

export {
    getTestList,
    getTestInfo,
    getStudentList
}