<script setup>
import { defineProps, onMounted, onUnmounted, ref } from 'vue';
import Button from "@/components/Button.vue";
import { openModal } from '@customizer/modal-x';
import { useUsers } from "../store/userStore";
import { changeUserStatus } from "../Api/UserApi";
import { useToast } from '@/toast/store/toast';
import icons from "@/utils/icons";
import { useMobileDropdown } from "@/composables/useMobileDropdown";
import MobileDropdown from "@/components/MobileDropdown.vue";

const props = defineProps({
  rowData: {
    type: Array,
    required: true
  },
  rowKeys: {
    type: Array,
    required: true
  },
  headKeys: {
    type: Array,
    required: true
  },
  onView: {
    type: Function,
    default: () => {}
  },
  onEdit: {
    type: Function,
    default: () => {}
  },
  onActivate: {
    type: Function,
    default: () => {}
  },
  onDeactivate: {
    type: Function,
    default: () => {}
  },
  cells: {  // Add this if parent uses `cells`
    type: Array,
    default: () => [],
  },
  pending: {
    type: Boolean,
    default: false
  },
  onRowClick: { type: Function, default: () => {} },
  page: { type: Number, default: 1 },
  perPage: { type: Number, default: 25 }
});

// Compute row number based on page and perPage
const getRowNumber = (index) => {
  const displayPage = Math.max(1, props.page);
  return (displayPage - 1) * props.perPage + index + 1;
};

const { addToast } = useToast();
const usersStore = useUsers();

// Enhanced mobile dropdown
const mobileDropdown = useMobileDropdown(208, {
  animationDuration: 250,
  backdrop: true,
  closeOnScroll: false
});

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Helper function to format fullname with proper capitalization
function formatFullName(row) {
  const title = capitalizeFirstLetter(row?.title || '');
  const firstName = capitalizeFirstLetter(row?.firstName || '');
  const fatherName = capitalizeFirstLetter(row?.fatherName || '');
  const grandFatherName = capitalizeFirstLetter(row?.grandFatherName || '');
  
  return `${title} ${firstName} ${fatherName} ${grandFatherName}`.trim();
}

function getStatusStyle(status) {
  const base = "inline-flex justify-center items-center min-w-[80px] px-3 py-1 rounded text-sm font-semibold";

  switch (status?.toUpperCase()) {
    case "APPROVED":
      return `${base} bg-green-100 text-green-800`;
      case "ACTIVE":
      return `${base} bg-green-100 text-green-800`;
      case "SUBMITTED":
      return `${base} bg-yellow-100 text-yellow-800`;
        // Light green for active
    case "INACTIVE":
      return `${base} bg-red-100 text-red-800`;    // Light gray for inactive
    case "PENDING":
      return `${base} bg-yellow-100 text-yellow-800`; // Light yellow for pending
    case "ACCEPTED":
      return `${base} bg-blue-100 text-blue-800`;     // Light blue for accepted
    case "REJECTED":
      return `${base} bg-red-100 text-red-800`;       // Light red for rejected
    case "RESUBMITTED":
      return `${base} bg-purple-100 text-purple-800`;
    case "SUSPENDED":
      return `${base} bg-yellow-100 text-yellow-800`; // Light yellow for suspended
    default:
      return `${base} bg-gray-100 text-gray-800`;    // Default light gray
  }
}

function getGenderStyle(gender) {
  switch(gender?.toLowerCase()) {
    case 'male':
      return 'bg-blue-100 text-blue-800';
    case 'female':
      return 'bg-pink-100 text-pink-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function toggleDropdown(event, rowId, isMobile = false, row = null) {
  // Desktop dropdown
  if (!isMobile) {
    event.stopPropagation();
    closeAllDropdowns();
    const dropdownId = `dropdown-desktop-${rowId}`;
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) dropdown.classList.toggle('hidden');
    return;
  }
  
  // Mobile dropdown using composable
  mobileDropdown.toggle(event, rowId, row);
}

function closeAllDropdowns() {
  document.querySelectorAll('.dropdown-menu').forEach(el => {
    el.classList.add('hidden');
  });
  mobileDropdown.close();
}

// Add click event listener to close dropdowns when clicking outside
function handleClickOutside(event) {
  if (!event.target.closest('.dropdown-container')) {
    closeAllDropdowns();
  }
}

