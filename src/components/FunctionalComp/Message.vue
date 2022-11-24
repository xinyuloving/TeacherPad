<template>
    <div class="message" v-if="start" :style="{ opacity: opacity }">
        <div class="text">{{text}}</div>
    </div>
</template>

<script>
export default {
    name: 'Message',
    props: {
        // 文本内容
        text: {
            type: String,
            required: true
        },
        // 持续时间
        time: {
            type: [String, Number],
            default: 2000
        },
        // 开启
        start: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            opacity: 0
        }
    },
    watch: {
        start() {
            if (this.start) {
                setTimeout(() => {
                    this.fadeIn()
                }, 10);
            } 
        },
        opacity() {
            if (!this.opacity) {
                setTimeout(() => {
                    this.$emit('close')
                }, 1000);
            }
        }
    },
    methods: {
        fadeIn() {
            this.opacity = 1;
            setTimeout(() => {
                this.opacity = 0
            }, this.time);
        }
    }
}
</script>

<style lang="less" scoped>
.message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px 30px;
    background-color: rgba(0, 0, 0, .6);
    color: #fff;
    transition: opacity 1s;
    border-radius: 0.1rem;
    z-index: 999;
}
</style>