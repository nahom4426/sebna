<script setup>
import { watch } from "vue";
import { removeUndefined } from "@/utils/utils";
import { getAllUser } from "../Api/UserApi";
import { useUserStore } from "../store/userStore";
import { usePagination } from "@/composables/usePagination";

const props = defineProps({
  search: String,
});

const userStore = useUserStore();

const pagination = usePagination({
  store: userStore,
  cb: (data) =>
    getAllUser({ ...data, ...removeUndefined({ search: props.search }) }),
  auto: false,
});

if (!userStore.users.length) {
  pagination.send();
}

watch(
  () => props.search,
  () => {
    pagination.send();
  }
);
</script>

<template>
  <slot
    :users="userStore.users"
    :pending="pagination.pending.value"
    :error="pagination.error.value"
    :refresh="pagination.send"
  />
</template>
