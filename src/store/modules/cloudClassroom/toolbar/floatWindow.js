// 浮窗
const floatWindow = () => ({
    visible: false,
    submitState: false,  // 浮窗中 是否已经设置了答案
    hide: false, // 浮窗是否隐藏
    mappingHide: false, // 映射 hide (动画)
})
const state = floatWindow();

const mutations = {
    resetState(state) {
        // 重置 state
        Object.assign(state, floatWindow());
    },
    setState(state, data) {
        // 设置 state 的某个属性值
        state[data.key] = data.value;
    },
}

const actions = {
    changeFloatWindowHide({ state, commit }) {
        // 改变浮窗 隐藏或出现
        if (!state.hide) {
            commit('setState', { key: 'hide', value: true });
            commit('setState', { key: 'mappingHide', value: true });
        } else {
            commit('setState', { key: 'hide', value: false });
            let timer = setTimeout(() => {
                commit('setState', { key: 'mappingHide', value: false });
                clearTimeout(timer);
            }, 300);
        }
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}