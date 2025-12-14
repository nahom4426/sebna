<script setup>
import { ref } from "vue";
import Table from "@/components/Table.vue";
import TableRowSkeleton from "@/components/TableRowSkeleton.vue";
import DefaultPage from "@/components/DefaultPage.vue";
import icons from "@/utils/icons";
import UserStatusRow from "../components/statusrow.vue";
import UsersDataProvider from "../components/UsersDataProvider.vue";
import { openModal } from "@customizer/modal-x";
const search = ref('');
</script>

<template>
  <DefaultPage v-model="search" placeholder="Search Users">
    <template #add-action>
      <button
        class="flex gap-2 justify-center items-center px-6 py-4 text-white rounded-md bg-primary"
        @click.prevent="openModal('AddUser')"
      >
        <i v-html="icons.plus_circle"></i>
        Add User
      </button>
    </template>

    <template #default="{ search }">
      <UsersDataProvider :search="search" v-slot="{ users, pending, refresh }">
        <Table
          :pending="pending"
          :headers="{
            head: [
              'Fullname',
              'Email',
              'Mobile Phone',
              'User Type',
              'Role Name',
              'Gender',
              'Status',
              'Actions',
            ],
            row: [
              'fullname',
              'email',
              'mobilePhone',
              'userType',
              'roleName',
              'gender',
              'status',
            ],
          }"
          :rows="users"
          :rowCom="UserStatusRow"
          :Fallback="TableRowSkeleton"
        />
      </UsersDataProvider>
    </template>
  </DefaultPage>
</template>
