<template>
    <div class="time-table">
        <!-- 课表 -->
        <div class="head">
            <TButton class="home" @touch="goHome"> 首页 </TButton>
            <TButton class="btn"> 课程表 </TButton>
        </div>
        <div class="con">
            <div class="main">
                <!-- <div class="top">
                    <div class="group">
                        <span class="icon">
                            <i class="iconfont icon-left"></i>
                        </span>
                        <span class="span-text">第二周</span>
                        <span class="icon">
                            <i class="iconfont icon-right"></i>
                        </span>
                    </div>
                </div> -->
                <div class="bottom">
                    <table>
                        <thead>
                            <tr>
                                <th class="init-flex"></th>
                                <th
                                    :class="[
                                        'init-flex',
                                        item === columnActive ? 'active' : '',
                                    ]"
                                    v-for="item in 7"
                                    :key="item"
                                    v-touch="
                                        () => {
                                            tableHeadItemTouch(item);
                                        }
                                    "
                                >
                                    <span class="mask">
                                        <span class="head-name">{{
                                            item | formatWeekName
                                        }}</span>
                                        <span class="tip-name">{{
                                            item | formatDate
                                        }}</span>
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody v-loading="loading">
                            <tr v-for="item in tableData" :key="item.courseNum">
                                <td class="init-flex">
                                    <span class="head-name">{{
                                        item.courseNum | formatPitchName
                                    }}</span>
                                    <span class="tip-name">{{
                                        `${item.startTime}-${item.endTime}`
                                    }}</span>
                                </td>
                                <td
                                    :class="[
                                        'init-flex',
                                        columnActive === ele ? 'active' : '',
                                    ]"
                                    v-for="ele in 7"
                                    :key="ele"
                                >
                                    <span
                                        :class="[
                                            'mask',
                                            item[`week${ele}`].courseName
                                                ? ele > columnActive
                                                    ? 'future'
                                                    : ele < columnActive
                                                    ? 'past-time'
                                                    : ''
                                                : '',
                                            item[`week${ele}`].courseName
                                                ? 'mask-active'
                                                : '',
                                        ]"
                                    >
                                        <span class="head-name single_elli">
                                            {{ item[`week${ele}`].courseName }}
                                        </span>
                                        <span class="tip-name single_elli">
                                            {{ item[`week${ele}`].gradeName
                                            }}{{ item[`week${ele}`].className }}
                                        </span>
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TButton from "@/components/FunctionalComp/TButton.vue";
import { mapActions } from "vuex";
import moment from "moment";
export default {
    components: {
        TButton,
    },
    data() {
        return {
            tableData: [],
            columnActive: 0, // 代表周几
            rowActive: 0,
            loading: false,
        };
    },
    created() {
        this.getCourse();
        this.getTodayWeek();
    },
    filters: {
        formatWeekName(value) {
            const weekArr = ["一", "二", "三", "四", "五", "六", "日"];
            return `星期${weekArr[value - 1] ? weekArr[value - 1] : value}`;
        },
        formatPitchName(value) {
            const sectionArr = ["一", "二", "三", "四", "五", "六", "七", "八"];
            return `第${
                sectionArr[value - 1] ? sectionArr[value - 1] : value
            }节`;
        },
        formatDate(week) {
            const now = new Date();
            const nowTime = now.getTime();
            const today = now.getDay() ? now.getDay() : 7;
            const oneDayLong = 24 * 60 * 60 * 1000;
            let target;
            if (week < today) {
                target = nowTime - (today - week) * oneDayLong;
            } else if (week > today) {
                target = nowTime + (week - today) * oneDayLong;
            } else {
                target = nowTime;
            }
            return moment(new Date(target)).format("YYYY.M.D");
        },
    },
    methods: {
        ...mapActions({
            getStoreCourse: "teacher/getCourse",
        }),
        goHome() {
            this.$router.push({ name: "Home" });
        },
        async getCourse() {
            this.loading = true;
            let tableData = await this.getStoreCourse();
            if (!tableData.length) {
                // 该老师没有课表的容错处理
                let arr = [];
                for (let i = 1; i <= 8; i++) {
                    const obj = {
                        endTime: "",
                        startTime: "",
                        courseNum: i,
                    };
                    for (let j = 1; j <= 7; j++) {
                        obj[`week${j}`] = {
                            week: j,
                            courseCode: "",
                            courseName: "",
                        };
                    }
                    arr.push(obj);
                }
                tableData = arr;
            }
            this.tableData = tableData;
            this.loading = false;
        },
        tableHeadItemTouch(i) {
            // 课程表头每一项的点击处理函数
            this.columnActive = i;
        },
        getTodayWeek() {
            // 星期天 - 星期六 ： 0 - 6
            const week = new Date().getDay();
            this.columnActive = week ? week : 7;
        },
    },
};
</script>

