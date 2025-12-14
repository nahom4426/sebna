import { ref } from "vue";

const roles = ref([]);

function useRolesWithoutPinia() {
  function set(data) {
    roles.value = data;
  }

  function getAll() {
    return roles.value;
  }

  function update(id, data) {
    const idx = roles.value.findIndex((el) => el.roleUuid == id);
    if (idx == -1) return;

    roles.value.splice(idx, 1, data);
  }

  // function updateStatus(id, status) {
  //   const idx = roles.value.findIndex((el) => el.roleUuid == id);
  //   if (idx == -1) return;

  //   roles.value[idx].roleStatus = status;
  // }

  return {
    roles,
    getAll,
    update,
    // updateStatus,
    set,
  };
}

export { useRolesWithoutPinia };
