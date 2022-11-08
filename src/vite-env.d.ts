/// <reference types="vite/client" />

declare module '*.vue' {
  import type {DefineComponent} from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type.esm.js';
