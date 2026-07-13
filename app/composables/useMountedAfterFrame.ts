export const useMountedAfterFrame = () => {
  const isMountedAfterFrame = ref(false)

  onMounted(async () => {
    await nextTick()
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve())
    })

    isMountedAfterFrame.value = true
  })

  return {
    isMountedAfterFrame,
  }
}
