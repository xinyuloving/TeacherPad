import { getTeacherInfo, getTimeTableByTeacherId, logout, getTimeTableTime, getRole } from "@/api/user"
import { getClassesBySchoolCode, getClassroomList, getSubjectBySchool } from "@/api/school"
import { getToken, removeToken } from '@/utils/auth'
import { createTeacherIM } from "@/utils/util";

const teacherStore = () => ({
    teacherInfo: {
        // id: 23423,
        // teacherName: "李晓敏",
        // avatar: "",
        // coursePendingNum: 3,
        // teachSubject: [
        //     {
        //         id: 1,
        //         subjectName: "数学"
        //     },
        //     {
        //         id: 2,
        //         subjectName: "语文"
        //     }
        // ],
        // teachClasses: [
        // {
        //     id: 1,
        //     gradeId: 3,
        //     className: "三年一班"
        // },
        // {
        //     id: 2,
        //     gradeId: 3,
        //     className: "三年二班"
        // },
        // {
        //     id: 3,
        //     gradeId: 4,
        //     className: "四年一班"
        // },
        // {
        //     id: 4,
        //     gradeId: 4,
        //     className: "四年二班"
        // }
        // ]
    },
    token: getToken(),
    teacherAccount: "",  // 老师账号 --> 唯一
    teacherId: "",
    schoolCode: "",
    gradeAndClassOptions: [],  // 学校下的年级和班级
    timetable: [],
    classroomList: [],          // 教室列表
    schoolSubjects: [],
    facilityENV: '',           // 当前设备运行的环境
    teacherRole: '',            // 教师角色
})

// const state = {
//     teacherInfo: {
//         // id: 23423,
//         // teacherName: "李晓敏",
//         // avatar: "",
//         // coursePendingNum: 3,
//         // teachSubject: [
//         //     {
//         //         id: 1,
//         //         subjectName: "数学"
//         //     },
//         //     {
//         //         id: 2,
//         //         subjectName: "语文"
//         //     }
//         // ],
//         // teachClasses: [
//         // {
//         //     id: 1,
//         //     gradeId: 3,
//         //     className: "三年一班"
//         // },
//         // {
//         //     id: 2,
//         //     gradeId: 3,
//         //     className: "三年二班"
//         // },
//         // {
//         //     id: 3,
//         //     gradeId: 4,
//         //     className: "四年一班"
//         // },
//         // {
//         //     id: 4,
//         //     gradeId: 4,
//         //     className: "四年二班"
//         // }
//         // ]
//     },
//     token: getToken(),
//     teacherAccount: "",  // 老师账号 --> 唯一
//     teacherId: "",
//     schoolCode: "",
//     gradeAndClassOptions: [],  // 学校下的年级和班级
//     timetable: [],
// }

const state = teacherStore();

const mutations = {
    setTeacherInfo(state, teacherInfo) {
        // 设置 teacherInfo
        state.teacherInfo = teacherInfo;
    },
    SET_TOKEN(state, token) {
        state.token = token;
    },
    setState(state, data) {
        state[data.key] = data.value;
    },
    resetState(state) {
        Object.assign(state, choice());
    },
    teacherInfoSet(state, data) {
        state.teacherInfo[data.key] = data.value;
    },
    setClassroomList(state, data) {
        state.classroomList = data
    },
    SET_ENV(state, data) {
        state.facilityENV = data
    }
}

