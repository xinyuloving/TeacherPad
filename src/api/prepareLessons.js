import request from '@/utils/request'

// 获取课件列表
function getCoursewareList(data) {
    return request({
        method: 'get',
        url: '/courseware_assistant/my/list_tree',
        params: data
    })
}

// 根据id获取课件列表
function getCwListByParentId(data) {
    return request({
        method: 'get',
        url: '/courseware_assistant/my/list',
        params: data
    })
}

function shareToStudent(data) {
    return request({
        method: 'post',
        url: '/courseware_assistant/my/copy',
        data,
        headers: { 'Content-Type': 'application/json;charset=utf8' }
    })
}


// 添加课件
function addCourseware(data) {
    return request({
        method: 'post',
        url: '/courseware_assistant/my/add_courseware',
        data,
        headers: { 'Content-Type': 'application/json;charset=utf8' }
    })
}

// 删除课件或文件夹
function removeCourseware(data) {
    return request({
        method: 'post',
        url: '/courseware_assistant/remove',
        data,
        headers: { 'Content-Type': 'application/json;charset=utf8' }
    })
}

// 添加文件夹
function addFolder(data) {
    return request({
        method: 'post',
        url: '/courseware_assistant/my/add_folder',
        data,
        headers: { 'Content-Type': 'application/json;charset=utf8' }
    })
}

// 修改文件名
function updateFileName(data) {
    return request({
        method: 'post',
        url: '/courseware_assistant/update_name',
        data,
        headers: { 'Content-Type': 'application/json;charset=utf8' }
    })
}

// 根据父id获取校本资源列表
function getScholasticByParentId(data) {
    return request({
        method: 'get',
        url: '/courseware_assistant/school/list',
        params: data
    })
}

// 校本资源添加课件
function addScholasticResource(data) {
    return request({
        method: 'post',
        url: '/courseware_assistant/school/add_courseware',
        data,
        headers: { 'Content-Type': 'application/json;charset=utf8' }
    })
}

// 校本资源新建文件夹
function schoolNewFolder(data) {
    return request({
        method: 'post',
        url: '/courseware_assistant/school/add_folder',
        data,
        headers: { 'Content-Type': 'application/json;charset=utf8' }
    })
}

export {
    getCoursewareList,
    getCwListByParentId,
    addCourseware,
    removeCourseware,
    addFolder,
    updateFileName,
    shareToStudent,
    getScholasticByParentId,
    addScholasticResource,
    schoolNewFolder
}