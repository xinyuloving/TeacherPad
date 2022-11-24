// 选择题
let prevOption;
const choice = () => ({
    // 选择题模块
    options: [],  // 老师在发布题目前 选择的选项
    // options {content: "A", selectNum: 0, studentIdList: [], state: 0}
    singleOrMult: false, // 单选或多选， false 表示单选，true 表示多选
    finishStudentList: [], // {studentId, selectOption}已经完成选择的学生数组(全部)
    correctAnswer: "",  // 正确答案
    visible: false,  // dialog 状态
    flag: true,  // 为 true 展示设置选项，false 表示设置答案
});

const state = choice();


const getters = {
    choicePerson: state => {
        // 正确和错误的人
        const { finishStudentList, correctAnswer, singleOrMult } = state; // 完成答题的学生列表，正确的答案
        const correct = [];  // 正确的人
        const error = [];   // 错误的人

        if (finishStudentList.length) {
            for (let i = 0; i < finishStudentList.length; i++) {
                const e = finishStudentList[i];
                if (singleOrMult) {
                    if (e.selectOption.length !== correctAnswer.length) {
                        // 首先多选情况下答案长度不同就直接跳过
                        error.push(e);
                        continue;
                    } else {
                        let flag = false;
                        for (let j = 0; j < correctAnswer.length; j++) {
                            const t = correctAnswer[j];  // 每个选项
                            // 学生的答案中不存在该项正确答案
                            if (
                                e.selectOption.findIndex(
                                    (item) => item === t
                                ) === -1
                            ) {
                                // 错误
                                flag = false;
                                break;
                            } else {
                                flag = true;
                            }
                        }
                        if (flag) {
                            correct.push(e);
                        } else {
                            error.push(e);
                        }
                    }
                } else {
                    // 单选
                    if (e.selectOption === correctAnswer) {
                        correct.push(e);
                    } else {
                        error.push(e);
                    }
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
                return "0.00%"
            }

        } else {
            return '-';
        }
    },
}


const mutations = {
    resetState(state) {
        // 重置 state
        Object.assign(state, choice());
        prevOption = undefined;
    },
    setState(state, data) {
        // 设置 state 的某个属性值
        state[data.key] = data.value;
    },
    // setChoiceOptions(state, data) {
    //     // 老师端 点击提交  设置 选择题的 选项
    //     console.log(data);
    //     state.choiceQuestion.options = data.options;
    //     state.choiceQuestion.singleOrMult = data.singleOrMult;
    //     // this.choiceOptions = data;
    // },
    setChoiceOptionState(state, index) {
        // 设置选择题选项的正确答案
        const item = state.options[index];
        if (state.singleOrMult) {
            // 多选
            item.state = item.state === 0 ? 1 : 0;
        } else {
            // 单选
            if (item.state === 1) return;
            item.state = 1;
            if (prevOption) {
                prevOption.state = 0;
            }
            prevOption = item;
        }
    },
    setChoiceInfo(state, data) {
        // 接收学生端发送来的 ccl_1 的消息  -->  设置每个选项选择的人数
        console.log(data);
        // const studentId = Number(data.from.slice(4));
        const { studentId, target } = JSON.parse(data.payload.extension);  // 第一个参数为 选项
        state.finishStudentList.push({
            studentId: studentId,
            selectOption: target,  // 学生选择的选项
        });
        if (state.singleOrMult) {
            // 多选 (收到 Array)
            for (let i = 0; i < target.length; i++) {
                const e = target[i];
                const t = state.options.find(item => item.content === e);
                t.selectNum++;
                t.studentIdList.push(studentId);
            }
        } else {
            // 单选 (收到 String)
            const t = state.options.find(item => item.content === target);
            console.log(t);
            t.selectNum++;
            t.studentIdList.push(studentId);
        }
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