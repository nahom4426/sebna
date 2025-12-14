<script setup>
import InputParent from '@/components/new_form_builder/InputParent.vue';
import InputError from '@/components/new_form_elements/InputError.vue';
import { computed, ref, watch } from 'vue';

const props = defineProps({
  label: String,
  value: String,
  options: {
    type: Array,
    required: true,
  },
  selectedPrivilege: {
    type: Array,
  },
  validation: String,
  name: String,
});

const selected = ref([]);

const group = computed(() => {
  return props?.options.reduce((state, el) => {
    const category = el.privilegeCategory || 'Other';
    if (state[category]) {
      state[category].push(el);
    } else {
      state[category] = [el];
    }
    return state;
  }, {});
});

const totalCount = computed(() => props.options?.length || 0);
const selectedCount = computed(() => selected.value.length);

function categoryClasses(category) {
  const map = {
    user: 'from-sky-500 to-blue-600 border-blue-300',
    student: 'from-emerald-500 to-teal-600 border-emerald-300',
    university: 'from-amber-500 to-orange-600 border-amber-300',
    contract: 'from-fuchsia-500 to-pink-600 border-pink-300',
    program: 'from-indigo-500 to-blue-600 border-indigo-300',
    document: 'from-cyan-500 to-sky-600 border-cyan-300',
    privilege: 'from-purple-500 to-violet-600 border-violet-300',
    role: 'from-rose-500 to-red-600 border-rose-300',
    services: 'from-teal-500 to-emerald-600 border-teal-300',
    'credit invoice': 'from-orange-500 to-amber-600 border-orange-300',
  };
  return map[(category || '').toLowerCase()] || 'from-slate-400 to-slate-600 border-slate-300';
}

function categoryTextClass(category) {
  const map = {
    user: 'text-blue-700',
    student: 'text-emerald-700',
    university: 'text-orange-700',
    contract: 'text-pink-700',
    program: 'text-indigo-700',
    document: 'text-cyan-700',
    privilege: 'text-violet-700',
    role: 'text-rose-700',
    services: 'text-teal-700',
    'credit invoice': 'text-orange-700',
  };
  return map[(category || '').toLowerCase()] || 'text-slate-700';
}

function categoryBorderClass(category) {
  const map = {
    user: 'border-l-4 border-blue-400',
    student: 'border-l-4 border-emerald-400',
    university: 'border-l-4 border-amber-400',
    contract: 'border-l-4 border-pink-400',
    program: 'border-l-4 border-indigo-400',
    document: 'border-l-4 border-cyan-400',
    privilege: 'border-l-4 border-violet-400',
    role: 'border-l-4 border-rose-400',
    services: 'border-l-4 border-teal-400',
    'credit invoice': 'border-l-4 border-orange-400',
  };
  return map[(category || '').toLowerCase()] || 'border-l-4 border-slate-300';
}

watch(
  () => props.selectedPrivilege,
  (newPrivileges) => {
    if (!Array.isArray(newPrivileges)) {
      selected.value = [];
      return;
    }
    selected.value = [];
    newPrivileges.forEach((el) => {
      if (typeof el === 'string') {
        selected.value.push(el);
      } else if (el && el.privilegeUuid) {
        selected.value.push(el.privilegeUuid);
      }
    });
  },
  { immediate: true, deep: true }
);

function toggle(id) {
  if (!selected.value.includes(id)) {
    selected.value.push(id);
  } else {
    const idx = selected.value.findIndex((el) => el == id);
    idx > -1 && selected.value.splice(idx, 1);
  }
}

const isChecked = computed(() => {
  return (id) => selected.value.includes(id);
});

const isAllChecked = computed(() => {
  return (category) =>
    group.value[category].every((el) =>
      selected.value.includes(el.privilegeUuid)
    );
});

function selectAll(checked, category) {
  const ids = group.value[category].map((el) => el.privilegeUuid);
  selected.value = selected.value.filter((el) => !ids.includes(el));
  if (checked) {
    selected.value = [...selected.value, ...ids];
  }
}
</script>

<template>
  <InputParent
    :validation="validation"
    :name="name"
    v-model="selected"
    v-slot="{ setRef, error }"
  >
    <div :ref="setRef" class="flex flex-col gap-3">
      <!-- Header with badges -->
      <div class="flex items-center justify-between gap-2 border-b py-2">
        <div class="flex items-center gap-3">
          <span
            :data-required="`${validation}`.includes('required') ? 'true' : 'false'"
            :title="label"
            class="text-sm capitalize px-1 truncate"
            v-if="label"
          >{{ label }}</span>
          <InputError :error="error" />
        </div>

        <div class="flex items-center gap-2">
          <!-- Total badge with hover breakdown by category -->
          <div class="relative group">
            <span class="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold bg-white text-slate-700">
              Total: {{ totalCount }}
            </span>
            <div class="absolute z-20 hidden group-hover:block right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-left">
              <div class="text-xs font-semibold text-gray-700 mb-2">By Category</div>
              <ul class="max-h-60 overflow-auto space-y-1">
                <li v-for="cat in Object.keys(group)" :key="cat" class="flex items-center justify-between text-xs">
                  <span class="truncate">{{ cat }}</span>
                  <span class="text-gray-600">{{ group[cat].length }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Selected badge -->
          <span class="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold bg-blue-50 text-blue-700 border-blue-200">
            Selected: {{ selectedCount }}
          </span>
        </div>
      </div>

      <!-- Category sections -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div v-for="category in Object.keys(group)" :key="category" :class="`rounded-xl border border-white/70 shadow-sm bg-white/80 backdrop-blur ${categoryBorderClass(category)}`">
          <div class="flex items-center justify-between px-3 py-2 border-b">
            <div class="flex items-center gap-2">
              <input
                :checked="isAllChecked(category)"
                @click="(ev) => selectAll(ev.target.checked, category)"
                class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                type="checkbox"
                :aria-label="`Select all in ${category}`"
              />
              <p class="font-semibold text-sm capitalize" :class="categoryTextClass(category)">{{ category }}</p>
            </div>
            <span :class="`inline-flex items-center text-[10px] font-semibold text-white rounded-full px-2 py-0.5 border bg-gradient-to-r ${categoryClasses(category)}`">
              {{ group[category].length }}
            </span>
          </div>

          <div class="p-3 space-y-2 max-h-56 overflow-auto">
            <label
              v-for="privilege in group[category]"
              :key="privilege.privilegeUuid"
              class="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 rounded px-1 py-0.5"
            >
              <input
                :checked="isChecked(privilege.privilegeUuid)"
                @click="toggle(privilege.privilegeUuid)"
                class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                type="checkbox"
                :aria-label="`Select ${privilege.privilegeName}`"
              />
              <span class="text-xs truncate" :title="privilege.privilegeName">{{ privilege.privilegeName }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </InputParent>
</template>
