<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSelect, IonSelectOption, IonSpinner } from '@ionic/vue'
import { onMounted, reactive } from 'vue'
import { useChecklists } from '../store/checklists'
import { useRouter } from 'vue-router'

const { templates, list, loading, error, loadTemplates, loadList, createChecklist, deleteChecklist } = useChecklists()
const router = useRouter()

const form = reactive<{ name: string; description: string; template_id: number | null }>({ name: '', description: '', template_id: null })

onMounted(async () => {
  await Promise.all([loadTemplates(), loadList(1)])
})

async function onCreate() {
  const created = await createChecklist({ name: form.name, description: form.description || null, template_id: form.template_id || undefined })
  form.name = ''
  form.description = ''
  form.template_id = null
  router.push(`/checklists/${created.id}`)
}

async function onDelete(id: number) {
  if (confirm('Delete this checklist?')) {
    await deleteChecklist(id)
  }
}
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Checklists</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent class="ion-padding">
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Create Checklist</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <form class="stack-md" @submit.prevent="onCreate">
            <IonItem>
              <IonLabel position="stacked">Name</IonLabel>
              <IonInput v-model="form.name" required />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Description</IonLabel>
              <IonInput v-model="form.description" />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Template (optional)</IonLabel>
              <IonSelect v-model="form.template_id" interface="popover" placeholder="None">
                <IonSelectOption :value="null">None</IonSelectOption>
                <IonSelectOption v-for="tpl in templates" :key="tpl.id" :value="tpl.id">{{ tpl.name }}</IonSelectOption>
              </IonSelect>
            </IonItem>
            <div>
              <IonButton type="submit" :disabled="loading || !form.name">Create</IonButton>
            </div>
          </form>
        </IonCardContent>
      </IonCard>

      <div v-if="loading" class="ion-padding">
        <IonSpinner />
      </div>

      <IonList v-if="list">
        <IonItem v-for="c in list.data" :key="c.id" button @click="router.push(`/checklists/${c.id}`)">
          <IonLabel>
            <h2>{{ c.name }}</h2>
            <p>{{ c.description }}</p>
          </IonLabel>
          <IonButton slot="end" color="danger" @click.stop="onDelete(c.id)">Delete</IonButton>
        </IonItem>
      </IonList>

      <div v-if="error" class="ion-padding" style="color:#ef4444">{{ error }}</div>
    </IonContent>
  </IonPage>
  
</template>

<style scoped>
.stack-md { display: grid; gap: 12px; }
</style>


