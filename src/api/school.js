import request from "../utils/request"

function getClassesBySchoolCode(data) {
    // 获取学校下面的班级
    return request({
        url: '/school/get_clazz_list_by_school',
        method: 'post',
        data,
        headers: { 'Content-Type': 'application/json;charset=utf8' },
    })
}

function getClassroomList(data) {
    // 获取学校的教室列表
    return request({
        url: '/classroom/list_by_id',
        method: 'post',
        params: data
    })
}

function getSubjectBySchool(data) {
    return request({
        url: '/school/get_subject_list_by_school',
        method: 'post',
        params: data
    })
}

export {
    getClassesBySchoolCode,
    getClassroomList,
    getSubjectBySchool
}