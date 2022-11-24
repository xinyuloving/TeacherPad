import judge from "./judge";
import choice from "./choice";
import floatWindow from "./floatWindow";
import answer from "./answerStatistics";
import timer from "./timer"
import random from "./random";
import responder from "./responder";
import teachCallback from "./teachCallback";
import distribute from "./distribute";
import classTest from "./classTest";
import { repaintArray, rnd } from "@/utils/util";
import sendMessage from "@/utils/sendMessage";

import { tMessage } from "@/components/FunctionalComp/message/index"

// 工具栏

let touchItem;

const toolbarState = () => ({
    isActive: false,
    toolList: [
        {
            id: 1,
            content: "答题工具",
            type: 0,
            children: [
                {
                    id: 11,
                    content: "选择题",
                    type: 1, // 工具类型：0 表示不设置禁用；1表示强工具，同类型全部禁用；2 表示弱类型，只禁用自身
                    // parentId: 1,
                },
                {
                    id: 12,
                    content: "判断题",
                    type: 1,
                    // parentId: 1,
                },
            ],
        },
        {
            id: 2,
            content: "互动工具",
            type: 0,
            children: [
                {
                    id: 21,
                    content: "抢答题",
                    type: 1,
                    // parentId: 2,
                },
                {
                    id: 22,
                    content: "随机点名",
                    type: 1,
                    // parentId: 2,
                },
                {
                    id: 23,
                    content: "计时器",
                    type: 2,
                    // parentId: 2,
                },
            ],
        },
        {
            id: 3,
            content: "随堂测试",
            type: 1,
        },
        {
            id: 4,
            content: "内容分发",
            type: 2,
        },
        {
            id: 5,
            content: "导入课件",
            type: 0,
        },
        {
            id: 6,
            content: "结束上课",
            type: 0,
        },
    ],
    toolActive: -1, // 工具栏激活的索引，以下两个字段只控制样式
    childrenActive: -1,

    strongId: 0, // 强id的工具互斥，即当他不为零的时候禁用所有互斥工具
    weakIdObj: {
        23: false, // 定时器
        4: false, // 内容分发
    }, // 弱id的工具使用后禁用自身，该对象是以弱工具的id为键，值为Boolean

    addCoursewareVisible: false,  // 添加课件

    endClassVisible: false, // 结束上课的 dialog

})

const state = toolbarState();


const mutations = {
    resetState(state) {
        // 重置
        Object.assign(state, toolbarState());
        touchItem = undefined;
    },
    setState(state, data) {
        // 设置 state
        if (data.objKey) {
            state[data.objKey][data.key] = data.value;
        } else {
            state[data.key] = data.value;
        }
    },
    handleDisabled(state) {
        const { id } = touchItem;
        const { strongId, weakIdObj } = state;
        switch (touchItem.type) {
            case 1: {
                // 强禁用
                if (strongId === 0) {
                    state.strongId = id;
                }
                break;
            }
            case 2: {
                // 弱工具
                if (!weakIdObj[id]) {
                    // 当前该弱工具已使用
                    state.weakIdObj[id] = true;
                }
                break;
            }

            default:
                break;
        }
    },
}

const actions = {
    toolItemTouch({ state, commit, rootGetters, dispatch }, obj) {
        const { id, index, item } = obj;

        const { strongId, weakIdObj } = state;
        if (item.type === 1) {
            if (strongId) return;
        } else if (item.type === 2) {
            if (weakIdObj[item.id]) return;
        }

        touchItem = item;

        // 设置样式
        if (state.toolActive !== index) {
            commit('setState', { key: 'childrenActive', value: -1 });
            commit('setState', { key: 'toolActive', value: index });
        }


        switch (id) {
            case 3: {
                // 随堂测试
                commit("classTest/setState", { key: "visible", value: true })
                break;
            }
            case 4: {
                // 内容分发
                commit('distribute/setState', { key: "visible", value: true });
                break;
            }
            case 5: {
                // 导入课件
                commit('setState', { key: "addCoursewareVisible", value: true });
                break;
            }
            case 6: {
                // 结束上课
                const { classTest: { ctBackVisible } } = state;
                if (ctBackVisible) {
                    tMessage({ title: "请先结束随堂测试！", type: "error" }, () => {
                        commit("setState", { key: "toolActive", value: -1 })
                    })
                    return;
                }
                commit("setState", { key: "endClassVisible", value: true });
                break;
            }
            default:
                break;
        }
    },
    async childItemTouch({ state, commit, rootGetters, dispatch }, obj) {
        const { id, index, item } = obj;

        const { strongId, weakIdObj } = state;
        if (item.type === 1) {
            if (strongId) return;
        } else if (item.type === 2) {
            if (weakIdObj[item.id]) return;
        }

        touchItem = item;


        // 设置样式
        commit('setState', { key: 'childrenActive', value: index });

        switch (id) {
            case 11: {
                // 选择题
                commit("choice/setState", { key: 'visible', value: true });
                commit("choice/setState", { key: 'flag', value: true });
                break;
            }
            case 12: {
                // 判断题
                commit('judge/setState', { key: 'visible', value: true });
                break;
            }
            case 21: {
                // 抢答题
                this.commit('cloudClassroom/setState', { key: "toolbarVisible", value: false });
                // dispatch('responder/openResponder');
                try {
                    await sendMessage({
                        content: "ccl_7",
                        extension: JSON.stringify({ flag: 1 }),
                    });
                    // 看板
                    this.dispatch("inCloudClassroom/dataRecords", {
                        type: "responder",
                    });
                    commit('responder/setState', { key: 'visible', value: true });
                    commit("handleDisabled");
                } catch (error) {
                    tMessage({ title: "发起抢答器失败！请重新尝试", type: "error" }, () => {
                        commit("setState", { key: "childrenActive", value: -1 })
                    })
                }

                break;
            }
            case 22: {
                // 随机点名
                // const temArr = [...rootGetters.studentList];
                // const index = rnd(0, temArr.length - 1);
                // const t = temArr.splice(index, 1)[0]; // 目标对象
                // console.log(t);
                // const a = repaintArray(temArr, t);
                // console.log(a);
                // if (a.length && t) {
                //     commit('random/setState', { key: 'winnerInfo', value: t });
                //     commit('random/setState', { key: 'options', value: a });
                //     commit('random/setState', { key: 'visible', value: true })
                // } else {
                //     tMessage({ title: "抱歉，该班没有学生！", type: "warning" }, () => {
                //         commit("setState", { key: "childrenActive", value: -1 })
                //     })
                // }
                commit('random/setState', { key: 'visible', value: true })
                break;
            }
            case 23: {
                // 计时器
                console.log(state);
                if (!state.timer.timerVisible)
                    commit('timer/setState', { key: 'timerDialogVisible', value: true });
                break;
            }
            case 24: {
                // 教学反馈
                commit('teachCallback/setState', { key: 'visible', value: true });
                this.commit('cloudClassroom/setState', { key: "toolbarVisible", value: false });
                sendMessage({
                    content: "ccl_8",
                    extension: JSON.stringify({ flag: 1 }),
                }).then(() => {
                    console.log("消息发送成功");
                });
                break;
            }
            default:
                break;
        }
        // this.setDisabled(item);
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    modules: {
        judge,
        choice,
        floatWindow,
        answer,
        timer,
        random,
        responder,
        teachCallback,
        distribute,
        classTest
    }
}