
const state = {
    classroomInfo: {},
    coursewareList: []
}

const mutations = {
    setClassroomInfo(state, data) {
        state.classroomInfo = data
    },
    setCoursewareList(state, data) {
        state.coursewareList = data
    },
    removeState(state) {
        state.classroomInfo = {};
        state.coursewareList = []
    },
    removeCoursewareList(state, data) {
        state.coursewareList.splice(data, 1)
    }
}

export default {
    namespaced: true,
    state,
    mutations
}