// 题库

const state = {
    folderId: '',       // 文件夹id
    toHome: true,
    isClick: false,
    navClick: false
}


const mutations = {
    // 获取文件夹id
    setFolderId(state, data) {
        state.folderId = data
    },
    setState(state, data) {
        state[data.key] = data.val;
    }
}


export default {
    namespaced: true,
    state,
    mutations
}