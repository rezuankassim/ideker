<template>
  <div class="flex flex-col">
    <div class="overflow-x-auto">
      <div class="inline-block min-w-full py-2 align-middle">
        <div class="overflow-hidden">
          <table class="min-w-full table-fixed border-separate border-spacing-y-3">
            <thead class="bg-[#FAFBFC]">
              <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                <th
                  class="pt-[15px] pb-[14px] text-xs font-semibold uppercase leading-[10px] tracking-[1px] text-[#4E5D78]"
                  :class="{
                    'w-[66px] rounded-l-[15px]': header.index === 0,
                    'w-[48px] rounded-r-[15px]': header.index + 1 === headerGroup.headers.length,
                  }"
                  v-for="header in headerGroup.headers"
                  :key="header.id"
                >
                  {{ header.column.columnDef.header }}
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                class="group mt-3 text-sm font-semibold leading-[11px] text-[#4E5D78] hover:cursor-pointer"
                v-for="row in table.getRowModel().rows"
                :key="row.id"
                @click="router.push(`/bbs/view/${row.original.id}`)"
              >
                <td
                  class="py-[34px] group-hover:bg-[#F4F8FF]"
                  :class="{
                    'rounded-l-[15px] text-center': index === 0,
                    'rounded-r-[15px]': index + 1 === row.getVisibleCells().length,
                  }"
                  v-for="(cell, index) in row.getVisibleCells()"
                  :key="cell.id"
                >
                  {{ cell.getValue() }}
                </td>
              </tr>
            </tbody>
          </table>

          <div
            class="flex items-center justify-between rounded-[15px] bg-[#FAFBFC] px-[22px] py-[14px]"
          >
            <p class="text-sm font-medium leading-[11px] text-[#B0B7C3]">
              {{
                (table.getState().pagination.pageIndex === 0
                  ? table.getState().pagination.pageIndex + 1
                  : table.getState().pagination.pageIndex * 10 + 1) *
                (Number(table.getRowModel().rows[0]?.index) + 1)
              }}-{{
                (table.getState().pagination.pageIndex + 1) *
                (table.getRowModel().rows[table.getRowModel().rows.length - 1]?.index + 1)
              }}
              Of
              {{ table.getPageCount() * 10 }} Items
            </p>

            <div class="flex items-center gap-x-[19px]">
              <button
                class="rounded-[10px] p-2"
                :class="{
                  'bg-[#F3F3F3] text-[#B0B7C3]': !table.getCanPreviousPage(),
                  'bg-[#377DFF] text-white': table.getCanPreviousPage(),
                }"
                :disabled="!table.getCanPreviousPage()"
                @click="table.previousPage()"
              >
                <ChevronLeftIcon class="h-6 w-6" />
              </button>

              <button
                class="font-medium leading-[29px] hover:text-[#377DFF] focus:text-[#377DFF] focus:outline-none focus:ring-0"
                v-for="(page, index) in pagesArray"
                :key="page + index"
                @click="table.setPageIndex(page - 1)"
                :disabled="page === '...' || table.getState().pagination.pageIndex === page - 1"
                :class="{
                  'text-[#377DFF]': table.getState().pagination.pageIndex === page - 1,
                  'text-[#B0B7C3]': table.getState().pagination.pageIndex !== page - 1,
                }"
              >
                {{ page }}
              </button>

              <button
                class="rounded-[10px] p-2"
                :class="{
                  'bg-[#F3F3F3] text-[#B0B7C3]': !table.getCanNextPage(),
                  'bg-[#377DFF] text-white': table.getCanNextPage(),
                }"
                :disabled="!table.getCanNextPage()"
                @click="table.nextPage()"
              >
                <ChevronRightIcon class="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import {
  getCoreRowModel,
  useVueTable,
  createColumnHelper,
  getPaginationRowModel,
  PaginationState,
} from '@tanstack/vue-table';
import {useHeaderStore} from '../../store/header';
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/vue/24/solid';
import {computed} from '@vue/reactivity';
import {useRouter} from 'vue-router';

type BBS = {
  id: string;
  title: string;
  views: number;
};

const {setHeader} = useHeaderStore();
const router = useRouter();
const columnHelper = createColumnHelper<BBS>();
const pageIndex = ref<number>(0);
const pageSize = ref<number>(10);
const pagination = computed(() => {
  return {
    pageIndex: pageIndex.value,
    pageSize: pageSize.value,
  };
});
const setPagination = ({pageIndex: pI, pageSize: pS}: PaginationState): PaginationState => {
  pageIndex.value = pI;
  pageSize.value = pS;

  return {pageIndex: pageIndex.value, pageSize: pageSize.value};
};

