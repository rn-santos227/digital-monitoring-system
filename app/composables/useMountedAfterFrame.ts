import { nextTick, onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

const hasRenderableSize = (element: HTMLElement) => element.clientWidth > 0 && element.clientHeight > 0

