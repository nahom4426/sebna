<script setup >
import ModalParent from "@/components/ModalParent.vue";
import NewFormParent from "@/components/NewFormParent.vue";
import UserForm from "./UserForm.vue";
import { closeModal } from "@customizer/modal-x";
import { ref, onMounted } from "vue";
import { CreateUser } from "../Api/UserApi";
import { useUsers } from "../store/userStore";
import { useToast } from '@/toast/store/toast';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
});

const modalData = ref(props.data || {});
const formPending = ref(false);
const error = ref('');
const userStore = useUsers();
const { addToast } = useToast();

onMounted(() => {
  console.log('AddUser modal received data:', modalData.value);
});

// Handle form submission
async function handleSubmit(formValues) {
  try {
    formPending.value = true;
    console.log('Form submitted with values:', formValues);
    
    // Make sure payerUuid is included
    const userData = {
      ...formValues,
      payerUuid: modalData.value.payerUuid || formValues.payerUuid
    };
    
    console.log('Submitting user data:', userData);
    
    const result = await CreateUser(userData);
    
    if (result.success) {
      console.log('User created successfully:', result.data);
      
      // Add the new user to the store
      userStore.add(result.data);
      
      addToast({
        type: 'success',
        title: 'Success',
        message: 'User created successfully'
      });
      
      // Call onUpdated callback if provided
      if (typeof modalData.value.onUpdated === 'function') {
        modalData.value.onUpdated(result.data);
      }
      
      closeModal();
    } else {
      throw new Error(result.error || 'Failed to create user');
    }
  } catch (error) {
    console.error('Error creating user:', error);
    
  } finally {
    formPending.value = false;
  }
}
</script>

<template>
  <ModalParent>
    <NewFormParent 
      class="" 
      size="lg" 
      title="Add User" 
      subtitle="To add a new user, please fill out the information in the fields below."
    >
      <div class="bg-white rounded-lg">
        <div v-if="error" class="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {{ error }}
        </div>
        
        <UserForm
          :pending="formPending"
          :onSubmit="handleSubmit"
          :onCancel="() => closeModal()"
          :roleName="modalData.roleName"
          :payerUuid="modalData.payerUuid"
        />
      </div>
    </NewFormParent>
  </ModalParent>
</template>
