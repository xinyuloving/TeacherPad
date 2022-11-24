// user 即 teacher
import request from "../utils/request"

function login(data) {
    // 登录
    return request({
        url: "/user/login",
        method: 'post',
        params: data,
        // headers: { 'Content-Type': 'application/json;charset=utf8' },
    })
}


function getVerifyCode(data) {
    // 获取手机验证码
    return request({
        url: "/user/login/send_login_sms_verify_code",
        method: 'post',
        params: data,
    })
}

function loginByVerifyCode(data) {
    // 通过手机验证码登录
    return request({
        url: "/user/login/teacher_pad_by_sms",
        method: 'post',
        params: data,
    })
}


function modifyPwd(data) {
    // 修改密码
    return request({
        url: "/user/login/modify_password",
        method: 'post',
        params: data,
        // headers: { 'Content-Type': 'application/json;charset=utf8' },
    })
}

function loginByMobile(data) {
    // 通过手机号登录
    return request({
        url: "/user/login/teacher_pad_by_password",
        method: 'post',
        params: data,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
    })
}

function getTeacherInfo() {
    // 获取 老师信息
    return request({
        url: "/teacher/teacher_info",
        method: 'post',
    })
}

function getTimUserSig(data) {
    // 获取 腾讯即时通信 的 userSig
    return request({
        url: "/user/get_im_sig",
        method: 'get',
        params: data
    })
}

function logout() {
    // 登出
    return request({
        url: "/user/login/logout",
        method: 'post',
    })
}

function getAssignmentList(data) {
    // 获取作业列表
    return request({
        url: "/teacher/assignment_list",
        method: 'post',
        data,
        headers: { 'Content-Type': 'application/json;charset=utf8' }
    })
}

function issueAssignment(data) {
    // 发布作业
    return request({
        url: '/teacher/add_assignment',
        method: 'post',
        data,
        headers: { 'Content-Type': 'application/json;charset=utf8' }
    })
}

function updateAssignment(data) {
    // 修改作业
    return request({
        url: '/teacher/modify_assignment',
        method: 'post',
        data,
        headers: { 'Content-Type': 'application/json;charset=utf8' }
    })
}

function removeAssignment(data) {
    console.log(data);
    return request({
        url: '/teacher/delete_assignment',
        method: 'post',
        params: data,
    })
}

function getTimeTableByTeacherId(data) {
    // 查询老师课表详情
    return request({
        url: "/course_schedule/teacher/info",
        method: 'get',
        params: data,
    })
}

function getTimeTableTime(data) {
    // 查询学校课表时间
    return request({
        url: "/course_schedule/getTime",
        method: 'get',
        params: data,
    })
}

function getRole(data) {
    // 获取用户角色
    return request({
        url: '/user/get_role',
        method: 'post',
        params: data
    })
}

function getPermissionFromRole(data) {
    return request({
        url: '/permission/get_permission_from_role',
        method: 'post',
        params: data
    })
}


export {
    login,
    getVerifyCode,
    loginByVerifyCode,
    loginByMobile,
    getTeacherInfo,
    getTimUserSig,
    logout,
    getAssignmentList,
    getTimeTableByTeacherId,
    modifyPwd,
    issueAssignment,
    updateAssignment,
    removeAssignment,
    getTimeTableTime,
    getRole,
    getPermissionFromRole
}