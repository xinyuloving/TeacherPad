<template>
    <div class="modify-pwd">
        <TDialog
            :visible="visible"
            :dialogConStyle="{
                width: '8.92rem',
                height: '5.77rem',
            }"
            customClass="modify-dialog"
            @close="closeDialog"
            :bounceOptions="{ bounceState, distance: '2.5rem' }"
        >
            <template v-slot:header>
                <div class="head-con">
                    <span class="d-head">修改密码</span>
                </div>
            </template>
            <template v-slot:default>
                <div class="main-con">
                    <div class="input-con">
                        <label for="">
                            <input
                                type="text"
                                :minlength="4"
                                :maxlength="6"
                                @focus="handleFocus"
                                @blur="verifyCode"
                                v-model.trim="ruleForm.validCode"
                                placeholder="请输入验证码"
                            />
                            <span class="code-text">
                                <span
                                    @click.prevent="openVcode"
                                    :style="{
                                        color: codeFlag ? '#c3c3c3' : '#3e83f8',
                                    }"
                                    >{{ codeText }}</span
                                >
                            </span>
                        </label>
                        <span class="e-tips" v-show="eMsg.validCode">{{
                            eMsg.validCode
                        }}</span>
                    </div>
                    <div class="input-con">
                        <input
                            type="text"
                            :minlength="8"
                            :maxlength="16"
                            @focus="handleFocus"
                            @blur="verifyPwd(1)"
                            v-model.trim="ruleForm.password1"
                            placeholder="请输入新密码"
                        />
                        <span class="e-tips" v-show="eMsg.password1">{{
                            eMsg.password1
                        }}</span>
                    </div>
                    <div class="input-con">
                        <input
                            type="text"
                            :minlength="8"
                            :maxlength="16"
                            @focus="handleFocus"
                            @blur="verifyPwd(2)"
                            v-model.trim="ruleForm.password2"
                            placeholder="请确认密码"
                        />
                        <span class="e-tips" v-show="eMsg.password2">{{
                            eMsg.password2
                        }}</span>
                    </div>
                    <p>密码可以为8-16位字母、数字和下划线</p>
                </div>
            </template>
            <template v-slot:footer>
                <div class="foot-con">
                    <!-- <TButton
                        content="确定"
                        :configItems="{
                            width: '4.59rem',
                            height: '0.65rem',
                            background: '#3E83F8',
                            borderRadius: '0.08rem',
                            fontSize: '0.25rem',
                        }"
                        v-touch.prevent="handleTouch"
                    /> -->
                    <TButton class="confirm" @touch.prevent="handleTouch">
                        确定
                    </TButton>
                </div>
            </template>
        </TDialog>
        <Vcode
            :show="vCodeShow"
            :range="5"
            @success="vCodeSuccess"
            @close="vCodeClose"
        />
        <TMessage
            :visible.sync="messageVisible"
            @closed="logout()"
            type="success"
            tips="您的密码已经修改成功，请重新登录"
        />
    </div>
</template>

<script>
import TButton from "@/components/FunctionalComp/TButton.vue";
import TDialog from "@/components/FunctionalComp/TDialog.vue";

import Vcode from "@/components/FunctionalComp/Vcode.vue";

import md5 from "md5";
import { getVerifyCode, modifyPwd } from "@/api/user";
import { mapGetters, mapActions } from "vuex";
import TMessage from "@/components/FunctionalComp/message/TMessage.vue";
let codeTimer;

