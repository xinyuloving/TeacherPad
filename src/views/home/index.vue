<template>
    <div class="index">
        <!-- 左侧盒子 -->
        <div class="left-box">
            <!-- 个人信息 -->
            <PrivateInfo />
            <!-- 功能 -->
            <Tools @begin="beginTraining" />
        </div>
        <!-- 右侧盒子 -->
        <div class="right-box">
            <!-- 当天课程 -->
            <TobayCourse @begin="beginTraining" />
        </div>
        <!-- 弹框 -->
        <TDialog :visible="visible" :dialogConStyle="{width: '14.35rem', height: '8.66rem', background: '#F6F5FA'}" :showClose="false">
            <template v-slot>
                <ChooseTheClassroom v-bind.sync="attendClassInfo" @begin="beginTraining" v-if="attendClassInfo.type" />
                <BeforeClassroom v-bind.sync="attendClassInfo" @begin="beginTraining" v-else />
            </template>
        </TDialog>
    </div>
</template>

<script>

import PrivateInfo from '@/components/home/PrivateInfo.vue'
import Tools from '@/components/home/Tools.vue'
import TobayCourse from '@/components/home/TodayCourse.vue'
import TDialog from '@/components/FunctionalComp/TDialog.vue'
import ChooseTheClassroom from '@/components/home/ChooseTheClassroom.vue'
import BeforeClassroom from '@/components/home/BeforeClassroom.vue'
import { mapState, mapMutations } from 'vuex'

export default {
    name: 'Index',

    components: {
        PrivateInfo,
        Tools,
        TobayCourse,
        TDialog,
        ChooseTheClassroom,
        BeforeClassroom
    },

    data() {
        return {
            schoolCode: this.$store.getters.schoolCode,
            teacherId: this.$store.getters.teacherId,
            attendClassInfo: {
                className: '',
                subjectName: '',
                type: true
            }
        }
    },

    computed: {
        ...mapState('inCloudClassroom', ['visible'])
    },

    methods: {
        ...mapMutations('inCloudClassroom', ['setState']),
        // 开始上课
        beginTraining(obj) {
            if (obj) {
                this.attendClassInfo = {...this.attendClassInfo, ...obj};
            } else {
                this.attendClassInfo = {
                    className: '',
                    subjectName: '',
                    type: true
                }
            }
            this.setState({key: 'visible', value: true})
        },
    },
}
</script>

<style lang="less" scoped>
.index {
    width: 100%;
    height: 100%;
    padding: 0.83rem;
    display: flex;
    .left-box {
        width: 10.11rem;
        height: 100%;
        display: flex;
        flex-direction: column;
        .private-info {
            margin-bottom: 0.85rem;
        }
        .tools {
            flex: 1;
        }
    } 
    .right-box {
        flex: 1;
        height: 100%;
        display: flex;
        justify-content: flex-end;
    }
}
</style>