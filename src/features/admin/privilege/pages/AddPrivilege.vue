<script setup>
import PrivilegeForm from "../form/PrivilegeForm.vue";
import { useApiRequest } from "@/composables/useApiRequest";
import { usePrivilege } from "../store/privilegeStore";
import { toasted } from "@/utils/utils";
import { createPrivilege } from "../Api/PrivilegeApi";
import { useRouter } from "vue-router";
import { useForm } from "@/components/new_form_builder/useForm";
import Button from "@/components/Button.vue";
import { ref } from "vue";

const req = useApiRequest();
const privilegeStore = usePrivilege();
const router = useRouter();
const { submit } = useForm("privilegeForm");

function create({ values, reset }) {




  req.send(
    () => {
      return createPrivilege(values);
    },
    (res) => {
      if (res.success) {
        console.log(res.data?.content);
        
        privilegeStore.add(res.data?.content);
        if (reset) reset();
        
        toasted(res.success, "Privilege Created Successfully", res.error);
        router.push("/privileges");
      } else {
        toasted(false, "", res.error || "Failed to create privilege");
      }
    }
  );
}




</script>
<template>
 <div class=" bg-white p-4 rounded-xl space-y-6 box-border">
  <h1 class=" border-b font-semibold p-4">Add privilege</h1>
  <PrivilegeForm/>
  <div
    class="mt-4 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-md"
  >
    <p class="text-sm text-yellow-700">
      <strong>Note:</strong> All fields must be at least 3 characters long.
      Privilege Name and Category must be less than 50 characters.
    </p>
  </div>
  <Button
    size="md"
    class="flex justify-center w-full items-center mt-3 gap-3  box-border text-white bg-primary"
    :pending="req.pending.value"
    @click.prevent="submit(create)"
  >
    Add Privilege
  </Button>
 </div>

 
</template>
