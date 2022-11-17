<template>
  <div class="rounded-[20px] bg-[#FAFBFC] px-[31px] pt-[39px] pb-[31px]">
    <h2 class="text-lg font-semibold leading-[14px] text-[#323B4B]">Modify</h2>
    <p class="mt-6 font-medium leading-[12px] text-[#B0B7C3]">
      Modify the BBS record by submitting this form
    </p>

    <div class="mt-[36px] rounded-[15px] bg-white px-[38px] py-[30px]">
      <form class="flex flex-col gap-y-[45px]" @submit.prevent="submit">
        <div>
          <div class="flex flex-col gap-y-[29px]">
            <label for="title" class="text-sm font-semibold leading-[10px] text-[#B0B7C3]">
              Title
            </label>

            <input
              v-model="title"
              id="title"
              type="text"
              class="h-[58px] rounded-[15px] border border-[#F3F3F3] bg-white px-[23px] pt-[23px] pb-[24px] font-semibold leading-[11px] focus:border-[#377DFF] focus:ring-0 focus:drop-shadow-[0px_12px_23px_rgba(55,125,255,0.06)]"
              :class="{
                'border-[#FF5630] drop-shadow-[0px_12px_23px_rgba(255,86,48,0.06)]': errors.title,
              }"
            />
          </div>

          <span
            v-if="errors.title"
            class="mt-[17px] block text-sm font-medium leading-[15px] text-[#FF5630]"
          >
            {{ errors.title }}
          </span>
        </div>

        <div>
          <div class="flex flex-col gap-y-[29px]">
            <label for="content" class="text-sm font-semibold leading-[10px] text-[#B0B7C3]">
              Content
            </label>

            <textarea
              v-model="content"
              id="content"
              class="resize-none rounded-[15px] border border-[#F3F3F3] bg-white px-[23px] pt-[23px] pb-[24px] font-semibold focus:border-[#377DFF] focus:ring-0 focus:drop-shadow-[0px_12px_23px_rgba(55,125,255,0.06)]"
              rows="7"
              :class="{
                'border-[#FF5630] drop-shadow-[0px_12px_23px_rgba(255,86,48,0.06)]': errors.content,
              }"
            ></textarea>
          </div>

          <span
            v-if="errors.content"
            class="mt-[17px] block text-sm font-medium leading-[15px] text-[#FF5630]"
          >
            {{ errors.content }}
          </span>
        </div>

        <div>
          <div class="flex flex-col gap-y-[29px]">
            <label for="files" class="text-sm font-semibold leading-[10px] text-[#B0B7C3]">
              Files
            </label>

            <div
              v-if="
                attachedFile &&
                attachedFile.attachedFileInfos &&
                Object.keys(attachedFile.attachedFileInfos).length !== 0
              "
              class="flex flex-col gap-y-[14px] rounded-[15px] bg-[#FAFBFC] p-[27px]"
            >
              <div
                v-for="file in attachedFile.attachedFileInfos"
                class="flex items-center justify-between rounded-[15px] bg-white px-[17px] py-[15px]"
              >
                <span class="font-medium text-[#4E5D78]">{{ file.filename }}</span>
                <button type="button" @click="deleteFile(file.id, attachedFile.id)">
                  <x-mark-icon class="h-[26px] w-[26px] text-[#C1C7D0]" />
                </button>
              </div>
            </div>

            <file-pond
              ref="pond"
              :files="files"
              allow-multiple
              @processfile="processFile"
              @removefile="removeFile"
              accepted-file-types="image/*"
              :server="{
                process,
                revert,
              }"
            />
          </div>

          <span
            v-if="errors.files"
            class="mt-[17px] block text-sm font-medium leading-[15px] text-[#FF5630]"
          >
            {{ errors.files }}
          </span>
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            class="rounded-[15px] bg-[#377DFF] px-[20px] py-[13px] font-semibold leading-[21px] text-white"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {toFormValidator} from '@vee-validate/zod';
import {onMounted, ref} from 'vue';
import {useHeaderStore} from '../../store/header';
import * as zod from 'zod';
import {useField, useForm} from 'vee-validate';
import {useRoute, useRouter} from 'vue-router';
import vueFilePond from 'vue-filepond';
import type {
  FilePondErrorDescription,
  FilePondFile,
  ProcessServerConfigFunction,
  RevertServerConfigFunction,
} from 'filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type.esm.js';
import 'filepond/dist/filepond.min.css';
import type {FilePond} from 'filepond';
import {XMarkIcon} from '@heroicons/vue/24/solid';

interface UploadFile {
  id: string;
  filename: string;
  originalFilename: string;
  fileSize: number;
  contentType: string;
}
type AttachedFileInfo = {
  id: number;
  size: number | null;
  downloadCount: number;
  filename: string;
};
type AttachedFile = {
  id: number;
  attachedFileInfos: AttachedFileInfo[];
};

