// 页面滑动处理

export default {
    data() {
        return {
            slide_domW: 0,
            slide_offsetX: 0,
            slide_initialX: 0,
            slide_childW: 0,
            slide_x: 0,
        }
    },
    methods: {
        slide_mount() {
            try {
                this.$refs.slideChild.style.transform = 'translateX(${0}px)';
                this.slide_childW = this.$refs.slideChild.offsetWidth;
                this.slide_domW = this.$refs.slide.offsetWidth;
                // 监听手指触摸事件
                this.$refs.slide.addEventListener('touchstart', e => {
                    this.$refs.slideChild.style.transition = 'all 0s';
                    this.slide_initialX = e.touches[0].pageX
                })
                // 监听手指滑动事件
                this.$refs.slide.addEventListener('touchmove', e => {
                    this.slide_x = e.touches[0].pageX - this.slide_initialX;
                    this.$refs.slideChild.style.transform = `translateX(${this.slide_offsetX + this.slide_x}px)`;
                })
                // 监听手指抬起事件
                this.$refs.slide.addEventListener('touchend', e => {
                    this.slide_childW = this.$refs.slideChild.offsetWidth;
                    this.slide_domW = this.$refs.slide.offsetWidth;
                    this.$refs.slideChild.style.transition = 'all .3s';
                    const x = e.changedTouches[0].pageX - this.slide_initialX + this.slide_offsetX + this.slide_x;
                    if (x > 0) {
                        this.slide_offsetX = 0;
                    } else if (x < -this.slide_childW + this.slide_domW) {
                        this.slide_offsetX = -this.slide_childW + this.slide_domW
                    } else {
                        this.slide_offsetX = Math.round(x / this.slide_domW) * this.slide_domW
                    }
                    this.$refs.slideChild.style.transform = `translateX(${this.slide_offsetX}px)`;
                    this.slide_x = null;
                })
            } catch(err) {
                console.log(err);
            }
        }
    },
    computed: {
        currentPage() {
            return -Math.round((this.slide_x + this.slide_offsetX) / this.slide_domW)
        }
    }
}