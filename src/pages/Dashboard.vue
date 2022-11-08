<template>
  <div class="rounded-[20px] bg-[#FAFBFC] px-[36px] pt-[39px] pb-[36px]">
    <h2 class="text-lg font-semibold leading-[14px] text-[#323B4B]">Analytics Overview</h2>

    <div class="mt-[35px] grid grid-cols-4 gap-x-[30px]">
      <div
        class="rounded-[15px] bg-white px-[25px] pt-[28px] pb-[29px] drop-shadow-[0px_23px_44px_rgba(176,183,195,0.14)]"
      >
        <span class="text-lg font-semibold leading-[15px] text-[#4E5D78]">Sales</span>

        <div class="mt-[38px] flex items-baseline">
          <span class="text-2xl font-semibold leading-[20px] text-[#4E5D78]">$38.9k</span>

          <div class="flex">
            <span class="ml-[2px] text-xs font-semibold leading-[12px] text-[#38CB89]">+3.4%</span>
            <ArrowUpIcon class="ml-[5px] h-[10px] w-[10px] text-[#38CB89]" />
          </div>
        </div>

        <p class="mt-[17px] text-sm leading-[11px] text-[#B0B7C3]">Last year $31942</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ArrowUpIcon} from '@heroicons/vue/24/solid';
import {onMounted} from 'vue';
import {useHeaderStore} from '../store/header';

const {header, setHeader} = useHeaderStore();

onMounted(() => {
  setHeader('Dashboard');
});
</script>
