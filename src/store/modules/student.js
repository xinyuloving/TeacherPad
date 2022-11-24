import { getStudentList } from "@/api/student"
import { turnPinyin, createStudentIM } from "@/utils/util"

const state = {
    studentList: [],
}

const mutations = {
    setAllStudent(state, data) {
        const t = data.map(item => ({
            id: item.student.id,
            studentAccount: item.student.account,
            name: item.student.name,
            photoUrl: item.student.photoUrl,
            // 下面两个字段在 云课堂 的右侧选人 组件中使用，如果 之后 这两个字段会影响逻辑的话，就再生成一份新的 给 选人组件使用
            checked: false,
            nameList: turnPinyin(item.student.name), // 姓名的首字母转为大写后组成的字符串数组
            im_id: createStudentIM(item.student.id),
            gender: item.student.gender,
            flowerNum: 0,
            gradeCode: item.clazzInfo.gradeCode,
            classCode: item.clazzInfo.code,
        }))
        state.studentList = t;
    },
    addStudentFlower(state, studentArr) {
        // 给学生增加小红花
        const { studentList } = state;
        for (let i = 0; i < studentArr.length; i++) {
            const e = studentArr[i];
            const t = studentList.find(item => item.id === e.id);
            if (t)
                t.flowerNum += 1;
        }
    }
}

const actions = {
    getAllStudent({ commit }, data) {
        // 获取学生列表
        return new Promise((resolve, reject) => {
            getStudentList(JSON.stringify(data)).then(res => {
                const { data: { studentInfoList } } = res;
                commit('setAllStudent', studentInfoList)
                resolve();
            }).catch(err => {
                reject(err);
            })

        })
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}