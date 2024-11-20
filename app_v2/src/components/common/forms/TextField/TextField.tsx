import { cx } from '@styled-system/css';
import {
  composeRenderProps,
  TextField as AriaTextField,
  TextFieldProps as AriaTextFieldProps,
  ValidationResult,
} from 'react-aria-components';

import { Description, FieldError, Label } from '../Field';
import { Input } from '../Field/Field';
import { fieldBorderRecipe, fieldRecipe, inputContainerRecipe, inputRecipe } from '../Field/styles';

export interface TextFieldProps extends AriaTextFieldProps {
  label?: string;
  placeholder?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

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
      className={composeRenderProps(props.className, (className) => cx(fieldRecipe(), className))}
    >
      {label && <Label>{label}</Label>}
      <Input
        className={({ isFocusVisible, isInvalid, isDisabled }) =>
          cx(
            inputContainerRecipe(),
            inputRecipe({ isFocusVisible }),
            fieldBorderRecipe({ isInvalid, isDisabled }),
          )
        }
        placeholder={placeholder}
      />
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaTextField>
  );
}
