import { css, cx } from '@styled-system/css';
import * as React from 'react';

import {
  sharedTypographyRecipe,
  TextLineBarRecipeProps,
  textRecipe,
  titleRecipe,
  TitleRecipeProps,
} from './typographyRecipes';
import { textLineBarRecipe } from './typographyRecipes';
import { SharedTypographyRecipeProps, TextRecipeProps } from './typographyRecipes';

type TextProps = SharedTypographyRecipeProps &
  TextRecipeProps &
  React.HTMLAttributes<HTMLElement> & {
    as?: 'p' | 'span' | 'figcaption' | 'li' | 'em';
  };

export function Text({ className, ...props }: TextProps) {
  const { as: Component = 'p', ...rest } = props;

  const [sharedTypographyRecipeProps, rest2] = sharedTypographyRecipe.splitVariantProps(rest);
  const [textRecipeProps, rest3] = textRecipe.splitVariantProps(rest2);

  return (
    <Component
      className={cx(
        sharedTypographyRecipe(sharedTypographyRecipeProps),
        textRecipe(textRecipeProps),
        className,
      )}
      {...rest3}
    />
  );
}

export function Em(props: Omit<TextProps, 'as'>) {
  return (
    <Text {...props} as="em" className={css({ color: 'fg.accent' })} bold={false} italic={true} />
  );
}

export function MailTo(props: Omit<TextProps, 'as'>) {
  const [sharedTypographyRecipeProps, rest2] = sharedTypographyRecipe.splitVariantProps(props);
  const [textRecipeProps, rest3] = textRecipe.splitVariantProps(rest2);

  return (
    <a
      href={`mailto:${props.children}`}
      className={cx(
        sharedTypographyRecipe(sharedTypographyRecipeProps),
        textRecipe(textRecipeProps),
        css({ color: 'fg.accent' }),
      )}
      {...rest3}
    >
      {props.children}
    </a>
  );
}

function addLineBreaks(input: string): React.ReactNode {
  return input.split('_').reduce((acc, part, index, array) => {
    if (index < array.length - 1) {
      return acc.concat(part, '_', <wbr key={index} />);
    }
    return acc.concat(part);
  }, [] as React.ReactNode[]);
}

export function TextUnderScoreBreak({ children, ...props }: TextProps) {
  return (
    <Text {...props}>{typeof children === 'string' ? addLineBreaks(children) : children}</Text>
  );
}

type TitleProps = SharedTypographyRecipeProps &
  TextLineBarRecipeProps &
  TitleRecipeProps &
  React.HTMLAttributes<HTMLHeadingElement> & {
    as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  };

export function Title({ as, className, ...props }: TitleProps) {
  const [sharedTypographyRecipeProps, rest] = sharedTypographyRecipe.splitVariantProps(props);
  const [textLineBarRecipeProps, rest2] = textLineBarRecipe.splitVariantProps(rest);
  const [titleRecipeProps] = titleRecipe.splitVariantProps(rest2);

  const Component = as;
  return (
    <Component
      className={cx(
        sharedTypographyRecipe({ margin: true, ...sharedTypographyRecipeProps }),
        textLineBarRecipe(textLineBarRecipeProps),
        titleRecipe(titleRecipeProps),
        className,
      )}
      {...props}
    />
  );
}
