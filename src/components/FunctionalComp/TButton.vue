<script>
export default {
    name: "TButton",
    props: {
        disabled: Boolean,
        type: String, // text/normal/primary
        btnStyle: {
            type: Object,
            default: () => ({}),
        },
        createDomForContent: Boolean,
        loading: Boolean,
        loadingClass: {
            type: String,
            default: "",
        },
    },
    methods: {
        handleClick(type, evt) {
            if (this.loading) return;
            if (this.disabled) return;
            if (this.listeners[type]) this.$emit(type, evt);
        },
    },
    computed: {
        listeners() {
            return this.$listeners;
        },
    },
    render(h) {
        const { btnStyle, disabled, createDomForContent, loading, type, loadingClass } =
            this;
        const classes = [
            "t_button",
            type === "normal"
                ? `t_btn_normal`
                : type === "text"
                ? "t_btn_text"
                : "t_btn_primary",

            loading ? "is-loading disabled" : "",
            disabled ? "disabled" : "",
        ];
        return h(
            "button",
            {
                class: classes,
                style: {
                    ...btnStyle,
                },
                directives: [
                    {
                        name: "touch",
                        value: (e) => {
                            this.handleClick("touch", e);
                        },
                    },
                ],
                on: {
                    click: (e) => {
                        this.handleClick("click", e);
                    },
                },
            },
            [
                loading
                    ? h("i", {
                          class: ["iconfont", "icon-loading", loadingClass],
                      })
                    : "",
                createDomForContent
                    ? h(
                          "span",
                          {
                              class: ["btn_text", loadingClass],
                          },
                          this.$slots.default
                      )
                    : this.$slots.default,
            ]
        );
    },
};
</script>
<style lang="less" scoped>
@blue1: #3e83f8;
@white1: #fff;
.t_button {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    width: 3.08rem;
    height: 0.77rem;
    border-radius: 0.1rem;
    font-size: 0.25rem;
    font-weight: 500;
    opacity: 1;
}

.is-loading {
    position: relative;
    pointer-events: none;
}

.icon-loading {
    animation: rotating 2s linear infinite;
    font-size: 0.25rem;
}

.t_btn_primary {
    background: @blue1;
    color: @white1;
}

.t_btn_text {
    width: 0.8rem;
    height: 0.5rem;
    font-size: 0.25rem;
    background: inherit;
    color: @blue1;
}

.t_button .iconfont + span {
    margin-left: 0.1rem;
}

.t_btn_normal {
    color: @blue1;
    background: @white1;
}

@keyframes rotating {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(1turn);
    }
}
</style>

<style lang="less" scoped>
.touchActive {
    opacity: 0.6 !important;
}
.disabled {
    opacity: 0.6 !important;
    cursor: not-allowed;
}
</style>