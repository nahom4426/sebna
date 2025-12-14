import { ref } from "vue";
import { defineStore } from "pinia";
import { getAllUser } from "../Api/UserApi";

export const useUserStore = defineStore("userStore", () => {
  const users = ref([]);

  function set(data) {
    users.value = data;
  }

  function getAll() {
    return users.value;
  }

  function add(data) {
    users.value.push(data); // ✅ fixed from pushing "add"
  }

  function update(id, data) {
    const idx = users.value.findIndex((el) => el.userUuid === id);
    if (idx !== -1) {
      users.value.splice(idx, 1, data);
    }
  }

  function remove(id) {
    const idx = users.value.findIndex((el) => el.userUuid === id);
    if (idx !== -1) {
      users.value.splice(idx, 1);
    }
  }

  function updateStatus(id, status) {
    const idx = users.value.findIndex((el) => el.userUuid === id);
    if (idx !== -1) {
      users.value[idx].userStatus = status;
    }
  }

  async function fetchUsers(params = {}) {
    try {
      const response = await getAllUser(params);
      if (response.success) {
        set(response.data);
      } else {
        throw new Error(response.error || "Failed to fetch users");
      }
      return response;
    } catch (error) {
      console.error("Fetch users failed:", error);
    }
  }

  return {
    users,
    set,
    getAll,
    add,
    update,
    remove,
    updateStatus,
    fetchUsers,
  };
});

// Optional alias for backward compatibility
export const useUsers = useUserStore;
