<template>
    <header class="class-report-header">
        <div class="header-left">
            <img src="../../assets/img/cloudClassroom/classReport/book.png" class="book" />
            <span class="classroom-info">{{ classroomInfo.subjectName + '/' + teacherInfo.name }}</span>
            <span class="student-sum">共有{{ studentNum }}位同学认真聆听</span>
            <span class="male">
                <img src="../../assets/img/cloudClassroom/classReport/male.png" />
                &nbsp;{{ maleNum }}人
            </span>
            <span class="female">
                <img src="../../assets/img/cloudClassroom/classReport/female.png" />
                &nbsp;{{ femaleNum }}人
            </span>
        </div>
        <div class="header-right">
            <div class="icon-box" v-touch.prevent="toHome">
                <i class="iconfont icon-close"></i>
            </div>
        </div>
    </header>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
    name: 'ClassReportHeader',
    data() {
        return {
            maleNum: 0,
            femaleNum: 0
        }
    },
    computed: {
        ...mapState('inCloudClassroom', ['classroomInfo', 'studentNum', 'studentList']),
        ...mapState('teacher', ['teacherInfo'])
    },
    created() {
        for (let i = 0; i < this.studentList.length; i++) {
            this.studentList[i].gender ? this.maleNum++ : this.femaleNum++;
        }
    },
    methods: {
        ...mapMutations('inCloudClassroom', ['emptyData']),
        toHome() {
            this.emptyData();
            this.$router.push({ path: '/' });
        }
    }
}
</script>

<style lang="less" scoped>
.class-report-header {
    width: 100%;
    height: 1.28rem;
    background: #3E82F8;
    padding: 0 0.38rem;
    display: flex;
    justify-content: space-between;
    .header-left {
        height: 100%;
        display: flex;
        align-items: center;
        font-weight: 500;
        font-size: 0.31rem;
        color: #fff;
        .book {
            width: 0.86rem;
        }
        .classroom-info {
            margin-left: 0.21rem;
        }
        .student-sum {
            margin-left: 0.98rem;
        }
        .male {
            margin-left: 0.83rem;
        }
        .female {
            margin-left: 0.45rem;
        }
        .male,
        .female {
            display: flex;
            align-items: center;
            img {
                width: 0.46rem;
            }
        }
    }
    .header-right {
        height: 100%;
        display: flex;
        align-items: center;
        .icon-box {
            width: 0.81rem;
            height: 0.81rem;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, .5);
            border-radius: 50%;
            .iconfont {
                font-size: 0.7rem;
                color: #FE7876;
            }
        }
    }
}
</style>