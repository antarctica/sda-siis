import DataGrid from '@/components/common/DataGrid';
import DateTime from '@/components/common/DateTime';
import useTime from '@/hooks/useTime';

function getUTCLabel(offset: number): string {
  if (offset === 0) return 'UTC';
  const sign = offset > 0 ? '+' : '-';
  return `UTC${sign}${Math.abs(offset)}`;
}

export function TemporalData() {
  const time = useTime();
  const utcOffset = 3;
  return (
    <DataGrid
      data={[
        {
          label: 'UTC',
          value: (
            <DateTime date={time.toDate()} dateStyle="medium" timeStyle="medium" timeZone="UTC" />
          ),
        },
        {
          label: 'LOCAL',
          value: (
            <>
              <DateTime
                date={time.toDate()}
                dateStyle="medium"
                timeStyle="medium"
                timeZone="UTC"
                utcOffset={utcOffset}
              />{' '}
              <span>({getUTCLabel(utcOffset)})</span>
            </>
          ),
        },
      ]}
    ></DataGrid>
  );
}
