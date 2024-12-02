import createClient from 'openapi-fetch';
import { createQueryHook } from 'swr-openapi';
import { GeoJSONFeature, GeoJSONFeatureSchema } from 'zod-geojson';

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

  return products;
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

export async function convertRTZPToGeoJSON(input: string | File): Promise<GeoJSONFeature> {
  const body = input instanceof File ? input : JSON.stringify(input);
  const formData = new FormData();
  formData.append('application/rtzp', body);

  const { data, error } = await apiClient.POST('/routes/convert', {
    params: {
      header: {
        'content-type': 'application/rtzp',
        accept: 'application/geo+json',
      },
    },
    body: formData,
  });

  if (error) {
    console.error('Failed to convert route to GeoJSON:', error);
    throw error;
  }

  if (!data) {
    throw new Error('No data received from route conversion');
  }

  try {
    return GeoJSONFeatureSchema.parse(data);
  } catch (error) {
    console.error('Invalid GeoJSON received from route conversion', error);
    throw new Error('Invalid GeoJSON received from route conversion');
  }
}

export async function convertGeoJSONToRTZP(input: string | File): Promise<Blob> {
  const body = input instanceof File ? input : JSON.stringify(input);
  const formData = new FormData();
  formData.append('application/geo+json', body);

  const { data, error } = await apiClient.POST('/routes/convert', {
    params: {
      header: {
        'content-type': 'application/geo+json',
        accept: 'application/rtzp',
      },
    },
    body: formData,
  });

  if (error) {
    console.error('Failed to convert route to RTZP:', error);
    throw error;
  }

  if (!data) {
    throw new Error('No data received from route conversion');
  }

  if (typeof data !== 'string') {
    throw new Error('Invalid data received from route conversion');
  }

  return new Blob([data], { type: 'application/rtzp' });
}
