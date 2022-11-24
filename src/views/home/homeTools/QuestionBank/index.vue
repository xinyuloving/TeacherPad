<template>
    <!-- 题库助手 -->
    <div class="question-bank">
        <div class="head-button">
            <TButton
                class="btn1"
                @touch="to"
            >
                首页
            </TButton>
            <TButton class="btn2"> 题库助手 </TButton>
        </div>
        <div class="question-main">
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
import { mapState, mapMutations } from 'vuex'

export default {
    name: "QuestionBank",

    components: {
        TButton,
        LeftList,
    },

    computed: {
        ...mapState('questionBank', ['toHome'])
    },

    data() {
        return {
            LeftList: [{
                name: "我的题库",
                icon: "icon-shijuanguanli"
            }, {
                name: "校本题库",
                icon: "icon-wenjianjia"
            }], // 左侧列表数据
        };
    },

    methods: {
        ...mapMutations('questionBank', ['setState']),
        leftUpdate(index) {
            if (index) {
                this.$router.push({name: 'SchoolQuestionBank'})
            } else {
                this.$router.push({name: 'FileList'})
            }
        },
        to() {
            if (this.toHome) {
                console.log(this.toHome);
                this.$router.push({ path: '/' })
            } else {
                this.setState({key: 'isClick', val: true})
            }
        }
    },

    mounted() {
        this.$parent.$el.children[0].style.background = '#fff'
    },

    beforeDestroy() {
        this.$parent.$el.children[0].style.background = ''
    }
};
</script>

<style lang="less" scoped>
.question-bank {
    display: flex;
    color: #333;
    flex-direction: column;
    height: 100%;
    background: #F0F5FD;
    .question-main {
        flex: 1;
        display: flex;
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
            .title {
                font-size: 0.25rem;
                font-weight: 500;
                line-height: 0.9rem;
            }
        }
    }
}
</style>