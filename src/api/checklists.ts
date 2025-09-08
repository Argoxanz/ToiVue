import http from './http'

export type ChecklistTemplateTask = {
  id: number
  checklist_template_id: number
  title: string
  description: string | null
  due_in_days: number | null
  sort_order: number
}

export type ChecklistTemplate = {
  id: number
  name: string
  description: string | null
  tasks: ChecklistTemplateTask[]
}

export type Subtask = {
  id: number
  task_id: number
  title: string
  is_completed: boolean
  sort_order: number
}

export type Task = {
  id: number
  checklist_id: number
  title: string
  description: string | null
  due_at: string | null
  responsible_user_id: number | null
  is_completed: boolean
  is_custom: boolean
  sort_order: number
  subtasks: Subtask[]
  responsible?: { id: number; name: string } | null
}

export type Checklist = {
  id: number
  user_id: number
  name: string
  description: string | null
  tasks?: Task[]
}

export type Paginated<T> = {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export const checklistsApi = {
  async getTemplates(): Promise<ChecklistTemplate[]> {
    const { data } = await http.get<ChecklistTemplate[]>('/checklist-templates')
    return data
  },

  async list(page = 1): Promise<Paginated<Checklist>> {
    const { data } = await http.get<Paginated<Checklist>>('/checklists', { params: { page } })
    return data
  },

  async create(payload: { name: string; description?: string | null; template_id?: number | null }): Promise<Checklist> {
    const { data } = await http.post<Checklist>('/checklists', payload)
    return data
  },

  async get(id: number): Promise<Checklist & { tasks: Task[] }> {
    const { data } = await http.get<Checklist & { tasks: Task[] }>(`/checklists/${id}`)
    return data
  },

  async update(id: number, payload: Partial<Pick<Checklist, 'name' | 'description'>>): Promise<Checklist> {
    const { data } = await http.put<Checklist>(`/checklists/${id}`, payload)
    return data
  },

  async remove(id: number): Promise<void> {
    await http.delete(`/checklists/${id}`)
  },

  async listTasks(checklistId: number): Promise<Task[]> {
    const { data } = await http.get<Task[]>(`/checklists/${checklistId}/tasks`)
    return data
  },

  async createTask(
    checklistId: number,
    payload: Partial<Omit<Task, 'id' | 'checklist_id' | 'subtasks' | 'is_custom'>> & { title: string }
  ): Promise<Task> {
    const { data } = await http.post<Task>(`/checklists/${checklistId}/tasks`, payload)
    return data
  },

  async updateTask(
    checklistId: number,
    taskId: number,
    payload: Partial<Omit<Task, 'id' | 'checklist_id' | 'subtasks' | 'is_custom'>>
  ): Promise<Task> {
    const { data } = await http.put<Task>(`/checklists/${checklistId}/tasks/${taskId}`, payload)
    return data
  },

  async removeTask(checklistId: number, taskId: number): Promise<void> {
    await http.delete(`/checklists/${checklistId}/tasks/${taskId}`)
  },

  async listSubtasks(checklistId: number, taskId: number): Promise<Subtask[]> {
    const { data } = await http.get<Subtask[]>(`/checklists/${checklistId}/tasks/${taskId}/subtasks`)
    return data
  },

  async createSubtask(
    checklistId: number,
    taskId: number,
    payload: { title: string; sort_order?: number | null }
  ): Promise<Subtask> {
    const { data } = await http.post<Subtask>(`/checklists/${checklistId}/tasks/${taskId}/subtasks`, payload)
    return data
  },

  async updateSubtask(
    checklistId: number,
    taskId: number,
    subtaskId: number,
    payload: Partial<Pick<Subtask, 'title' | 'is_completed' | 'sort_order'>>
  ): Promise<Subtask> {
    const { data } = await http.put<Subtask>(`/checklists/${checklistId}/tasks/${taskId}/subtasks/${subtaskId}`, payload)
    return data
  },

  async removeSubtask(checklistId: number, taskId: number, subtaskId: number): Promise<void> {
    await http.delete(`/checklists/${checklistId}/tasks/${taskId}/subtasks/${subtaskId}`)
  },
}


