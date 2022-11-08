<template>
  <div class="h-screen w-full">
    <header>
      <nav class="flex items-center justify-between px-[32px] py-[30px]">
        <div class="w-[182px] text-center">
          <span class="align-middle text-[24px] font-semibold leading-[20px] text-[#323B4B]">
            IDEKER
          </span>
        </div>

        <div class="flex flex-1 items-center justify-between">
          <h1 class="ml-[70px] text-2xl font-semibold leading-[20px] text-[#323B4B]">
            {{ headerTitle }}
          </h1>

          <a
            href="https://github.com/rezuankassim"
            target="_blank"
            class="flex h-[47px] w-[47px] items-center justify-center rounded-full p-[4px]"
          >
            <CodeBracketIcon class="h-[28px] w-[28px] text-[#B0B7C3]" />
          </a>
        </div>
      </nav>
    </header>

    <div class="flex">
      <aside
        class="mt-[-107px] h-screen w-[250px] border-r border-[#F3F3F3] px-[17px] pt-[120px] pb-[49px]"
      >
        <nav class="flex flex-col gap-y-[41px]">
          <div>
            <span
              class="ml-[17px] text-xs font-medium uppercase leading-[10px] tracking-[1px] text-[#B0B7C3]"
            >
              Pages
            </span>

            <ul class="mt-[15px] flex flex-col gap-y-[10px]">
              <li v-for="item in sidebarItems" :key="item.label">
                <SidebarLink :item="item" />
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      <main class="flex-1 overflow-y-auto px-[35px] py-[17px]">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CodeBracketIcon,
  ClipboardDocumentIcon,
  ChevronDownIcon,
  UsersIcon,
  Squares2X2Icon,
} from '@heroicons/vue/24/solid';
import SidebarLink from './SidebarLink.vue';
import {FunctionalComponent} from 'vue';
import {useHeaderStore} from '../store/header';
import {computed} from '@vue/reactivity';

interface ISidebarItem {
  label: string;
  href?: string;
  parentHref?: string;
  children?: {label: string; href: string}[];
  icon: FunctionalComponent;
}

const sidebarItems: ISidebarItem[] = [
  {
    label: 'Dashboard',
    href: '/',
    icon: Squares2X2Icon,
  },
  {
    label: 'BBS',
    parentHref: '/bbs/',
    icon: ClipboardDocumentIcon,
    children: [
      {
        label: 'Register',
        href: '/bbs/register',
      },
      {
        label: 'List',
        href: '/bbs/list',
      },
    ],
  },
  {
    label: 'Members',
    parentHref: '/members/',
    icon: UsersIcon,
    children: [
      {
        label: 'Register',
        href: '/members/register',
      },
      {
        label: 'List',
        href: '/members/list',
      },
    ],
  },
];
const store = useHeaderStore();
const headerTitle = computed(() => store.header);
</script>