// Set up and clean up event listeners
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

function handleEditWithClose(row) {
  closeAllDropdowns();
  handleEdit(row);
}

function handleViewWithClose(rowId) {
  closeAllDropdowns();
  props.onView(rowId);
}

function handleEdit(row) {
  if (row.userUuid) {
    openModal('EditUser', { 
      userUuid: row.userUuid, 
      user: row,
      onUpdated: (updatedUser) => {
        usersStore.update(updatedUser.userUuid, updatedUser);
      }
    });
  } else if (typeof props.onEdit === 'function') {
    props.onEdit(row);
  }
}

async function handleActivateWithClose(userId) {
  closeAllDropdowns();
  try {
    const response = await changeUserStatus(userId, 'ACTIVE');
    if (response.success) {
      addToast({
        type: 'success',
        title: 'Status Updated',
        message: 'User has been activated successfully'
      });
      usersStore.update(userId, { status: 'ACTIVE' });
    } else {
      throw new Error(response.error || 'Failed to activate user');
    }
  } catch (error) {
    addToast({
      type: 'error',
      title: 'Activation Failed',
      message: error.message || 'An error occurred while activating the user'
    });
  }
}

async function handleDeactivateWithClose(userId) {
  closeAllDropdowns();
  try {
    const response = await changeUserStatus(userId, 'INACTIVE');
    if (response.success) {
      addToast({
        type: 'success',
        title: 'Status Updated',
        message: 'User has been deactivated successfully'
      });
      usersStore.update(userId, { status: 'INACTIVE' });
    } else {
      throw new Error(response.error || 'Failed to deactivate user');
    }
  } catch (error) {
    addToast({
      type: 'error',
      title: 'Deactivation Failed',
      message: error.message || 'An error occurred while deactivating the user'
    });
  }
}
function getUserType(row) {
  const hasPayer = !!row.payerUuid;
  const hasProvider = !!row.providerUuid;

  if (hasPayer && !hasProvider) return 'Payer';
  if (!hasPayer && hasProvider) return 'Provider';
  if (!hasPayer && !hasProvider) return 'Admin';
  if (hasPayer && hasProvider) return 'Payer and Provider';
}

