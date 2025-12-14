<script setup>
import Table from '@/components/Table.vue';
import { useApiRequest } from '@/composables/useApiRequest';
import { fetchUserFiles, fetchUserFilesView } from '../Api/UserApi';
import { closeModal, openModal } from '@customizer/modal-x';

const props = defineProps(
    {
        data: {
            type: Object,
            required: true,
        }
    }
)
const req = useApiRequest();
const viewreq = useApiRequest();
req.send(
    () => fetchUserFiles(props.data.userUuid),
    (res) => {

    }
)



</script>

<template>
    <div @click.self="closeModal()" class="h-full bg-black/50 p-4">
        <Table :headers="{
            head: [
                'File Name',
                'File Size',
                'Actions',
            ],
            row: [
                'fileName',
                'fileSize',
            ]
        }" :pending="req.pending.value" :rows="req.response.value">
            <template #actions="{ row }">
                <button class="rounded-lg bg-primary text-white px-3 py-2 border-gray-300"
                    @click='openModal("ViewUserDOcView", { fileName: row?.fileName })'>View</button>


            </template>
        </Table>
    </div>
</template>