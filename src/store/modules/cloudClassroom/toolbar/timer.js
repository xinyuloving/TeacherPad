// 定时器
const timer = () => ({
    timerDialogVisible: false, // 设置定时器弹窗
    timerVisible: false, // 定时器
    time: [], // 设置的时间
});


const state = timer();

const mutations = {
    resetState(state) {
        Object.assign(state, timer());
    },
    setState(state, data) {
        state[data.key] = data.value;
    },

}

const actions = {

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}