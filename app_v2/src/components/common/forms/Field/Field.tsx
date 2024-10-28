'use client';

import { cva, cx } from '@styled-system/css';
import { Label as RACLabel, LabelProps } from 'react-aria-components';

const labelRecipe = cva({
  base: {
    textTransform: 'uppercase',
    fontSize: 'sm',
  },
});

export function Label(props: LabelProps) {
  return <RACLabel {...props} className={cx(labelRecipe(), props.className)} />;
}

// export function Description(props: TextProps) {
//   return (
//     <Text
//       {...props}
//       slot="description"
//       className={customTwMerge('text-body-sm', props.className)}
//     />
//   );
// }

// export function FieldError(props: FieldErrorProps) {
//   return (
//     <RACFieldError
//       {...props}
//       className={composeTailwindRenderProps(
//         props.className,
//         'text-body-sm text-red-500 forced-colors:text-[Mark]',
//       )}
//     />
//   );
// }

// export const fieldBorderStyles = customTV({
//   variants: {
//     isFocusWithin: {
//       false: 'border-primary-blue',
//       true: 'border-primary-blue ',
//     },
//     isInvalid: {
//       true: 'border-red-600',
//     },
//     isDisabled: {
//       true: 'border-primary-blue-surface',
//     },
//   },
// });

// export const fieldGroupStyles = customTV({
//   extend: insetfocusRing,
//   base: 'group flex items-center h-9 bg-dark-blue border overflow-hidden',
//   variants: fieldBorderStyles.variants,
// });

// export function FieldGroup(props: GroupProps) {
//   return (
//     <Group
//       {...props}
//       className={composeRenderProps(props.className, (className, renderProps) =>
//         fieldGroupStyles({ ...renderProps, className }),
//       )}
//     />
//   );
// }

// export function Input(props: InputProps) {
//   return (
//     <RACInput
//       {...props}
//       className={composeTailwindRenderProps(
//         props.className,
//         'bg-transparent placeholder:text-primary-blue placeholder:text-body-xs border-none',
//       )}
//     />
//   );
// }

// export function TextArea(props: TextAreaProps) {
//   return (
//     <RACTextArea
//       {...props}
//       className={composeTailwindRenderProps(
//         props.className,
//         'bg-transparent placeholder:text-primary-blue placeholder:text-body-xs border-none',
//       )}
//     />
//   );
// }
