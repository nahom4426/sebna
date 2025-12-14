<script setup>
import { ref, watch } from 'vue';
import Input from '@/components/new_form_elements/Input.vue';
import Textarea from '@/components/new_form_elements/Textarea.vue';
import Form from '@/components/new_form_builder/Form.vue';
import SelectPrivilegeInput from '../components/SelectPrivilegeInput.vue';

const props = defineProps({
  roles: {
    type: Object,
  },
  privileges: {
    type: Array,
    required: true,
  },
  selectedPrivilege: {
    type: Array,
    default: () => [],
  },
});

const selectedPrivileges = ref(props.selectedPrivilege);

watch(
  () => props.selectedPrivilege,
  (newVal) => {
    selectedPrivileges.value = newVal;
  },
  { immediate: true }
);
</script>

<template>
  <Form
    v-if="roles"
    class="grid grid-cols-3 gap-4 p-6"
    :inner="false"
    id="roleForm"
  >
    <Input
      name="roleName"
      validation="required"
      label="Role Name"
      :modelValue="roles.roleName"
      :attributes="{
        placeholder: 'Enter Role Name',
      }"
    />

    <Textarea
      name="roleDescription"
      validation="required"
      label="Role Description"
      :modelValue="roles.roleDescription"
      :attributes="{
        placeholder: 'Enter Role Description',
      }"
    />

    <div class="col-span-3">
      <SelectPrivilegeInput
        label="Select Privileges"
        validation="required"
        name="privilegeUuid"
        :options="privileges"
        :selectedPrivilege="selectedPrivileges"
      />
    </div>
  </Form>
</template>

<style scoped>
/* Form styling */
</style>