const {setHeader} = useHeaderStore();
const route = useRoute();
const router = useRouter();
const bbsId = ref('');
const attachedFile = ref<AttachedFile>({} as AttachedFile);
const pond = ref<FilePond | null>(null);

const validationSchema = toFormValidator(
  zod.object({
    title: zod.string({
      required_error: 'Title is required',
    }),
    content: zod.string({
      required_error: 'Content is required',
    }),
    files: zod.array(
      zod.object({
        filename: zod.string(),
        originalFilename: zod.string(),
        fileSize: zod.number(),
        contentType: zod.string(),
      })
    ),
  })
);

const {handleSubmit, errors} = useForm({
  validationSchema,
});

const {value: title} = useField<string>('title');
const {value: content} = useField<string>('content');
const {value: files} = useField<UploadFile[]>('files', undefined, {
  initialValue: [],
});

onMounted(async () => {
  setHeader('BBS Modify');

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
    bbsId.value = body.id;
    title.value = body.title;
    content.value = body.content;
    attachedFile.value = body.attachedFile;
  } else {
    router.push({
      name: 'BBS List',
    });
  }
});

const submit = handleSubmit(async values => {
  const response = await fetch(`http://idc.flexink.com:9250/api/public/bbs/post/${bbsId.value}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: title.value,
      content: content.value,
      attachedFile: {
        attachedFileInfos: files.value.map(file => ({
          filename: file.filename,
          originalFilename: file.originalFilename,
          fileSize: file.fileSize,
          contentType: file.contentType,
        })),
      },
    }),
  });

  if (response.status >= 200 && response.status < 300) {
    router.push(`/bbs/view/${bbsId.value}`);
  }
});

const FilePond = vueFilePond(FilePondPluginFileValidateType);
const process: ProcessServerConfigFunction = (
  fieldName,
  file,
  metadata,
  load,
  error,
  progress,
  abort
) => {
  // fieldName is the name of the input field
  // file is the actual file object to send
  const formData = new FormData();
  formData.append('file', file, file.name);

  const request = new XMLHttpRequest();
  request.open('POST', 'http://idc.flexink.com:9250/api/public/bbs/post/file');
  request.setRequestHeader('Access-Control-Allow-Origin', '*');

  // Should call the progress method to update the progress to 100% before calling load
  // Setting computable to false switches the loading indicator to infinite mode
  request.upload.onprogress = e => {
    progress(e.lengthComputable, e.loaded, e.total);
  };

  // Should call the load method when done and pass the returned server file id
  // this server file id is then used later on when reverting or restoring a file
  // so your server knows which file to return without exposing that info to the client
  request.onload = function () {
    if (request.status >= 200 && request.status < 300) {
      const response = JSON.parse(request.responseText);
      // the load method accepts either a string (id) or an object
      load(response[0].filename);
    } else {
      // Can call the error method if something is wrong, should exit after
      error('oh no');
    }
  };

  request.send(formData);

  // Should expose an abort method so the request can be cancelled
  return {
    abort: () => {
      // This function is entered if the user has tapped the cancel button
      request.abort();

      // Let FilePond know the request has been cancelled
      abort();
    },
  };
};
const revert: RevertServerConfigFunction = (
  /** Server file id of the file to restore. */
  uniqueFieldId: any,
  /** Should call the load method when done. */
  load: () => void,
  /** Call if something goes wrong, will exit after. */
  error: (errorText: string) => void
) => {
  // Should somehow send `source` to server so server can remove the file with this source
  if (uniqueFieldId) {
    const request = new XMLHttpRequest();
    request.open('DELETE', `http://idc.flexink.com:9250/api/public/bbs/post/file/${uniqueFieldId}`);

    request.send();
  }

  // // Can call the error method if something is wrong, should exit after
  // error('oh my goodness');

  // // Should call the load method when done, no parameters required
  load();
};
const processFile = (error: FilePondErrorDescription | null, file: FilePondFile) => {
  console.log(file);
  files.value.push({
    id: file.id,
    filename: file.serverId,
    originalFilename: file.filename,
    fileSize: file.fileSize,
    contentType: file.fileType,
  });
};
const removeFile = (error: FilePondErrorDescription | null, file: FilePondFile) => {
  files.value = files.value.filter(file => file.id !== file.id);
};
const deleteFile = async (attachedFileInfoId: number, attachedFileId: number) => {
  await fetch(
    `http://idc.flexink.com:9250/api/public/bbs/post/file/${bbsId.value}/${attachedFileId}/${attachedFileInfoId}?lang=en`,
    {
      method: 'DELETE',
    }
  );

  attachedFile.value.attachedFileInfos = attachedFile.value.attachedFileInfos.filter(
    file => file.id !== attachedFileInfoId
  );
};
</script>
