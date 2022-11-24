// 随堂测试
const classTest = () => ({
    visible: false,
    previewVisible: false, // 题目预览
    selectFile: {}, //  选中的单个文件
    publishList: [],
    ctBackVisible: false, 
});

const state = classTest();

const mutations = {
    resetState(state) {
        Object.assign(state, classTest());
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