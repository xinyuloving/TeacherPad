<template>
    <!-- 备课助手 -->
    <div class="prepare-lessons">
        <div class="head-button">
            <TButton class="btn1" @touch="to"> {{ butContent }} </TButton>
            <TButton class="btn2"> 备课助手 </TButton>
        </div>
        <div class="prepare-lessons-main">
            <!-- 左侧 -->
            <div class="left-box">
                <LeftList :list="LeftList" @leftUpdate="leftUpdate" />
            </div>
            <!-- 右侧 -->
            <div class="right-box">
                <div class="right-main">
                    <!-- 子路由 -->
                    <router-view />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TButton from "@/components/FunctionalComp/TButton.vue";
import LeftList from "@/components/homeToolsPublic/leftList.vue";

export default {
    name: "PrepareLessons",

    components: {
        TButton,
        LeftList,
    },

    data() {
        return {
            LeftList: [{
                name: "我的课件",
                icon: "icon-kejian"
            }, {
                name: "校本资源",
                icon: "icon-wenjianjia1"
            }], // 左侧列表数据
            butContent: "首页",
        };
    },

    methods: {
        to() {
            this.$router.push({ name: "Home" });
        },
        leftUpdate(index) {
            if (index) {
                this.$router.push({name: 'ScholasticResource'})
            } else {
                this.$router.push({name: 'CoursewareList'})
            }
        }
    },
};
</script>

<style lang="less" scoped>
.prepare-lessons {
    display: flex;
    color: #333;
    flex-direction: column;
    height: 100%;
    background: #F0F5FD;
    .prepare-lessons-main {
        display: flex;
        flex: 1;
    }
    .head-button {
        display: flex;
        height: 0.81rem;
        align-items: center;
        padding-left: 0.2rem;
        .btn1 {
            width: 0.8rem;
            height: 0.6rem;
            font-size: 0.26rem;
            background: #ffffff;
            box-shadow: 0rem 0rem 0.1rem 0rem rgba(223, 223, 223, 0.5);
            border-radius: 0.08rem 0rem 0rem 0.08rem;
            font-weight: 400;
            color: #a8a8a8;
            margin: 0 0.1rem 0 0;
        }
        .btn2 {
            width: 1.3rem;
            height: 0.6rem;
            font-size: 0.26rem;
            background: #f4f8ff;
            border-radius: 0rem 0.08rem 0.08rem 0rem;
            border: 0.01rem solid #3e83f8;
            font-weight: 400;
            color: #3e83f8;
        }
    }
    .left-box {
        width: 2.58rem;
        height: 9.27rem;
        background-color: #fff;
        border-radius: 0 0.21rem 0.21rem 0;
    }
    .right-box {
        flex: 1;
        margin-left: 0.24rem;
        .right-main {
            width: 16.67rem;
            height: 9.27rem;
            border-radius: 0.21rem;
            background-color: #fff;
            padding: 0 0.52rem 0.5rem 0.58rem;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
        }
    }
}
</style>