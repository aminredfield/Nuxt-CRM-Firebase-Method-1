<template>
  <main class="space-y-6">
    <h1 class="text-2xl font-semibold mb-4">
      Связи между задачами, проектами и клиентами
    </h1>

    <p class="text-sm text-slate-400 mb-2">
      Здесь мы не создаём записи, а только связываем существующие
      <b>tasks</b> с <b>projects</b> и <b>clients</b>.
    </p>

    <div v-if="loadingAll">Загрузка данных…</div>

    <section v-else class="border rounded p-4 overflow-x-auto">
      <table class="min-w-full text-sm border-collapse">
        <thead>
          <tr class="border-b">
            <th class="text-left py-2 pr-4">Task</th>
            <th class="text-left py-2 pr-4">Project</th>
            <th class="text-left py-2 pr-4">Client</th>
            <th class="text-left py-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="task in tasks"
            :key="task.id"
            class="border-b last:border-b-0"
          >
            <td class="py-1 pr-4">
              <span class="font-medium">{{ task.name }}</span>
            </td>

            <td class="py-1 pr-4">
              <select
                v-model="task.projectId"
                class="border rounded px-2 py-1 min-w-[160px] text-black"
              >
                <option :value="''">(без проекта)</option>
                <option v-for="p in projects" :key="p.id" :value="p.id">
                  {{ p.name }}
                </option>
              </select>
            </td>

            <td class="py-1 pr-4">
              <select
                v-model="task.clientId"
                class="border rounded px-2 py-1 min-w-[160px] text-black"
              >
                <option :value="''">(без клиента)</option>
                <option v-for="c in clients" :key="c.id" :value="c.id">
                  {{ c.name }}
                </option>
              </select>
            </td>

            <td class="py-1">
              <button
                class="border px-3 py-1 rounded text-xs"
                :disabled="savingId === task.id"
                @click="saveRelations(task)"
              >
                {{ savingId === task.id ? "Сохранение…" : "Сохранить" }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-if="!tasks.length" class="mt-3 text-sm text-slate-400">
        Задач пока нет. Создай их на странице
        <NuxtLink to="/crud">CRUD</NuxtLink>.
      </p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

const { $firestore } = useNuxtApp();

type SimpleItem = { id: string; name: string };
type TaskItem = {
  id: string;
  name: string;
  projectId: string;
  clientId: string;
};

const projects = ref<SimpleItem[]>([]);
const clients = ref<SimpleItem[]>([]);
const tasks = ref<TaskItem[]>([]);

const loadingAll = ref(false);
const savingId = ref<string | null>(null);

const loadSimpleCollection = async (
  colName: string,
  target: typeof projects
) => {
  if (!$firestore) return;
  const colRef = collection($firestore, colName);
  const snap = await getDocs(colRef);

  target.value = snap.docs.map((d) => ({
    id: d.id,
    name: (d.data().name as string) ?? "(no name)",
  }));
};

const loadTasks = async () => {
  if (!$firestore) return;
  const colRef = collection($firestore, "tasks");
  const snap = await getDocs(colRef);

  tasks.value = snap.docs.map((d) => {
    const data = d.data() as any;
    return {
      id: d.id,
      name: (data.name as string) ?? "(no name)",
      projectId: (data.projectId as string) ?? "",
      clientId: (data.clientId as string) ?? "",
    };
  });
};

const saveRelations = async (task: TaskItem) => {
  if (!$firestore) return;
  savingId.value = task.id;
  try {
    const ref = doc($firestore, "tasks", task.id);
    await updateDoc(ref, {
      projectId: task.projectId || null,
      clientId: task.clientId || null,
    });
  } finally {
    savingId.value = null;
  }
};

onMounted(async () => {
  loadingAll.value = true;
  try {
    await Promise.all([
      loadSimpleCollection("projects", projects),
      loadSimpleCollection("clients", clients),
      loadTasks(),
    ]);
  } finally {
    loadingAll.value = false;
  }
});
</script>
