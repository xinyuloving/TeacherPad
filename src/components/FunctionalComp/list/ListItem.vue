<template>
    <div
        :class="{ 'list-item': true, disabled: isDisabled }"
        v-touch="handleTouch"
        :style="{ borderColor: isChecked ? '#3e83f8' : '' }"
    >
        <img
            :src="
                require(`../../../assets/img/home/homeTools/PrepareLessons/${itemData.suffix}.png`)
            "
            alt=""
        />
        <span>{{ itemData[props.label] }}</span>
    </div>
</template>

<script>
export default {
    props: {
        itemData: {
            type: Object,
            default: () => ({}),
        },
        checkedValue: {
            type: Array,
            default: () => [],
        },
        props: {
            type: Object,
            required: true,
            // default: () => ({
            //     value: "name", // 每一项的唯一标识
            // }),
        },
        disabled: {
            type: Array,
            default: () => [],
        },
    },
    computed: {
        isChecked() {
            const { isSelectedValue, value } = this.props;
            if (isSelectedValue) {
                return this.checkedValue.includes(this.itemData[value]);
            } else {
                return this.checkedValue.find(
                    (item) => item[value] === this.itemData[value]
                );
            }
        },
        isDisabled() {
            const { isSelectedValue, value } = this.props;
            const { disabled } = this;
            if (disabled.length) {
                if (isSelectedValue) {
                    return Boolean(disabled.includes(this.itemData[value]));
                } else {
                    return Boolean(
                        disabled.find(
                            (ele) => ele[value] === this.itemData[value]
                        )
                    );
                }
            } else {
                return false;
            }
        },
    },
    methods: {
        handleTouch() {
            if (this.isDisabled) return;
            this.$emit("itemTouch", this.itemData);
        },
    },
};
</script>

<style lang="less">
.list-item {
    width: 1.2rem;
    height: 1.2rem;
    margin: 0.1rem 0.15rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 0.01rem solid transparent;
    transition: all 0.2s linear;
    border-radius: 0.08rem;
    img {
        width: 0.55rem;
        height: 0.55rem;
        margin-bottom: 0.1rem;
    }
    span {
        width: 100%;
        font-size: 0.2rem;
        font-weight: 400;
        color: #333333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
        padding: 0 0.05rem;
    }
}
.disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>