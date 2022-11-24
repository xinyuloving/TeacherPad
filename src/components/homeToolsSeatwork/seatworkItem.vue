<template>
    <div class="seatwork-item">
        <!-- 图片 -->
        <div class="img-box">
            <img src="~@/assets/img/seatwork/refer.png" />
        </div>
        <!-- 试卷标题 -->
        <div class="title">{{ item.examPaperName }}</div>
        <!-- 发布时间 -->
        <!-- <div class="time">2020-5-7</div> -->
        <!-- 班级 -->
        <div class="class-grade">{{ item.gradeName + item.className }}</div>
        <!-- 人数 -->
        <div class="people">
            <span>{{ item.answerCount }}</span
            >/{{ item.stuCount }}
        </div>
        <!-- 查阅试卷 -->
        <div class="but">
            <TButton
                class="btn"
                @touch="
                    () => {
                        $emit('lookTest', item.id);
                    }
                "
            >
                查阅试卷
            </TButton>
        </div>
    </div>
</template>

<script>
import TButton from "@/components/FunctionalComp/TButton.vue";

export default {
    name: "SeatworkItem",

    components: {
        TButton,
    },

    props: {
        item: Object,
    },
};
</script>

<style lang="less" scoped>
.seatwork-item {
    margin-top: 0.5rem;
    margin-right: 0.57rem;
    width: 3.25rem;
    height: 3.8rem;
    background-color: #fff;
    border-radius: 0.1rem;
    text-align: center;
    padding-top: 0.28rem;
    .img-box {
        img {
            width: 0.9rem;
            height: 0.9rem;
        }
    }
    .title {
        margin-top: 0.19rem;
        margin-bottom: 0.1rem;
        color: #333;
        font-size: 0.23rem;
        font-weight: 500;
        padding: 0 0.3rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .class-grade,
    .people,
    .time {
        font-size: 0.19rem;
        color: #666;
        span {
            color: #3e83f8;
        }
    }
    .people {
        margin-top: 0.14rem;
    }
    .but {
        display: flex;
        justify-content: center;
        margin-top: 0.21rem;
        .btn {
            width: 1.92rem;
            height: 0.42rem;
            font-size: 0.21rem;
            background: #3e83f8;
            color: #ffffff;
            font-weight: 400;
            border-radius: 0.08rem;
        }
    }
}
</style>
