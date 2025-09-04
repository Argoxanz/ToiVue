<script setup lang="ts">
import { ref, computed } from 'vue'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon, IonInput, IonTextarea, IonModal } from '@ionic/vue'
import { add, create, trash } from 'ionicons/icons'

type Guest = {
  id: string
  name: string
  notes: string
}

const storageKey = 'toivue.guests'
const guests = ref<Guest[]>(loadGuests())

function loadGuests(): Guest[] {
  try {
    const raw = localStorage.getItem(storageKey)
    return raw ? JSON.parse(raw) as Guest[] : []
  } catch {
    return []
  }
}

function persist() {
  localStorage.setItem(storageKey, JSON.stringify(guests.value))
}

const isModalOpen = ref(false)
const editGuest = ref<Guest | null>(null)
const nameInput = ref('')
const notesInput = ref('')

function startAdd() {
  editGuest.value = null
  nameInput.value = ''
  notesInput.value = ''
  isModalOpen.value = true
}

function startEdit(g: Guest) {
  editGuest.value = { ...g }
  nameInput.value = g.name
  notesInput.value = g.notes
  isModalOpen.value = true
}

function saveGuest() {
  const trimmedName = nameInput.value.trim()
  if (!trimmedName) return
  if (editGuest.value) {
    const idx = guests.value.findIndex(g => g.id === editGuest.value!.id)
    if (idx !== -1) {
      guests.value[idx] = { ...guests.value[idx], name: trimmedName, notes: notesInput.value }
    }
  } else {
    guests.value.unshift({ id: crypto.randomUUID(), name: trimmedName, notes: notesInput.value })
  }
  persist()
  isModalOpen.value = false
}

function deleteGuest(id: string) {
  guests.value = guests.value.filter(g => g.id !== id)
  persist()
}

const hasGuests = computed(() => guests.value.length > 0)
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Guests</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div class="ion-padding">
        <IonButton color="primary" @click="startAdd">
          <IonIcon :icon="add" slot="start" />
          Add guest
        </IonButton>
      </div>

      <IonList v-if="hasGuests">
        <IonItem v-for="g in guests" :key="g.id" detail="false">
          <IonLabel>
            <h2>{{ g.name }}</h2>
            <p v-if="g.notes">{{ g.notes }}</p>
          </IonLabel>
          <IonButton fill="clear" color="medium" @click="startEdit(g)">
            <IonIcon :icon="create" />
          </IonButton>
          <IonButton fill="clear" color="danger" @click="deleteGuest(g.id)">
            <IonIcon :icon="trash" />
          </IonButton>
        </IonItem>
      </IonList>

      <div v-else class="ion-text-center ion-padding">
        <p>No guests yet. Add your first one!</p>
      </div>

      <IonModal :is-open="isModalOpen" @did-dismiss="isModalOpen = false">
        <IonHeader>
          <IonToolbar>
            <IonTitle>{{ editGuest ? 'Edit guest' : 'Add guest' }}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent class="ion-padding">
          <IonInput label="Name" label-placement="stacked" placeholder="Guest name" v-model="nameInput" />
          <IonTextarea class="ion-margin-top" label="Notes" label-placement="stacked" placeholder="Notes about this guest" :auto-grow="true" v-model="notesInput" />
          <div class="ion-text-right ion-margin-top">
            <IonButton fill="clear" color="medium" @click="isModalOpen = false">Cancel</IonButton>
            <IonButton color="primary" @click="saveGuest">Save</IonButton>
          </div>
        </IonContent>
      </IonModal>
    </IonContent>
  </IonPage>
</template>

<style scoped>
h2 {
  margin: 0 0 4px 0;
}
p {
  margin: 0;
}
</style>


