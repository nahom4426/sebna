import { ref } from "vue";
import { defineStore } from "pinia";

export const usePrivilege = defineStore("Privilegestore", () => {
  const privilege = ref([]);

  function set(data) {
    privilege.value = data;
  }

  function getAll() {
    return privilege.value;
  }

  function update(id, data) {
    const idx = privilege.value.findIndex((el) => el.privilegeUuid == id);
    if (idx == -1) return;

    privilege.value.splice(idx, 1, data);
  }

  function remove(id) {
    const idx = privilege.value.findIndex((el) => el.privilegeUuid == id);
    if (idx == -1) return;

    privilege.value.splice(idx, 1);
  }
  function add(data) {
    console.log(data);
    
    privilege.value.push(data);
  }

  // function updateStatus(id, status) {
  //   const idx = roles.value.findIndex((el) => el.roleUuid == id);
  //   if (idx == -1) return;

  //   roles.value[idx].roleStatus = status;
  // }

  return {
    privilege,
    getAll,
    update,
    remove,
    add,
    // updateStatus,
    set,
  };
});
