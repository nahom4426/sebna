<script setup lang="ts">
import { ref, computed, onMounted, type PropType } from 'vue';
import Input from '@/components/new_form_elements/Input.vue';
import InputPassword from '@/components/new_form_elements/InputPassword.vue';
import Select from '@/components/new_form_elements/Select.vue';
import Form from '@/components/new_form_builder/Form.vue';
import { getAllRole } from '../../role/Api/RoleApi';
import Spinner from '@/components/Spinner.vue';
import InputLayout from '@/components/new_form_elements/NewInputLayout.vue';
const props = defineProps({
  initialData: {
    type: Object as PropType<any>,
    default: () => ({})
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  pending: {
    type: Boolean,
    default: false
  },
  onSubmit: {
    type: Function as PropType<(values: any) => void>,
    required: true
  },
  onCancel: {
    type: Function as PropType<() => void>,
    required: true
  },
  roleName: {
    type: String,
    default: ''
  },
  payerUuid: {
    type: String,
    default: ''
  }
});

// Create a computed property to handle the pending state
const isPending = computed(() => {
  return props.pending || fetchRolesPending.value;
});

// Add a ref for the form element
const formEl = ref(null);

// Log props when component is mounted
onMounted(() => {
  console.log('UserForm props:', {
    initialData: props.initialData,
    isEdit: props.isEdit,
    roleName: props.roleName
  });
  
  // Fetch roles
  fetchRoles();
});

// Add a reactive variable to track if role selection should be disabled
const roleDisabled = ref(false);

// Form data
const email = ref('');
const password = ref('');
const title = ref('');
const firstName = ref('');
const fatherName = ref('');
const grandFatherName = ref('');
const gender = ref('');
const mobilePhone = ref('');
const roleUuid = ref('');

// Role fetching state
const roles = ref<any[]>([]);
const fetchRolesPending = ref(false);
const rolesError = ref<string | null>(null);

// Role options computation
const roleOptions = computed(() => {
  if (!roles.value) return [];
  
  // Check if roles.value has a content property (pagination response)
  const rolesArray = roles.value.content || roles.value;
  
  if (!Array.isArray(rolesArray)) {
    console.error('Roles is not an array:', roles.value);
    return [];
  }
  
  return rolesArray.map(role => ({
    label: role.roleName,
    value: role.roleUuid
  }));
});


// Fetch roles function
async function fetchRoles() {
  console.log('Fetching roles, looking for:', props.roleName);
  fetchRolesPending.value = true;
  
  try {
    const response = await getAllRole();
    
    if (response.success) {
      roles.value = response.data || [];
      console.log('Fetched roles:', roles.value);
      
      // If a specific role name is provided, try to find and select it
      if (props.roleName) {
        console.log('Looking for role with name:', props.roleName);
        
        // Check if roles.value has a content property (pagination response)
        const rolesArray = roles.value.content || roles.value;
        
        if (!Array.isArray(rolesArray)) {
          console.error('Roles is not an array:', roles.value);
          return;
        }
        
        // Try to find a role that matches the pattern "PA_[PayerName]_Manager"
        // First, extract the payer name from the role name pattern
        const payerNameMatch = props.roleName.match(/^(PA|PR)_(.+)_Manager$/);
const payerName = payerNameMatch ? payerNameMatch[2] : null;

let matchingRole = null;

if (payerName) {
  // Look for an exact match first
  matchingRole = rolesArray.find(role => 
    role.roleName === props.roleName
  );
  
  // If no exact match, look for a role that contains the payer/provider name
  if (!matchingRole) {
    matchingRole = rolesArray.find(role => 
      role.roleName && role.roleName.includes(payerName)
    );
  }
}
        
        // If still no match, try a more general approach
        if (!matchingRole) {
          console.log('No match found using payer name, trying more general approach');
          
          // Try exact match
          matchingRole = rolesArray.find(role => 
            role.roleName === props.roleName
          );
          
          // If no exact match, try case-insensitive match
          if (!matchingRole) {
            const normalizedRoleName = props.roleName.toLowerCase();
            matchingRole = rolesArray.find(role => 
              role.roleName && role.roleName.toLowerCase() === normalizedRoleName
            );
          }
          
          // If still no match, try partial match
          if (!matchingRole) {
            console.log('No exact match found, trying partial match');
            matchingRole = rolesArray.find(role => 
              role.roleName && 
              (role.roleName.includes(props.roleName) || 
               props.roleName.includes(role.roleName))
            );
          }
        }
        
        if (matchingRole) {
          console.log('Found matching role:', matchingRole);
          roleUuid.value = matchingRole.roleUuid;
          // Disable role selection if a specific role is provided
          roleDisabled.value = true;
        } else {
          console.log('No matching role found for:', props.roleName);
          console.log('Available roles:', rolesArray.map(r => r.roleName).join(', '));
        }
      }
    } else {
      console.error('Failed to fetch roles:', response.error);
    }
  } catch (error) {
    console.error('Error fetching roles:', error);
  } finally {
    fetchRolesPending.value = false;
  }
}

// Title options
const titleOptions = ['Mr', 'Ms.', 'Dr.', 'Prof'];
const genderOptions = ['Female', 'Male'];

// Initialize form data
onMounted(async () => {
  await fetchRoles();

  if (props.initialData && Object.keys(props.initialData).length > 0) {
    email.value = props.initialData.email || '';
    password.value = props.initialData.password || '';
    title.value = props.initialData.title || '';
    firstName.value = props.initialData.firstName || '';
    fatherName.value = props.initialData.fatherName || '';
    grandFatherName.value = props.initialData.grandFatherName || '';
    
    // Fix gender capitalization - convert to uppercase for the select component
   if (props.initialData.gender) {
  gender.value = props.initialData.gender.charAt(0).toUpperCase() + 
                 props.initialData.gender.slice(1).toLowerCase();
}
    mobilePhone.value = props.initialData.mobilePhone || '';
    
    // Handle role selection
    if (props.initialData.roleUuid) {
      roleUuid.value = props.initialData.roleUuid;
    } 
    // If we have roleName but no roleUuid, try to find the matching role
    else if (props.initialData.roleName && roles.value) {
      const rolesArray = roles.value.content || roles.value;
      
      if (Array.isArray(rolesArray)) {
        const matchingRole = rolesArray.find(role => 
          role.roleName === props.initialData.roleName
        );
        
        if (matchingRole) {
          roleUuid.value = matchingRole.roleUuid;
          console.log('Found matching role by name:', matchingRole);
        }
      }
    }
  }
});

function handleSubmit() {
  const formData = {
    email: email.value,
  
    title: title.value,
    firstName: firstName.value,
    fatherName: fatherName.value,
    grandFatherName: grandFatherName.value,
    gender: gender.value,
    mobilePhone: mobilePhone.value,
    roleUuid: roleUuid.value
  };

  props.onSubmit(formData);
}
</script>

<template>
  <Form 
    ref="formEl"
    :inner="false" 
    class="p-6 space-y-6 bg-white" 
    id="user-form"
    @submit.prevent="handleSubmit"
  >
    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <!-- Email -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-[#75778B]">
          Email <span class="text-red-500">*</span>
        </label>
        <Input
          v-model="email"
          name="email"
          validation="required|email"
          :attributes="{
            placeholder: 'Enter user email',
            required: true
          }"
        />
      </div>

      <!-- Password -->
      <!-- <div class="space-y-2">
        <label class="block text-sm font-medium text-[#75778B]">
          Password <span v-if="!isEdit" class="text-red-500">*</span>
        </label>
        <InputPassword
          v-model="password"
          name="password"
          :validation="isEdit ? '' : 'required'"
          :attributes="{
            placeholder: 'Enter password',
            required: !isEdit,
            autocomplete: 'new-password'
          }"
        />
      </div> -->

      <!-- Title -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-[#75778B]">
          Title <span class="text-red-500">*</span>
        </label>
        <Select
          v-model="title"
          name="title"
          validation="required"
          :options="titleOptions"
          :attributes="{
            placeholder: 'Select title',
            required: true
          }"
        />
      </div>

      <!-- First Name -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-[#75778B]">
          First Name <span class="text-red-500">*</span>
        </label>
        <Input
          v-model="firstName"
          name="firstName"
          validation="required|alpha"
          :attributes="{
            placeholder: 'Enter first name',
            required: true
          }"
        />
      </div>

      <!-- Father Name -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-[#75778B]">
          Father Name <span class="text-red-500">*</span>
        </label>
        <Input
          v-model="fatherName"
          name="fatherName"
          validation="required|alpha"
          :attributes="{
            placeholder: 'Enter father name',
            required: true
          }"
        />
      </div>

      <!-- Grandfather Name -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-[#75778B]">
          Grandfather Name 
        </label>
        <Input
          v-model="grandFatherName"
          name="grandFatherName"
          :attributes="{
            placeholder: 'Enter grandfather name',
            required: true
          }"
        />
      </div>

      <!-- Gender -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-[#75778B]">
          Gender <span class="text-red-500">*</span>
        </label>
        <Select
          v-model="gender"
          name="gender"
          validation="required"
          :options="genderOptions"
          :attributes="{
            placeholder: 'Select gender',
            required: true
          }"
        />
      </div>

      <!-- Mobile Phone -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-[#75778B]">
          Mobile Phone <span class="text-red-500">*</span>
        </label>
        <Input
          v-model="mobilePhone"
          name="mobilePhone"
          validation="required|phone"
          :attributes="{
            placeholder: 'Enter mobile phone',
            required: true
          }"
        />
      </div>

      <!-- Role -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-[#75778B]">
          Role <span class="text-red-500">*</span>
        </label>
        <InputLayout>
          <select
            v-model="roleUuid"
            name="roleUuid"
            required
            :disabled="roleDisabled"
            class="custom-input"
          >
            <option value="" disabled>
              {{ roleOptions.length ? 'Select role' : 'No roles available' }}
            </option>
            <option
              v-for="option in roleOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </InputLayout>
        
        <p v-if="roleDisabled" class="mt-1 text-xs text-blue-500">
          This role is automatically assigned and cannot be changed.
        </p>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="pt-4 border-t border-[#DFDEF2] flex justify-end space-x-4">
      <button
        type="button"
        @click="onCancel"
        class="text-[#75778B] px-6 py-2 border border-[#75778B] rounded-lg hover:bg-gray-50"
        :disabled="pending"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="bg-[#02676B] hover:bg-[#014F4F] text-white px-6 py-2 rounded-lg flex items-center justify-center"
        :disabled="pending"
      >
        <span v-if="pending" class="inline-block mr-2 w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent"></span>
        {{ isEdit ? 'Update User' : 'Add User' }}
      </button>
    </div>
  </Form>
</template>

<style scoped>
/* Additional styling for the form */
:deep(.form-control) {
  @apply bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5;
}

:deep(.form-select) {
  @apply bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5;
}
</style>
