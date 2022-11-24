<template>
    <div class="forget-pwd">
        <TDialog
            :visible="visible"
            :dialogConStyle="{
                width: '8.92rem',
                height: nextFlag ? '6rem' : '4.79rem',
                transition: 'all 0.3s',
            }"
            @close="dialogCancel"
            @opened="$refs.phoneInput.focus()"
            :closeByTouchModal="true"
            :bounceOptions="{ bounceState, distance: '2.5rem' }"
        >
            <template v-slot:header>
                <div class="head-con">
                    <span class="d-head">忘记密码</span>
                </div>
            </template>
            <template v-slot:default>
                <div
                    class="main-con"
                    :style="{ height: nextFlag ? '100%' : '3.04rem' }"
                >
                    <div :class="['left', nextFlag ? 'move-left' : '']">
                        <p class="form-title">请输入您注册的手机号</p>
                        <div class="input-con">
                            <input
                                type="text"
                                maxlength="11"
                                v-model.trim.number="ruleForm.phone"
                                placeholder="输入您的手机号"
                                @blur="verifyPhone"
                                @focus="handleFocus"
                                @keydown.tab.enter.prevent="handleTouch"
                                ref="phoneInput"
                            />
                            <span class="e-tips" v-show="eMsg.phone">{{
                                eMsg.phone
                            }}</span>
                        </div>
                    </div>
                    <div :class="['right', nextFlag ? 'move-show' : '']">
                        <p class="right-title">
                            <span>验证码已发送至</span>
                            <span class="phone"> {{ ruleForm.phone }}</span>
                        </p>
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
                                        v-touch.prevent="openVcode"
                                        :style="{
                                            color: resetFlag
                                                ? '#c3c3c3'
                                                : '#3e83f8',
                                        }"
                                        >{{ resetTips }}</span
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
                                placeholder="请确认新密码"
                            />
                            <span class="e-tips" v-show="eMsg.password2">{{
                                eMsg.password2
                            }}</span>
                        </div>
                        <p class="pwd-tips">
                            密码可以为8-16位字母、数字和下划线
                        </p>
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <div class="foot-con">
                    <!-- <TButton
                        :content="btnText"
                        :configItems="{
                            width: '4.59rem',
                            height: '0.65rem',
                            background: '#3E83F8',
                            borderRadius: '0.08rem',
                            fontSize: '0.25rem',
                        }"
                        v-touch.prevent="handleTouch"
                    /> -->
                    <TButton class="btn" @click.prevent="handleTouch">
                        {{ btnText }}
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
            tips="您的密码已经修改成功，请重新登录"
            type="success"
        />
    </div>
</template>

