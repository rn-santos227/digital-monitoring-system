<template>

</template>

<script setup lang="ts">
import { useNotificationMenuHandler } from '~/handlers/notifications'

const {
  items,
  unreadCount,
  unreadCountLabel,
  isLoading,
  isMarkingRead,
  menuRoot,
  isOpen,
  closeMenu,
  toggleMenu,
  markRead,
  formatNotificationDate,
} = useNotificationMenuHandler()
</script>
