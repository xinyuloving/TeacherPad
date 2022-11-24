import request from '@/utils/request'

// 发布通知
function publishNotify(data) {
    return request({
        method: 'post',
        url: '/school/send_school_notice',
        data,
        headers: { 'Content-Type': 'application/json;charset=utf8' }
    })
}

// 获取通知列表
function getNotifys(data) {
    return request({
        method: 'post',
        url: '/school/query_school_notice_by_sender',
        params: data
    })
}

function delNotifyById(data) {
    return request({
        method: 'post',
        url: '/school/delete_school_notice_by_Id',
        data,
        headers: { 'Content-Type': 'application/json;charset=utf8' }
    })
}

export {
    publishNotify,
    getNotifys,
    delNotifyById
}