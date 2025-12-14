<script setup>
import ModalParent from "@/components/ModalParent.vue";
import NewFormParent from "@/components/NewFormParent.vue";
import UserForm from "./UserForm.vue";
import { closeModal } from "@customizer/modal-x";
import { ref, onMounted, watch, computed } from "vue";
import { updateUserById, getUserById } from "../Api/UserApi";
import { useUsers } from "../store/userStore";
import { useApiRequest } from "@/composables/useApiRequest";
import { useToast } from '@/toast/store/toast';
import { institutions } from "@/features/instution_settings/store/InstitutionsStore";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
});

const { addToast } = useToast();
const userStore = useUsers();
const institutionsStore = institutions();
const req = useApiRequest();

// Reactive state
const userUuid = ref(props.data?.userUuid || '');
const userData = ref(props.data?.user || {});
const pending = ref(false);
const error = ref('');

// Determine if this is a payer admin user
const isPayerAdmin = computed(() => {
  return props.data?.payerUuid && props.data?.roleName?.startsWith('PA_');
});

// Computed payer data for admin users
const payerData = computed(() => {
  if (!isPayerAdmin.value) return null;
  return institutionsStore.institutions.find(
    p => p.payerUuid === props.data?.payerUuid
  );
});

// Computed role name
const roleName = computed(() => {
  return props.data?.roleName || userData.value?.roleName || '';
});

onMounted(async () => {
  console.log('EditUser modal mounted with data:', props.data);
  
  if (props.data?.userUuid) {
    userUuid.value = props.data.userUuid;
    userData.value = props.data.user || {};
    
    // If we don't have complete user data, fetch it
    if (userUuid.value && Object.keys(userData.value).length === 0) {
      await fetchUserData();
    }
  }
});

watch(() => props.data, (newData) => {
  console.log('EditUser modal props updated:', newData);
  if (newData) {
    userUuid.value = newData.userUuid || '';
    userData.value = newData.user || {};
  }
}, { deep: true });

async function fetchUserData() {
  try {
    pending.value = true;
    error.value = '';
    
    req.send(
      () => getUserById(userUuid.value),
      (res) => {
        if (res.success) {
          userData.value = res.data;
          console.log('Fetched user data:', userData.value);
        } else {
          error.value = res.error || 'Failed to fetch user data';
          addToast({
            type: 'error',
            title: 'Error',
            message: error.value
          });
        }
      }
    );
  } catch (err) {
    error.value = err.message || 'An error occurred while fetching user data';
    addToast({
      type: 'error',
      title: 'Error',
      message: error.value
    });
  } finally {
    pending.value = false;
  }
}

async function handleSubmit(formValues) {
  try {
    pending.value = true;
    error.value = '';
    console.log('Updating user with values:', formValues);
    
    // Prepare payload - preserve roleName for payer admins
    const payload = {
      ...formValues,
      // For payer admins, preserve the original roleName
      ...(isPayerAdmin.value && { roleName: roleName.value })
    };
    
    // Format gender to lowercase for API
    if (payload.gender) {
      payload.gender = payload.gender.toLowerCase();
    }

    req.send(
      () => updateUserById(userUuid.value, payload),
      async (res) => {
        if (res.success) {
          const updatedUser = {
            ...userData.value,
            ...formValues,
            userUuid: userUuid.value,
            // Preserve the role name for payer admins
            ...(isPayerAdmin.value && { roleName: roleName.value })
          };

          // Update the user in the store
          userStore.update(userUuid.value, updatedUser);
          
          // If this is a payer admin user, update the payer in institutions store
          if (isPayerAdmin.value && payerData.value) {
            const updatedUsers = payerData.value.users?.map(user => 
              user.userUuid === userUuid.value ? updatedUser : user
            ) || [];
            
            institutionsStore.update(props.data.payerUuid, {
              users: updatedUsers
            });
          }

          addToast({
            type: 'success',
            title: 'Success',
            message: 'User updated successfully'
          });

          // Call the onUpdated callback if provided
          if (props.data?.onUpdated) {
            props.data.onUpdated(updatedUser);
          }

          closeModal();
        } else {
          error.value = res.error || 'Failed to update user';
          addToast({
            type: 'error',
            title: 'Error',
            message: error.value
          });
        }
      }
    );
  } catch (err) {
    error.value = err.message || 'An error occurred while updating user';
    addToast({
      type: 'error',
      title: 'Error',
      message: error.value
    });
  } finally {
    pending.value = false;
  }
}
</script>

<template>
  <ModalParent>
    <NewFormParent 
      class="" 
      size="lg" 
      :title="`Edit ${userData.firstName || 'User'}`" 
      subtitle="Update the user information in the fields below."
    >
      <div class="bg-white rounded-lg">
        <div v-if="error" class="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {{ error }}
        </div>
        
        <div v-if="pending && Object.keys(userData).length === 0" class="p-4 mb-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg">
          Loading user data...
        </div>
        
        <UserForm
          v-else-if="Object.keys(userData).length > 0"
          :initial-data="userData"
          :is-edit="true"
          :pending="pending || req.pending.value"
          :role-name="roleName"
          :payer-uuid="props.data?.payerUuid"
          :onSubmit="handleSubmit"
          :onCancel="() => closeModal()"
        />
        
        <div v-else class="p-4 text-center text-gray-500">
          No user data available
        </div>
      </div>
    </NewFormParent>
  </ModalParent>
</template>