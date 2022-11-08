import {defineStore} from 'pinia';
import {ref} from 'vue';

export const useHeaderStore = defineStore('header', () => {
  const header = ref<string>('');

  const setHeader = (head: string) => {
    header.value = head;
  };

  return {header, setHeader};
});
