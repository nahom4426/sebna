<script setup>
import Button from '@/components/Button.vue';
import DefaultPage from '@/components/DefaultPage.vue';
import Table from '@/components/Table.vue';
import TableRowSkeleton from '@/components/TableRowSkeleton.vue';
import { ref, onMounted } from 'vue';
import icons from '@/utils/icons';
import PrivilegesDataProvider from '../components/PrivilegesDataProvider.vue';
import PrivilegeRow from '../components/PrivilegeRow.vue';

const dataProvider = ref();

// Force refresh when component mounts
onMounted(() => {
  if (dataProvider.value && dataProvider.value.refresh) {
    dataProvider.value.refresh();
  }
});
</script>

<template>
  <DefaultPage placeholder="Search Privileges">
    <template #add-action>
      <div class="flex gap-2 justify-end items-center">
        <Button
          @click="$router.push('/add_privilege')"
          type="primary"
          class="flex gap-2 items-center"
        >
          <i v-html="icons.plus" />
          Add Privilege
        </Button>
      </div>
    </template>
    <template v-slot="{ search }">
      <PrivilegesDataProvider ref="dataProvider" :search="search" v-slot="{ privileges, pending }">
        <!-- Mobile cards -->
        <div class="grid gap-3 p-2 md:hidden">
          <div
            v-for="row in privileges"
            :key="row.privilegeUuid"
            class="p-4 bg-white rounded-lg border shadow-sm"
          >
            <div class="text-xs text-slate-500">Privilege Name</div>
            <div class="font-semibold text-slate-900">{{ row.privilegeName }}</div>
            <div class="mt-2 text-xs text-slate-500">Description</div>
            <div class="text-slate-800">{{ row.privilegeDescription || '-' }}</div>

            <div class="mt-3 text-xs text-slate-500">Category</div>
            <div class="mt-1">
              <span class="inline-flex gap-1 items-center px-2 py-0.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded-full border border-blue-200">
                {{ row.privilegeCategory }}
              </span>
            </div>

            <div class="mt-3 text-xs text-slate-500">Type</div>
            <div class="mt-1">
              <span class="inline-flex gap-1 items-center px-2 py-0.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-500 to-violet-600 rounded-full border border-purple-300">
                {{ row.privilegeType }}
              </span>
            </div>

            <div class="flex justify-end mt-4">
              <button
                class="px-3 py-1.5 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                @click="$router.push(`/edit_privilege/${row?.privilegeUuid}`)"
              >Edit</button>
            </div>
          </div>
          <div v-if="!pending && !(privileges?.length)" class="px-2 text-sm text-slate-500">No privileges found.</div>
        </div>

        <!-- Desktop table -->
        <div class="hidden md:block">
          <Table
            :pending="pending"
            :headers="{
              head: ['Privilege Name', 'Description', 'Category', 'Type', 'Actions'],
              row: ['privilegeName', 'privilegeDescription', 'privilegeCategory', 'privilegeType'],
            }"
            :Fallback="TableRowSkeleton"
            :rows="privileges"
            :rowCom="PrivilegeRow"
          >
          </Table>
        </div>
      </PrivilegesDataProvider>
    </template>
  </DefaultPage>
</template>
