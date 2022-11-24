
import tim from '@/utils/im'
import TIM from 'tim-js-sdk';
import sendMessage from '@/utils/sendMessage'
import { startHeartbeat, stopHeartbeat, sendHeartbeat } from '@/utils/heartbeat'
import { turnPinyin } from "@/utils/util"
import { disbandGroup } from '@/api/im'

function toolsUseInit() {
    return {
        judge: 0,
        select: 0,
        classTest: 0,
        timer: 0,
        callTheRoll: 0,
        responder: 0,
        contentShare: 0
    }
}

const state = {
    whetherToEnter: false,    // 是否已进入云课堂
    groupID: '',              // 群组id
    studentList: [],          // 学生列表
    seatingPlan: [],          // 座位表
    deviceList: [],           // 设备列表
    studentNum: 0,            // 当前登录的学生数量
    visible: false,           // 首页弹框的显示与隐藏
    remainingList: [],        // 储存设备列表用于记录未回复消息的设备
    timer: '',                // 定时器
    studentSum: 0,            // 学生总数
    classroomInfo: {},        // 教室信息
    toolsUse: toolsUseInit(), // 工具使用情况
    dataList: [],             // 数据埋点暂存
    correctRate: 0, // 正确率
}

const mutations = {
    setState(state, data) {
        // 状态暂存
        state[data.key] = data.value;
        // 如果值为true则进入云课堂  开始发送心跳包
        // if (state.whetherToEnter) startHeartbeat();
    },

    setDataList(state, data) {
        if (data) {
            state.dataList.push(data)
        } else {
            state.dataList = []
        }
    },

    manageMessage(state, data) {
        // 处理消息
        let { description, extension } = data.payload;
        console.log(extension);
        if (extension) {
            extension = JSON.parse(extension);
        }
        // console.log(extension)
        switch (description) {
            case 'JOIN_CCL_OK':
                // this.commit('inCloudClassroom/setStudent', extension);
                this.dispatch('inCloudClassroom/updateStudent', extension);
                break;
            case 'Still_There':
                console.log("收到学生的心跳包的返回");
                if (state.groupID) sendHeartbeat();
                break;
            case 'QUERY_ME':
                this.dispatch('inCloudClassroom/handleQueryMe')
                break;

        }
    },

    async createSeatingPlan(state, data) {
        // const res = await tim.getUserProfile({userIDList: ['BD2021100004']});
        // console.log(res);
        // console.log(data);
        state.seatingPlan = [];
        // 生成座位图
        for (let i = 0; i < data.row; i++) {
            state.seatingPlan.push([]);
            for (let j = 0; j < data.column; j++) {
                state.seatingPlan[i].push({ type: 0, active: 0 })
            }
        }
        state.deviceList.forEach(item => {
            this.commit('inCloudClassroom/updateSeatingPlan', { ...item, type: 1 });
        })

        console.log(state.deviceList);
    },

    updateSeatingPlan(state, data) {
        // 更新座位图
        const seat = state.deviceList.find(item => item.sn === data.sn);
        const x = state.seatingPlan.length - seat.rowNumber;
        let obj = state.seatingPlan[x][seat.columnNumber - 1];
        obj.type = data.type;
        obj.active = data.active ? data.active : obj.active;
        if (data.type === 2) {
            obj.im_id = data.im_id;
            obj.id = data.id;
            obj.sn = data.sn;
            obj.className = data.classInfo.className;
            obj.groupID = data.groupID;
            obj.name = data.name;
            obj.expand = false
        } else {
            // obj.type = 2;
            // obj.sn = data.sn;
            // obj.expand = false
            // console.log('消息发送失败' ,data);
        }
    },

    emptyState(state, data) {
        if (state.groupID) {
            if (data) {
                // 判断解散的群是否是当前上课的群
                const { payload: { groupProfile: { groupID } } } = data.e;
                if (state.groupID !== groupID) return;
            } else {
                this.dispatch('inCloudClassroom/disband', state.groupID)
            }
            // console.log(data);
            // 清空状态
            const flag = state.whetherToEnter;
            state.whetherToEnter = false;
            state.groupID = '';
            // state.studentList = [];
            // state.seatingPlan = [];
            state.deviceList = [];
            // state.studentNum = 0;
            state.visible = false;
            state.remainingList = [];
            this.commit('signCourseware/removeState')
            // 停止发送心跳包
            stopHeartbeat();
            // console.log('清空内容');
            if (flag) {
                this.dispatch('cloudClassroom/resetAll');
                const timer = setTimeout(() => {
                    data && data.cb({ msg: '退出云课堂', to: '/teachingFeedback' });
                    clearTimeout(timer)
                }, 0);
            } else {
                data && data.cb({ msg: '退出云课堂' })
            }
        }
    },
    emptyData() {
        state.studentList = [];
        state.seatingPlan = [];
        state.studentNum = 0;
        state.studentSum = 0;
        state.classroomInfo = {};
        state.toolsUse = toolsUseInit();
        state.dataList = [];
        state.correctRate = 0
    },
    studentFlower(state, data) {
        if (data.ids) {
            data.ids.forEach(id => {
                const student = state.studentList.find(item => item.id === id);
                student.isFlower = true;
                student.flowers++;
                student.interactiveNum++;
                if (student.interactiveNum === 1) {
                    this.commit('inCloudClassroom/updateActive', { sn: student.sn, active: 2 })
                } else if (student.interactiveNum === 3) {
                    this.commit('inCloudClassroom/updateActive', { sn: student.sn, active: 3 })
                }
            })
        } else {
            state.studentList.forEach(item => {
                item.isFlower = true;
                item.flowers++;
                item.interactiveNum++;
                if (item.interactiveNum === 1) {
                    this.commit('inCloudClassroom/updateActive', { sn: item.sn, active: 2 })
                } else if (item.interactiveNum === 3) {
                    this.commit('inCloudClassroom/updateActive', { sn: item.sn, active: 3 })
                }
            })
        }
    },
    studentRaiseHand(state, data) {
        const student = state.studentList.find(item => item.id === data.id);
        student.isRaiseHand = true;
        student.raiseHands++;
        student.interactiveNum++;
        if (student.interactiveNum === 1) {
            this.commit('inCloudClassroom/updateActive', { sn: student.sn, active: 2 })
        } else if (student.interactiveNum === 3) {
            this.commit('inCloudClassroom/updateActive', { sn: student.sn, active: 3 })
        }
    },
    studentInteractive(state, data) {
        if (data.id) {
            const student = state.studentList.find(item => item.id === data.id);
            student.interactiveNum++;
            if (student.interactiveNum === 1) {
                this.commit('inCloudClassroom/updateActive', { sn: student.sn, active: 2 })
            } else if (student.interactiveNum === 3) {
                this.commit('inCloudClassroom/updateActive', { sn: student.sn, active: 3 })
            }
        } else {
            state.studentList.forEach(item => {
                item.interactiveNum++;
                if (item.interactiveNum === 1) {
                    this.commit('inCloudClassroom/updateActive', { sn: item.sn, active: 2 })
                } else if (item.interactiveNum === 3) {
                    this.commit('inCloudClassroom/updateActive', { sn: item.sn, active: 3 })
                }
            })
        }
    },
    updateActive(state, data) {
        const seat = state.deviceList.find(item => item.sn === data.sn);
        const x = state.seatingPlan.length - seat.rowNumber;
        state.seatingPlan[x][seat.columnNumber - 1].active = data.active
    },
    studentQuestion(state, data) {
        if (data.flag) {
            console.log(data.ids);
            data.ids.forEach(id => {
                const student = state.studentList.find(item => item.id === id);
                student.correctNum++
            })
        } else {
            state.studentList.forEach(item => {
                item.questionNum++;
                item.interactiveNum++;
                if (item.interactiveNum === 1) {
                    this.commit('inCloudClassroom/updateActive', { sn: item.sn, active: 2 })
                } else if (item.interactiveNum === 3) {
                    this.commit('inCloudClassroom/updateActive', { sn: item.sn, active: 3 })
                }
            })
        }
    }
}