const actions = {
    async logout() {
        await logout();
        removeToken();
        location.reload();
    },
    async getTeacherInfo({ commit, dispatch }) {
        // 发请求，拿到教师信息
        try {
            const { data: { classItemList, subjectList, teacher } } = await getTeacherInfo();
            commit("setState", { key: 'teacherAccount', value: teacher.account });
            commit("setState", { key: 'teacherId', value: teacher.id });
            const teachSubjects = [];
            subjectList.forEach(item => {
                teachSubjects.push({
                    id: item.id,
                    subjectName: item.name,
                    code: item.code,
                })
            })
            const teachClasses = [];
            classItemList.forEach(item => {
                teachClasses.push({
                    id: item.id,
                    classCode: item.code,
                    gradeCode: item.gradeCode,
                    className: item.gradeName + item.clazzName,
                    gradeName: item.gradeName, // 后加字段，前面的className 不可删除
                    clazzName: item.clazzName,
                })
            })
            // teacher.im_id = Number(`2000${teacher.id}`);
            teacher.im_id = createTeacherIM(teacher.id);
            const teacherInfo = {
                teachSubjects,
                teachClasses,
                ...teacher,
                coursePendingNum: 0,
            }
            commit("setState", { key: 'teacherInfo', value: teacherInfo });
            commit("setState", { key: 'schoolCode', value: teacher.schoolCode });
            dispatch('getClassroomList', teacherInfo.schoolCode);
            dispatch('getGradeAndClass');
            dispatch('getSubjectsBySchool');
            dispatch('getTeacherRole')
        } catch (error) {

        }

    },
    getGradeAndClass({ state, commit }) {
        // 获取年级和班级 --->  级联
        return new Promise(async (reslove) => {
            if (!state.gradeAndClassOptions.length) {
                // const gradeList = await dispatch("getGradeList")
                const p = {
                    schoolCode: state.schoolCode,
                    page: 1,
                    pageSize: 999,
                }
                const { data: { clazzList } } = await getClassesBySchoolCode(JSON.stringify(p));
                const gradeCodeList = Array.from(new Set(clazzList.map(item => item.gradeCode)));
                const temArr = [];
                for (let i = gradeCodeList.length - 1; i >= 0; i--) {
                    const e = gradeCodeList[i];
                    const temObj = {
                        label: "",
                        value: e,
                        children: []
                    }
                    for (let j = clazzList.length - 1; j >= 0; j--) {
                        const o = clazzList[j];
                        if (o.gradeCode === e) {
                            if (!temObj.label) temObj.label = o.gradeName;

                            temObj.children.push({
                                label: o.clazzName,
                                value: o.code
                            })
                        }
                    }
                    temArr.push(temObj)
                }
                // 年级排序方式
                let gradeOrder = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '七年级', '八年级', '九年级'];
                // 排序方法
                temArr.sort((a, b) => gradeOrder.indexOf(a.label) - gradeOrder.indexOf(b.label));
                commit("setState", { key: "gradeAndClassOptions", value: temArr })
            }
            reslove(state.gradeAndClassOptions);
        })

    },
    getCourse({ state, commit }, flag) {
        return new Promise(async (resolve) => {
            if (!state.timetable.length || flag) {
                const { data: timeList } = await getTimeTableTime({ schoolCode: state.schoolCode })
                const { data: courseInfo } = await getTimeTableByTeacherId({
                    schoolCode: state.schoolCode,
                    teacherId: state.teacherId,
                })

                let tableData = [];
                for (let i = 1; i <= 8; i++) {
                    const t = timeList.find(item => item.courseNum === i);
                    if (t) {
                        const courseRow = courseInfo.find(ele => ele.courseNum === i);
                        if (courseRow) {
                            for (let k = 1; k <= 7; k++) {
                                const c = courseRow.infos.find(course => course.week === k);
                                console.log(c);
                                if (c) {
                                    t[`week${k}`] = {
                                        week: k,
                                        courseCode: c.courseCode,
                                        courseName: c.courseName,
                                        gradeCode: c.gradeCode,
                                        gradeName: c.gradeName,
                                        classCode: c.classCode,
                                        className: c.className,
                                    };
                                } else {
                                    t[`week${k}`] = {
                                        week: k,
                                        courseCode: "",
                                        courseName: "",
                                        gradeCode: "",
                                        gradeName: "",
                                        classCode: "",
                                        className: "",
                                    };
                                }
                            }
                        } else {
                            for (let k = 1; k <= 7; k++) {
                                t[`week${k}`] = {
                                    week: k,
                                    courseCode: "",
                                    courseName: "",
                                    gradeCode: "",
                                    gradeName: "",
                                    classCode: "",
                                    className: "",
                                };
                            }
                        }
                        tableData.push(t);
                    } else {
                        const m = {
                            courseNum: i,
                            startTime: "",
                            endTime: "",
                        }
                        for (let k = 1; k <= 7; k++) {
                            m[`week${k}`] = {
                                week: k,
                                courseCode: "",
                                courseName: "",
                                gradeCode: "",
                                gradeName: "",
                                classCode: "",
                                className: "",
                            };
                        }
                        tableData.push(m);
                    }
                }

                // for (let j = 0; j < timeList.length; j++) {
                //     const m = timeInfos[j];
                //     for (let k = 1; k <= 7; k++) {
                //         m[`week${k}`] = {
                //             week: k,
                //             courseCode: "",
                //             courseName: "",
                //         };
                //     }
                // }
                // tableData = timeInfos;
                // if (tableData.length) {
                //     for (let j = 0; j < rows.length; j++) {
                //         const m = rows[j];
                //         const dataItem = tableData.find(
                //             (item) => item.courseNum === m.courseNum
                //         );
                //         if (dataItem) {
                //             for (
                //                 let k = 0;
                //                 k < m.infos.length;
                //                 k++
                //             ) {
                //                 const o = m.infos[k];
                //                 dataItem[`week${o.week}`] = o;
                //             }
                //         }
                //     }
                // }



                // let tableData = [];
                // for (let j = 0; j < timeInfos.length; j++) {
                //     const m = timeInfos[j];
                //     for (let k = 1; k <= 7; k++) {
                //         m[`week${k}`] = {
                //             week: k,
                //             courseCode: "",
                //             courseName: "",
                //         };
                //     }
                // }
                // tableData = timeInfos;
                // if (tableData.length) {
                //     for (let j = 0; j < rows.length; j++) {
                //         const m = rows[j];
                //         const dataItem = tableData.find(
                //             (item) => item.courseNum === m.courseNum
                //         );
                //         if (dataItem) {
                //             for (
                //                 let k = 0;
                //                 k < m.infos.length;
                //                 k++
                //             ) {
                //                 const o = m.infos[k];
                //                 dataItem[`week${o.week}`] = o;
                //             }
                //         }
                //     }
                // }

                commit("setState", { key: "timetable", value: tableData });
                // const week = new Date().getDay();
                // const today = week ? week : 7;
                // let coursePendingNum = 0;
                // for (let i = 0; i < tableData.length; i++) {
                //     const e = tableData[i];
                //     if (e[`week${today}`].courseCode) coursePendingNum++;
                // }
                // commit("teacherInfoSet", { key: "coursePendingNum", value: coursePendingNum });
            }
            resolve(state.timetable);
        })
    },
    async getClassroomList({ commit }, code) {
        try {
            const { data } = await getClassroomList({ schoolCode: code });
            if (data && data.length) commit('setClassroomList', data)
        } catch (err) {
            console.log(err);
        }
    },

    async getSubjectsBySchool({ state, commit }) {
        try {
            const { data } = await getSubjectBySchool({ schoolCode: state.schoolCode })
            commit("setState", { key: "schoolSubjects", value: data });
        } catch (err) {
            console.log(err)
        }
    },

    async getTeacherRole({ state, commit }) {
        try {
            const { data } = await getRole()
            commit("setState", { key: 'teacherRole', value: data });
        } catch (err) {
            console.log(err);
        }
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}