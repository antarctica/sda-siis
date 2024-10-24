import useSWR from 'swr';

export const SHIP_SENSOR_REFRESH_INTERVAL = 3000; // 3 seconds
const OGC_ENDPOINT = import.meta.env.VITE_SERVICE_API_OGC_ENDPOINT;

interface SensorData {
  latitude: number | null;
  longitude: number | null;
  speed: number | null;
  heading: number | null;
  depth: number | null;
  pos_online: boolean;
  speed_online: boolean;
  heading_online: boolean;
  depth_online: boolean;
}

type SensorStatus = 'FULLY_ONLINE' | 'PARTIALLY_ONLINE' | 'OFFLINE' | 'ERROR';

const fetcher = async (url: string): Promise<SensorData> => {
  const params = new URLSearchParams({
    service: 'WFS',
    version: '1.0.0',
    request: 'GetFeature',
    typeName: 'siis:vw_sensor',
    maxFeatures: '1',
    outputFormat: 'application/json',
  });

  const response = await fetch(`${url}?${params}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();

  const feature = data.features[0];
  return {
    latitude: feature.geometry.coordinates[1],
    longitude: feature.geometry.coordinates[0],
    speed: feature.properties.speed,
    heading: feature.properties.heading,
    depth: feature.properties.depth,
    pos_online: feature.properties.pos_online,
    speed_online: feature.properties.speed_online,
    heading_online: feature.properties.heading_online,
    depth_online: feature.properties.depth_online,
  };
};

export function useSensorData() {
  const { data, error, isLoading } = useSWR<SensorData>(
    `${OGC_ENDPOINT}/geoserver/siis/ows`,
    fetcher,
    {
      refreshInterval: SHIP_SENSOR_REFRESH_INTERVAL,
    },
  );

  const getSensorStatus = (): SensorStatus => {
    if (error) return 'ERROR';
    if (!data) return 'OFFLINE';

    const onlineStatuses = [
      data.pos_online,
      data.speed_online,
      data.heading_online,
      data.depth_online,
    ];

    if (onlineStatuses.every((status) => status)) return 'FULLY_ONLINE';
    if (onlineStatuses.some((status) => status)) return 'PARTIALLY_ONLINE';
    return 'OFFLINE';
  };

  const sensorStatus = getSensorStatus();

  return {
    sensorData: data,
    isLoading,
    isError: error,
    sensorStatus,
  };
}

export function useShipPosition() {
  const { sensorData, isLoading, isError, sensorStatus } = useSensorData();
  return {
    latitude: sensorData?.latitude ?? null,
    longitude: sensorData?.longitude ?? null,
    isOnline: sensorData?.pos_online ?? false,
    isLoading,
    isError,
    sensorStatus,
  };
}

export function useShipSpeed() {
  const { sensorData, isLoading, isError, sensorStatus } = useSensorData();
  return {
    speed: sensorData?.speed ?? null,
    isOnline: sensorData?.speed_online ?? false,
    isLoading,
    isError,
    sensorStatus,
  };
}

export function useShipHeading() {
  const { sensorData, isLoading, isError, sensorStatus } = useSensorData();
  return {
    heading: sensorData?.heading ?? null,
    isOnline: sensorData?.heading_online ?? false,
    isLoading,
    isError,
    sensorStatus,
  };
}

export function useShipDepth() {
  const { sensorData, isLoading, isError, sensorStatus } = useSensorData();
  return {
    depth: sensorData?.depth ?? null,
    isOnline: sensorData?.depth_online ?? false,
    isLoading,
    isError,
    sensorStatus,
  };
}
