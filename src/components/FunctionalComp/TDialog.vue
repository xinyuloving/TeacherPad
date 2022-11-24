<template>
    <transition
        :name="animate ? 'drop' : 'none'"
        @after-enter="afterEnter"
        @after-leave="afterLeave"
    >
        <div
            :class="{
                't-dialog-wrapper': true,
                modal: !modal,
            }"
            :style="{
                ...wrapperStyle,
            }"
            v-if="visible"
            v-touch.self="closeByTouchModal ? close : ''"
            ref="TDialog"
        >
            <div
                :class="['t-dialog-con', customClass]"
                :style="{
                    top: top,
                    ...dialogConStyle,
                }"
                ref="TDialogCon"
                v-bounce="bounceOptions"
            >
                <i
                    :class="{
                        iconfont: true,
                        'icon-close': true,
                        close_con_pos: !$slots.header,
                        closeClass: true,
                    }"
                    v-if="showClose && !$slots.header"
                    v-touch="close"
                ></i>
                <header v-if="$slots.header">
                    <i
                        :class="{
                            iconfont: true,
                            'icon-close': true,
                            close_head_pos: $slots.header,
                            closeClass: true,
                        }"
                        v-if="showClose"
                        v-touch="close"
                    ></i>
                    <slot name="header"></slot>
                </header>
                <main>
                    <slot></slot>
                </main>
                <footer v-if="$slots.footer">
                    <slot name="footer"></slot>
                </footer>
            </div>
        </div>
    </transition>
</template>

<script>
import bounce from "@/directive/bounce";
export default {
    directives: {
        bounce,
    },
    props: {
        visible: Boolean,
        wrapperStyle: {
            type: Object,
            default: () => ({}),
        },
        dialogConStyle: {
            type: Object,
            default: () => ({}),
        },
        closeByTouchModal: Boolean,
        showClose: {
            type: Boolean,
            default: true,
        },
        customClass: {
            type: String,
            default: "",
        },
        closeClass: {
            type: String,
            default: "",
        },
        animate: {
            type: Boolean,
            default: true,
        },
        modal: {
            type: Boolean,
            default: true,
        },
        appendToBody: Boolean,
        top: {
            type: String,
            default: "50%",
        },
        bounceOptions: {
            type: [Object, Boolean],
            default: false,
        },
    },
    watch: {
        visible: {
            handler(newValue) {
                this.addRemoveDomToBody(newValue);
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
            this.$emit("closed");
        },
        addRemoveDomToBody(type) {
            if (this.appendToBody) {
                this.$nextTick(() => {
                    const body = document.body;
                    const TDialog = this.$refs.TDialog;
                    if (type) {
                        if (body.append) {
                            body.append(TDialog);
                        } else {
                            body.appendChild(TDialog);
                        }
                    } else {
                        if (TDialog) body.removeChild(TDialog);
                    }
                });
            }
        },
    },
    destroyed() {
        if (this.appendToBody && this.$el && this.$el.parentNode) {
            this.$el.parentNode.removeChild(this.$el);
        }
    },
};
</script>

<style lang="less" scoped>
@trans1: all 0.3s;
@trans0: all 0s;
.t-dialog-wrapper {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    background: rgba(0, 0, 0, 0.6);
    // transition: @trans1;
}
.t-dialog-con {
    position: absolute;
    left: 50%;
    // transform: translate(-50%, -50%);
    transform: translate3d(-50%, -50%, 0);
    opacity: 1;
    width: 40%;
    height: 40%;
    background: #fff;
    border-radius: 0.21rem;
    // transition: @trans1;
    display: flex;
    flex-direction: column;
}
header {
    width: 100%;
    height: auto;
    position: relative;
}
header,
footer {
    display: flex;
    justify-content: center;
    align-items: center;
}
.icon-close {
    position: absolute;
    right: 3%;
    font-size: 0.36rem;
    z-index: 2;
}

.close_head_pos {
    top: 50%;
    transform: translateY(-50%);
}

.close_con_pos {
    top: 3%;
}

main {
    flex: 1;
    width: 100%;
    display: flex;
    justify-content: center;
}

.drop-enter,
.drop-leave-to {
    background-color: rgba(0, 0, 0, 0);
    .t-dialog-con {
        // transform: translate(-50%, -60%) !important;
        transform: translate3d(-50%, -60%, 0) !important;
        opacity: 0 !important;
    }
}

.drop-enter-active,
.drop-leave-active {
    transition: @trans1;
    .t-dialog-con {
        transition: @trans1;
    }
}

.none-enter-active,
.none-leave-active {
    transition: @trans0;
    .t-dialog-con {
        transition: @trans0;
    }
}

.modal {
    background-color: rgba(0, 0, 0, 0) !important;
}
</style>
