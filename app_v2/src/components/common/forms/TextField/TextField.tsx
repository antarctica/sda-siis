import { cx } from '@styled-system/css';
import { cva } from '@styled-system/css/cva.mjs';
import {
  composeRenderProps,
  TextField as AriaTextField,
  TextFieldProps as AriaTextFieldProps,
  ValidationResult,
} from 'react-aria-components';

import { Description, FieldError, Label } from '../Field';
import { Input } from '../Field/Field';
import { fieldBorderRecipe } from '../Field/styles';

const inputStyles = cva({
  base: {},
  variants: {
    isFocused: {
      true: {
        insetFocusRing: true,
      },
      false: {
        insetFocusRing: false,
      },
    },
  },
});

export interface TextFieldProps extends AriaTextFieldProps {
  label?: string;
  placeholder?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

const textFieldRecipe = cva({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1',
    mb: '2',
  },
});

export default function TextField({
  label,
  description,
  errorMessage,
  placeholder,
  ...props
}: TextFieldProps) {
  return (
    <AriaTextField
      {...props}
      className={composeRenderProps(props.className, (className) =>
        cx(textFieldRecipe(), className),
      )}
    >
      {label && <Label>{label}</Label>}
      <Input
        className={({ isFocused, isInvalid, isDisabled }) =>
          cx(inputStyles({ isFocused }), fieldBorderRecipe({ isInvalid, isDisabled }))
        }
        placeholder={placeholder}
      />
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaTextField>
  );
}
