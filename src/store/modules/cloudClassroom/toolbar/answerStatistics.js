// 选择题/判断题 答题统计
const answer = () => ({
    visible: false,
    answerHide: false, // 隐藏
})
const state = answer();

const mutations = {
    resetState(state) {
        // 重置 state
        Object.assign(state, answer());
    },
    setState(state, data) {
        // 设置 state 的某个属性值
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