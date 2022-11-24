import request from '@/utils/request'
// const baseURL = 'http://121.40.127.159:11004/api'
const baseURL = process.env.NODE_ENV === 'development' ? 'http://dev-api-log.phenix.otter-nxedu.com/api' : process.env.NODE_ENV === 'testing' ? "http://test-api-log.phenix.otter-nxedu.com/api" : "https://api-log.phenix.otter-nxedu.com/api"

// 登录埋点系统
function loginPhenix() {
    return request({
        baseURL,
        method: 'post',
        url: '/v1/log/system/login',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({
            appKey: "iAIF3fdNbfbT",
            appSecret: "Qo5*:h{[Ap$8@-(0k;i[2yd/h.[g8a0~"
        })
    })
}

// 登出埋点系统
function logoutPhenix() {
    const token = window.localStorage.getItem('Phenix-Token')
    return request({
        baseURL,
        method: 'post',
        url: '/v1/log/system/logout',
        headers: { 'Phenix-Token': token }
    })
}

// 上报单条事件
function uploadLogEvent(data) {
    const token = window.localStorage.getItem('Phenix-Token')
    return request({
        baseURL,
        method: 'post',
        url: '/v1/log/logEvent/uploadLogEvent',
        headers: {
            'Content-Type': 'application/json',
            'Phenix-Token': token
        },
        data
    })
}

// 上报多条事件
function uploadLogEventList(data) {
    const token = window.localStorage.getItem('Phenix-Token')
    return request({
        baseURL,
        method: 'post',
        url: '/v1/log/logEvent/uploadLogEventList',
        headers: {
            'Content-Type': 'application/json',
            'Phenix-Token': token
        },
        data
    })
}

export {
    loginPhenix,
    logoutPhenix,
    uploadLogEvent,
    uploadLogEventList
}