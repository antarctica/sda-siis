import createClient from 'openapi-fetch';
import { createQueryHook } from 'swr-openapi';

import { paths } from '@/types/api';

const client = createClient<paths>({
  baseUrl: import.meta.env.VITE_SERVICE_API_ENDPOINT,
});

export const useAPI = createQueryHook(client, 'api');
