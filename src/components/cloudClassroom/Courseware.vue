<template>
    <div class="courseware">
        <div class="courseware_main">
            <div class="courseware_index" v-if="coursewareList.length">
                <SelectPreview
                    v-for="item in coursewareList"
                    :key="item.id"
                    :fileName="item.tencentCosName"
                    :suffix="item.suffix"
                    :videoAutoplay="false"
                    class="preview_item"
                    :style="{ zIndex: active === item.id ? '3' : '1' }"
                />
                <!-- v-show -->
            </div>
            <div class="courseware_default" v-else>
                <div class="con">
                    <img
                        src="@/assets/img/cloudClassroom/no-courseware.png"
                        alt=""
                    />
                    <span class="tips">快去上传课件吧</span>
                </div>
            </div>
        </div>
        <ul class="bottom_bar" v-if="coursewareList.length">
            <li
                v-for="item in coursewareList"
                :key="item.id"
                :class="{
                    active: active === item.id,
                }"
                v-touch="
                    () => {
                        liTouch(item.id);
                    }
                "
            >
                <span class="single_elli">{{ item.name }}</span>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapState } from "vuex";
import SelectPreview from "@/components/cloudClassroom/SelectPreview.vue";
export default {
    components: {
        SelectPreview,
    },
    data() {
        return {
            active: 0, // 当前激活的索引
        };
    },
    computed: {
        ...mapState({
            coursewareList: (state) => state.signCourseware.coursewareList,
        }),
    },
    watch: {
        "coursewareList.length": {
            handler(newValue) {
                console.log(newValue);
                if (newValue) {
                    this.active = this.coursewareList[0].id;
                } else {
                    this.active = 0;
                }
            },
            immediate: true,
        },
    },
    methods: {
        liTouch(id) {
            this.active = id;
        },
    },
};
</script>

<style lang="less" scoped>
@trans1: all 0.3s;
.courseware {
    width: 100%;
    height: 100%;
    .courseware_main,
    .courseware_default {
        width: 100%;
        height: 100%;
        .courseware_index {
            width: 100%;
            height: 100%;
            position: relative;
            .preview_item {
                position: absolute;
            }
        }
    }
    .courseware_default {
        display: flex;
        align-items: center;
        justify-content: center;
        .con {
            display: flex;
            flex-direction: column;
            align-items: center;
            img {
                // width: 2.27rem;
                // height: 1.81rem;
                width: 2.7rem;
                height: 2.2rem;
                margin-bottom: 0.26rem;
            }
            .tips {
                // font-size: 0.17rem;
                font-weight: 400;
                color: #666;
                margin-bottom: 0.3rem;
            }
        }
    }
    .bottom_bar {
        width: auto;
        display: flex;
        align-items: flex-end;
        position: fixed;
        bottom: 0;
        z-index: 5;
        left: 50%;
        transform: translateX(-50%);
        li {
            width: 1.96rem;
            height: 0.54rem;
            background: #eceef0;
            border-radius: 0.21rem 0.21rem 0rem 0rem;
            transition: @trans1;
            padding: 0.16rem 0.16rem 0;
            display: flex;
            span {
                transition: @trans1;
                width: 100%;
                text-align: center;
                font-size: 0.24rem;
                font-weight: 600;
                color: #666666;
            }
        }
        .active {
            width: 2.58rem;
            height: 0.71rem;
            background: #508ef9;
            span {
                color: #fff;
                font-weight: 400;
            }
        }
    }
}
</style>