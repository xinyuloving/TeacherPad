import toolbar from "./toolbar";
import reward from "./reward"
// 云课堂
const classroom = () => ({
    attendClass: [],  // 正在上课的班级，长度为2.第一个代表年级 id ，第二个为 班级 id / 测试 使用 一年级一班 19  24
    // toolbarVisible: false,
    // topbarVisible: false,
    pickbarVisible: false,

    barrageList: [
        // {
        //     id: 1,
        //     name: "小明",
        //     top: '0.5rem', // 0 表示 0.5rem 1 表示 1.5rem 2 表示 2.5rem
        // },
    ], // 弹幕列表
})



const state = classroom();

const mutations = {
    resetState(state) {
        Object.assign(state, classroom());
    },
    setState(state, data) {
        // 设置 state 的某个属性值
        state[data.key] = data.value;
    },
    setBarrageList(state, studentId) {
        // 推送弹幕到弹幕列表
        const student = this.getters.studentList.find(item => item.id === studentId);
        let top;
        if (state.barrageList.length) {
            const o = state.barrageList[state.barrageList.length - 1];
            top = o.top === '0.5rem' ? '1.5rem' : o.top === '1.5rem' ? '2.5rem' : '0.5rem';
        } else {
            top = '0.5rem';
        }
        const d = {
            id: student.id,
            name: student.name,
            // photoUrl: student.photoUrl,
            top,
        }
        state.barrageList.push(d);
        // 看板
        this.dispatch("inCloudClassroom/dataRecords", {
            type: "raiseHand",
            id: studentId,
        });
    },
    removeBarrageList(state) {
        state.barrageList.shift();
    }
}

const actions = {
    resetAll({ commit }) {
        // 重置所有是为了防止老师正在进行一些工具，却结束了上课。如果不重置在下次上课时，将会出现问题。最好的做法是重置掉老师在课堂使用过的工具。
        commit("resetState");
        commit("toolbar/resetState");
        commit("reward/resetState");
        commit("toolbar/answer/resetState");
        commit("toolbar/choice/resetState");
        commit("toolbar/classTest/resetState");
        commit("toolbar/distribute/resetState");
        commit("toolbar/floatWindow/resetState");
        commit("toolbar/judge/resetState");
        commit("toolbar/random/resetState");
        commit("toolbar/responder/resetState");
        commit("toolbar/timer/resetState");

        // commit("toolbar/teachCallback/resetState");
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    modules: {
        toolbar,
        reward
    }
}