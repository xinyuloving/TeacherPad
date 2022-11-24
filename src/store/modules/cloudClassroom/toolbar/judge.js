// 判断题
let prevOption;
const judge = () => ({
    visible: false,  // dialog 状态
    flag: true,  // 为 true 展示设置选项，false 表示设置答案
    options: [
        {
            id: 1,  // 对
            icon: "icon-duihao1",
            selectNum: 0,
            studentIdList: [],
            state: 0
        },
        {
            id: 2,  // 错
            icon: "icon-cuo",
            selectNum: 0,
            studentIdList: [],
            state: 0
        }
    ],
    finishStudentList: [], // {studentId, selectOption}已经完成选择的学生数组(全部)
    correctAnswer: "",  // 正确答案 id
});


const state = judge();

const getters = {
    choicePerson: state => {
        // 正确和错误的人
        const { finishStudentList, correctAnswer } = state; // 完成答题的学生列表，正确的答案
        const correct = [];  // 正确的人
        const error = [];   // 错误的人

        if (finishStudentList.length) {
            for (let i = 0; i < finishStudentList.length; i++) {
                const e = finishStudentList[i];
                if (e.selectOption === correctAnswer) {
                    // 正确
                    correct.push(e);
                } else {
                    error.push(e);
                }
            }
        }

        return {
            correct,
            error,
        }
    },
    correctRate: (state, getters, rootState, rootGetters) => {
        // 选择题 正确率
        const submitState = rootState.cloudClassroom.toolbar.floatWindow.submitState;
        if (submitState) {
            const studentListNum = rootGetters.studentList.length;
            // 计算正确率 --> 首先拿到正确的人数
            if (studentListNum) {
                const correctNum = getters.choicePerson.correct.length;
                return `${((correctNum / studentListNum) * 100).toFixed(
                    2
                )}%`;
            } else {
                return '0.00%'
            }

        } else {
            return '-';
        }
    },
}

const mutations = {
    resetState(state) {
        Object.assign(state, judge());
        prevOption = undefined;
    },
    setState(state, data) {
        state[data.key] = data.value;
    },

    setJudgeOptionState(state, index) {
        const item = state.options[index];
        if (item.state === 1) return;
        item.state = 1;
        if (prevOption)
            prevOption.state = 0;

        prevOption = item;
    },

    setJudgeInfo(state, data) {
        // 接收学生端发送来的 ccl_2 的消息  -->  设置每个选项选择的人数
        const { studentId, optionId } = JSON.parse(data.payload.extension);  // 学生选择的选项
        state.finishStudentList.push({
            studentId: studentId,
            selectOption: optionId,  // 学生选择的选项
        });

        const t = state.options.find(item => item.id === optionId);
        t.selectNum++;
        t.studentIdList.push(studentId);
    },
}

const actions = {

}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}