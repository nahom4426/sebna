<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useApiRequest } from '@/composables/useApiRequest';
import { getPrivilegeById, updatePrivilege } from '../Api/PrivilegeApi';
import PrivilegeForm from '../form/PrivilegeForm.vue';
import { usePrivilege } from '../store/privilegeStore';
import { ref, watch } from 'vue';
import { toasted } from '@/utils/utils.js';
import Button from '@/components/Button.vue';
import { useForm } from '@/components/new_form_builder/useForm';

const router = useRouter();
const { submit } = useForm('privilegeForm');
const privilegeStore = usePrivilege();
const route = useRoute();
const privilegeUuid = route.params.privilegeUuid;
const req = useApiRequest();
const updateReq = useApiRequest();


const privilege = ref(
    privilegeStore.privilege.find((el) => el.privilegeUuid == privilegeUuid) || {}
);

if (!Object.keys(privilege.value).length) {
    req.send(
        () => getPrivilegeById(privilegeUuid),
        (res) => {
            if (res.success) {
                privilege.value = res.data;
               
            }
        }
    );
} 


function update({ values }) {
     updateReq.send(
        () => updatePrivilege(privilegeUuid, values),
        (res) => {
            if (res.success) {
                privilegeStore.update(privilegeUuid, { ...privilege.value, ...values });
                router.push('/privileges');
                toasted(res.success, 'Successfully Updated', res.error);
            } else {
                toasted(false, '', res.error || 'Failed to update privilege');
            }
        }
    );
}


</script>
<template>
  
   <div class=" bg-white p-4 rounded-xl space-y-6">
  <h1 class=" border-b font-semibold p-4">Update privilege</h1>
        <PrivilegeForm 
            :privilege="privilege" 
            
        />
        
        <div class="mt-4 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p class="text-sm text-yellow-700">
                <strong>Note:</strong> All fields must be at least 3 characters long. Privilege Name and Category must be less than 50 characters.
            </p>
        </div>
   
        <Button 
            size="md" 
           
            class="flex justify-center w-full items-center mt-3 gap-3 p-4  text-white bg-primary"
            :pending="updateReq.pending.value" 
            @click.prevent="submit(update)"
        >
            Update Privilege
        </Button>
   </div>
</template>
