import { cva, cx } from '@styled-system/css';
import {
  composeRenderProps,
  DateField as AriaDateField,
  DateFieldProps as AriaDateFieldProps,
  DateInput as AriaDateInput,
  DateInputProps,
  DateSegment,
  DateValue,
  ValidationResult,
} from 'react-aria-components';

import { Description, FieldError, Label } from '../Field';
import { fieldBorderRecipe, fieldRecipe, inputRecipe } from '../Field/styles';

export interface DateFieldProps<T extends DateValue> extends AriaDateFieldProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

const segmentStyles = cva({
  base: {
    display: 'inline',
    p: '0.5',
    px: '0.5',
    rounded: 'sm',
    outline: 'none',
  },
  variants: {
    isPlaceholder: {
      true: { color: 'fg.muted' },
    },
    isDisabled: {
      true: { color: 'fg.muted' },
    },
    isFocused: {
      true: { bg: 'bg.accent', color: 'fg.accent.contrast' },
    },
  },
});

export function DateInput(props: Omit<DateInputProps, 'children'>) {
  return (
    <AriaDateInput
      {...props}
      className={composeRenderProps(props.className, (className) => cx(inputRecipe(), className))}
    >
      {(segment) => <DateSegment segment={segment} className={segmentStyles} />}
    </AriaDateInput>
  );
}

export function DateField<T extends DateValue>({
  label,
  description,
  errorMessage,
  ...props
}: DateFieldProps<T>) {
  return (
    <AriaDateField
      {...props}
      className={composeRenderProps(props.className, (className) => cx(fieldRecipe(), className))}
    >
      {label && <Label>{label}</Label>}
      <DateInput
        className={({ isInvalid, isDisabled }) => cx(fieldBorderRecipe({ isInvalid, isDisabled }))}
      />
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaDateField>
  );
}
