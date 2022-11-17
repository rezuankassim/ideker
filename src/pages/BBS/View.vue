<template>
  <div class="rounded-[20px] bg-[#FAFBFC] px-[31px] pt-[39px] pb-[31px]">
    <h2 class="text-lg font-semibold leading-[14px] text-[#323B4B]">View</h2>
    <p class="mt-6 font-medium leading-[12px] text-[#B0B7C3]">View information of the BBS record</p>

    <div class="mt-[36px] flex flex-col gap-y-[45px] rounded-[15px] bg-white px-[38px] py-[30px]">
      <div>
        <div class="flex flex-col gap-y-[29px]">
          <span class="text-sm font-semibold leading-[10px] text-[#B0B7C3]">Title</span>

          <span class="font-semibold leading-[11px] text-[#323B4B]">{{ bbs.title }}</span>
        </div>
      </div>

      <div>
        <div class="flex flex-col gap-y-[29px]">
          <span class="text-sm font-semibold leading-[10px] text-[#B0B7C3]">Content</span>

          <span class="font-semibold leading-[11px] text-[#323B4B]">{{ bbs.content }}</span>
        </div>
      </div>

      <div>
        <div class="flex flex-col gap-y-[29px]">
          <span class="text-sm font-semibold leading-[10px] text-[#B0B7C3]">Files</span>

          <span
            v-for="file in bbs.attachedFile?.attachedFileInfos"
            class="font-semibold leading-[11px] text-[#323B4B]"
            :key="file.id"
          >
            <a
              :href="`http://idc.flexink.com:9250/api/public/bbs/post/file/${bbs.id}/${bbs.attachedFile.id}/${file.id}?lang=en`"
              className="hover:cursor-pointer"
              download
            >
              {{ file.filename }}
            </a>
          </span>
        </div>
      </div>

      <div class="flex justify-end gap-x-[21px]">
        <button
          class="rounded-[15px] bg-[#FF5630] px-[20px] py-[13px] font-semibold leading-[21px] text-white"
          @click="deleteBBS(bbs.id)"
        >
          Delete
        </button>

        <router-link
          :to="`/bbs/modify/${bbs.id}`"
          class="rounded-[15px] bg-[#377DFF] px-[20px] py-[13px] font-semibold leading-[21px] text-white"
        >
          Modify
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import {onBeforeRouteUpdate, useRoute, useRouter} from 'vue-router';
import {useHeaderStore} from '../../store/header';

type BBSRecord = {
  id: number;
  title: string;
  content: string;
  views: number;
  attachedFile: {
    id: number;
    attachedFileInfos?: {
      id: number;
      size: number;
      downloadCount: number;
      filename: string;
    }[];
  };
};

const {setHeader} = useHeaderStore();
const route = useRoute();
const router = useRouter();
const bbs = ref<BBSRecord>({} as BBSRecord);

onMounted(async () => {
  setHeader('BBS View');

  const response = await fetch(
    `http://idc.flexink.com:9250/api/public/bbs/post/${route.params.id}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (response.status >= 200 && response.status < 300) {
    const body = await response.json();
    bbs.value.id = body.id;
    bbs.value.title = body.title;
    bbs.value.content = body.content;
    bbs.value.views = body.views;
    bbs.value.attachedFile = body.attachedFile;
  } else {
    router.push({
      name: 'BBS List',
    });
  }
});

const deleteBBS = async (id: string) => {
  await fetch(`http://idc.flexink.com:9250/api/public/bbs/post/${id}`, {
    method: 'DELETE',
  });

  router.push('/bbs/list');
};

watch(
  () => route.params.id,
  async curr => {
    const response = await fetch(`http://idc.flexink.com:9250/api/public/bbs/post/${curr}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status >= 200 && response.status < 300) {
      const body = await response.json();
      bbs.value.id = body.id;
      bbs.value.title = body.title;
      bbs.value.content = body.content;
      bbs.value.views = body.views;
      bbs.value.attachedFile = body.attachedFile;
      console.log(bbs.value);
    } else {
      router.push({
        name: 'BBS List',
      });
    }
  }
);
</script>
