import createClient from 'openapi-fetch';
import { createQueryHook } from 'swr-openapi';

import { MapGranule, MapProduct } from '@/types';
import { paths } from '@/types/api';
import { DateRange } from '@/utils/dateUtils';

export const apiClient = createClient<paths>({
  baseUrl: import.meta.env.VITE_SERVICE_API_ENDPOINT,
});

export const useAPI = createQueryHook(apiClient, 'api');

export async function fetchProducts(hemi: 'N' | 'S' | undefined): Promise<MapProduct[]> {
  const { data: products, error } = await apiClient.GET('/products', {
    params: {
      query: { hemi },
    },
  });

  if (error || !products) {
    console.error('Failed to fetch products:', error);
    return [];
  }

  return products; // Return all products, including static ones
}

export async function fetchGranulesForProduct(
  code: string,
  dateRange?: DateRange,
): Promise<MapGranule[]> {
  const { data, error } = await apiClient.GET('/products/{code}/granules', {
    params: {
      path: { code },
      query: {
        date_range: dateRange,
      },
    },
  });

  if (error) {
    console.error(`Failed to fetch granules for product ${code}:`, error);
    return [];
  }

  return data || [];
}
