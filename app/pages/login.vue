<template>

</template>

<script setup lang="ts">
import { ROUTE_PATHS } from '~/constants/routes.constants'

const router = useRouter()
const currentYear = new Date().getFullYear()
const rememberMe = ref(false)

const credentials = reactive({
  identifier: '',
  password: ''
})

</script>
