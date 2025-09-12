import { reactive, toRefs } from 'vue'
import { checklistsApi, type Checklist, type ChecklistTemplate, type Task, type Subtask, type Paginated } from '../api/checklists'

type ChecklistsState = {
  templates: ChecklistTemplate[]
  list: Paginated<Checklist> | null
  current: (Checklist & { tasks: Task[] }) | null
  loading: boolean
  error: string | null
}

const state = reactive<ChecklistsState>({
  templates: [],
  list: null,
  current: null,
  loading: false,
  error: null,
})

export function useChecklists() {
  async function loadTemplates() {
    state.loading = true
    state.error = null
    try {
      state.templates = await checklistsApi.getTemplates()
    } catch (e: unknown) {
      const errorResponse = e as { response?: { data?: { message?: string } } }
      state.error = errorResponse?.response?.data?.message ?? 'Failed to load templates'
    } finally {
      state.loading = false
    }
  }

  async function loadList(page = 1) {
    state.loading = true
    state.error = null
    try {
      state.list = await checklistsApi.list(page)
    } catch (e: unknown) {
      const errorResponse = e as { response?: { data?: { message?: string } } }
      state.error = errorResponse?.response?.data?.message ?? 'Failed to load checklists'
    } finally {
      state.loading = false
    }
  }

  async function createChecklist(payload: { name: string; description?: string | null; template_id?: number | null }) {
    state.loading = true
    state.error = null
    try {
      const created = await checklistsApi.create(payload)
      // Optimistically prepend to list if present
      if (state.list) {
        state.list.data.unshift(created)
        state.list.total += 1
      }
      return created
    } catch (e: unknown) {
      const errorResponse = e as { response?: { data?: { message?: string } } }
      state.error = errorResponse?.response?.data?.message ?? 'Failed to create checklist'
      throw e
    } finally {
      state.loading = false
    }
  }

  async function loadChecklist(id: number) {
    state.loading = true
    state.error = null
    try {
      state.current = await checklistsApi.get(id)
    } catch (e: unknown) {
      const errorResponse = e as { response?: { data?: { message?: string } } }
      state.error = errorResponse?.response?.data?.message ?? 'Failed to load checklist'
    } finally {
      state.loading = false
    }
  }

  async function updateChecklist(id: number, payload: { name?: string; description?: string | null }) {
    state.loading = true
    state.error = null
    try {
      const updated = await checklistsApi.update(id, payload)
      if (state.current && state.current.id === id) {
        state.current = { ...state.current, ...updated }
      }
      if (state.list) {
        const idx = state.list.data.findIndex((c) => c.id === id)
        if (idx !== -1) state.list.data[idx] = { ...state.list.data[idx], ...updated }
      }
    } catch (e: unknown) {
      const errorResponse = e as { response?: { data?: { message?: string } } }
      state.error = errorResponse?.response?.data?.message ?? 'Failed to update checklist'
      throw e
    } finally {
      state.loading = false
    }
  }

  async function deleteChecklist(id: number) {
    state.loading = true
    state.error = null
    try {
      await checklistsApi.remove(id)
      if (state.list) {
        state.list.data = state.list.data.filter((c) => c.id !== id)
        state.list.total = Math.max(0, state.list.total - 1)
      }
      if (state.current?.id === id) state.current = null
    } catch (e: unknown) {
      const errorResponse = e as { response?: { data?: { message?: string } } }
      state.error = errorResponse?.response?.data?.message ?? 'Failed to delete checklist'
      throw e
    } finally {
      state.loading = false
    }
  }

  async function createTask(checklistId: number, payload: { title: string; description?: string | null; due_at?: string | null; responsible_user_id?: number | null; sort_order?: number }) {
    const task = await checklistsApi.createTask(checklistId, payload)
    if (state.current && state.current.id === checklistId) {
      state.current.tasks.push(task)
    }
    return task
  }

  async function updateTask(checklistId: number, taskId: number, payload: Partial<Pick<Task, 'title' | 'description' | 'due_at' | 'responsible_user_id' | 'is_completed' | 'sort_order'>>) {
    const updated = await checklistsApi.updateTask(checklistId, taskId, payload)
    if (state.current && state.current.id === checklistId) {
      const idx = state.current.tasks.findIndex((t) => t.id === taskId)
      if (idx !== -1) state.current.tasks[idx] = updated
    }
    return updated
  }

  async function deleteTask(checklistId: number, taskId: number) {
    await checklistsApi.removeTask(checklistId, taskId)
    if (state.current && state.current.id === checklistId) {
      state.current.tasks = state.current.tasks.filter((t) => t.id !== taskId)
    }
  }

  async function createSubtask(checklistId: number, taskId: number, payload: { title: string; sort_order?: number }) {
    const created = await checklistsApi.createSubtask(checklistId, taskId, payload)
    if (state.current && state.current.id === checklistId) {
      const task = state.current.tasks.find((t) => t.id === taskId)
      if (task) task.subtasks.push(created)
    }
    return created
  }

  async function updateSubtask(checklistId: number, taskId: number, subtaskId: number, payload: Partial<Pick<Subtask, 'title' | 'is_completed' | 'sort_order'>>) {
    const updated = await checklistsApi.updateSubtask(checklistId, taskId, subtaskId, payload)
    if (state.current && state.current.id === checklistId) {
      const task = state.current.tasks.find((t) => t.id === taskId)
      if (task) {
        const idx = task.subtasks.findIndex((s) => s.id === subtaskId)
        if (idx !== -1) task.subtasks[idx] = updated
      }
    }
    return updated
  }

  async function deleteSubtask(checklistId: number, taskId: number, subtaskId: number) {
    await checklistsApi.removeSubtask(checklistId, taskId, subtaskId)
    if (state.current && state.current.id === checklistId) {
      const task = state.current.tasks.find((t) => t.id === taskId)
      if (task) task.subtasks = task.subtasks.filter((s) => s.id !== subtaskId)
    }
  }

  return {
    ...toRefs(state),
    loadTemplates,
    loadList,
    createChecklist,
    loadChecklist,
    updateChecklist,
    deleteChecklist,
    createTask,
    updateTask,
    deleteTask,
    createSubtask,
    updateSubtask,
    deleteSubtask,
  }
}


