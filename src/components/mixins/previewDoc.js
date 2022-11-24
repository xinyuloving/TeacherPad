import cos from "@/utils/cos"

export default {

    data() {
        return {
            mixin_docDom: ''
        }
    },

    methods: {
        _mountDoc(obj) {
            return new Promise(async (resolve, reject) => {
                try {
                    const res = await cos.previewTheDocument({
                        type: 0,
                        key: obj.name,
                        dom: obj.dom,
                    });
                    if (obj.dom) {
                        this.mixin_docDom = res;
                        await res.ready();
                    }
                    resolve(res)
                } catch(err) {
                    reject(err)
                }
            })
        }
    }
}