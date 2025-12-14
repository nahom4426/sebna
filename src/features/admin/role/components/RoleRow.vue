<script setup>
import {  defineProps } from 'vue';
import { openModal } from '@customizer/modal-x';
import icons from '@/utils/icons';
import { useMobileDropdown } from '@/composables/useMobileDropdown';
import MobileDropdown from '@/components/MobileDropdown.vue';
import { useRouter } from 'vue-router';

const router = useRouter()

// Enhanced mobile dropdown
const mobileDropdown = useMobileDropdown(208, {
  animationDuration: 250,
  backdrop: true,
  closeOnScroll: false
});

const props = defineProps({
  rowData: { type: Array, required: true, default: () => [] },
  rowKeys: { type: Array, required: true, default: () => ['roleName', 'roleDescription', 'privilegeList'] },
  headKeys: { type: Array, required: false, default: () => ['#', 'Role Name', 'Role Description', 'Privileges', 'Actions'] },
  onRowClick: { type: Function, default: () => {} },
  page: { type: Number, default: 1 },
  perPage: { type: Number, default: 25 }
});

// Compute row number based on page and perPage
const getRowNumber = (index) => {
  const displayPage = Math.max(1, props.page);
  return (displayPage - 1) * props.perPage + index + 1;
};

function privilegeBadgeClass() {
  return 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow border border-violet-400'
}

function handleEdit(row) {
  router.push(`/edit_role/${row.roleUuid}`)
}

function toggleDropdown(event, rowId, row) {
  // For mobile, use the modern dropdown
  if (window.innerWidth < 1024) {
    mobileDropdown.toggle(event, rowId, row);
  }
}
</script>

<template>
  <template v-for="(row, idx) in rowData" :key="row?.roleUuid || idx">
    <!-- Desktop Table Row -->
    <tr
      @click.self="onRowClick(row)"
      class="hidden bg-white border-b transition-colors duration-150 ease-in-out lg:table-row hover:bg-gray-50"
    >
    <td class="p-4 font-medium text-gray-500">{{ getRowNumber(idx) }}</td>

    <td v-for="key in rowKeys" :key="key" class="p-3 py-4 align-top">
      <template v-if="key === 'privilegeList'">
        <div class="inline-block relative group">
          <span :class="privilegeBadgeClass()" :title="`Total privileges: ${row.privilegeList?.length || 0}`">
            {{ row.privilegeList?.length || 0 }}
          </span>
          <div class="absolute z-20 hidden group-hover:block w-72 max-w-[20rem] bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-left mt-2">
            <div class="mb-2 text-xs font-semibold text-gray-700">Privileges ({{ row.privilegeList?.length || 0 }})</div>
            <ul class="overflow-auto max-h-56 divide-y divide-gray-100">
              <li v-for="(p, i) in row.privilegeList || []" :key="p.privilegeUuid || i" class="py-1.5">
                <div class="text-xs text-gray-900 truncate" :title="p.privilegeName">{{ p.privilegeName }}</div>
                <div class="text-[11px] text-gray-500 truncate" :title="p.privilegeDescription">{{ p.privilegeDescription }}</div>
              </li>
            </ul>
          </div>
        </div>
      </template>
      <template v-else>
        <span class="text-gray-800">{{ row[key] || '—' }}</span>
      </template>
    </td>

    <td class="p-3">
      <div class="flex flex-wrap gap-2 justify-start items-center">
        <button
          class="flex justify-center items-center w-9 h-9 text-white bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full shadow-md hover:opacity-90"
          @click.stop="handleEdit(row)"
          title="Edit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
          </svg>
        </button>
      </div>
    </td>
  </tr>

  <!-- Mobile Card View -->
  <div 
    class="block relative p-4 mb-3 bg-white rounded-xl border border-gray-100 shadow-sm transition-all duration-200 lg:hidden hover:shadow-md"
    @click="onRowClick(row)"
  >
    <div class="space-y-3">
      <!-- Key fields -->
      <div 
        v-for="(key, keyIndex) in rowKeys" 
        :key="keyIndex" 
        class="flex gap-3 justify-between items-start"
      >
        <span class="flex-shrink-0 text-xs font-semibold tracking-wide text-gray-500 uppercase">
          {{ headKeys[keyIndex + 1] || key }}
        </span>
        <span class="flex-1 min-w-0 text-sm font-medium text-right text-gray-900">
          <template v-if="key === 'privilegeList'">
            <span :class="privilegeBadgeClass()" :title="`Total privileges: ${row.privilegeList?.length || 0}`">
              {{ row.privilegeList?.length || 0 }}
            </span>
          </template>
          <template v-else>
            <span class="block truncate">{{ row[key] || '—' }}</span>
          </template>
        </span>
      </div>

      <!-- Mobile Actions -->
      <div class="pt-3 border-t border-gray-100">
        <div class="flex justify-end">
          <button
            @click.stop="toggleDropdown($event, row.roleUuid, row)"
            class="flex justify-center items-center w-10 h-10 bg-white rounded-lg border border-gray-200 shadow-sm transition-colors duration-200 hover:bg-gray-50"
            title="Actions"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
  </template>
  
  <!-- Enhanced Mobile Dropdown -->
  <MobileDropdown
    :is-visible="mobileDropdown.activeId.value !== null"
    :style="mobileDropdown.style.value"
    :active-row="mobileDropdown.activeRow.value"
    :close="mobileDropdown.close"
  >
    <template #default="{ row, close }">
      <button
        @click="handleEdit(row); close()"
        class="dropdown-item flex items-center gap-3 w-full px-4 py-3 text-sm text-blue-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="dropdown-item-icon w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 20h9"/>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
        </svg>
        <span>Edit Role</span>
      </button>
    </template>
  </MobileDropdown>
</template>
