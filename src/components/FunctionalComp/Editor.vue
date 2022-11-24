<template>
    <div class="e-ditor" ref="editor" @input="editorInput" contenteditable="true" v-html="value">

    </div>
</template>

<script>
export default {
    name: 'Editor',

    data()  {
        return {
            value: '',

        }
    },

    methods: {
        editorInput() {
            console.log(this.$refs.editor.innerHTML);
        }
    },

    created() {
        let str = "hwekrfhwfkjlsadhkhklfhsakljj<!----><!----><div data-v-b4e1afba=\"\" class=\"option-box\" style=\"padding: 5px 10px;\"><div data-v-b4e1afba=\"\" class=\"option-item\" style=\"margin: 5px 0px; display: flex; line-height: 1.5;\"><div data-v-b4e1afba=\"\" class=\"key\" style=\"margin-right: 5px;\">A</div>: <div data-v-b4e1afba=\"\" contenteditable=\"false\" class=\"guding\" style=\"flex: 1 1 0%; margin-left: 5px;\">fd</div></div><div data-v-b4e1afba=\"\" class=\"option-item\" style=\"margin: 5px 0px; display: flex; line-height: 1.5;\"><div data-v-b4e1afba=\"\" class=\"key\" style=\"margin-right: 5px;\">B</div>: <div data-v-b4e1afba=\"\" contenteditable=\"false\" class=\"guding\" style=\"flex: 1 1 0%; margin-left: 5px;\">ga</div></div><div data-v-b4e1afba=\"\" class=\"option-item\" style=\"margin: 5px 0px; display: flex; line-height: 1.5;\"><div data-v-b4e1afba=\"\" class=\"key\" style=\"margin-right: 5px;\">C</div>: <div data-v-b4e1afba=\"\" contenteditable=\"false\" class=\"guding\" style=\"flex: 1 1 0%; margin-left: 5px;\">gfsd</div></div><div data-v-b4e1afba=\"\" class=\"option-item\" style=\"margin: 5px 0px; display: flex; line-height: 1.5;\"><div data-v-b4e1afba=\"\" class=\"key\" style=\"margin-right: 5px;\">D</div>: <div data-v-b4e1afba=\"\" contenteditable=\"false\" class=\"guding\" style=\"flex: 1 1 0%; margin-left: 5px;\">er</div></div></div>";
        this.value = str.replace(/contenteditable="false"/g, 'contenteditable="true"')
    }
}
</script>

<style lang="less" scoped>
    .e-ditor {
        height: 100%;
        background-color: #fff;
    }
</style>