const columns = [
  columnHelper.accessor('id', {
    id: 'no',
    header: 'No',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('title', {
    id: 'title',
    header: 'Title',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('views', {
    id: 'views',
    header: 'Views',
    cell: info => info.getValue(),
  }),
];
let defaultData: BBS[] = [];
const count = ref<number>(0);
const data = ref<BBS[]>(defaultData);
const pagesArray = ref<any[]>([]);

const table = useVueTable({
  get data() {
    return data.value;
  },
  columns,
  get pageCount() {
    return Math.ceil(count.value / 10) ?? -1;
  },
  getCoreRowModel: getCoreRowModel(),
  state: {
    get pagination() {
      return pagination.value;
    },
  },
  onPaginationChange: updater => {
    if (typeof updater === 'function') {
      setPagination(updater({pageIndex: pageIndex.value, pageSize: pageSize.value}));
    } else {
      setPagination(updater);
    }
  },
  manualPagination: true,
});

const range = (start: number, end: number) => {
  let length = end - start + 1;
  /*
  	Create an array of certain length and set the elements within it from
    start value to end value.
  */
  return Array.from({length}, (_, idx) => idx + start);
};

onMounted(async () => {
  setHeader('BBS List');

  await fetch('http://idc.flexink.com:9250/api/public/bbs/post')
    .then(response => response.json())
    .then(response => {
      data.value = response.data;
      count.value = response.count;
    });

  const siblingCount = 1;
  const totalPageCount = table.getPageCount();
  const totalPageNumbers = siblingCount + 5;
  const DOTS = '...';
  const currentPage = table.getState().pagination.pageIndex + 1;

  /*
      Case 1:
      If the number of pages is less than the page numbers we want to show in our
      paginationComponent, we return the range [1..totalPageCount]
    */
  if (totalPageNumbers >= totalPageCount) {
    return (pagesArray.value = range(1, totalPageCount));
  }

  /*
    	Calculate left and right sibling index and make sure they are within range 1 and totalPageCount
    */
  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount);

  /*
      We do not show dots just when there is just one page number to be inserted between the extremes of sibling and the page limits i.e 1 and totalPageCount. Hence we are using leftSiblingIndex > 2 and rightSiblingIndex < totalPageCount - 2
    */
  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

  const firstPageIndex = 1;
  const lastPageIndex = totalPageCount;

  /*
    	Case 2: No left dots to show, but rights dots to be shown
    */
  if (!shouldShowLeftDots && shouldShowRightDots) {
    let leftItemCount = 3 + 2 * siblingCount;
    let leftRange = range(1, leftItemCount);

    return (pagesArray.value = [...leftRange, DOTS, totalPageCount]);
  }

  /*
    	Case 3: No right dots to show, but left dots to be shown
    */
  if (shouldShowLeftDots && !shouldShowRightDots) {
    let rightItemCount = 3 + 2 * siblingCount;
    let rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount);
    return (pagesArray.value = [firstPageIndex, DOTS, ...rightRange]);
  }

  /*
    	Case 4: Both left and right dots to be shown
    */
  if (shouldShowLeftDots && shouldShowRightDots) {
    let middleRange = range(leftSiblingIndex, rightSiblingIndex);
    return (pagesArray.value = [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex]);
  }
});

watch(pageIndex, async (curr, prev) => {
  console.log(curr, prev);
  if (curr > prev) {
    await fetch(`http://idc.flexink.com:9250/api/public/bbs/post?pageNumber=${curr + 1}`)
      .then(response => response.json())
      .then(response => {
        data.value = response.data;
      });
  } else if (prev > curr) {
    if (curr === 0) {
      await fetch('http://idc.flexink.com:9250/api/public/bbs/post')
        .then(response => response.json())
        .then(response => {
          data.value = response.data;
        });
    } else {
      await fetch(`http://idc.flexink.com:9250/api/public/bbs/post?pageNumber=${prev}`)
        .then(response => response.json())
        .then(response => {
          data.value = response.data;
        });
    }
  }

  const siblingCount = 1;
  const totalPageCount = table.getPageCount();
  const totalPageNumbers = siblingCount + 5;
  const DOTS = '...';
  const currentPage = table.getState().pagination.pageIndex + 1;

  /*
    Case 1:
    If the number of pages is less than the page numbers we want to show in our
    paginationComponent, we return the range [1..totalPageCount]
  */
  if (totalPageNumbers >= totalPageCount) {
    return (pagesArray.value = range(1, totalPageCount));
  }

  /*
    Calculate left and right sibling index and make sure they are within range 1 and totalPageCount
  */
  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount);

  /*
    We do not show dots just when there is just one page number to be inserted between the extremes of sibling and the page limits i.e 1 and totalPageCount. Hence we are using leftSiblingIndex > 2 and rightSiblingIndex < totalPageCount - 2
  */
  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

  const firstPageIndex = 1;
  const lastPageIndex = totalPageCount;

  /*
    Case 2: No left dots to show, but rights dots to be shown
  */
  if (!shouldShowLeftDots && shouldShowRightDots) {
    let leftItemCount = 3 + 2 * siblingCount;
    let leftRange = range(1, leftItemCount);

    return (pagesArray.value = [...leftRange, DOTS, totalPageCount]);
  }

  /*
    Case 3: No right dots to show, but left dots to be shown
  */
  if (shouldShowLeftDots && !shouldShowRightDots) {
    let rightItemCount = 3 + 2 * siblingCount;
    let rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount);
    return (pagesArray.value = [firstPageIndex, DOTS, ...rightRange]);
  }

  /*
    Case 4: Both left and right dots to be shown
  */
  if (shouldShowLeftDots && shouldShowRightDots) {
    let middleRange = range(leftSiblingIndex, rightSiblingIndex);
    return (pagesArray.value = [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex]);
  }
});
</script>
