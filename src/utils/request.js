import axios from 'axios'
import store from '@/store'
import { getToken, removeToken } from '@/utils/auth'
import { MessageBox, Message } from 'element-ui'

// 创建一个 axios 实例
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // 无指定后端地址的时候需要加上 "api"
    timeout: 10000 // request timeout
})


// 请求拦截器
service.interceptors.request.use(
    config => {
        if (store.getters.token) {
            config.headers['token'] = `Bearer ${getToken()}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
)

// 响应拦截器
service.interceptors.response.use(
    response => {
        const { data } = response;
        // 约定的 token 失效返回码约定 10002（token 失效，token 被顶下线等）

        // data.code 为 0 则成功

        // 10002 --> token 失效，已返回到登录页
        // 10005 --> 未提供 token
        // 10006 --> 未提供有效 token
        // 10007 --> 您的账号已在另一台设备上登录，如非本人操作，请立即修改密码
        // 10008 --> 已被系统强制下线
        // 10009 --> 当前会话未登录

        const interceptCode = [10002, 10005, 10006, 10007, 10008, 10009]; // 需要拦截下来的 code
        if (interceptCode.includes(data.code)) {
            let alertMsg = "";
            switch (data.code) {
                case 10002:
                    alertMsg = "您的登录信息已过期，请点击确认回到到登录页"
                    break;
                case 10005:
                    alertMsg = "未提供 token"
                    break;
                case 10006:
                    alertMsg = "未提供有效 token"
                    break;
                case 10007:
                    alertMsg = "您的账号已在另一台设备上登录，如非本人操作，请立即修改密码"
                    break;
                case 10008:
                    alertMsg = "已被系统强制下线"
                    break;
                case 10009:
                    alertMsg = "当前会话未登录"
                    break;
                default:
                    alertMsg = "未知错误"
                    break;
            }
            MessageBox.alert(alertMsg, '提示', {
                confirmButtonText: '确定',
                type: 'error',
                callback: () => {
                    removeToken();
                    location.reload();
                }
            });
        } else {
            return data;
        }

        // if (data.code !== 0) {
        //     if (data.code === 10001 || data.code === -1) return data;
        //     MessageBox.alert(alertMsg, '提示', {
        //         confirmButtonText: '确定',
        //         type: 'error',
        //         callback: () => {
        //             removeToken();
        //             location.reload();
        //         }
        //     });
        //     return Promise.reject(new Error(data.msg || 'Error'));
        // } else {
        //     return data;
        // }


        // return data;

        // 登录会出问题
        // if (data.code === 0) {
        //     return data;
        // } else {
        //     return new Error(data.msg || 'Error');
        // }
    },
    error => {
        // MessageBox.alert(error, '提示', {
        //     confirmButtonText: '确定',
        //     type: 'error',
        //     callback: () => {
        //         location.reload();
        //     }
        // });
        Message({
            message: "当前网络不可用，请检查网络设置",
            type: 'error',
            duration: 3 * 1000
        })
        return Promise.reject(error);
    }
)

export default service
