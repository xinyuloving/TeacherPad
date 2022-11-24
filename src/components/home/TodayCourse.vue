<template>
    <!-- 今日课程 -->
    <div class="today-course" v-loading="loading">
        <div class="title">课程安排</div>
        <div class="display-area" ref="slide">
            <div class="course-content" ref="slideChild" v-if="courseList.length">
                <div class="item-box" v-for="(item, index) in courseList" :key="index">
                    <div :class="each.status === 0 ? 'start' : 'not-start'" v-for="(each, num) in item" :key="num">
                        <div class="top-box">
                            <span class="diji">第{{each.courseNum}}节</span>
                            <span class="sub-name">{{each.courseName}}</span>
                        </div>
                        <div class="bottom-box">
                            <span class="time">{{each.startTime + '-' + each.endTime}}</span>
                            <span class="class-name">{{each.gradeName + each.className}}</span>
                            <TButton class="begin" v-if="each.status" @touch="begin(each)">开始上课</TButton>
                            <div class="begin" v-else>开始上课</div>
                        </div>
                    </div>
                </div>
            </div>
            <DefalutPage v-else :textContent="defalutText" :imgName="defaultImgName" @refresh="getTodayCourse" />
        </div>
        <div class="locations" v-if="courseList.length">
            <div class="dian" v-for="(item, index) in courseList" :key="index" :style="{ background: currentPage === index ? '#fff' : '#C9C9C9' }"></div>
        </div>
    </div>
</template>

<script>

import TButton from '@/components/FunctionalComp/TButton.vue'
import slide from '@/components/mixins/slide'
import { getTodayCourse } from '../../api/classSchedule'
import moment from 'moment'
import defalutPage from '@/components/mixins/defalutPage.js'

export default {
    name: 'TobayCourse',

    mixins: [slide, defalutPage],

    components: {
        TButton
    },

    data() {
        return {
            schoolCode: this.$store.getters.schoolCode,
            teacherId: this.$store.getters.teacherId,
            courseList: [],
            loading: false
        }
    },

    methods: {
        // 开始上课
        begin(item) {
            if (item.endTime <= moment(new Date()).format("HH:mm")) {
                this.$message({
                    message: '该节课已结束',
                    type: 'warning'
                })
            } else {
                this.$emit('begin', {
                    subjectName: item.courseName
                })
            }
        },
         // 获取当天的课表
        async getTodayCourse() {
            try {
                this.loading = true;
                const res = await getTodayCourse({
                    schoolCode: this.schoolCode,
                    teacherId: this.teacherId
                })
                if (res.code === 0 && res.data.length) {
                    const arr = [...res.data.filter(item => item.status === 1), ...res.data.filter(item => item.status === 0)];
                    this.courseList.push([])
                    arr.forEach(item => {
                        if (!this.courseList[this.courseList.length - 1] || this.courseList[this.courseList.length - 1].length === 4) {
                            this.courseList.push([])
                        }
                        this.courseList[this.courseList.length - 1].push(item)
                    })
                    setTimeout(() => {
                        this.slide_mount()
                    }, 0);
                } else {
                    this.defaultShow('今天没有课程')
                }
                this.loading = false
            } catch(err) {
                this.defaultShow('网络飞走了，刷新试试吧', 'not_network');
                this.loading = false;
                // this.$message({
                //     message: err,
                //     type: 'error'
                // })
                console.log(err);
            }
        },
    },
    
    created() {
        this.getTodayCourse()
    }
}
</script>

<style lang="less" scoped>
.today-course {
    padding: 0 0.22rem;
    width: 7.65rem;
    height: 9.15rem;
    background-image: linear-gradient(to bottom, #fff, #7EB5FF);
    border-radius: 0.16rem;
    box-shadow: 0rem 0.01rem 0.05rem 0rem rgba(151, 188, 254, 0.5);
    overflow: hidden;
    .title {
        font-size: 0.38rem;
        font-weight: 600;
        line-height: 3;
        padding: 0 0.2rem;
    }
    .display-area {
        height: 7.2rem;
        overflow: hidden;
        position: relative;
    }
    .course-content {
        height: 100%;
        padding-top: 0.1rem;
        position: absolute;
        top: 0;
        display: flex;
        .item-box {
            height: 100%;
            width: 7.21rem;
            padding: 0 0.2rem;
            display: inline-block;
            .not-start,
            .start {
                height: 1.6rem;
                border-radius: 0.1rem;
                margin-bottom: 0.23rem;
                padding: 0.2rem 0.3rem;
                .top-box,
                .bottom-box {
                    height: 0.6rem;
                    display: flex;
                    align-items: center;
                }
                .bottom-box {
                    justify-content: space-between;
                }
                .diji {
                    padding: 0.05rem 0.1rem;
                    font-size: 0.25rem;
                    font-weight: 500;
                    border-radius: 0.05rem;
                    margin-right: 0.3rem;
                }
                .sub-name {
                    font-size: 0.31rem;
                    font-weight: 600;
                    font-family: PingFangSC-Semibold, PingFang SC;
                }
                .time,
                .class-name {
                    font-size: 0.29rem;
                    color: #666666;
                    font-family: PingFangSC-Regular, PingFang SC;
                }
                .time {
                    margin-right: 0.2rem;
                }
                .begin {
                    width: 1.48rem;
                    height: 0.48rem;
                    font-size: 0.31rem;
                    font-weight: 600;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    display: inline-block;
                    margin-left: 0.2rem;
                }
            }
            .not-start {
                background-color: #fff;
                .diji {
                    color: #4A8CFD;
                    background-color: #4b8efd42;
                }
                .begin {
                    background-image: linear-gradient(to right, #4A8CFC, #5EC2FF);
                    color: #fff;
                }
            }
            .start {
                background-color: #EFF0F1;
                .diji {
                    background-color: #D2D2D2;
                    color: #fff;
                }
                .begin {
                    background-color: transparent;
                    color: #999;
                    text-align: center;
                    line-height: 0.48rem;
                }
            }
        }
    }
    .locations {
        display: flex;
        justify-content: center;
        height: 0.8rem;
        align-items: center;
        .dian {
            width: 0.1rem;
            height: 0.1rem;
            border-radius: 50%;
            background-color: #fff;
            margin: 0 0.15rem;
        }
    }
}
</style>