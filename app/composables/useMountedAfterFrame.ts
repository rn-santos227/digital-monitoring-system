import { nextTick, onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

const hasRenderableSize = (element: HTMLElement) => element.clientWidth > 0 && element.clientHeight > 0

export const useMountedAfterFrame = (target?: Ref<HTMLElement | null>) => {
  const isMountedAfterFrame = ref(false)
  let resizeObserver: ResizeObserver | undefined
  let frameId: number | undefined

  const markReadyWhenRenderable = () => {
    const targetElement = target?.value

    if (targetElement && !hasRenderableSize(targetElement)) {
      return
    }

    isMountedAfterFrame.value = true
    resizeObserver?.disconnect()
  }
}
