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
      gridTemplateColumns: '[auto auto]',
      gridTemplateRows: '[min-content min-content]',
      columnGap: '2',
      alignItems: 'center',
      fontSize: 'sm',
      textWrap: 'nowrap',
    },
    label: {
      fontWeight: 'bold',
      color: 'fg.accent',
    },
    value: {
      fontSize: 'md',
      color: 'fg',
    },
  },
});

export default function DataGrid({ data }: { data: [Item] | [Item, Item] }) {
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