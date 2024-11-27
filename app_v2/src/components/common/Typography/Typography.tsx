import { css, cva, cx, RecipeVariantProps } from '@styled-system/css';
import * as React from 'react';

const typographyRecipe = cva({
  base: {
    textStyle: 'body',
  },
  variants: {
    margin: {
      true: {
        mb: '2',
      },
    },
    bold: {
      true: {
        fontWeight: 'semibold',
      },
    },
    italic: {
      true: {
        fontStyle: 'italic',
      },
    },
    underline: {
      true: {
        textDecoration: 'underline',
      },
    },
    listitem: {
      true: {
        ml: '8',
      },
    },
    heading: {
      'heading-1': {
        textStyle: 'heading1',
      },
      'heading-2': {
        textStyle: 'heading2',
      },
      'heading-3': {
        textStyle: 'heading3',
      },
      'heading-4': {
        textStyle: 'heading4',
      },
      body: {
        textStyle: 'body',
      },
    },

    textPosition: {
      start: {
        gridTemplateColumns: '[ auto 1fr]',
        '&::after': {
          content: "''",
          display: 'block',
          height: '0.5',
          backgroundColor: 'bg.base.border',
          width: 'full',
        },
      },
      middle: {
        gridTemplateColumns: '[1fr auto 1fr]',
        '&::before, &::after': {
          content: "''",
          display: 'block',
          height: '0.5',
          backgroundColor: 'bg.base.border',
          width: 'full',
        },
      },
      end: {
        gridTemplateColumns: '[1fr auto]',
        '&::before': {
          content: "''",
          display: 'block',
          height: '[1px]',
          backgroundColor: 'bg.base.border',
          width: 'full',
        },
      },
    },
  },
  compoundVariants: [
    {
      heading: [],
      css: {
        textUnderlineOffset: '2px',
        color: 'fg',
        _dark: {
          color: 'fg',
        },
      },
    },
    {
      textPosition: ['start', 'middle', 'end'],
      css: {
        display: 'grid',
        gridGap: '2',
        alignItems: 'center',
      },
    },
  ],
});

type TypographyProps = RecipeVariantProps<typeof typographyRecipe> &
  React.HTMLAttributes<HTMLElement> & {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'figcaption' | 'li';
    margin?: boolean;
  };

function Typography({
  margin = false,
  bold,
  italic,
  textPosition,
  heading,
  className,
  ...localProps
}: TypographyProps) {
  const { as: Component = 'p', ...restProps } = localProps;
  return (
    <Component
      className={cx(
        typographyRecipe({
          listitem: Component === 'li',
          bold,
          textPosition,
          heading,
          italic,
          margin,
        }),
        className,
      )}
      {...restProps}
    />
  );
}

export function Em({ children, className }: TypographyProps) {
  return (
    <span
      className={cx(
        typographyRecipe({ bold: true, italic: false }),
        css({ color: 'fg.accent' }),
        className,
      )}
    >
      {children}
    </span>
  );
}

export function MailTo({ children, className }: TypographyProps) {
  return (
    <a
      href={`mailto:${children}`}
      className={cx(
        typographyRecipe({ bold: true, italic: false, underline: true }),
        css({ color: 'fg.accent' }),
        className,
      )}
    >
      {children}
    </a>
  );
}

export function Text({ children, ...props }: TypographyProps) {
  return (
    <Typography margin={true} {...props}>
      {children}
    </Typography>
  );
}

export function Heading({
  children,
  ...props
}: TypographyProps & {
  heading: 'heading-1' | 'heading-2' | 'heading-3' | 'heading-4' | 'heading-mega' | 'body';
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}) {
  return (
    <Typography margin {...props} heading={props.heading || 'heading-1'}>
      {children}
    </Typography>
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

export function TextUnderScoreBreak({ children, ...props }: TypographyProps) {
  return (
    <Typography {...props}>
      {typeof children === 'string' ? addLineBreaks(children) : children}
    </Typography>
  );
}

export default Typography;
