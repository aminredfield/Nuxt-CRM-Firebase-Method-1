<template>
  <main class="space-y-8">
    <h1 class="text-2xl font-semibold mb-4">crud для 3 коллекций</h1>
    <section class="border p-4 rounded">
      <h2 class="text-xl font-semibold mb-2">Projects</h2>

      <form class="flex gap-2 mb-3" @submit.prevent="createProject">
        <input
          v-model="newProjectName"
          type="text"
          placeholder="Название проекта"
          class="border px-2 py-1 rounded flex-1 text-black"
        />
        <button
          type="submit"
          class="border px-3 py-1 rounded"
          :disabled="loading"
        >
          Добавить
        </button>
      </form>

      <div v-if="loadingProjects">Загрузка projects…</div>

      <ul v-else class="space-y-1">
        <li
          v-for="item in projects"
          :key="item.id"
          class="border px-2 py-1 rounded flex justify-between items-center"
        >
          <span>{{ item.name }}</span>
          <div class="flex gap-2 text-sm">
            <button class="underline" @click="editProject(item)">
              Изменить
            </button>
            <button class="underline text-red-500" @click="deleteProject(item)">
              Удалить
            </button>
          </div>
        </li>
      </ul>
    </section>

    <section class="border p-4 rounded">
      <h2 class="text-xl font-semibold mb-2">Clients</h2>

      <form class="flex gap-2 mb-3" @submit.prevent="createClient">
        <input
          v-model="newClientName"
          type="text"
          placeholder="Имя клиента"
          class="border px-2 py-1 rounded flex-1 text-black"
        />
        <button
          type="submit"
          class="border px-3 py-1 rounded"
          :disabled="loading"
        >
          Добавить
        </button>
      </form>

      <div v-if="loadingClients">Загрузка clients…</div>

      <ul v-else class="space-y-1">
        <li
          v-for="item in clients"
          :key="item.id"
          class="border px-2 py-1 rounded flex justify-between items-center"
        >
          <span>{{ item.name }}</span>
          <div class="flex gap-2 text-sm">
            <button class="underline" @click="editClient(item)">
              Изменить
            </button>
            <button class="underline text-red-500" @click="deleteClient(item)">
              Удалить
            </button>
          </div>
        </li>
      </ul>
    </section>

    <section class="border p-4 rounded">
      <h2 class="text-xl font-semibold mb-2">Tasks</h2>

      <form class="flex gap-2 mb-3" @submit.prevent="createTask">
        <input
          v-model="newTaskTitle"
          type="text"
          placeholder="Название задачи"
          class="border px-2 py-1 rounded flex-1 text-black"
        />
        <button
          type="submit"
          class="border px-3 py-1 rounded"
          :disabled="loading"
        >
          Добавить
        </button>
      </form>

      <div v-if="loadingTasks">Загрузка tasks…</div>

      <ul v-else class="space-y-1">
        <li
          v-for="item in tasks"
          :key="item.id"
          class="border px-2 py-1 rounded flex justify-between items-center"
        >
          <span>{{ item.name }}</span>
          <div class="flex gap-2 text-sm">
            <button class="underline" @click="editTask(item)">Изменить</button>
            <button class="underline text-red-500" @click="deleteTask(item)">
              Удалить
            </button>
          </div>
        </li>
      </ul>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

const { $firestore } = useNuxtApp();

type Item = { id: string; name: string };

const loading = ref(false);

const projects = ref<Item[]>([]);
const clients = ref<Item[]>([]);
const tasks = ref<Item[]>([]);

const loadingProjects = ref(false);
const loadingClients = ref(false);
const loadingTasks = ref(false);

const newProjectName = ref("");
const newClientName = ref("");
const newTaskTitle = ref("");

const loadCollection = async (colName: string, target: typeof projects) => {
  if (!$firestore) return;

  const colRef = collection($firestore, colName);
  const snap = await getDocs(colRef);

  target.value = snap.docs.map((d) => ({
    id: d.id,
    name: (d.data().name as string) ?? "(no name)",
  }));
};

const loadProjects = async () => {
  loadingProjects.value = true;
  try {
    await loadCollection("projects", projects);
  } finally {
    loadingProjects.value = false;
  }
};

const createProject = async () => {
  if (!newProjectName.value || !$firestore) return;
  loading.value = true;
  try {
    const colRef = collection($firestore, "projects");
    await addDoc(colRef, {
      name: newProjectName.value,
      createdAt: Timestamp.now(),
    });
    newProjectName.value = "";
    await loadProjects();
  } finally {
    loading.value = false;
  }
};

const editProject = async (item: Item) => {
  if (!$firestore) return;
  const name = window.prompt("Новое название проекта", item.name);
  if (!name) return;
  await updateDoc(doc($firestore, "projects", item.id), {
    name,
  });
  await loadProjects();
};

const deleteProject = async (item: Item) => {
  if (!$firestore) return;
  if (!window.confirm("Удалить проект?")) return;
  await deleteDoc(doc($firestore, "projects", item.id));
  await loadProjects();
};

const loadClients = async () => {
  loadingClients.value = true;
  try {
    await loadCollection("clients", clients);
  } finally {
    loadingClients.value = false;
  }
};

const createClient = async () => {
  if (!newClientName.value || !$firestore) return;
  loading.value = true;
  try {
    const colRef = collection($firestore, "clients");
    await addDoc(colRef, {
      name: newClientName.value,
      createdAt: Timestamp.now(),
    });
    newClientName.value = "";
    await loadClients();
  } finally {
    loading.value = false;
  }
};

const editClient = async (item: Item) => {
  if (!$firestore) return;
  const name = window.prompt("Новое имя клиента", item.name);
  if (!name) return;
  await updateDoc(doc($firestore, "clients", item.id), {
    name,
  });
  await loadClients();
};

const deleteClient = async (item: Item) => {
  if (!$firestore) return;
  if (!window.confirm("Удалить клиента?")) return;
  await deleteDoc(doc($firestore, "clients", item.id));
  await loadClients();
};

const loadTasks = async () => {
  loadingTasks.value = true;
  try {
    await loadCollection("tasks", tasks);
  } finally {
    loadingTasks.value = false;
  }
};

const createTask = async () => {
  if (!newTaskTitle.value || !$firestore) return;
  loading.value = true;
  try {
    const colRef = collection($firestore, "tasks");
    await addDoc(colRef, {
      name: newTaskTitle.value,
      createdAt: Timestamp.now(),
    });
    newTaskTitle.value = "";
    await loadTasks();
  } finally {
    loading.value = false;
  }
};

const editTask = async (item: Item) => {
  if (!$firestore) return;
  const name = window.prompt("Новое название задачи", item.name);
  if (!name) return;
  await updateDoc(doc($firestore, "tasks", item.id), {
    name,
  });
  await loadTasks();
};

const deleteTask = async (item: Item) => {
  if (!$firestore) return;
  if (!window.confirm("Удалить задачу?")) return;
  await deleteDoc(doc($firestore, "tasks", item.id));
  await loadTasks();
};

onMounted(async () => {
  await Promise.all([loadProjects(), loadClients(), loadTasks()]);
});
</script>
