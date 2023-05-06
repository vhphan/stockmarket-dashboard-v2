import {computed} from "vue";
import {triggerNegative} from "@/utils/notifications.js";


export const useApiArray = (apiArray, executeCallback = null) => {

    const isFetchingArray = apiArray.map((api) => api.isFetching);
    const errorArray = apiArray.map((api) => api.error);
    const dataArray = apiArray.map((api) => api.data);
    const isLoading = computed(() => {
        return isFetchingArray.some((isFetching) => isFetching.value);
    });
    const execute = async () => {
        const executePromisesArray = apiArray.map((api) => api.execute());
        await Promise.all(executePromisesArray);
        errorArray.forEach((error) => {
            if (error.value) {
                triggerNegative({message: error.value});
            }
        });
        executeCallback && executeCallback();
    };

    return {
        isFetchingArray,
        errorArray,
        dataArray,
        isLoading,
        execute,
    };

};