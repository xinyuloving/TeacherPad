<template>
    <div class="left-list">
        <!-- 列表的每一项 -->
        <div class="left-list-item" v-touch="() => { currentTest(index) }" v-for="(item, index) in studentList" :key="index" :style="{ backgroundColor: index === current ? '#F0F5FD' : '#fff' }">
            <!-- 头像 -->
            <div class="photo-box">
                <img class="photo" src="~@/assets/img/avatar.png" />
                <img v-if="item.answerStatus" class="tag" src="~@/assets/img/seatwork/seatwork-just.png" />
                <!-- <i class="iconfont icon-success1 tag" v-if="item.answerStatus"></i> -->
                <div class="mask" v-else></div>
            </div>
            <!-- 姓名 -->
            <div class="student-name" v-if="item.answerStatus" :style="{ color: index === current ? '#3E83F8' : '#333'}">{{ item.studentName }}</div>
            <div class="student-name" v-else :style="{ color: '#999'}">{{ item.studentName }}</div>
        </div>
    </div>
</template>

<script>
export default {

    name: 'LeftList',

    props: {
        studentList: Array
    },

    data() {
        return {
            current: -1,    // 当前选中的学生的索引
        }
    },

    methods: {
        currentTest(index) {
            if (this.studentList[index].answerStatus && this.current !== index) {
                this.current = index;
                this.$emit('currentTest', index)
            }
        }
    },

    created() {
        // 当已有学生提交时  默认选中索引为0的学生
        if (this.studentList[0].answerStatus) this.current = 0;
    },
}
</script>

<style lang="less" scoped>
    .left-list {
        width: 3.08rem;
        height: 9.27rem;
        background-color: #fff;
        border-radius: 0.1rem;
        box-sizing: border-box;
        padding: 0.38rem 0.19rem 0.38rem 0.16rem;
        overflow-y: auto;
        color: #333;
        .left-list-item {
            height: 0.85rem;
            border-radius: 0.1rem;
            display: flex;
            align-items: center;
            padding-left: 0.43rem;
            transition: all .3s;
            font-size: 0.23rem;
            .photo-box {
                width: 0.6rem;
                height: 0.6rem;
                position: relative;
                margin-right: 0.17rem;
                .photo {
                    width: 0.6rem;
                }
                .tag {
                    width: 0.2rem;
                    position: absolute;
                    top: 0;
                    left: 0;
                }
                .mask {
                    position: absolute;
                    width: 0.6rem;
                    height: 0.6rem;
                    border-radius: 50%;
                    top: 0;
                    left: 0;
                    background-color: #999;
                    opacity: .5;
                }
            }
            .student-name {
                transition: all .3s;
                flex: 1;
            }
        }
    }
</style>