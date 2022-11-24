<template>
    <transition
        :name="animate ? 'drop' : 'none'"
        @after-enter="afterEnter"
        @after-leave="afterLeave"
    >
        <div
            class="t-message"
            v-if="visible"
            ref="TMessage"
            v-touch.self="closeByTouchModal ? close : ''"
            :style="{
                ...wrapperStyle,
            }"
        >
            <div
                :class="['message-box', customClass]"
                :style="{
                    top: top,
                    ...msgBoxStyle,
                }"
            >
                <i :class="['iconfont', showType]"></i>
                <span class="title">{{ title }}</span>
                <span class="tips">{{ tips }}</span>
            </div>
        </div>
    </transition>
</template>

<script>
const typeObj = {
    success: "icon-success1",
    warning: "icon-warning",
    error: "icon-error",
};
export default {
    props: {
        visible: Boolean,
        title: {
            type: String,
            default: "修改成功",
        },
        tips: {
            type: String,
            default: "",
        },
        type: {
            type: String,
            default: "success",
        },
        wrapperStyle: {
            type: Object,
            default: () => ({}),
        },
        msgBoxStyle: {
            type: Object,
            default: () => ({}),
        },
        customClass: {
            type: String,
            default: "", // 主体盒子的自定义类名
        },
        duration: {
            type: Number,
            default: 2000, // 表示消息存在的时间，为0表示不会自动关闭
        },
        closeByTouchModal: {
            type: Boolean,
            default: true,
        },
        animate: {
            type: Boolean,
            default: true,
        },
        top: {
            type: String,
            default: "50%", // 该组件的距顶部的位置使用定位：top
        },
    },
    computed: {
        showType() {
            return typeObj[this.type] || "success";
        },
    },
    watch: {
        visible: {
            handler(newValue) {
                this.addRemoveDomToBody(newValue);
                if (newValue) {
                    if (this.duration) {
                        this.timer = setTimeout(() => {
                            this.close();
                        }, this.duration);
                    }
                }
            },
        },
    },
    methods: {
        close() {
            this.$emit("close");
            this.$emit("update:visible", false);
        },
        afterEnter() {
            this.$emit("opened");
        },
        afterLeave() {
            clearTimeout(this.timer);
            this.$emit("closed");
        },
        addRemoveDomToBody(type) {
            this.$nextTick(() => {
                const body = document.body;
                const TMessage = this.$refs.TMessage;
                if (type) {
                    if (body.append) {
                        body.append(TMessage);
                    } else {
                        body.appendChild(TMessage);
                    }
                } else {
                    if (TMessage) body.removeChild(TMessage);
                }
            });
        },
    },
};
</script>

<style lang="less">
@trans1: all 0.3s;
@trans0: all 0s;
@color3: #333;
.t-message {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 101;
    background-color: rgba(0, 0, 0, 0.6);
    // transition: @trans1;
    .message-box {
        position: absolute;
        left: 50%;
        opacity: 1;
        // transform: translate(-50%, -50%);
        transform: translate3d(-50%, -50%, 0);

        width: 5.21rem;
        height: 2.98rem;
        background: #ffffff;
        border-radius: 0.21rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        // transition: @trans1;
        .iconfont {
            margin-bottom: 0.2rem;
            font-size: 0.85rem;
        }
        .title {
            font-size: 0.25rem;
            font-weight: 600;
            color: @color3;
            margin-bottom: 0.17rem;
        }
        .tips {
            font-size: 0.2rem;
            font-weight: 400;
            color: @color3;
        }
    }
}

.drop-enter,
.drop-leave-to {
    background-color: rgba(0, 0, 0, 0);
    .message-box {
        top: -2.98rem !important;
        opacity: 0;
    }
}

.drop-enter-active,
.drop-leave-active {
    transition: @trans1;
    .message-box {
        transition: @trans1;
    }
}

.none-enter-active,
.none-leave-active {
    transition: @trans0;
    .message-box {
        transition: @trans0;
    }
}

.icon-success1 {
    color: #67d076;
}
.icon-warning {
    color: #ffc300;
}
.icon-error {
    color: #fa5151;
}
</style>