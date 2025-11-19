
# **ПРОМПТЫ ДЛЯ ВАРИАНТА 1**

---

## **1. Создание пустого проекта**

> Создай пустой Nuxt-проект и покажи структуру, которую он создаёт.

---

## **2. Добавление layers**

> Добавь структуру /root/frontend и /root/modules, подключи modules как layer в frontend/nuxt.config.ts и покажи итоговую структуру.

---

## **3. Firebase + эмуляторы**

> Подключи Firebase (Firestore + Functions) к проекту, создай плагин firebase.client.ts, настрой подключение к эмуляторам и покажи, какие файлы добавлены.

---

## **4. Layout с меню**

> Создай layouts/default.vue с меню и добавь app.config.ts, из которого layout берёт пункты меню. Покажи итоговую структуру layout + config.

---

## **5. Страница CRUD**

> Создай страницу /crud с CRUD для коллекций projects, clients, tasks, используя Firestore SDK. Покажи добавленные файлы.

---

## **6. Страница relation**

> Создай страницу /relation, где выбираются связи задач с проектами и клиентами (projectId, clientId), и покажи итоговую структуру.

---

## **7. Reverse index в Functions**

> Добавь cloud function, которая при изменении документа tasks/{taskId} создаёт или обновляет reverse index в projectTaskIndex и clientTaskIndex. Покажи файл functions/src/index.ts.

---

## **8. Composite index Firestore**

> Добавь composite index для projectTaskIndex (projectId + createdAt). Покажи firestore.indexes.json.

---

## **9. Страница reverse index в layer**

> Создай страницу /reverse-index внутри modules/pages, которая читает reverse index и фильтрует по projectId. Покажи файл и структуру слоя.

---

## **10. Layer дополняет меню**

> Добавь в modules/app.config.ts пункт меню для /reverse-index и покажи, как изменилось меню.


