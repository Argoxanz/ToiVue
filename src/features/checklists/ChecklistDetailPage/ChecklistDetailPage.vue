<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonList, IonCheckbox, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSpinner, IonModal } from '@ionic/vue';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useChecklists } from '@/store/checklists';
import { useAuth } from '@/store/auth';
import './ChecklistDetailPage.css';

const route = useRoute();
const { t } = useI18n();
const checklistId = Number(route.params.id);

const { current, loading, error, loadChecklist, updateChecklist, createTask, updateTask, deleteTask, createSubtask, updateSubtask, deleteSubtask } = useChecklists();
const { user } = useAuth();

const checklistForm = reactive<{ name: string; description: string | null }>({ name: '', description: '' });
const taskForm = reactive<{ title: string; description: string; due_at: string | null } >({ title: '', description: '', due_at: null });
const modalOpen = ref(false);
const selectedTaskId = ref<number | null>(null);
const newSubtaskTitle = ref('');

onMounted(async () => {
  await loadChecklist(checklistId);
  if (current?.value) {
    checklistForm.name = current.value.name;
    checklistForm.description = current.value.description;
  }
});

async function onUpdateChecklist() {
  await updateChecklist(checklistId, { name: checklistForm.name, description: checklistForm.description ?? null });
}

async function onAddTask() {
  if (!taskForm.title) return;
  await createTask(checklistId, { title: taskForm.title, description: taskForm.description || null, due_at: taskForm.due_at || null });
  taskForm.title = '';
  taskForm.description = '';
  taskForm.due_at = null;
}

async function onToggleTask(taskId: number, checked: boolean) {
  await updateTask(checklistId, taskId, { is_completed: checked });
}

async function onDeleteTask(taskId: number) {
  if (confirm(t('checklists.deleteItem'))) await deleteTask(checklistId, taskId);
}

async function onAddSubtask(taskId: number, title: string) {
  if (!title) return;
  await createSubtask(checklistId, taskId, { title });
}

async function onToggleSubtask(taskId: number, subtaskId: number, checked: boolean) {
  await updateSubtask(checklistId, taskId, subtaskId, { is_completed: checked });
}

async function onRenameSubtask(taskId: number, subtaskId: number, title: string) {
  await updateSubtask(checklistId, taskId, subtaskId, { title });
}

async function onDeleteSubtask(taskId: number, subtaskId: number) {
  if (confirm(t('checklists.deleteItem'))) await deleteSubtask(checklistId, taskId, subtaskId);
}

