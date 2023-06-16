<template>
    <div
        class="my_button"
        :class="{
            solid_button: !isGhostButton && !disable,
            solid_button_disable: !isGhostButton && disable,
            ghost_button: isGhostButton && !disable,
            ghost_button_disable: isGhostButton && disable
        }"
        @click="btnClick"
    >
        <slot>
            <span>{{ buttonText }}</span>
        </slot>
    </div>
</template>

<script setup lang="ts">
    interface IProps {
        buttonText?: string;
        isGhostButton?: boolean;
        disable?: boolean;
    }

    const emit = defineEmits<{
        (e: 'callback', event: Event): void;
    }>();

    const props = withDefaults(defineProps<IProps>(), {
        buttonText: '',
        isGhostButton: false,
        disable: false
    });

    const btnClick = (event: Event) => {
        if (props.disable) return;
        emit('callback', event);
    };
</script>

<style lang="less" scoped>
    .my_button {
        .text_font_bold;

        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        width: 100%;
        height: 40px;
        padding: 0 16px;

        span {
            .text_ellipsis;
        }
    }

    .solid_button {
        .button_container;
        .cursor_pointer;

        color: #ffffff;
        transition: background-color 0.3s;

        &:hover {
            .hover_button;
        }
    }

    .solid_button_disable {
        .disable_button;

        color: #ffffff;
        cursor: default;

        &:hover {
            .disable_button;

            border: none;
        }
    }

    .ghost_button {
        .ghost_button;
        .cursor_pointer;

        color: #000000;

        &:hover {
            .ghost_hover_button;
        }
    }

    .ghost_button_disable {
        .text_font_bold;

        color: rgba(0, 0, 0, 0.35);
        background: var(--bj-background-color-fourth);
        border: 2px solid var(--bj-disable-color);
        border-radius: var(--border-radius-normal);
        cursor: default;

        &:hover {
        }
    }
</style>
