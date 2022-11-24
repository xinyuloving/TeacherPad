// 奖励小红花
import sendMessage from "@/utils/sendMessage";
import { Message } from "element-ui"
const reward = () => ({
    visible: false,
    rewardStudentList: [], // 奖励的学生列表，必须将要奖励的学生设置给它，用来页面展示
    disabled: false, // 选择题反馈模块页面中的一键奖励按钮与选人栏的奖励按钮的禁用效果：发消息之前设置，完成取消
})

const state = reward();

const mutations = {
    resetState(state) {
        Object.assign(state, reward());
    },
    setState(state, data) {
        // 设置 state 的某个属性值
        state[data.key] = data.value;
    },
}

const actions = {
    /**
     * 
     * @param {Object} param0 
     * @param {Array} studentList --> 要奖励的学生列表
     */
    async openReward({ commit, rootGetters }, data) {
        // 开启奖励，type 三种类型：0 --> 全体奖励；1 --> 个人奖励；2 --> 答题奖励
        const { studentList = [], type } = data;
        if (type !== 0 && !studentList.length) return;
        commit("setState", { key: "disabled", value: true });
        try {
            const extension = {
                // studentList: type === 0 ? "all" : studentList.map((item) => item.id),
                type,
            }
            if (type !== 0) {
                extension.studentList = studentList.map((item) => item.id);
            }
            const prop = {
                content: "ccl_10",
                extension: JSON.stringify(extension),
            };
            await sendMessage(prop);
            commit("setState", { key: "disabled", value: false });

            // commit("setState", { key: "rewardStudentList", value: studentList });

            // 教师端奖励弹窗界面上需要展示的学生列表
            const showStudentList = type === 0 ? rootGetters.studentList : studentList;

            commit("setState", { key: "rewardStudentList", value: showStudentList });

            commit("setState", { key: "visible", value: true });
            // this.commit("student/addStudentFlower", studentList);
            this.commit("student/addStudentFlower", showStudentList);

        } catch (error) {
            commit("setState", { key: "disabled", value: false });

            Message({
                type: "error",
                message: "网络不稳定，请稍后重试！"
            })
        }

    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
}