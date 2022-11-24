<template>
    <!-- 个人信息 -->
    <div class="private-info">
        <!-- 头像 -->
        <img src="~@/assets/img/home/photo.png" />
        <!-- 文字 -->
        <div class="text-box">
            <!-- 教师名 -->
            <div class="name">{{ teacherInfo.name }}</div>
            <!-- 所教科目和班级 -->
            <div class="subject-and-class">
                任课科目：
                <span
                    v-for="(item, index) in teacherInfo.teachSubjects"
                    :key="index"
                    >{{ item.subjectName }}</span
                >
                |&nbsp;&nbsp; 任课班级：
                <span
                    v-for="(item, i) in teacherInfo.teachClasses"
                    :key="teacherInfo.teachSubjects.length + i"
                    >{{ item.className }}</span
                >
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    name: "PrivateInfo",

    computed: {
        ...mapState({
            teacherInfo: (state) => state.teacher.teacherInfo,
        }),
    },
};
</script>

<style lang="less" scoped>
.private-info {
    background: linear-gradient(
        270deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.6) 100%
    );
    border-radius: 0.72rem;
    height: 1.44rem;
    display: flex;
    img {
        height: 100%;
        border-radius: 50%;
        border: 0.02rem solid #fff;
    }
    .text-box {
        width: 8.67rem;
        padding-left: 0.2rem;
        div {
            height: 50%;
            line-height: 0.72rem;
        }
        .name {
            font-size: 0.35rem;
            font-weight: 600;
            color: #3b444c;
        }
        .subject-and-class {
            width: 100%;
            overflow-x: auto;
            white-space: nowrap;
            font-size: 0.27rem;
            span {
                margin-right: 10px;
            }
        }
    }
}
</style>