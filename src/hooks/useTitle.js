import { watch, ref } from 'vue'
import { isString } from '@/utils/is'

export const useTitle = newTitle => {
    const title = ref(newTitle ? `${process.env.VUE_APP_TITLE} - ${newTitle}` : process.env.VUE_APP_TITLE)

    watch(
        title,
        (n, o) => {
            if (isString(n) && n !== o && document) {
                document.title = n
            }
        },
        { immediate: true }
    )

    return title
}
