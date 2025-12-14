<script setup>
import { watch } from "vue";
import { removeUndefined } from "@/utils/utils.js";
import { getAllRole } from "../Api/RoleApi";
import { useRoles } from "../store/roleStore";
import { usePagination } from "@/composables/usePagination";
import { onMounted } from "vue";

const props = defineProps({
  search: String,
});

const roles = useRoles();

const pagination = usePagination({
  store: roles,
  cb: (data) =>
    getAllRole({ ...data, ...removeUndefined({ search: props.search }) }),
  auto: false,
});

onMounted(() => {
  pagination.send();
});

watch(
  () => props.search,
  () => {
    pagination.send();
  }
);
defineExpose({
  refresh: () => pagination.send()
});
</script>
<template>
  <slot
    :roles="roles.roles"
    :pending="pagination.pending.value"
    :error="pagination.error.value"
  />
</template>
