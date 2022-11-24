import TIM from 'tim-js-sdk';
import tim from "@/utils/im";
import store from '../store'
import { Message } from 'element-ui'

/**
 * 
 * @param {Object} messageOptions 新建消息的配置项，五个参数分别是：to（接收人/群组 id，String，默认为当前群组 id）；type（会话类型：TIM.TYPES.CONV_GROUP(1)/TIM.TYPES.CONV_C2C(2) 群组会话/端到端会话，默认为 群组会话）；msgType（自定义消息的类型，String，默认为"cloudClassroom"）；content（自定义消息的内容 String，必传项）；extension（扩展字段，默认为空字符串）
 */
export default function sendMessage(messageOptions) {
    // 进入云课堂 im 发送消息
    // 创建自定义消息
    if (store.getters.IMSdkState) {
        const obj = {
            to: store.getters.groupId,
            type: TIM.TYPES.CONV_GROUP,
            mesType: 'cloudClassroom',
            extension: JSON.stringify({}),
            ...messageOptions
        };
        if (typeof obj.type === 'number') {
            obj.type = obj.type === 2 ? TIM.TYPES.CONV_C2C : TIM.TYPES.CONV_GROUP;
        }
        const message = tim.createCustomMessage({
            to: obj.to,
            conversationType: obj.type,
            payload: {
                data: obj.mesType,
                description: obj.content,
                extension: obj.extension,
            },
        });
        // 发送消息
        return new Promise((resolve, reject) => {
            tim
                .sendMessage(message)
                .then((imResponse) => {
                    // 发送成功
                    resolve(imResponse);
                })
                .catch((imError) => {
                    // 发送失败
                    // const error = imError.toString();
                    // if (error.includes("请求超时")) {
                    //     Message({
                    //         message: "当前网络不可用，请检查网络设置",
                    //         type: 'error',
                    //         duration: 3 * 1000
                    //     })
                    // }
                    reject(imError);
                });
        })
    } else {
        return Promise.reject("IMSdkState 还没有准备好");
    }
}