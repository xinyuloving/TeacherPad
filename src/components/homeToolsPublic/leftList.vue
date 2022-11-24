<template>
    <div class="left-list">
        <!-- logo -->
        <div class="logo">
            <!-- <img src="~@/assets/img/logo.png" /> -->
        </div>
        <!-- 列表 -->
        <div class="list">
            <!-- 动态的背景 -->
            <div class="mobile" :style="{ top: top }">
                <div></div>
            </div>
            <div class="item-box">
                <div
                    :class="{ item: true, active: currentIndex === index }"
                    v-for="(item, index) in list"
                    :key="index"
                    v-touch="
                        () => {
                            currentIndex = index;
                        }
                    "
                >
                    <div class="item-img" v-if="showImg">
                        <i :class="['iconfont', item.icon]"></i>
                    </div>
                    <div class="item-text">{{ item.name || item }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "LeftList",

    props: {
        list: Array,
        showImg: {
            type: Boolean,
            default: true,
        },
    },

    data() {
        return {
            top: "0",
            currentIndex: 0,
        };
    },

    watch: {
        currentIndex() {
            this.top = this.currentIndex + "rem";
            this.$emit("leftUpdate", this.currentIndex);
        },
    },

    created() {
        if (
            !(
                this.$route.name === "CoursewareList" ||
                this.$route.name === "FileList" ||
                this.$route.name === "ClassReport"
            )
        ) {
            this.currentIndex = 1;
            this.top = this.currentIndex + "rem";
        }
    },
};
</script>

<style lang="less" scoped>
.left-list {
    .logo {
        text-align: center;
        padding: 0.25rem 0 0.46rem;
        img {
            width: 1.2rem;
            height: 1.2rem;
        }
    }
    .list {
        position: relative;
        .item {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 0.9rem;
            margin-bottom: 0.1rem;
            background-color: #fff;
            z-index: 9;
            background-color: transparent;
            .item-img {
                margin-right: 0.2rem;
                .iconfont {
                    font-size: 0.3rem;
                }
            }
            .item-text {
                transition: color 0.3s;
                font-size: 0.26rem;
            }
        }
        .active {
            color: #3e83f8;
            .item-text {
                font-weight: 600;
            }
        }
        .item-box {
            width: 100%;
            position: absolute;
            top: 0;
        }
        .mobile {
            width: 100%;
            height: 0.9rem;
            background-color: #daf0ff;
            position: absolute;
            top: 0;
            z-index: 0;
            transition: all 0.2s;
            div {
                width: 0.05rem;
                height: 100%;
                border-radius: 0.05rem;
                background-color: #3e83f8;
            }
        }
    }
}
</style>