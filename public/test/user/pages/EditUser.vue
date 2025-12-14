<script setup>
import { useRoute, useRouter } from "vue-router";
import { useApiRequest } from "@/composables/useApiRequest";
import { getUserById, updateUserById } from "../Api/UserApi";
import { getAllRole } from "../../role/Api/RoleApi";
import { allRequest, toasted } from "@/utils/utils";
import { useUsers } from "../store/userStore";
import NewFormParent from "../../role/components/NewFormParent.vue";
import { ref, } from "vue";
import Button from "@/components/Button.vue";

import { useForm } from "@/components/new_form_builder/useForm";
import UserForm from "./UserForm.vue";

const route = useRoute();
const userStore = useUsers();
const userUuid = route.params.userUuid;
const user = ref(userStore.users.find((el) => el.userUuid == userUuid) || {});
const { submit } = useForm("userform");
const router = useRouter();

const userReq = useApiRequest();
const updateReq = useApiRequest();

const userData = ref(null);
const rolesData = ref([]);

userReq.send(
  () =>
    allRequest({
      user: getUserById(userUuid),
      roles: getAllRole({ page: 1, limit: 500 }),
    }),
  (response) => {

    if (response && response.data) {
      if (response.data.user) {
        userData.value = response.data.user;
      }

      if (response.data.roles && Array.isArray(response.data.roles)) {
        rolesData.value = response.data.roles
          .map((role) => {
            return {
              ...role,
              roleUuid: role.roleUuid || role.id || "",
              roleName: role.roleName || role.name || "",
            };
          })
          .filter((role) => role.roleUuid && role.roleName); 

      }
    }
  }
);

function update({ values }) {

  const formattedData = {
    email: values.email,
    title: values.title,
    firstName: values.firstName,
    fatherName: values.fatherName,
    grandFatherName: values.grandFatherName,
    gender: values.gender.toLowerCase(), 
    mobilePhone: values.mobilePhone,
    roleUuid: values.roleUuid,
  };


  updateReq.send(
    () => updateUserById(userUuid, formattedData),
    (res) => {
      toasted(res.success, "Successfully Updated", res.error);
      if (res.success) {
        const updatedUser = {
          ...user.value,
          ...formattedData,
          ...(res.data || {}),
        };
        userStore.update(userUuid, updatedUser);
        router.push("/Users");
      }
    }
  );
}

const goBack = () => {
  router.go(-1);
};
</script>
<template>
  <button @click="goBack" class="flex items-center gap-2 text-primary mb-3">
    <div
      class="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-5 h-5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15.75 19.5L8.25 12l7.5-7.5"
        />
      </svg>
    </div>
  </button>
  <NewFormParent size="xl" title="Update Users">
    <div v-if="userReq.pending.value" class="p-6 text-center">
      Loading user data...
    </div>
    <div
      v-else-if="!userData || rolesData.length === 0"
      class="p-6 text-center text-red-500"
    >
      Failed to load user data. Please try again.
      <pre
        v-if="process.env.NODE_ENV === 'development'"
        class="mt-4 text-xs text-left bg-gray-100 p-2 rounded"
      >
                User data: {{ userData ? "Available" : "Missing" }}
                Roles data: {{ rolesData.length }} roles loaded
            </pre
      >
    </div>
    <UserForm v-else :roles="rolesData" :user="userData" />
    <template #bottom>
      <div
        class="p-2"
        v-if="!userReq.pending.value && userData && rolesData.length > 0"
      >
        <Button
          type="primary"
          :pending="updateReq.pending.value"
          @click.prevent="submit(update)"
          class="w-full"
        >
          Update User
        </Button>
      </div>
    </template>
  </NewFormParent>
</template>
