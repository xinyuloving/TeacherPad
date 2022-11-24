<template>
    <div class="seatwork">
        <!-- 头部按钮区 -->
        <div class="header-but">
            <HeaderBotton
                :headerButtons="headerButtons"
                @toLocation="toLocation"
            />
        </div>
        <!-- 主页显示区域 -->
        <div class="home-page" v-if="location">
            <!-- 切换栏 -->
            <div class="tab" v-if="false">
                <div
                    class="tab-left"
                    :style="{
                        backgroundColor: location === 1 ? '#3E83F8' : '#fff',
                    }"
                    v-touch="
                        () => {
                            location = 1;
                        }
                    "
                >
                    <img src="~@/assets/img/seatwork/test.png" />
                    <span
                        :style="{ color: location === 1 ? '#fff' : '#3E83F8' }"
                        >随堂测试</span
                    >
                </div>
                <div
                    class="tab-right"
                    :style="{
                        backgroundColor: location === 2 ? '#3E83F8' : '#fff',
                    }"
                    v-touch="
                        () => {
                            location = 2;
                        }
                    "
                >
                    <img src="~@/assets/img/seatwork/stage.png" />
                    <span
                        :style="{ color: location === 2 ? '#fff' : '#3E83F8' }"
                        >阶段考试</span
                    >
                </div>
            </div>
            <!-- 随堂测试展示区 -->
            <div class="seatwork-box" v-if="!defaultIsShow">
                <SeatworkItem
                    v-for="(item, index) in testList"
                    :key="index"
                    :item="item"
                    @lookTest="lookTest"
                />
            </div>
            <div class="seatwork-box" v-else>
                <!-- 缺省页 -->
                <DefalutPage :textContent="defalutText" :imgName="defaultImgName"></DefalutPage>
            </div>
        </div>
        <!-- 查阅试卷显示区域 -->
        <div class="look-up" v-else>
            <LookTest :testTitle="lookTestName" :testId="lookTestId" />
        </div>
        <!-- 加载状态 -->
        <Loading v-show="isLoading" />
    </div>
</template>

<script>
import HeaderBotton from "@/components/homeToolsSeatwork/headerButton.vue";
import SeatworkItem from "@/components/homeToolsSeatwork/seatworkItem.vue";
import LookTest from "@/views/home/homeTools/Seatwork/LookTest.vue";
import Loading from "@/components/FunctionalComp/Loading.vue";
import { getTestList } from "@/api/classTest";
import defalutPage from '@/components/mixins/defalutPage'

export default {
    name: "Seatwork",

    components: {
        HeaderBotton,
        SeatworkItem,
        LookTest,
        Loading,
    },

    mixins: [defalutPage],

    data() {
        return {
            headerButtons: [
                // 头部按钮列表
                {
                    content: "首页",
                    toLocation: "/"
                },
                {
                    content: "考试管理",
                    toLocation: "/Seatwork"
                },
            ],
            location: 1, // 当前所在页面 0 => 查阅试卷  1 => 随堂测试  2 => 阶段考试   默认1
            teacherId: this.$store.getters.teacherId, // 教师id
            testList: [], // 试卷列表
            lookTestId: null, // 查阅试卷的id
            lookTestName: "", // 要查阅的试卷名
            isLoading: false, // 加载状态
        };
    },

    methods: {
        // 监听头部按钮点击事件
        toLocation(index) {
            // 如果点击的是当前项 则跳出
            if (index === this.headerButtons.length - 1) return;
            if (index) {
                // 如果点击的非首页
                // 则被点击的发生变化 并删除其后的按钮
                this.headerButtons.splice(index + 1);
                // 改变当前页面显示内容
                this.location = 1;
            } else {
                this.$router.push({
                    path: this.headerButtons[index].toLocation,
                });
            }
        },
        // 获取随堂测试试卷列表
        async getTestList() {
            try {
                this.isLoading = true;
                const { data } = await getTestList({
                    teacherId: this.teacherId,
                });
                // 如果data有值
                if (data.length) {
                    this.testList = data.reverse();
                    this.defaultIsShow = false;
                } else {
                    this.defaultShow();
                    this.testList = [];
                }
                this.isLoading = false;
            } catch (err) {
                this.testList = [];
                this.defaultShow("not_network", "网络飞走了，刷新试试吧");
                this.isLoading = false;
                console.log(err);
            }
        },
        // 查阅试卷
        lookTest(id) {
            // 修改顶部按钮样式 并追加一个按钮
            this.headerButtons.push({
                content: "查阅试卷",
                toLocation: ""
            });
            this.lookTestId = id;
            this.testList.forEach((item) => {
                if (item.id === id) this.lookTestName = item.examPaperName;
            });
            // 改变当前页面显示内容
            this.location = 0;
        },
    },

    created() {
        this.getTestList();
    },
};
</script>

<style lang="less" scoped>
.seatwork {
    height: 100%;
    background-color: #f0f5fd;
    .header-but {
        padding: 0.25rem 0.52rem 0.15rem;
    }
    .home-page {
        .tab {
            margin-top: 0.15rem;
            display: flex;
            font-size: 0.23rem;
            justify-content: center;
            div {
                width: 3.39rem;
                height: 0.48rem;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #fff;
                span {
                    margin-left: 5px;
                }
                img {
                    width: 0.22rem;
                    height: 0.24rem;
                }
            }
            .tab-left {
                border-radius: 2rem 0 0 2rem;
            }
            .tab-right {
                border-radius: 0 2rem 2rem 0;
            }
        }
        .seatwork-box {
            padding-left: 0.73rem;
            padding-bottom: 0.5rem;
            height: 9.06rem;
            overflow-y: auto;
            display: flex;
            flex-wrap: wrap;
            .btn {
                width: 1.83rem;
                height: 0.55rem;
            }
        }
    }
}
</style>