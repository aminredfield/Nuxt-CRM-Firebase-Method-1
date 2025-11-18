import { onDocumentWritten } from 'firebase-functions/v2/firestore'
import * as admin from 'firebase-admin'

admin.initializeApp()
const db = admin.firestore()

const projectTaskIndexCol = db.collection('projectTaskIndex')
const clientTaskIndexCol = db.collection('clientTaskIndex')

export const onTaskWrite = onDocumentWritten('tasks/{taskId}', async (event: any) => {
    const taskId = event.params.taskId as string
    const beforeSnap = event.data?.before
    const afterSnap = event.data?.after
    const before = beforeSnap ? (beforeSnap.data() as any) : null
    const after = afterSnap ? (afterSnap.data() as any) : null
    const batch = db.batch()

    if (before) {
        if (before.projectId) {
            const ref = projectTaskIndexCol.doc(`${before.projectId}_${taskId}`)
            batch.delete(ref)
        }
        if (before.clientId) {
            const ref = clientTaskIndexCol.doc(`${before.clientId}_${taskId}`)
            batch.delete(ref)
        }
    }

    if (!after) {
        await batch.commit()
        return
    }

    if (after.projectId) {
        const ref = projectTaskIndexCol.doc(`${after.projectId}_${taskId}`)
        batch.set(ref, {
            projectId: after.projectId,
            taskId,
            taskName: after.name ?? null,
            createdAt:
                after.createdAt ??
                admin.firestore.FieldValue.serverTimestamp(),
        })
    }

    if (after.clientId) {
        const ref = clientTaskIndexCol.doc(`${after.clientId}_${taskId}`)
        batch.set(ref, {
            clientId: after.clientId,
            taskId,
            taskName: after.name ?? null,
            createdAt:
                after.createdAt ??
                admin.firestore.FieldValue.serverTimestamp(),
        })
    }

    await batch.commit()
})
