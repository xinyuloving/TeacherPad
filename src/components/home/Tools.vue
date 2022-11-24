<template>
    <!-- 工具项 -->
    <div class="tools">
        <div class="top">
            <TButton
                class="in-classroom"
                v-touch="
                    () => {
                        $emit('begin');
                    }
                "
                >进入教室</TButton
            >
            <TButton
                class="prepare-lessons-management"
                v-touch="
                    () => {
                        preParing(1);
                    }
                "
                >备课管理</TButton
            >
            <TButton
                class="question-bank-management"
                v-touch="
                    () => {
                        preParing(2);
                    }
                "
                >题库管理</TButton
            >
        </div>
        <div class="bottom">
            <TButton
                class="classroom-test"
                v-touch="
                    () => {
                        preParing(4);
                    }
                "
                >随堂测试</TButton
            >
            <TButton
                class="assignment-management"
                v-touch="
                    () => {
                        preParing(5);
                    }
                "
                >作业管理</TButton
            >
            <TButton
                class="my-course"
                v-touch="
                    () => {
                        preParing(6);
                    }
                "
                >我的课表</TButton
            >
            <TButton
                class="class-report"
                v-touch="
                    () => {
                        preParing(3);
                    }
                "
                >更多精彩<br />敬请期待</TButton
            >
        </div>
    </div>
</template>

<script>
import TButton from "@/components/FunctionalComp/TButton.vue";

export default {
    name: "Tools",

    components: {
        TButton,
    },

    methods: {
        preParing(index) {
            switch (index) {
                case 1:
                    this.$router.push({
                        name: "CoursewareList",
                        params: { type: 0 },
                    });
                    break;
                case 2:
                    this.$router.push({ name: "FileList" });
                    break;
                case 3:
                    // this.$router.push({ name: "ClassReport" });
                    break;
                case 4:
                    this.$router.push({ path: "/Seatwork" });
                    break;
                case 5:
                    this.$router.push({ name: "WorkList" });
                    break;
                case 6:
                    this.$router.push({ name: "Timetable" });
                    break;
            }
        },
    },
};
</script>

<style lang="less" scoped>
.tools {
    color: #fff;
    // display: flex;
    // flex-wrap: wrap;
    // justify-content: space-between;
    // align-content: space-between;
    padding-top: 0.1rem;
    .top,
    .bottom {
        display: flex;
        justify-content: space-between;
    }
    .top {
        margin-bottom: 0.4rem;
    }
    .in-classroom {
        width: 5rem;
        height: 2.88rem;
        background: url("~@/assets/img/home/new0.png") no-repeat;
    }
    .prepare-lessons-management {
        width: 2.41rem;
        height: 2.88rem;
        background: url("~@/assets/img/home/new1.png") no-repeat;
    }
    .question-bank-management {
        width: 2.41rem;
        height: 2.88rem;
        background: url("~@/assets/img/home/new2.png") no-repeat;
    }
    .class-report,
    .classroom-test,
    .assignment-management,
    .my-course {
        width: 2.41rem;
        height: 3.48rem;
    }
    .class-report {
        background: url("~@/assets/img/home/new3.png") no-repeat;
    }
    .classroom-test {
        background: url("~@/assets/img/home/new4.png") no-repeat;
    }
    .assignment-management {
        background: url("~@/assets/img/home/new5.png") no-repeat;
    }
    .my-course {
        background: url("~@/assets/img/home/new6.png") no-repeat;
    }
    .t_button {
        padding-left: 0.33rem;
        padding-top: 0.38rem;
        justify-content: flex-start;
        align-items: flex-start;
        font-size: 0.35rem;
        font-weight: 600;
        background-size: cover;
    }
}
</style>