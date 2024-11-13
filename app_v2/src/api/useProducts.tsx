import { ZonedDateTime } from '@internationalized/date';
import useSWRImmutable from 'swr/immutable';

import { CRS_LOOKUP } from '@/config/constants';
import { MapCRS, MapGranule, MapProduct } from '@/types';
import { safeParseUTC } from '@/utils/dateUtils';

import { fetchGranulesForProduct, fetchProducts } from './api';

type ProductWithGranules = MapProduct & {
  granules: MapGranule[];
  latestDate?: ZonedDateTime;
};

async function fetcher(crs: MapCRS): Promise<{ products: ProductWithGranules[] }> {
  try {
    const hemisphere = CRS_LOOKUP[crs].hemisphere;
    const allProducts = await fetchProducts(hemisphere);

    // Fetch granules for dynamic products (non-static)
    const granulePromises: Promise<ProductWithGranules>[] = allProducts
      .filter(
        (product): product is MapProduct & { code: string } => !!product.code && !product.static,
      )
      .map(async (product) => {
        const granules = await fetchGranulesForProduct(product.code);

        const dateValues = granules
          .map((granule) => {
            const timestamp = granule.timestamp;
            if (timestamp) {
              const zonedDateTime = safeParseUTC(timestamp);
              return zonedDateTime;
            }
            return undefined;
          })
          .filter((date) => date !== undefined);

        const firstDate = dateValues[0];

        const latestDate = firstDate
          ? dateValues.reduce((max, date) => (date.compare(max) > 0 ? date : max), firstDate)
          : undefined;

        return { ...product, granules, latestDate };
      });

    // Assign empty granules to static products
    const staticProducts = allProducts
      .filter((product) => product.static)
      .map((product) => ({ ...product, granules: [] }));

    const settledPromises = await Promise.allSettled(granulePromises);

    const dynamicProductsWithGranules: ProductWithGranules[] = settledPromises
      .filter(
        (result): result is PromiseFulfilledResult<ProductWithGranules> =>
          result.status === 'fulfilled',
      )
      .map((result) => result.value);

    const productsWithGranules = [...dynamicProductsWithGranules, ...staticProducts];

    return { products: productsWithGranules };
  } catch (error) {
    console.error('Unexpected error in fetcher:', error);
    return { products: [] };
  }
}

export const useProducts = (crs: MapCRS) =>
  useSWRImmutable(`/products?crs=${crs}`, () => fetcher(crs));
