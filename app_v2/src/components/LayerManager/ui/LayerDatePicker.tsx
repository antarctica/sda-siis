import { fromDate } from '@internationalized/date';
import React from 'react';

import { useAPI } from '@/api/api';
import { DatePicker } from '@/components/common/forms/DatePicker';
import { safeParseUTC } from '@/utils/dateUtils';

import { LayerMachineActor } from '../machines/types';

// Todo:
// - At the moment the date picker will only allow one granule per day to be selected.
//   We need to consider what to do if there are multiple granules for a given day? Should
//   there be some way of disambiguating between granules?

function LayerDatePicker({
  isDisabled,
  siisCode,
  layerActor,
  defaultValue,
}: {
  isDisabled: boolean;
  siisCode: string;
  layerActor: LayerMachineActor;
  defaultValue?: Date;
}) {
  const { data } = useAPI('/products/{code}/granules', {
    params: {
      path: { code: siisCode },
      query: {
        maxage: 365 * 24, // 1 year in hours,
      },
    },
  });

  const dateValues = React.useMemo(() => {
    if (data && data.length > 0) {
      return data
        .map((granule) => {
          const timestamp = granule.timestamp;
          if (timestamp) {
            const zonedDateTime = safeParseUTC(timestamp);
            return zonedDateTime;
          }
          return undefined;
        })
        .filter((date) => date !== undefined);
    }
    return [];
  }, [data]);

  const maxDate = React.useMemo(() => {
    const firstDate = dateValues[0];
    if (!firstDate) {
      return undefined;
    }
    // Find the maximum date in the validDateValues array
    return dateValues.reduce((max, date) => (date.compare(max) > 0 ? date : max), firstDate);
  }, [dateValues]);

  return (
    <DatePicker
      label="Select Date"
      navButtonsEnabled
      isDisabled={isDisabled}
      maxValue={maxDate}
      defaultValue={defaultValue ? fromDate(defaultValue, 'UTC') : undefined}
      validDates={dateValues}
      granularity="day"
      onChange={(value) => {
        layerActor.send({
          type: 'LAYER.SET_TIME_INFO',
          timeInfo: {
            type: 'single',
            value: value.toDate('UTC'),
            precision: 'date',
          },
        });
      }}
    />
  );
}

export default LayerDatePicker;