export default {
    components: {
        TDialog,
        TButton,
        Vcode,
        TMessage,
    },
    props: {
        visible: Boolean,
    },
    data() {
        return {
            vCodeShow: false,
            ruleForm: {
                validCode: "",
                password1: "",
                password2: "",
            },
            eMsg: {
                validCode: "",
                password1: "",
                password2: "",
            },
            codeCountDown: 60,
            codeFlag: false,
            messageVisible: false,
            bounceState: false,
            inputFocus: false, // 输入框是否聚焦
        };
    },
    computed: {
        ...mapGetters({
            teacherPhone: "teacherPhone",
        }),
        codeText() {
            return this.codeFlag
                ? `重新发送${this.codeCountDown}s`
                : "发送验证码";
        },
    },
    watch: {
        inputFocus: {
            handler(newValue) {
                if (newValue) {
                    this.bounceState = true;
                } else {
                    this.$nextTick(() => {
                        this.bounceState = false;
                    });
                }
            },
        },
    },
    methods: {
        ...mapActions({
            logout: "teacher/logout",
        }),
        handleGetCode() {
            // 获取验证码的touch事件
            this.vCodeShow = true;
        },
        getCode() {
            // 获取验证码  -->  两种情况，手机号登陆的时候(key=1)获取验证码 和 重置密码的时候获取的验证码
            // 先校验手机号
            if (!this.codeFlag) {
                this.codeFlag = true;
                // 验证正确
                // ----------  获取验证码  -----------
                codeTimer = setInterval(() => {
                    if (this.codeCountDown > 1) {
                        this.codeCountDown--;
                    } else {
                        this.cancelResetDialog();
                    }
                }, 1000);
            }
        },
        cancelResetDialog() {
            this.codeFlag = false;
            clearInterval(codeTimer);
            this.codeCountDown = 60;
        },
        closeDialog() {
            this.$emit("update:visible", false);
            if (codeTimer) this.cancelResetDialog();
            // 在 dialog 关闭前，可能会触发input的blur事件，从而导致错误提示没有关闭，从而异步清空数据
            setTimeout(() => {
                this.ruleForm = {
                    validCode: "",
                    password1: "",
                    password2: "",
                };
                this.eMsg = {
                    validCode: "",
                    password1: "",
                    password2: "",
                };
            }, 50); // 加 0.05s 的延迟，确保初始化完成
        },
        async handleTouch() {
            const { validCode, password1 } = this.ruleForm;
            if (this.verifyCode() && this.verifyPwd(1) && this.verifyPwd(2)) {
                const { code, msg } = await modifyPwd({
                    mobile: this.teacherPhone,
                    verifyCode: validCode,
                    newPassword: md5(password1),
                });
                if (code === 0) {
                    this.closeDialog();
                    // this.$message({
                    //     message: "密码重置成功！",
                    //     type: "success",
                    // });
                    this.messageVisible = true;
                    // this.logout();
                } else if (code === 10011) {
                    this.eMsg.validCode = "验证码错误！";
                } else {
                    this.eMsg.password2 = msg;
                }
            }
        },
        // 滑块拼图
        async vCodeSuccess() {
            const { code } = await getVerifyCode({
                mobile: this.teacherPhone,
            });
            this.vCodeClose();
            switch (code) {
                case 0: {
                    this.getCode();
                    break;
                }
                case 10010: {
                    this.eMsg.validCode = "用户不存在！";
                    break;
                }
                case 10011: {
                    this.eMsg.validCode = "超出每日发送验证码数量上限！";
                    break;
                }
                default:
                    this.eMsg.validCode = msg;
                    break;
            }
        },
        openVcode() {
            if (!this.codeFlag) this.vCodeShow = true;
        },
        vCodeClose() {
            this.vCodeShow = false;
        },
        handleFocus() {
            this.inputFocus = true;
        },
        // 表单验证
        verifyCode() {
            this.inputFocus = false;
            const { validCode } = this.ruleForm;
            const r = /^\d{4,6}$/;
            if (!validCode) {
                this.eMsg.validCode = "请输入验证码";
                return false;
            } else if (!r.test(validCode)) {
                this.eMsg.validCode = "验证码应为 4 到 6 位数字";
                return false;
            } else {
                this.eMsg.validCode = "";
                return true;
            }
        },
        verifyPwd(flag) {
            this.inputFocus = false;
            const r = /^[0-9a-zA-Z_]{8,16}$/;
            const { password1, password2 } = this.ruleForm;
            if (flag === 1) {
                if (!password1) {
                    this.eMsg.password1 = "请输入密码";
                    return false;
                } else if (!r.test(password1)) {
                    this.eMsg.password1 =
                        "密码应由8-16位字母、数字和下划线组成";
                    return false;
                } else {
                    this.eMsg.password1 = "";
                    return true;
                }
            } else {
                if (!password2) {
                    this.eMsg.password2 = "请输入密码";
                    return false;
                } else if (!r.test(password2)) {
                    this.eMsg.password2 =
                        "密码应由8-16位字母、数字和下划线组成";
                    return false;
                } else if (password2 !== password1) {
                    this.eMsg.password2 = "密码不一致";
                    return false;
                } else {
                    this.eMsg.password2 = "";
                    return true;
                }
            }
        },
    },
};
</script>

<style lang="less" scoped>
.modify-dialog {
    // width: 8.92rem;
    // height: 5.77rem;
    .head-con {
        height: 1.1rem;
        display: flex;
        align-items: center;
        span {
            font-size: 0.3rem;
            font-weight: 600;
            color: #333333;
        }
    }
    .main-con {
        height: 3.6rem;
        // width: 100%;
        width: 4.59rem;
        // padding: 0 2.17rem;
        .input-con {
            height: 0.94rem;
            display: flex;
            flex-direction: column;
            input {
                width: 100%;
                height: 0.65rem;
                background: #ffffff;
                border-radius: 0.08rem;
                border: 0.01rem solid #979797;
                padding: 0 0.3rem;
                font-size: 0.23rem;
                font-weight: 400;
                color: #333333;
                &::placeholder {
                    font-size: 0.23rem;
                    font-weight: 400;
                    color: #cecece;
                }
            }
            .e-tips {
                flex: 1;
                font-size: 0.18rem;
                font-weight: 500;
                color: #f55f5f;
                display: flex;
                align-items: center;
            }
            label {
                position: relative;
                .code-text {
                    position: absolute;
                    top: 50%;
                    right: 0.21rem;
                    transform: translateY(-50%);
                    cursor: pointer;
                    user-select: none;
                    span {
                        font-size: 0.23rem;
                        font-weight: 400;
                        color: #cecece;
                    }
                }
            }
        }
        p {
            font-size: 0.21rem;
            font-weight: 400;
            color: #999999;
            margin-bottom: 0.21rem;
            text-align: right;
        }
    }
    .foot-con {
        height: 0.96rem;
        .confirm {
            width: 4.59rem;
            height: 0.65rem;
            background: #3e83f8;
            border-radius: 0.08rem;
            font-size: 0.25rem;
        }
    }
}
</style>