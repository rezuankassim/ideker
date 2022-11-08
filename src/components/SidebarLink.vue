<template>
  <router-link
    v-if="!item.children"
    :to="item.href ?? ''"
    class="flex w-full items-center rounded-[15px] px-[14px] pt-[10px] pb-[11px]"
    active-class="bg-[#FAFBFC]"
  >
    <component :is="item.icon" class="h-[25px] w-[25px] text-[#B0B7C3]" />

    <span class="ml-[10px] flex-1 text-left text-[14px] font-medium leading-[10px] text-[#8A94A6]">
      {{ item.label }}
    </span>
  </router-link>

  <Disclosure v-else v-slot="{open}" :default-open="isLinkActive" :key="route.path">
    <DisclosureButton
      class="flex w-full items-center px-[14px] pt-[10px] pb-[11px]"
      :class="{'rounded-t-[15px] bg-[#FAFBFC]': open}"
    >
      <component :is="item.icon" class="h-[25px] w-[25px] text-[#B0B7C3]" />

      <span
        class="ml-[10px] flex-1 text-left text-[14px] font-medium leading-[10px] text-[#8A94A6]"
      >
        {{ item.label }}
      </span>

      <ChevronDownIcon
        class="h-[15px] w-[15px] text-[#B0B7C3] transition-transform"
        :class="{'rotate-180': open}"
      />
    </DisclosureButton>

    <DisclosurePanel class="rounded-b-[15px] bg-[#FAFBFC] px-[14px] pt-[11px] pb-[22px]">
      <ul v-if="item.children" class="flex flex-col gap-y-[28px]">
        <li v-for="child in item.children" :key="child.label">
          <router-link
            :to="child.href"
            class="flex items-center gap-x-[19px] pl-[9px]"
            v-slot="{isActive}"
          >
            <div
              class="h-[7px] w-[7px] rounded-full"
              :class="{'bg-[#377DFF]': isActive, 'bg-transparent': !isActive}"
            ></div>

            <span
              class="text-[14px] font-medium leading-[11px]"
              :class="{'text-[#8A94A6]': isActive, 'text-[#B0B7C3]': !isActive}"
            >
              {{ child.label }}
            </span>
          </router-link>
        </li>
      </ul>
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup lang="ts">
import {FunctionalComponent} from 'vue';
import {Disclosure, DisclosureButton, DisclosurePanel} from '@headlessui/vue';
import {ChevronDownIcon} from '@heroicons/vue/24/solid';
import {computed} from '@vue/reactivity';
import {useRoute} from 'vue-router';

interface Props {
  item: {
    label: string;
    href?: string;
    parentHref?: string;
    children?: {label: string; href: string}[];
    icon: FunctionalComponent;
  };
}

const {item} = defineProps<Props>();
const route = useRoute();

const isLinkActive = computed(() => {
  if (item.parentHref) {
    return route.path.includes(item.parentHref);
  }

  return false;
});
</script>
