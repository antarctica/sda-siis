import { DateValue } from '@internationalized/date';

import { DateRangePicker } from '@/components/common/forms/DatePicker';
import { RangeValue } from '@/utils/dateUtils';

import { LayerMachineActor } from '../../machines/types';

function LayerDateRangePicker({
  isDisabled,
  layerActor,
  defaultValue,
  maxDate,
}: {
  isDisabled: boolean;
  layerActor: LayerMachineActor;
  defaultValue?: RangeValue;
  maxDate?: DateValue;
}) {
  return (
    <DateRangePicker
      label="Select Date"
      isDisabled={isDisabled}
      maxValue={maxDate}
      defaultValue={defaultValue}
      granularity="day"
      onChange={(value) => {
        layerActor.send({
          type: 'LAYER.SET_TIME_INFO',
          timeInfo: {
            type: 'range',
            start: value.start.toDate('UTC'),
            end: value.end.toDate('UTC'),
            precision: 'date',
          },
        });
      }}
    />
  );
}

export default LayerDateRangePicker;
