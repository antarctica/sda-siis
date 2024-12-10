import { sva } from '@styled-system/css';
import React from 'react';

interface Item {
  label: string;
  value: string | React.ReactNode;
}

const datagridRecipe = sva({
  slots: ['gridContainer', 'label', 'value'],
  base: {
    gridContainer: {
      display: 'grid',
      alignItems: 'center',
      gridTemplateColumns: '[min-content min-content]',
      gridTemplateRows: '[min-content min-content]',
      columnGap: '4',
      textWrap: 'nowrap',
      fontSize: 'sm',
    },
    label: {
      color: 'fg.accent',
      textTransform: 'uppercase',
      fontWeight: 'bold',
    },
    value: {
      color: 'fg',
      fontSize: 'md',
    },
  },
});

export default function DataGrid({ data }: { data: Item[] }) {
  const { gridContainer, label, value } = datagridRecipe();
  return (
    <dl className={gridContainer}>
      {data.map((item, index) => (
        <React.Fragment key={index}>
          <dt className={label}>{item.label}</dt>
          <dd className={value}>{item.value}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
