<script setup>
import { useRouter } from 'vue-router'
import { defineProps } from 'vue';
import { openModal } from '@customizer/modal-x';
import icons from '@/utils/icons';
import { useMobileDropdown } from '@/composables/useMobileDropdown';
import MobileDropdown from '@/components/MobileDropdown.vue';

const router = useRouter()

// Enhanced mobile dropdown
const mobileDropdown = useMobileDropdown(208, {
  animationDuration: 250,
  backdrop: true,
  closeOnScroll: false
});

const props = defineProps({
  rowData: { type: Array, required: true, default: () => [] },
  rowKeys: { type: Array, required: true, default: () => ['privilegeName', 'privilegeDescription', 'privilegeCategory', 'privilegeType'] },
  headKeys: { type: Array, required: false, default: () => ['#', 'Privilege Name', 'Description', 'Category', 'Type', 'Actions'] },
  onRowClick: { type: Function, default: () => {} },
  page: { type: Number, default: 1 },
  perPage: { type: Number, default: 25 }
});

// Compute row number based on page and perPage
const getRowNumber = (index) => {
  const displayPage = Math.max(1, props.page);
  return (displayPage - 1) * props.perPage + index + 1;
};

function handleEdit(row) {
  router.push(`/edit_privilege/${row.privilegeUuid}`)
}

function toggleDropdown(event, rowId, row) {
  // For mobile, use the modern dropdown
  if (window.innerWidth < 1024) {
    mobileDropdown.toggle(event, rowId, row);
  }
}

function getTypeBadgeClass(type) {
  const map = {
    FOR_ALL: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-300',
    FOR_SYSTEM_ADMIN: 'bg-gradient-to-r from-purple-500 to-violet-600 text-white border-purple-300',
    FOR_PAYER: 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-blue-300',
    FOR_PROVIDER: 'bg-gradient-to-r from-orange-500 to-amber-600 text-white border-orange-300',
  }
  return map[type] || 'bg-gradient-to-r from-slate-400 to-slate-600 text-white border-slate-300'
}

function getTypeLabel(type) {
  const map = {
    FOR_ALL: 'All',
    FOR_SYSTEM_ADMIN: 'Admin',
    FOR_PAYER: 'Payer',
    FOR_PROVIDER: 'Provider',
  }
  return map[type] || type
}

function getCategoryBadgeClass(category) {
  const map = {
    'credit invoice': 'bg-orange-50 text-orange-700 border-orange-200',
    claim: 'bg-blue-50 text-blue-700 border-blue-200',
    system: 'bg-purple-50 text-purple-700 border-purple-200',
    kenema: 'bg-teal-50 text-teal-700 border-teal-200',
    services: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  }
  return map[(category || '').toLowerCase()] || 'bg-slate-50 text-slate-700 border-slate-200'
}
</script>

<template>
  <tr
    v-for="(row, idx) in rowData"
    :key="row?.privilegeUuid || idx"
    @click.self="onRowClick(row)"
    class="bg-white border-b transition-colors duration-150 ease-in-out hover:bg-gray-50"
  >
    <td class="p-4 font-medium text-gray-500">{{ getRowNumber(idx) }}</td>

    <td v-for="key in rowKeys" :key="key" class="p-3 py-4 align-top">
      <template v-if="key === 'privilegeType'">
        <span :class="`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border shadow-sm ${getTypeBadgeClass(row[key])}`">
          {{ getTypeLabel(row[key]) }}
        </span>
      </template>
      <template v-else-if="key === 'privilegeCategory'">
        <span :class="`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryBadgeClass(row[key])}`">
          {{ row[key] }}
        </span>
      </template>
      <template v-else>
        <span class="text-gray-800">{{ row[key] || '—' }}</span>
      </template>
    </td>

    <td class="p-3">
      <!-- Desktop Actions -->
      <div class="hidden flex-wrap gap-2 justify-start items-center lg:flex">
        <button
          class="flex justify-center items-center w-9 h-9 text-white bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full shadow-md transition-all duration-200 hover:opacity-90"
          @click.stop="handleEdit(row)"
          title="Edit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
          </svg>
        </button>
      </div>
      
      <!-- Mobile Actions -->
      <div class="flex justify-end lg:hidden">
        <button
          @click.stop="toggleDropdown($event, row.privilegeUuid, row)"
          class="flex justify-center items-center w-9 h-9 bg-white rounded-full border border-gray-200 shadow-sm transition-colors duration-200 hover:bg-gray-50"
          title="Actions"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>
    </td>
  </tr>
  
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
        class="flex gap-3 items-center px-4 py-3 w-full text-sm text-blue-600 dropdown-item"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 dropdown-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 20h9"/>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
        </svg>
        <span>Edit Privilege</span>
      </button>
    </template>
  </MobileDropdown>
</template>