function toDateOnly(value: string | null): string {
  if (!value) return '';
  const d = new Date(value);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function isOverdue(due_at: string | null, completed: boolean): boolean {
  if (!due_at || completed) return false;
  const today = new Date();
  today.setHours(0,0,0,0);
  const due = new Date(due_at);
  return due < today;
}

const selectedTask = computed(() => {
  if (!current?.value || selectedTaskId.value == null) return null;
  return current.value.tasks.find(t => t.id === selectedTaskId.value) || null;
});

function openTaskModal(taskId: number) {
  selectedTaskId.value = taskId;
  newSubtaskTitle.value = '';
  modalOpen.value = true;
}

function closeTaskModal() {
  modalOpen.value = false;
}

function progressLabel(task: { subtasks: Array<{ is_completed: boolean }> }) {
  const total = task.subtasks.length || 1;
  const done = task.subtasks.filter(s => s.is_completed).length;
  return `${done}/${total}`;
}

async function assignToMe(taskId: number) {
  if (!user) return;
  await updateTask(checklistId, taskId, { responsible_user_id: user.id });
}

async function clearAssignee(taskId: number) {
  await updateTask(checklistId, taskId, { responsible_user_id: null });
}
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start"><IonBackButton default-href="/checklists" /></IonButtons>
        <IonTitle>{{ $t('checklists.title') }}</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent class="ion-padding">
      <div v-if="loading" class="ion-padding"><IonSpinner /></div>
      <div v-if="error" class="ion-padding" style="color:#ef4444">{{ error }}</div>

      <IonCard v-if="current">
        <IonCardHeader>
          <IonCardTitle>{{ $t('checklists.editChecklist') }}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <div class="stack-md">
            <IonItem>
              <IonLabel position="stacked">{{ $t("common.name") }}</IonLabel>
              <IonInput v-model="checklistForm.name" />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">{{ $t("common.description") }}</IonLabel>
              <IonInput v-model="checklistForm.description" />
            </IonItem>
            <IonButton @click="onUpdateChecklist">{{ $t("common.save") }}</IonButton>
          </div>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>{{ $t('checklists.addItem') }}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <div class="stack-md">
            <IonItem>
              <IonLabel position="stacked">{{ $t("common.name") }}</IonLabel>
              <IonInput v-model="taskForm.title" />
            </IonItem>
            <!-- Keep additional fields in modal; creation is minimal per requirements -->
            <IonButton @click="onAddTask" :disabled="!taskForm.title">{{ $t("checklists.addItem") }}</IonButton>
          </div>
        </IonCardContent>
      </IonCard>

      <IonList v-if="current">
        <div v-for="task in current.tasks" :key="task.id" class="task" :class="{ overdue: isOverdue(task.due_at, task.is_completed) }">
          <IonItem button lines="full" @click="openTaskModal(task.id)">
            <IonCheckbox :checked="task.is_completed" slot="start" @ion-change.stop="(e:any)=>onToggleTask(task.id, !!e.detail.checked)" />
            <IonLabel>
              <h2>{{ task.title }}</h2>
            </IonLabel>
            <div slot="end"><strong>{{ progressLabel(task) }}</strong></div>
          </IonItem>
        </div>
      </IonList>

      <IonModal :is-open="modalOpen" @didDismiss="closeTaskModal">
        <div class="modal-content ion-padding" v-if="selectedTask">
          <h2 style="margin-top:0">{{ selectedTask.title }}</h2>
          <div class="stack-md">
            <div>
              <strong>{{ $t("checklists.deadline") }}</strong>
              <IonItem>
                <IonLabel position="stacked">{{ $t("checklists.dueDate") }}</IonLabel>
                <IonInput :value="toDateOnly(selectedTask?.due_at)" type="date" @ionChange="(e:any)=>selectedTask && updateTask(checklistId, selectedTask.id, { due_at: e.detail.value || null })" />
              </IonItem>
            </div>

            <div>
              <strong>{{ $t("checklists.assignee") }}</strong>
              <p>{{ $t("checklists.current") }}: {{ selectedTask.responsible?.name || $t("checklists.unassigned") }}</p>
              <div style="display:flex; gap:8px; flex-wrap:wrap;">
                <IonButton size="small" @click="assignToMe(selectedTask.id)" :disabled="!user">{{ $t("checklists.assignToMe") }}</IonButton>
                <IonButton size="small" color="medium" @click="clearAssignee(selectedTask.id)">{{ $t("checklists.clear") }}</IonButton>
              </div>
            </div>

            <div>
              <strong>{{ $t("checklists.subtasks") }} ({{ progressLabel(selectedTask) }})</strong>
              <IonList class="subtasks">
                <IonItem v-for="s in selectedTask.subtasks" :key="s.id">
                  <IonCheckbox :checked="s.is_completed" slot="start" @ion-change="(e:any)=>selectedTask && onToggleSubtask(selectedTask.id, s.id, !!e.detail.checked)" />
                  <IonInput :value="s.title" @ionBlur="(e:any)=>selectedTask && onRenameSubtask(selectedTask.id, s.id, e.target.value)" />
                  <IonButton color="danger" @click="onDeleteSubtask(selectedTask.id, s.id)">{{ $t("common.delete") }}</IonButton>
                </IonItem>
                <IonItem>
                  <IonInput v-model="newSubtaskTitle" :placeholder="$t('checklists.addItem')" @keyup.enter="async ()=>{ selectedTask && await onAddSubtask(selectedTask.id, newSubtaskTitle); newSubtaskTitle='' }" />
                  <IonButton @click="async ()=>{ selectedTask && await onAddSubtask(selectedTask.id, newSubtaskTitle); newSubtaskTitle='' }" :disabled="!newSubtaskTitle">{{ $t("common.add") }}</IonButton>
                </IonItem>
              </IonList>
            </div>

            <div style="display:flex;justify-content:space-between;gap:8px;">
              <IonButton color="medium" fill="outline" @click="closeTaskModal">{{ $t("common.close") }}</IonButton>
              <IonButton color="danger" @click="async ()=>{ await onDeleteTask(selectedTask!.id); closeTaskModal() }">{{ $t("checklists.deleteItem") }}</IonButton>
            </div>
          </div>
        </div>
      </IonModal>
    </IonContent>
  </IonPage>
</template>


