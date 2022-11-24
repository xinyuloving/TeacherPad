// 教学反馈
const teachCallback = () => ({
    options: [
        {
            id: 1,  // 听懂了
            selectNum: 0,
            studentIdList: [],
            // state: 0
        },
        {
            id: 2,  // 没听懂
            selectNum: 0,
            studentIdList: [],
            // state: 0
        }
    ],
    finishStudentList: [], // {studentId, selectOption}已经完成选择的学生数组(全部)
    visible: false,
});


const state = teachCallback();

const mutations = {
    resetState(state) {
        Object.assign(state, teachCallback());
    },
    setState(state, data) {
        state[data.key] = data.value;
    },
    setCallbackInfo(state, data) {
        // 接收学生端发送来的 ccl_8 的消息  -->  设置每个选项选择的人数
        const studentId = Number(data.from.slice(4));
        const payload = JSON.parse(data.payload.extension);  // 学生选择的选项
        state.finishStudentList.push({
            studentId,
            selectOption: payload,  // 学生选择的选项
        });

        const t = state.options.find(item => item.id === payload);
        t.selectNum++;
        t.studentIdList.push(studentId);
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