import { createCreate, disbandGroup } from "@/api/im"
import tim from '@/utils/im'

const state = {
    groupId: "",
    IMSdkState: "",  // IMSdk 状态，为 true 表示加载完成，可以收发信息
    // message: {
    //     // 定义了消息之后，在此进行初始化，否则无法监听 有关云课堂的消息以ccl为前缀标识
    //     ccl: {
    //         ccl_1: false,  // 进入云课堂
    //         ccl_2: false,  // 举手回答问题
    //         ccl_3: false,  // 选择题答题器
    //         ccl_4: false,  // 判断题答题器
    //         ccl_5: false,  // 随机选人
    //         ccl_6: false,  // 课堂测试答题器
    //         ccl_7: false,  // 抢答模块
    //         ccl_8: false,  // 教学反馈
    //         ccl_9: false,  // 结束上课，退出云课堂
    //         ccl_10: false,  // 奖励小红花
    //         ccl_11: false,  // 学生举手
    //         ccl_12: false,  // 内容分发
    //     }
    // },
    // ---------------------->   学生向老师发的消息
    // ccl_3 --> 选择题反馈
    // ccl_4 --> 判断题反馈
    // ccl_7 --> 抢答题反馈
    // ccl_8 --> 教学反馈
    // ccl_11 --> 举手反馈
    responderFlag: true, // 当收到学生抢答的第一条消息后，将它赋值为false，之后收到的相关消息不再进行处理
}

const mutations = {
    setState(state, data) {
        state[data.key] = data.value;
    },
    resetState(state) {
        state.groupId = "";
        state.responderFlag = true;
        state.cloudStudentList = []
    },
}

const actions = {
    setMessage({ state, commit }, e) {
        // 事件派发
        const payload = e.payload;
        const extension = JSON.parse(payload.extension);
        switch (payload.description) {
            case 'ccl_3':
                // 收到学生的选择题反馈 所做的事
                this.commit('cloudClassroom/toolbar/choice/setChoiceInfo', e);
                break;
            case 'ccl_4':
                // 收到学生的判断题反馈 所做的事
                this.commit('cloudClassroom/toolbar/judge/setJudgeInfo', e);
                break;
            case 'ccl_7':
                // 收到学生的抢答 所做的事
                if (state.responderFlag) {
                    commit("setState", { key: "responderFlag", value: false })
                    // state.responderFlag = false;
                    this.dispatch('cloudClassroom/toolbar/responder/setWinnerInfo', extension);
                }
                break;
            case 'ccl_8':
                // 教学反馈
                this.commit('cloudClassroom/toolbar/teachCallback/setCallbackInfo', e);
                break;
            case 'ccl_11':
                // 收到学生举手 所做的事
                this.commit('cloudClassroom/setBarrageList', extension.id);
                break;
            default:
                break;
        }
    },
    createGroupChat({ commit }, data) {
        // 创建群聊
        return new Promise((resolve, reject) => {
            createCreate(data).then(res => {
                const resData = JSON.parse(res.data);
                if (resData.ErrorCode === 0) {
                    // 为 0 表示 创建成功
                    commit('setState', { key: "groupId", value: resData.GroupId });
                }
                resolve(resData);
            }).catch((err) => {
                console.log("catch");
                reject(err);
            })
        })
    },
    disbandGroupChat({ commit, state }) {
        // 下课的时候将群解散
        if (state.groupId) {
            // 如果有群id 表示 进入过云课堂 -->  发请求解散群
            disbandGroup({ groupId: state.groupId }).then(res => {
                const resData = JSON.parse(res.data);
                console.log(resData);
                // 将 groupId 移除
                commit('setState', { key: "groupId", value: "" });
            })
        }
    },
    // 创建群组
    createImGroup({ commit }, data) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log(data);
                const res = await tim.createGroup(data);
                console.log(res);
                if (res && res.data && res.data.group) {
                    commit('setState', { key: "groupId", value: res.data.group.groupID })
                }
                resolve(res.data.group.groupID)
            } catch (err) {
                reject(err)
            }
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}