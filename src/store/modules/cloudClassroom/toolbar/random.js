// 随机选人
const random = () => ({
    visible: false,  // dialog 状态
    // options: [], // {photoUrl, name, id}
    // winnerInfo: {}, // 目标对象
});


const state = random();

const mutations = {
    resetState(state) {
        Object.assign(state, random());
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