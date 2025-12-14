import { ref } from 'vue'
import { defineStore } from 'pinia'

function* getId() {
  let id = 0;
  while (true) { 
    yield `${++id}`
  }
}

const id = getId()

export const useToast = defineStore('toast', () => {

  const toasts = ref([])

  function addToast(toast) {
    toasts.value.push({ id: id.next().value, toast })
  }

  function removeToast(id) {
    console.log(id, {...toasts.value})
    toasts.value.splice(toasts.value.findIndex(el => el.id == id), 1)
    
  }

  return { toasts, addToast, removeToast }
})
