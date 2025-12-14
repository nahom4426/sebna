<script setup>
import PrivilegesDataProvider from "../../privilege/components/PrivilegesDataProvider.vue";
import { useApiRequest } from "@/composables/useApiRequest";
import { craeteRole } from "../Api/RoleApi";
import { toasted } from "@/utils/utils";
import { useRoles } from "../store/roleStore";
import RoleForm from "../form/RoleForm.vue";
import { useRouter } from "vue-router";
import NewFormParent from "../components/NewFormParent.vue";
import Button from "@/components/Button.vue";
import { useForm } from "@/components/new_form_builder/useForm";

const { submit } = useForm("roleForm");
const roleStore = useRoles();
const req = useApiRequest();
const router = useRouter();

function create({ values }) {
  req.send(
    () => craeteRole(values),
    (res) => {
      if (res.success) {
        roleStore.add(res.data);
        router.push("/roles");
        toasted(res.success, "Role Created", res.error);
      }
      console.log('jjjj');
      
      //  
    }
  );
}

const goBack = () => {
  router.go(-1);
};
</script>

<template>
  <NewFormParent
    :is-modal="false"
    size="auto"
    class="flex justify-center h-full pb-6 bg-white"
    title="Add Role"
  >
    <PrivilegesDataProvider :pre-page="500" v-slot="{ privileges, pending }">
      <RoleForm
        v-if="!pending"
        :privileges="privileges"
        :selectedPrivilege="[]"
        :roles="{ roleName: '', roleDescription: '' }"
      />
      <p v-else>Loading...</p>
    </PrivilegesDataProvider>

    <template #bottom>
      <Button
        size="sm"
        type="primary"
        class="flex justify-center items-center mt-3 gap-3 p-2 bg-primary"
        :pending="req.pending.value"
        @click.prevent="submit(create)"
      >
        Add Role
      </Button>
    </template>
  </NewFormParent>
</template>
