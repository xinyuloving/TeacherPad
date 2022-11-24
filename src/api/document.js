import request from "../utils/request"

// 添加试卷
function addDocument(data) {
    return request({
        method: 'post',
        url: '/question_bank/my/add',
        data,
        headers: { 'Content-Type': 'application/json;charset=utf8' }
    })
}

// 更新试卷内容
function updateTestPaper(data) {
    return request({
        method: 'post',
        url: '/question_bank/my/update',
        data,
        headers: { 'Content-Type': 'application/json;charset=utf8' }
    })
}

// 根据id查询试卷
function queryTestPaper(data) {
    return request({
        method: 'get',
        params: data,
        url: '/question_bank/exam_paper_info'
    })
}

// 获取我的题库题库列表
function getDocumentList(data) {
    return request({
        method: 'get',
        params: data,
        url: '/question_bank/my/list_tree'
    })
}

// 根据父id获取我的题库列表
function onParentIdList(data) {
    return request({
        method: 'get',
        params: data,
        url: '/question_bank/my/list'
    })
}

// 更改文件名
function updateDocumentName(data) {
    return request({
        method: 'post',
        data,
        url: '/question_bank/update_name',
        headers: { 'Content-Type': 'application/json;charset=utf8' }
    })
}

// 删除文件
function removeDocument(data) {
    return request({
        method: 'post',
        data,
        url: '/question_bank/remove',
        headers: { 'Content-Type': 'application/json;charset=utf8' }
    })
}

// 发布试卷
function publish(data) {
    return request({
        method: 'post',
        url: '/question_bank/my/publish',
        data,
        headers: { 'Content-Type': 'application/json;charset=utf8' }
    })
}

// 获取校园题库列表
function getSchoolDocument(data) {
    return request({
        method: 'get',
        url: '/question_bank/school/list',
        params: data
    })
}

// 校园题库新建文件夹或文件
function schoolNewFile(data) {
    return request({
        method: 'post',
        url: '/question_bank/school/add',
        data,
        headers: { 'Content-Type': 'application/json;charset=utf8' }
    })
}

function schoolToMy(data) {
    return request({
        method: 'post',
        url: '/question_bank/school/copy',
        data,
        headers: { 'Content-Type': 'application/json;charset=utf8' }
    })
}

export {
    addDocument,
    updateTestPaper,
    queryTestPaper,
    getDocumentList,
    updateDocumentName,
    removeDocument,
    publish,
    getSchoolDocument,
    onParentIdList,
    schoolNewFile,
    schoolToMy
}