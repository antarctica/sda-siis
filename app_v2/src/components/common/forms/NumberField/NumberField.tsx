import { Description, FieldError, FieldGroup, Input, Label } from '@components/common/forms/Field';
import { css, cx } from '@styled-system/css';
import { Flex } from '@styled-system/jsx';
import {
  composeRenderProps,
  NumberField as AriaNumberField,
  NumberFieldProps as AriaNumberFieldProps,
  ValidationResult,
} from 'react-aria-components';

import { IconButton } from '../../Button';
import SvgIcon from '../../SvgIcon';
import { inputContainerRecipe, inputRecipe } from '../Field/styles';

export interface NumberFieldProps extends AriaNumberFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export default function NumberField({
  label,
  description,
  errorMessage,
  ...props
}: NumberFieldProps) {
  return (
    <AriaNumberField
      {...props}
      className={composeRenderProps(props.className, (className) => cx(className))}
    >
      {label && <Label>{label}</Label>}
      <FieldGroup className={inputContainerRecipe()}>
        <Input
          className={({ isFocusVisible }) =>
            cx(inputRecipe({ isFocusVisible }), css({ flexGrow: 1 }))
          }
        />
        <Flex gap="0.5" direction="column" w="5" mr="2">
          <IconButton
            className={css({ h: '3' })}
            disableTooltip
            slot="increment"
            aria-label="Increment"
            variant="primary"
            size="sm"
            icon={<SvgIcon name="icon-chevron-up" size={12} />}
          />

          <IconButton
            className={css({ h: '3' })}
            disableTooltip
            variant="primary"
            size="sm"
            slot="decrement"
            aria-label="Decrement"
            icon={<SvgIcon name="icon-chevron-down" size={12} />}
          />
        </Flex>
      </FieldGroup>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaNumberField>
  );
}