<style lang="less" scoped>
@blue: #3e83f8;
@light-blue: #f7fbff;
.time-table {
    width: 100%;
    height: 100%;
    padding: 0.25rem 0.52rem;
    .head {
        height: 0.75rem;
        display: flex;
        .home {
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
        .btn {
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
    .con {
        width: 100%;
        height: calc(100% - 0.79rem);
        display: flex;
        justify-content: center;
        .main {
            width: 14.25rem;
            .top {
                height: 0.48rem;
                margin-bottom: 0.13rem;
                .group {
                    width: 2.09rem;
                    height: 100%;
                    background: #ffffff;
                    border-radius: 0.04rem;
                    border: 0.01rem solid #bfc8d3;
                    display: flex;
                    .icon {
                        width: 0.45rem;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        .iconfont {
                            color: #333333;
                        }
                    }
                    .span-text {
                        flex: 1;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-size: 0.25rem;
                        font-family: PingFangSC-Medium, PingFang SC;
                        font-weight: 500;
                        color: #333333;
                    }
                }
            }
            .bottom {
                width: 100%;
                height: 8.54rem;
                background: #ffffff;
                box-shadow: 0rem 0rem 0.1rem 0rem #dfe7f2;
                border-radius: 0.23rem;
                overflow: hidden;
                table {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    thead {
                        width: 100%;
                        height: calc(100% / 9);
                        tr {
                            width: 100%;
                            height: 100%;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            .mask {
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                align-items: center;
                                width: 80%;
                                height: 80%;
                                border-radius: 0.14rem;
                                background: inherit;
                                transition: background 0.2s linear;
                                span {
                                    transition: color 0.2s linear;
                                }
                            }
                            .active {
                                background: @light-blue;
                                .mask {
                                    background: @blue;
                                    span {
                                        color: #fff;
                                    }
                                }
                            }
                        }
                    }
                    tbody {
                        flex: 1;
                        tr {
                            width: 100%;
                            height: calc(100% / 8);
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            .mask {
                                width: 100%;
                                height: 100%;
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                align-items: center;
                                background: inherit;
                                transition: all 0.2s linear;
                                span {
                                    transition: color 0.2s linear;
                                }
                            }
                            .future {
                                background: #edfdfe;
                            }
                            .past-time {
                                background: #f9f9f9;
                            }
                            .active {
                                background: @light-blue;
                                .mask-active {
                                    box-shadow: 0.05rem 0 0 0 @blue inset;
                                    background: #e6efff;
                                }
                            }
                        }
                    }
                    .init-flex {
                        width: calc(100% / 8);
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        color: #333333;
                        transition: background 0.2s linear;
                        .head-name {
                            font-size: 0.24rem;
                            font-weight: 500;
                            margin-bottom: 0.05rem;
                            width: 100%;
                            text-align: center;
                        }
                        .tip-name {
                            font-size: 0.2rem;
                            font-weight: 400;
                            width: 100%;
                            text-align: center;
                        }
                    }
                }
            }
        }
    }
}
</style>