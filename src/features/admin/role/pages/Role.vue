<script setup>
import Button from '@/components/Button.vue';
import DefaultPage from '@/components/DefaultPage.vue';
import Dropdown from '@/components/Dropdown.vue';
import Table from '@/components/Table.vue';
// import TableRowSkeleton from '@/skeletons/TableRowSkeleton.vue';
import { ref } from 'vue';
import icons from '@/utils/icons';
import RolesDataProvider from '../components/RolesDataProvider.vue';
import RoleRow from '../components/RoleRow.vue';
import TableRowSkeleton from '@/components/TableRowSkeleton.vue';
</script>

<template>
  <DefaultPage placeholder="Search Roles">
    <template #add-action>
      <div class="flex gap-2 justify-end items-center">
        <Button
          @click="$router.push('/create-role')"
          type="primary"
          class="flex gap-2 items-center"
        >
          <i v-html="icons.plus" />
          Add Roles
        </Button>
      </div>
    </template>
    <template v-slot="{ search }">
      <RolesDataProvider :search="search" v-slot="{ roles, pending }">
        <!-- Mobile cards -->
        <div class="grid gap-3 p-2 md:hidden">
          <div
            v-for="row in roles"
            :key="row.roleUuid"
            class="p-4 bg-white rounded-lg border shadow-sm"
          >
            <div class="text-xs text-slate-500">Role Name</div>
            <div class="font-semibold text-slate-900">{{ row.roleName }}</div>
            <div class="mt-2 text-xs text-slate-500">Role Description</div>
            <div class="text-slate-800">{{ row.roleDescription || '-' }}</div>

            <div class="mt-3 text-xs text-slate-500">Privileges</div>
            <div class="flex gap-2 items-center mt-1">
              <span class="inline-flex gap-1 items-center px-2 py-0.5 text-xs font-semibold text-indigo-700 bg-indigo-50 rounded-full border border-indigo-200">
                {{ Array.isArray(row.privileges) ? row.privileges.length : 0 }}
              </span>
            </div>

            <div class="flex justify-end mt-4">
              <button
                class="px-3 py-1.5 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                @click="$router.push(`/edit_role/${row.roleUuid}`)"
              >Edit</button>
            </div>
          </div>
          <div v-if="!pending && !(roles?.length)" class="px-2 text-sm text-slate-500">No roles found.</div>
        </div>

        <!-- Desktop table -->
        <div class="hidden md:block">
          <Table
            :pending="pending"
            :headers="{
              head: ['Role Name', 'Role Description', 'Privileges', 'Actions'],
              row: ['roleName', 'roleDescription', 'privilegeList'],
            }"
            :Fallback="TableRowSkeleton"
            :rows="roles"
            :rowCom="RoleRow"
          >
          </Table>
        </div>
      </RolesDataProvider>
    </template>
  </DefaultPage>
</template>
