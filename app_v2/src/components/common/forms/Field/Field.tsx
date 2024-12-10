import { cx } from '@styled-system/css';
import {
  composeRenderProps,
  FieldError as RACFieldError,
  FieldErrorProps,
  Group,
  GroupProps,
  Input as RACInput,
  InputProps,
  Label as RACLabel,
  LabelProps,
  TextArea as RACTextArea,
  TextAreaProps,
  TextProps,
} from 'react-aria-components';

import { Text } from '../../Typography';
import { fieldBorderRecipe, inputRecipe, textAreaRecipe } from './styles';
import { fieldGroupRecipe } from './styles';
import { validationErrorRecipe } from './styles';
import { labelRecipe } from './styles';

export function Label(props: LabelProps) {
  return <RACLabel {...props} className={cx(labelRecipe(), props.className)} />;
}

export function Description(props: TextProps) {
  return <Text {...props} textStyle="description" slot="description" />;
}

export function FieldError(props: FieldErrorProps) {
  return (
    <RACFieldError
      {...props}
      className={composeRenderProps(props.className, (className) =>
        cx(validationErrorRecipe(), className),
      )}
    />
  );
}

export function FieldGroup(props: GroupProps) {
  return (
    <Group
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        cx(fieldGroupRecipe(renderProps), fieldBorderRecipe(renderProps), className),
      )}
    />
  );
}

export function Input(props: InputProps) {
  return (
    <RACInput
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        cx(inputRecipe(renderProps), className),
      )}
    />
  );
}

export function TextArea(props: TextAreaProps) {
  return (
    <RACTextArea
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        cx(textAreaRecipe(renderProps), className),
      )}
    />
  );
}
