<template>
    <div :class="{ head: true, head_style: isActive }" ref="head">
        <div class="logo">
            <img src="@/assets/img/login/logo.png" alt="" />
            <span>{{ schoolName }}</span>
        </div>
        <div class="right">
            <TButton class="r-left" @touch="toNotification">
                <img src="@/assets/img/home/message.png" alt="" />
            </TButton>
            <div class="mid" @click.stop.prevent="open">
                <div class="img-con">
                    <img
                        src="@/assets/img/home/photo.png"
                        class="avatar"
                        alt=""
                    />
                    <TDropDown
                        :visible="dropDownVisible"
                        :styleGroup="{
                            width: '2rem',
                            boxShadow:
                                '0rem 0rem 0.06rem 0rem rgba(151, 151, 151, 0.36)',
                            border: 0,
                            borderRadius: '0.1rem',
                            left: '-150%',
                            top: '150%',
                        }"
                        :arrow="true"
                    >
                        <ul class="list">
                            <li
                                v-touch="
                                    () => {
                                        modifyVisible = true;
                                    }
                                "
                            >
                                <i class="iconfont icon-modify"></i>
                                <span>修改密码</span>
                            </li>
                            <li v-touch="logout">
                                <i class="iconfont icon-logout"></i>
                                <span>退出登录</span>
                            </li>
                        </ul>
                    </TDropDown>
                </div>
                <span class="username">{{ teacherName }}</span>
                <i
                    class="iconfont icon-ico-down-arrow icon-arrow"
                    :style="{
                        transform: dropDownVisible
                            ? 'rotate(180deg)'
                            : 'rotate(0deg)',
                    }"
                ></i>
            </div>
            <TDialog
                :visible.sync="logoutVisible"
                :dialogConStyle="{
                    width: '5.21rem',
                    height: '2.98rem',
                }"
                customClass="logoutDialog"
            >
                <template v-slot:header>
                    <div class="head-con">
                        <span class="d-head">提示</span>
                    </div>
                </template>
                <template v-slot:default>
                    <div class="main-con">
                        <span>确定要退出吗？</span>
                    </div>
                </template>
                <template v-slot:footer>
                    <div class="foot-con">
                        <TButton class="confirm" @touch.prevent="storeLogout">
                            确定
                        </TButton>
                    </div>
                </template>
            </TDialog>
            <ModifyPwd :visible.sync="modifyVisible" />
        </div>
    </div>
</template>

<script>
import TDropDown from "@/components/FunctionalComp/TDropDown.vue";
import TDialog from "@/components/FunctionalComp/TDialog.vue";
import TButton from "@/components/FunctionalComp/TButton.vue";

import { mapState, mapActions } from "vuex";
import ModifyPwd from "./ModifyPwd.vue";
export default {
    components: {
        TDropDown,
        TDialog,
        TButton,
        ModifyPwd,
    },

    data() {
        return {
            dropDownVisible: false,
            logoutVisible: false,
            modifyVisible: false,
            isActive: true,
        };
    },
    computed: {
        ...mapState({
            teacherName: (state) => state.teacher.teacherInfo.name,
            schoolName: (state) => state.teacher.teacherInfo.schoolName,
        }),
    },
    created() {
        document.addEventListener("click", this.closeDropDown);
    },
    watch: {
        "$route.fullPath": {
            handler(newValue) {
                if (newValue === "/") {
                    this.isActive = true;
                } else {
                    this.isActive = false;
                }
            },
            immediate: true,
        },
    },
    methods: {
        ...mapActions({
            storeLogout: "teacher/logout",
        }),
        open() {
            this.dropDownVisible = !this.dropDownVisible;
        },
        closeDropDown() {
            this.dropDownVisible = false;
        },
        logout() {
            // 退出
            this.logoutVisible = true;
        },
        // 前往通知页
        toNotification() {
            if (this.$route.name === "NotifyList") return;
            this.$router.push({ name: "NotifyList" });
        },
    },
    destroyed() {
        document.removeEventListener("click", this.closeDropDown);
    },
};
</script>

<style lang="less" scoped>
.head {
    flex-shrink: 0;
    width: 100%;
    height: 0.83rem;
    background: #ffffff;
    box-shadow: 0rem 0.02rem 0.05rem 0rem #e3e3e3;
    padding: 0 0.52rem;
    display: flex;
    justify-content: space-between;
    .logo {
        display: flex;
        align-items: center;
        img {
            width: 0.42rem;
            height: 0.42rem;
            margin-right: 0.13rem;
        }
        span {
            font-size: 0.26rem;
            font-weight: 600;
            color: #333333;
        }
    }
    .right {
        display: flex;
        align-items: center;
        .r-left {
            font-size: 0;
            width: auto;
            height: auto;
            background: transparent;
            img {
                width: 0.42rem;
                height: 0.35rem;
            }
        }
        .mid {
            display: flex;
            align-items: center;
            padding-right: 0.29rem;
            margin-left: 0.38rem;
            user-select: none;
            cursor: pointer;
            // border-right: 0.01rem solid #cbcbcb;
            .img-con {
                display: flex;
                position: relative;
                .avatar {
                    width: 0.42rem;
                    height: 0.42rem;
                    border-radius: 50%;
                    border: 0.01rem solid #999;
                }
                .list {
                    width: 100%;
                    padding: 0.1rem 0;
                    li {
                        width: 100%;
                        height: 0.7rem;
                        display: flex;
                        align-items: center;
                        padding: 0 0.27rem;
                        span,
                        .iconfont {
                            font-size: 0.25rem;
                            font-weight: 600;
                            color: #333333;
                        }
                        .iconfont {
                            margin-right: 0.1rem;
                        }
                        span {
                            width: 100%;
                        }
                    }
                }
            }
            .username {
                margin: 0 0.13rem;
            }
        }
        .logout {
            padding-left: 0.29rem;
            .con {
                display: flex;
                align-items: center;
                .logout-text {
                    margin-left: 0.11rem;
                }
                img {
                    width: 0.22rem;
                    height: 0.22rem;
                }
            }
        }
        .username,
        .icon-arrow {
            font-size: 0.25rem;
            font-weight: 600;
            color: #333333;
        }
        .icon-arrow {
            transition: transform 0.3s;
            transform-origin: center;
        }
    }
}
.head_style {
    background-color: transparent;
    box-shadow: 0 0 0 0 transparent;
}
.logoutDialog {
    width: 100%;
    .head-con,
    .main-con {
        width: 100%;
        height: 0.7rem;
        display: flex;
        align-items: center;
        padding-left: 0.3rem;
        span {
            font-size: 0.28rem;
            font-weight: 600;
            color: #333333;
        }
    }
    .main-con {
        height: 1rem;
        span {
            font-size: 0.26rem;
            font-weight: 500;
        }
    }
    .foot-con {
        padding-right: 0.3rem;
        width: 100%;
        height: 1.28rem;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .confirm {
            width: 1.4rem;
            height: 0.65rem;
            background: #3e83f8;
            border-radius: 0.08rem;
            font-size: 0.25rem;
        }
    }
}
</style>
