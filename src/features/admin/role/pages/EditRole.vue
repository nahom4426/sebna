<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useApiRequest } from '@/composables/useApiRequest';
import { getRoleById, updateRolebyId } from '../Api/RoleApi';
import { useRoles } from '../store/roleStore';
import { ref } from 'vue';
import NewFormParent from '../components/NewFormParent.vue';
import PrivilegesDataProvider from '../../privilege/components/PrivilegesDataProvider.vue';
import Button from '@/components/Button.vue';
import RoleForm from '../form/RoleForm.vue';
import { useForm } from '@/components/new_form_builder/useForm';
import { toasted } from '@/utils/utils';

const roleStore = useRoles();
const route = useRoute()
const roleUuid = route.params.roleUuid
const role = ref(roleStore.roles.find((el) => el.roleUuid == roleUuid) || {});
const req = useApiRequest()
const updateReq = useApiRequest()
const { submit } = useForm('roleForm')
const router = useRouter();

if (!Object.keys(role.value).length) {
    req.send(
        () => getRoleById(roleUuid),
        (res) => {
            if (res.success) {
                role.value = res.data;
            }
        }
    );
}

function update({ values }) {
    updateReq.send(
        () => updateRolebyId(roleUuid, values),
        (res) => {
            if (res.success) {
                roleStore.update(roleUuid, { ...role.value, ...values });
            }
            toasted(res.success, 'Successfully Updated', res.error);
            router.push('/roles');
        }
    );
}


</script>
<template>
  <NewFormParent
    :is-modal="false"
    size="auto"
    class="flex justify-center pb-6 h-full bg-white"
    title="Update Role"
  >
    <PrivilegesDataProvider :pre-page="500" v-slot="{ privileges, pending }">
      <RoleForm 
        v-if="!pending && Object.keys(role).length" 
        :selectedPrivilege="role.privilegeList" 
        :privileges="privileges" 
        :roles="role" 
      />
      <p v-else>Loading...</p>
    </PrivilegesDataProvider>

    <template #bottom>
      <Button
        size="sm"
        type="primary"
        class="flex gap-3 justify-center items-center p-2 mt-3 bg-primary"
        :pending="updateReq.pending.value"
        @click.prevent="submit(update)"
      >
        Update Role
      </Button>
    </template>
  </NewFormParent>
</template>