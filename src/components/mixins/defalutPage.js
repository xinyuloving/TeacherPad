import DefalutPage from '@/components/FunctionalComp/DefalutPage.vue'

export default {
    components: {
        DefalutPage
    },

    data() {
        return {
            defalutText: '暂时还没有内容',
            defaultImgName: 'not_content',
            defaultIsShow: false
        }
    },

    methods: {
        defaultShow(text, img) {
            this.defalutText = text || '暂时还没有内容';
            this.defaultImgName = img || 'not_content';
            this.defaultIsShow = true
        },
        defaultHidden() {
            this.defaultIsShow = false
        }
    }
}