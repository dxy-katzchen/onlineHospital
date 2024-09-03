import { ref } from 'vue';

export const fromRoute = ref(null);

export function useRoutes() {
  return { fromRoute };
}
