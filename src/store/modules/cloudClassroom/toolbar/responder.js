// 抢答器
import sendMessage from "@/utils/sendMessage"
const responder = () => ({
    visible: false,
    winnerInfo: {}, // 第一个完成抢答的人，后续所有的消息都不做处理
});


const state = responder();

const mutations = {
    resetState(state) {
        Object.assign(state, responder());
    },
    setState(state, data) {
        state[data.key] = data.value;
    },

}

const actions = {
    // async openResponder() {
    //     try {
    //         const data = {
    //             content: "ccl_7",
    //             extension: JSON.stringify({ flag: 1 })
    //         }
    //         await sendMessage(data);
    //     } catch (error) {

    //     }

    // },
    async setWinnerInfo({ commit }, data) {
        // const { id, studentName } = data;
        // const student = rootGetters.studentList.find(item => item.id === data.id)
        commit("setState", { key: "winnerInfo", value: data });
        const o = {
            content: "ccl_7",
            extension: JSON.stringify({ flag: 2, ...data })
        }
        await sendMessage(o);
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}