function getTypeStyle(statusOrType) {
  switch (statusOrType) {
    case 'Payer': return 'bg-blue-100 text-blue-800';
    case 'Provider': return 'bg-green-100 text-green-800';
    case 'Admin': return 'bg-yellow-100 text-yellow-800';
    case 'Payer and Provider': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

</script>

<template>
  <template v-for="(row, idx) in rowData.filter(r => r !== null)" :key="idx">
    <!-- Desktop Table Row -->
    <tr 
      @click.self="onRowClick(row)" 
      class="hidden bg-white border-b transition-colors duration-150 ease-in-out lg:table-row hover:bg-gray-50" 
    >
      <td class="p-4 font-medium text-gray-500">{{ getRowNumber(idx) }}</td>  

      <td class="p-3 py-4" v-for="key in rowKeys" :key="key">  
        <!-- Fullname field -->
        <span v-if="key === 'fullname'" class="font-medium text-gray-700">
          {{ formatFullName(row) }}
        </span>

        <!-- Email field -->
        <span v-else-if="key === 'email'" class="text-gray-600">
          {{ row?.email }}
        </span>

        <!-- Mobile Phone field -->
        <span v-else-if="key === 'mobilePhone'" class="text-gray-600">
          {{ row.mobilePhone }}
        </span>

        <!-- Role Name field -->
        <span v-else-if="key === 'roleName'" class="text-gray-700">
          <span class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-blue-800 bg-blue-100 rounded-md">
            {{ capitalizeFirstLetter(row.roleName) }}
          </span>
        </span>

        <!-- Gender field -->
        <span v-else-if="key === 'gender'" class="text-gray-700">
          <span class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-md"
                :class="getGenderStyle(row.gender)">
            {{ capitalizeFirstLetter(row.gender) }}
          </span>
        </span>
        <div v-else-if="key === 'status'" class="truncate">  
          <span 
            class="px-2.5 py-1 text-xs font-medium rounded-full"
            :class="getStatusStyle(row.status)"
          >
            {{ row.userStatus }}
          </span>
        </div>
        <!-- Status field -->
        <div v-else-if="key === 'userType'" class="truncate">
          <span 
            class="px-2.5 py-1 text-xs font-medium rounded-full"
            :class="getTypeStyle(getUserType(row))"
          >
            {{ getUserType(row) }}
          </span>
        </div>

        <!-- Default field rendering with capitalization -->
        <span v-else class="text-gray-700">
          {{ typeof row[key] === 'string' ? capitalizeFirstLetter(row[key]) : row[key] }}
        </span>
      </td>  

      <td class="relative p-3" v-if="headKeys.includes('Actions') || headKeys.includes('actions')">  
    <div class="flex gap-3 items-center">

  <!-- EDIT (Gray 3D) -->
  <button
    @click="handleEditWithClose(row)"
    class="flex gap-2 items-center px-4 py-2 rounded-lg border border-gray-300 bg-gray-50
           shadow-[0_3px_0_0_#bfbfbf]
           active:shadow-[0_1px_0_0_#bfbfbf] active:translate-y-[2px]
           transition text-gray-700 text-sm font-medium"
  >
    <i v-html="icons.edits" class="text-gray-600"></i>
    <span>Edit</span>
  </button>

  <!-- DETAIL (Light Blue 3D) -->
  <!-- <button
    @click="handleViewWithClose(row.userUuid || row.id)"
    class="flex gap-2 items-center px-4 py-2 rounded-lg border border-blue-300 bg-blue-50 text-blue-700
           shadow-[0_3px_0_0_#93c5fd]
           active:shadow-[0_1px_0_0_#93c5fd] active:translate-y-[2px]
           transition text-sm font-medium"
  >
    <i v-html="icons.details" class="text-blue-600"></i>
    <span>Detail</span>
  </button> -->

  <!-- ACTIVATE / DEACTIVATE -->
  <button
    v-if="row.userStatus === 'INACTIVE' || row.userStatus === 'Inactive'"
    @click="handleActivateWithClose(row.userUuid || row.id)"
    class="flex gap-2 items-center px-4 py-2 rounded-lg border border-green-300 bg-green-50 text-green-700
           shadow-[0_3px_0_0_#c7f0c7]
           active:shadow-[0_1px_0_0_#c7f0c7] active:translate-y-[2px]
           transition text-sm font-medium"
  >
    <i v-html="icons.activate" class="text-green-600"></i>
    <span>Activate</span>
  </button>

  <button
    v-if="row.userStatus === 'ACTIVE' || row.userStatus === 'Active'"
    @click="handleDeactivateWithClose(row.userUuid || row.id)"
    class="flex gap-2 items-center px-4 py-2 rounded-lg border border-red-300 bg-red-50 text-red-700
           shadow-[0_3px_0_0_#f2b0b0]
           active:shadow-[0_1px_0_0_#f2b0b0] active:translate-y-[2px]
           transition text-sm font-medium"
  >
    <i v-html="icons.deactivate" class="text-red-600"></i>
    <span>Deactivate</span>
  </button>

</div>

      </td>
    </tr>

    <!-- Mobile Card View (hidden on desktop) -->
    <div 
      class="block relative p-4 mb-3 bg-white rounded-xl border border-gray-100 shadow-sm transition-all duration-200 lg:hidden hover:shadow-md"
      @click="onRowClick(row)"
      style="overflow: visible;"
    >
      <div class="space-y-3">
        <!-- Key fields -->
        <div 
          v-for="(key, keyIndex) in rowKeys.slice(0, 5)" 
          :key="keyIndex" 
          class="flex gap-3 justify-between items-start"
        >
          <span class="flex-shrink-0 text-xs font-semibold tracking-wide text-gray-500 uppercase">
            {{ headKeys[keyIndex] || key }}
          </span>
          <span class="flex-1 min-w-0 text-sm font-medium text-right text-gray-900">
            <!-- Fullname -->
            <template v-if="key === 'fullname'">
              <span class="block font-medium truncate">{{ formatFullName(row) }}</span>
            </template>
            <!-- Email -->
            <template v-else-if="key === 'email'">
              <span class="block truncate">{{ row?.email }}</span>
            </template>
            <!-- Mobile Phone -->
            <template v-else-if="key === 'mobilePhone'">
              <span class="block truncate">{{ row.mobilePhone }}</span>
            </template>
            <!-- User Type -->
            <template v-else-if="key === 'userType'">
              <span 
                class="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full"
                :class="getTypeStyle(getUserType(row))"
              >
                {{ getUserType(row) }}
              </span>
            </template>
            <!-- Role Name -->
            <template v-else-if="key === 'roleName'">
              <span class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-blue-800 bg-blue-100 rounded-md">
                {{ capitalizeFirstLetter(row.roleName) }}
              </span>
            </template>
            <!-- Gender -->
            <template v-else-if="key === 'gender'">
              <span 
                class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-md"
                :class="getGenderStyle(row.gender)"
              >
                {{ capitalizeFirstLetter(row.gender) }}
              </span>
            </template>
            <!-- Status -->
            <template v-else-if="key === 'status'">
              <span 
                class="inline-flex justify-center items-center min-w-[80px] px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm"
                :class="getStatusStyle(row.status)"
              >
                {{ row.userStatus }}
              </span>
            </template>
            <!-- Default -->
            <template v-else>
              <span class="block truncate">
                {{ typeof row[key] === 'string' ? capitalizeFirstLetter(row[key]) : row[key] }}
              </span>
            </template>
          </span>
        </div>

        <!-- Mobile Actions -->
        <div class="pt-3 border-t border-gray-100">
          <div class="flex justify-end">
            <div class="relative" style="position: relative; z-index: 10;">
              <button 
                @click.stop="toggleDropdown($event, row.userUuid || row.id, true, row)"
                class="flex justify-center items-center w-10 h-10 bg-white rounded-lg border border-gray-200 shadow-sm transition-colors duration-200 hover:bg-gray-50"
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>

            </div>
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
        @click="handleEditWithClose(row); close()"
        class="flex gap-3 items-center px-4 py-3 w-full text-sm text-gray-700 dropdown-item"
      >
        <i v-html="icons.edits" class="dropdown-item-icon" />
        <span>Edit</span>
      </button>
      
      <button
        @click="handleViewWithClose(row.userUuid || row.id); close()"
        class="flex gap-3 items-center px-4 py-3 w-full text-sm text-gray-700 dropdown-item"
      >
        <i v-html="icons.details" class="dropdown-item-icon" />
        <span>Detail</span>
      </button>
      
      <template v-if="row?.userStatus">
        <button
          v-if="row.userStatus === 'INACTIVE' || row.userStatus === 'Inactive'"
          @click="handleActivateWithClose(row.userUuid || row.id); close()"
          class="flex gap-3 items-center px-4 py-3 w-full text-sm text-green-600 dropdown-item success"
        >
          <i v-html="icons.activate" class="dropdown-item-icon" />
          <span>Activate</span>
        </button>
       
        <button
          v-if="row.userStatus === 'ACTIVE' || row.userStatus === 'Active'"
          @click="handleDeactivateWithClose(row.userUuid || row.id); close()"
          class="flex gap-3 items-center px-4 py-3 w-full text-sm text-red-600 dropdown-item danger"
        >
          <i v-html="icons.deactivate" class="dropdown-item-icon" />
          <span>Deactivate</span>
        </button>
      </template>
    </template>
  </MobileDropdown>
</template>

<style scoped>
.dropdown-container {
  position: relative;
  display: inline-block;
}

.dropdown-menu {
  min-width: 180px;
  position: absolute;
  z-index: 9999;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top right;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.dropdown-item {
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-item:hover {
  transform: translateX(2px);
}

.dropdown-item-icon {
  width: 16px;
  height: 16px;
  opacity: 0.7;
}

.dropdown-item:hover .dropdown-item-icon {
  opacity: 1;
}

.dropdown-container button {
  position: relative;
  z-index: 1;
}

/* Ensure table cells allow overflow for dropdowns */
tbody tr {
  position: relative;
}

tbody td {
  overflow: visible;
}

/* Ensure table allows overflow */
table {
  overflow: visible;
}

/* Desktop dropdown specific styles */
.dropdown-menu:not(.hidden) {
  display: block !important;
}

.dropdown-menu.hidden {
  opacity: 0;
  transform: scale(0.95);
  pointer-events: none;
}

/* Hide desktop dropdown on mobile */
@media (max-width: 1023px) {
  .dropdown-menu {
    display: none !important;
  }
}
</style>