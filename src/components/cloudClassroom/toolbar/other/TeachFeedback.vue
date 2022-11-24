<template>
    <div class="teach-feedback">
        <!-- 教学反馈 -->
        <div class="top">
            <span>教学反馈</span>
        </div>
        <div class="main">
            <div class="main-top">
                <span class="fa-span"
                    >反馈人数：<span class="son-span">{{
                        finishStudentList.length
                    }}</span
                    >/{{ studentList.length }}</span
                >
            </div>
            <div class="main-con">
                <div class="chart-main" ref="teachFeedbackChart"></div>
            </div>
        </div>
        <div class="bottom">
            <TButton class="end" @touch="handleTouch"> 结束反馈 </TButton>
        </div>
    </div>
</template>

<script>
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from "echarts/core";
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart } from "echarts/charts";
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
} from "echarts/components";
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from "echarts/renderers";
// 注册必须的组件
echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    BarChart,
    CanvasRenderer,
]);

// 初始化图表，设置配置项
import { throttle } from "@/utils/util";
import sendMessage from "@/utils/sendMessage";
import TButton from "../../../FunctionalComp/TButton.vue";
import { createNamespacedHelpers, mapGetters } from "vuex";
const { mapMutations, mapState } = createNamespacedHelpers("cloudClassroom");

export default {
    components: {
        TButton,
    },
    computed: {
        ...mapState({
            options: (state) => state.toolbar.teachCallback.options,
            finishStudentList: (state) =>
                state.toolbar.teachCallback.finishStudentList,
        }),
        ...mapGetters({
            studentList: "studentList",
        }),
        seriesData() {
            return this.options.map((item) => item.selectNum);
        },
    },
    mounted() {
        if (!this.myChart) {
            this.myChart = echarts.init(this.$refs.teachFeedbackChart);
            this.mapping();
        }
    },
    watch: {
        seriesData: {
            handler() {
                throttle(this.mapping, this.mappingTimer, 2000);
            },
            deep: true,
        },
    },
    methods: {
        ...mapMutations({
            resetState: "toolbar/teachCallback/resetState",
            imStoreSet: "imStore/setState",
            toolbarReset: "toolbar/resetState",
        }),
        mapping() {
            // const that = this;
            const color = ["#67C998", "#3E83F8"];
            const publicOption = {
                xAxis: {
                    type: "category",
                    data: ["听懂了", "没听懂"],
                    axisTick: {
                        show: false,
                    },
                    axisLabel: {
                        interval: 0,
                        color: "#666666",
                        fontSize: 16,
                    },
                },
                yAxis: {
                    axisLabel: {
                        show: true,
                        color: "#666666",
                        // fontSize: 14,
                    },
                    minInterval: 1,
                    // maxInterval: 2,
                },
                // grid: {
                //     top: "5%",
                //     width: "80%",
                //     height: "90%",
                // },
                series: [
                    {
                        type: "bar",
                        data: this.seriesData,
                        barWidth: "50%",
                        itemStyle: {
                            // color: ["#67C998", "#3E83F8"],
                            color(params) {
                                return color[params.dataIndex];
                            },
                            borderRadius: [3, 3, 0, 0],
                        },
                    },
                ],
            };
            this.myChart.setOption(publicOption);
        },
        handleTouch() {
            sendMessage({
                content: "ccl_8",
                extension: JSON.stringify({ flag: 0 }),
            }).then(() => {
                console.log("消息发送成功");
                this.toolbarReset();
                this.resetState();
            });
        },
    },
};
</script>

<style lang="less" scoped>
.teach-feedback {
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
    width: 5.42rem;
    height: 6.79rem;
    background: #efeffa;
    border-radius: 0.16rem;
    display: flex;
    flex-direction: column;
    transition: all 0.3s;
    .top {
        height: 0.63rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 0.01rem solid #dadada;
        span {
            font-size: 0.25rem;
            font-weight: 600;
            color: #333333;
        }
    }
    .main {
        padding: 0 0.8rem;
        height: 4.93rem;
        display: flex;
        flex-direction: column;
        .main-top {
            display: flex;
            justify-content: center;
            height: 0.8rem;
            padding-top: 0.31rem;
            .fa-span {
                font-size: 0.25rem;
                font-weight: 500;
                color: #666666;
                .son-span {
                    color: #4587f8;
                }
            }
        }
        .main-con {
            flex: 1;
            width: 100%;
            .chart-main {
                width: 100%;
                height: 100%;
                // display: flex;
                // justify-content: center;
                // align-items: center;
            }
        }
    }
    .bottom {
        display: flex;
        justify-content: center;
        .end {
            width: 3rem;
            height: 0.67rem;
            border-radius: 0.07rem;
            font-size: 0.23rem;
        }
    }
}
</style>