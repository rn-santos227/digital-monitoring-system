// @vitest-environment happy-dom
import { createPinia, setActivePinia } from 'pinia'
import { defineComponent, h, ref, type Ref } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useMountedAfterFrame } from '@/app/composables/useMountedAfterFrame'
import { useNotifications } from '@/app/composables/useNotifications'
import { useNotificationMenuHandler } from '@/app/handlers/notifications/menu.handler'
import type { NotificationListResponse } from '@/app/types/domain/notification'
import { useNotificationStore } from '@/app/stores/notifications'

const { openStream } = vi.hoisted(() => ({ openStream: vi.fn() }))
vi.mock('@/app/utils/notification-endpoints', async (importOriginal) => ({
  ...(await importOriginal<
    typeof import('@/app/utils/notification-endpoints')
  >()),
  openNotificationsStream: openStream,
}))

beforeEach(() => {
  setActivePinia(createPinia())
  openStream.mockReset()
  vi.stubGlobal(
    '$fetch',
    vi.fn().mockResolvedValue({ items: [], unreadCount: 0 }),
  )
})
afterEach(() => vi.unstubAllGlobals())

const mountController = <T>(factory: () => T) => {
  let controller: T | undefined
  const wrapper = mount(
    defineComponent({
      setup() {
        controller = factory()
        return () => h('div')
      },
    }),
  )
  if (!controller) throw new Error('Missing mounted controller')
  return { controller, wrapper }
}

describe('renderable frame readiness', () => {
  const setup = (target?: Ref<HTMLElement | null>) => {
    let frame: FrameRequestCallback | undefined
    let resized: (() => void) | undefined
    const disconnect = vi.fn()
    const observe = vi.fn()
    const cancel = vi.fn()
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        frame = callback
        return 7
      }),
    )
    vi.stubGlobal('cancelAnimationFrame', cancel)
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          resized = callback
        }
        disconnect = disconnect
        observe = observe
      },
    )
    return {
      ...mountController(() => useMountedAfterFrame(target)),
      frame: () => frame?.(0),
      resize: () => resized?.(),
      disconnect,
      observe,
      cancel,
    }
  }

  it('becomes ready after the first frame when no target is required', async () => {
    const test = setup()
    expect(test.controller.isMountedAfterFrame.value).toBe(false)
    await flushPromises()
    test.frame()
    expect(test.controller.isMountedAfterFrame.value).toBe(true)
    test.wrapper.unmount()
    expect(test.cancel).toHaveBeenCalledWith(7)
  })

  it('waits for a hidden target to have width and height, then disconnects the observer', async () => {
    const target = document.createElement('div')
    let width = 0
    Object.defineProperties(target, {
      clientWidth: { get: () => width },
      clientHeight: { get: () => 20 },
    })
    const test = setup(ref(target))
    await flushPromises()
    test.frame()
    expect(test.observe).toHaveBeenCalledWith(target)
    test.resize()
    expect(test.controller.isMountedAfterFrame.value).toBe(false)
    width = 100
    test.resize()
    expect(test.controller.isMountedAfterFrame.value).toBe(true)
    expect(test.disconnect).toHaveBeenCalledOnce()
    test.wrapper.unmount()
    expect(test.disconnect).toHaveBeenCalledTimes(2)
  })

  it('immediately accepts a visible target without attaching an observer', async () => {
    const target = document.createElement('div')
    Object.defineProperties(target, {
      clientWidth: { value: 100 },
      clientHeight: { value: 20 },
    })
    const test = setup(ref(target))
    await flushPromises()
    test.frame()
    expect(test.controller.isMountedAfterFrame.value).toBe(true)
    expect(test.observe).not.toHaveBeenCalled()
    test.wrapper.unmount()
  })
})

describe('notification stream and menu lifecycle', () => {
  const setupStream = () => {
    const abort = new AbortController()
    let callbacks:
      | {
          onMessage: (response: NotificationListResponse) => void
          onError: (error: Error) => void
        }
      | undefined
    openStream.mockImplementation((handlers) => {
      callbacks = handlers
      return abort
    })
    return {
      abort,
      message: (response: NotificationListResponse) =>
        callbacks?.onMessage(response),
      error: () => callbacks?.onError(new Error('Stream lost')),
    }
  }

  it('replaces notification counts from the stream, caps the badge, and aborts on unmount', async () => {
    const stream = setupStream()
    const { controller, wrapper } = mountController(useNotifications)
    await flushPromises()
    expect(openStream).toHaveBeenCalledOnce()
    stream.message({ items: [], unreadCount: 100 })
    expect(controller.unreadCountLabel.value).toBe('99+')
    stream.message({ items: [], unreadCount: 3 })
    expect(controller.unreadCountLabel.value).toBe('3')
    expect(controller.formatNotificationDate('2026-10-04T12:00:00Z')).toMatch(
      /Oct/,
    )
    const reload = vi
      .spyOn(useNotificationStore(), 'fetchNotifications')
      .mockResolvedValue(undefined)
    stream.error()
    await flushPromises()
    expect(reload).toHaveBeenCalledOnce()
    const mark = vi
      .spyOn(useNotificationStore(), 'markAllRead')
      .mockResolvedValue(undefined)
    await controller.markAllRead()
    expect(mark).toHaveBeenCalledOnce()
    wrapper.unmount()
    expect(stream.abort.signal.aborted).toBe(true)
  })

  it('loads notices on opening, closes only on outside clicks, and removes its listener', async () => {
    setupStream()
    const { controller, wrapper } = mountController(useNotificationMenuHandler)
    await flushPromises()
    const reload = vi
      .spyOn(useNotificationStore(), 'fetchNotifications')
      .mockResolvedValue(undefined)
    const root = document.createElement('div')
    const child = document.createElement('button')
    root.appendChild(child)
    document.body.appendChild(root)
    controller.menuRoot.value = root
    await controller.toggleMenu()
    expect(reload).toHaveBeenCalledOnce()
    expect(controller.isOpen.value).toBe(true)
    child.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(controller.isOpen.value).toBe(true)
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(controller.isOpen.value).toBe(false)
    const mark = vi
      .spyOn(useNotificationStore(), 'markAllRead')
      .mockResolvedValue(undefined)
    await controller.markRead()
    expect(mark).toHaveBeenCalledOnce()
    const remove = vi.spyOn(document, 'removeEventListener')
    wrapper.unmount()
    expect(remove).toHaveBeenCalledWith('click', expect.any(Function))
    remove.mockRestore()
    root.remove()
  })
})
