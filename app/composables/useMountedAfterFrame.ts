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

  onMounted(async () => {
    await nextTick()

    frameId = requestAnimationFrame(() => {
      const targetElement = target?.value

      if (!targetElement || hasRenderableSize(targetElement)) {
        markReadyWhenRenderable()
        return
      }

      resizeObserver = new ResizeObserver(markReadyWhenRenderable)
      resizeObserver.observe(targetElement)
    })
  })

  onBeforeUnmount(() => {
    if (frameId !== undefined) {
      cancelAnimationFrame(frameId)
    }

    resizeObserver?.disconnect()
  })
}