<script>
import TDialog from "@/components/FunctionalComp/TDialog.vue";
import TButton from "@/components/FunctionalComp/TButton.vue";
import TMessage from "@/components/FunctionalComp/message/TMessage.vue";
import Vcode from "@/components/FunctionalComp/Vcode.vue";
import { getVerifyCode, modifyPwd } from "@/api/user";
import md5 from "md5";
let resetTimer;
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
            ruleForm: {
                //  dialog 中的内容
                phone: "",
                validCode: "",
                password1: "",
                password2: "",
            },
            eMsg: {
                phone: "",
                validCode: "",
                password1: "",
                password2: "",
            },
            nextFlag: false, // 是否下一步
            resetNum: 60,
            resetFlag: false, // 重置密码是否开始
            vCodeShow: false,
            messageVisible: false,
            bounceState: false,
            inputFocus: false, // 输入框是否聚焦
        };
    },
    computed: {
        resetTips() {
            return this.resetFlag ? `重新发送${this.resetNum}s` : "重新发送";
        },
        btnText() {
            return this.nextFlag ? "确认" : "下一步";
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
        getCode() {
            // 获取验证码  -->  两种情况，手机号登陆的时候(key=1)获取验证码 和 重置密码的时候获取的验证码
            // 先校验手机号
            if (!this.resetFlag) {
                this.resetFlag = true;
                // 验证正确
                // ----------  获取验证码  -----------
                resetTimer = setInterval(() => {
                    if (this.resetNum > 1) {
                        this.resetNum--;
                    } else {
                        this.cancelResetDialog();
                    }
                }, 1000);
            }
        },
        cancelResetDialog() {
            this.resetFlag = false;
            clearInterval(resetTimer);
            this.resetNum = 60;
        },
        dialogCancel() {
            this.$emit("update:visible", false);
            if (resetTimer) {
                this.cancelResetDialog();
                setTimeout(() => {
                    this.nextFlag = false;
                }, 200);
            }
            // 在 dialog 关闭前，可能会触发input的blur事件，从而导致错误提示没有关闭，从而异步清空数据
            setTimeout(() => {
                this.ruleForm = {
                    phone: "",
                    validCode: "",
                    password1: "",
                    password2: "",
                };
                this.eMsg = {
                    phone: "",
                    validCode: "",
                    password1: "",
                    password2: "",
                };
            }, 50);
        },
        async handleTouch() {
            if (!this.nextFlag) {
                if (this.verifyPhone()) {
                    this.$refs.phoneInput.blur();
                    this.vCodeShow = true;
                }
            } else {
                const { phone, validCode, password1 } = this.ruleForm;
                if (this.verifyPwd(1) && this.verifyPwd(2)) {
                    const { code, msg } = await modifyPwd({
                        mobile: phone,
                        verifyCode: validCode,
                        newPassword: md5(password1),
                    });
                    console.log(code, msg);
                    this.handleResult(code, msg);
                }
            }
        },
        handleResult(code, msg) {
            switch (code) {
                case 0:
                    this.dialogCancel();
                    this.messageVisible = true;
                    break;
                case 10011: {
                    this.eMsg.password2 = "验证码错误!";
                    break;
                }
                default:
                    this.eMsg.password2 = msg;
                    break;
            }
        },
        handleFocus() {
            this.inputFocus = true;
        },
        // 表单验证
        verifyPhone() {
            this.inputFocus = false;
            const { phone } = this.ruleForm;
            const r =
                /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
            if (!phone) {
                this.eMsg.phone = "请输入您的手机号";
                return false;
            } else if (!r.test(phone)) {
                this.eMsg.phone = "手机号格式不正确";
                return false;
            } else {
                this.eMsg.phone = "";
                return true;
            }
        },
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
                    this.eMsg.password2 = "两次密码不一致";
                    return false;
                } else {
                    this.eMsg.password2 = "";
                    return true;
                }
            }
        },
        // 滑块拼图方法
        openVcode() {
            if (!this.resetFlag) this.vCodeShow = true;
        },
        vCodeClose() {
            this.vCodeShow = false;
        },
        async vCodeSuccess() {
            try {
                const { phone } = this.ruleForm;
                const { code, msg } = await getVerifyCode({
                    mobile: phone,
                });
                console.log(code, msg);
                // this.vCodeClose();
                switch (code) {
                    case 0: {
                        this.nextFlag = true;
                        this.getCode();
                        break;
                    }
                    case 10010: {
                        this.eMsg.phone = "用户不存在！";
                        break;
                    }
                    case 10011: {
                        this.eMsg.phone = "超出每日发送验证码数量上限！";
                        break;
                    }
                    default:
                        this.eMsg.phone = msg;
                        break;
                }
            } finally {
                this.vCodeClose();
            }
        },
    },
};
</script>


<style lang="less" scoped>
.head-con {
    height: 0.7rem;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
        font-size: 0.27rem;
        font-weight: 600;
        color: #333333;
    }
}
.main-con {
    height: calc(4.79rem - 0.7rem - 1.05rem);
    width: 4.59rem;
    overflow: hidden;
    position: relative;
    transition: height 0.6s;
    .left,
    .right {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        transition: all 0.6s;
        opacity: 1;
        p {
            font-size: 0.22rem;
            font-weight: 600;
            color: #7e85a5;
            margin-bottom: 0.18rem;
        }
        .input-con {
            height: 1rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            input {
                width: 100%;
                height: 0.65rem;
                background: #ffffff;
                border-radius: 0.08rem;
                border: 0.01rem solid #979797;
                padding: 0 0.3rem;
                font-size: 0.24rem;
                font-weight: 400;
                color: #333333;
                &::placeholder {
                    font-size: 0.24rem;
                    font-weight: 400;
                    color: #cecece;
                }
            }
            .e-tips {
                flex: 1;
                font-size: 0.2rem;
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
                        font-size: 0.2rem;
                        font-weight: 400;
                        color: #cecece;
                    }
                }
            }
        }
    }
    .left {
        left: 0;
        padding: 0.4rem 0;
    }
    .right {
        padding: 0.2rem 0;
        right: -120%;
        opacity: 0;
        .right-title {
            .phone {
                color: #6c8ff9;
            }
        }
        .pwd-tips {
            text-align: right;
            color: #999999;
        }
    }
    .move-left {
        opacity: 0;
        left: -100%;
    }
    .move-show {
        opacity: 1;
        right: 0;
    }
}
.foot-con {
    height: 1.05rem;
    display: flex;
    justify-content: center;
    .btn {
        width: 4.59rem;
        height: 0.65rem;
        background: #3e83f8;
        border-radius: 0.08rem;
        font-size: 0.25rem;
    }
}
</style>