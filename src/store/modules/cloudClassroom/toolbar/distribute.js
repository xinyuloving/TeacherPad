// 内容分发
const distribute = () => ({
    visible: false,
    previewVisible: false, // 内容分发确认之后，云课堂的展示
    selectFile: {}, //  选中的单个文件
});


const state = distribute();

const mutations = {
    resetState(state) {
        Object.assign(state, distribute());
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