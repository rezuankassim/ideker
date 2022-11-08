<template></template>

<script setup lang="ts">
import {onMounted} from 'vue';
import {useHeaderStore} from '../../store/header';

const {setHeader} = useHeaderStore();

onMounted(() => {
  setHeader('Members List');
});
</script>
