<script setup>
import { closeModal } from '@customizer/modal-x';

// import { closeModal } from '@customizer/modal-x';

//import ResponseError from './ResponseError.vue';
const props = defineProps({
  size: {
    type: String,
    default: 'md',
  },
  title: {
    required: true,
    type: String,
  },
  goBack: {
    type: Boolean,
    default: false,
  },
  onGoBack: {
    type: Function,
  },
  isModal:{
    type:Boolean,
    default:true
  },
  error: {
    type: String,
  },
});
</script>
<template>
  <div :class="[$style[size]]" class="overflow-hidden flex flex-col justify-between  bg-white rounded-md">
   
    <div class="flex flex-col gap-4 form-scrollbar flex-1 overflow-auto p-2 border-b border-text-secondary-clr/30">
       <div class="flex justify-between border-b border-text-secondary-clr/30 items-center">
      <div class="flex items-center gap-4">
        <button @click="onGoBack" v-if="goBack"
          class="grid place-items-center rounded-md border border-text-clr"></button>
        <p class="font-bold text-lg px-4 p-3">{{ title }}</p>
      </div>
      <div class="flex items-center gap-4">
        <slot name="right-actions">
          <button v-if="isModal" @click="closeModal()">X</button>
        </slot>
        <button class="border rounded-full">
          <!-- <BaseIcon :path="mdiClose" :size="20" /> -->
        </button>
      </div>
    </div>
      <slot />
      <!-- / <ResponseError :error="error" /> -->
    </div>
    <slot name="bottom" />
  </div>
</template>

<style module>
.md {
  width: 40rem;
  height: 100%;
}

.lg {
  width: 60rem;
  height: 100%;
}

.xl {
  width: 100%;
  height: 100%;
}

.xs {
  width: auto;
  height: auto;
}
</style>

<style>
.form-layout {
  display: grid;
}

.form-scrollbar::-webkit-scrollbar {
  display: block;
  width: 5px;
}

.form-scrollbar::-webkit-scrollbar-thumb {
  background-color: #d1c9c9;
  border-radius: 50px;
}
</style>