const actions = {
    handleQueryMe({ state }, data) {
        if (state.whetherToEnter) {
            // 现在正在云课堂中
            // const { studentId } = data;
            // const student = state.studentList.find(stu => stu.id === studentId);
            // const params = {
            //     isNeedStudentInfo: false
            // };
            // if (!student) {
            //     // 告诉学生现在在云课堂
            //     params.isNeedStudentInfo = true;
            // }
            sendMessage({
                content: 'Having_Class',
            });

            // sendMessage({
            //     to: data.im_id + '',
            //     type: TIM.TYPES.CONV_C2C,
            //     content: "ccl_1",
            //     extension: JSON.stringify({ flag: 1, groupId: state.groupID, subjectName: state.classroomInfo.subjectName })
            // })
        }
    },
    sendToDevice({ dispatch, commit }, data) {
        // console.log(this.getters.teacherId)
        // console.log(data);
        commit('setState', { key: 'groupID', value: data.groupID });
        commit('setState', { key: 'deviceList', value: data.deviceList });
        commit('setState', { key: 'remainingList', value: [...data.deviceList] });
        commit('setState', { key: 'studentSum', value: data.deviceList.length });
        dispatch('batch', data);
    },
    batch({ dispatch, commit }, data) {
        let arr = [];
        let i = 0;
        while (i < data.deviceList.length) {
            arr.push(data.deviceList.slice(i, (i += 10)))
        }
        for (let j = 0; j < arr.length; j++) {
            let n = j * 300;
            const timer = setTimeout(() => {
                arr[j].forEach(item => {
                    // console.log(item.sn)
                    dispatch('pushMessage', { sn: item.sn, groupID: data.groupID })
                })
                clearTimeout(timer)
            }, n);
        }
    },
    async pushMessage({ commit }, data) {
        const text = tim.createTextMessage({
            to: data.sn,
            conversationType: TIM.TYPES.CONV_C2C,
            payload: {
                text: JSON.stringify(data)
            }
        })

        tim.sendMessage(text).then(res => {
            // console.log('发送成功', res);
        }).catch(res => {
            // console.log('发送失败', res);
            commit('updateSeatingPlan', { sn: data.sn, type: 3 })
        })
    },
    async disband(state, data) {
        try {
            await disbandGroup({ groupId: data })
        } catch (err) {
            console.log(err);
        }
    },
    updateStudent({ state, commit, dispatch }, data) {
        console.log("更新学生 ------》", data);
        try {
            // 关闭定时器
            clearTimeout(state.timer);
            // 将该学生移出未接收列表
            const i = state.remainingList.findIndex(item => item.sn === data.sn);
            i !== -1 ? state.remainingList.splice(i, 1) : '';
            if (state.whetherToEnter) {
                // 如果已经进入云课堂
                sendMessage({
                    to: data.im_id + '',
                    type: TIM.TYPES.CONV_C2C,
                    content: "ccl_1",
                    extension: JSON.stringify({ flag: 1, groupId: state.groupID, subjectName: state.classroomInfo.subjectName })
                })
            }
            // 该学生是否已经存在
            const index = state.studentList.findIndex(i => i.id === data.id)
            if (index === -1) {
                // 如果学生不存在则增加学生数量
                state.studentNum++;
            } else {
                // 如果学生已存在则获取设备坐标
                const seat = state.deviceList.find(i => i.sn === state.studentList[index].sn);
                const x = state.seatingPlan.length - seat.rowNumber;
                // 根据坐标设置座位图的显示类型
                state.seatingPlan[x][seat.columnNumber - 1].type = 1;
                state.seatingPlan[x][seat.columnNumber - 1].active = 0;
                // 删除学生的数据
                state.studentList.splice(index, 1)
            }
            const obj = {
                ...data,
                nameList: turnPinyin(data.name),
                isFlower: false,
                flowers: 0,
                isRaiseHand: false,
                raiseHands: 0,
                interactiveNum: 0,
                questionNum: 0,
                correctNum: 0
            }

            console.log(obj);
            // 插入一条学生数据
            state.studentList.push(obj);
            // 更新座位图
            commit('updateSeatingPlan', { ...data, type: 2, active: 1 });
            // 如果剩余列表中没有数据则不需要再次发送
            if (state.remainingList.length) state.timer = setTimeout(() => {
                // console.log('再次向设备发送')
                dispatch('batch', { groupID: state.groupID, deviceList: state.remainingList });
                clearTimeout(state.timer)
            }, 1000);
        } catch (err) {
            console.log(err);
        }
    },
    dataRecords({ state, commit }, data) {
        switch (data.type) {
            case 'judge':
                // 判断
                state.toolsUse.judge++;
                commit('studentQuestion', data)
                break;
            case 'choice':
                // 选择
                state.toolsUse.select++;
                commit('studentQuestion', data)
                break;
            case 'classTest':
                // 随堂测试
                state.toolsUse.classTest++;
                commit('studentInteractive', data)
                break;
            case 'timer':
                // 计时器
                state.toolsUse.timer++
                break;
            case 'randomPick':
                // 点名
                state.toolsUse.callTheRoll++
                break;
            case 'responder':
                // 抢答器
                state.toolsUse.responder++;
                commit('studentInteractive', data)
                break;
            case 'distribute':
                // 内容分享
                state.toolsUse.contentShare++
                break;
            case 'flower':
                // 小红花
                commit('studentFlower', data)
                break;
            case 'raiseHand':
                // 举手
                commit('studentRaiseHand', data)
                break;
            case 'correct':
                // 回答正确的
                commit('studentQuestion', { ...data, flag: true })
                break;
            default:
                break;
        }
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}