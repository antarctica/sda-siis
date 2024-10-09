import { motion } from 'framer-motion';
import * as React from 'react';

type SVGProps = Omit<React.HTMLAttributes<HTMLOrSVGElement>, 'onChange'>;
export interface Props extends SVGProps {
  onChange?: (checked: boolean) => void;
  checked: boolean;
  style?: React.CSSProperties;
  size?: number | string;
  moonColor?: string;
  sunColor?: string;
}

export function DarkModeSwitch({
  onChange,
  checked = false,
  size = 24,
  moonColor = 'white',
  sunColor = 'black',
  style,
}: Props) {
  const toggle = () => onChange?.(!checked);
  const id = React.useId();
  const uniqueMaskId = `circle-mask-${id}`;

  return (
    <motion.svg
      animate={{
        rotate: checked ? 40 : 90,
      }}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      color={checked ? moonColor : sunColor}
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
      onClick={toggle}
      style={{
        ...style,
      }}
    >
      <mask id={uniqueMaskId}>
        <rect x="0" y="0" width="100%" height="100%" fill="white" />
        <motion.circle
          animate={{
            cx: checked ? '50%' : '100%',
            cy: checked ? '23%' : '0%',
          }}
          r="9"
          fill="black"
        />
      </mask>

      <motion.circle
        cx="12"
        cy="12"
        fill={checked ? moonColor : sunColor}
        animate={{
          r: checked ? 9 : 5,
        }}
        mask={`url(#${uniqueMaskId})`}
      />
      <motion.g
        stroke="currentColor"
        animate={{
          opacity: checked ? 0 : 1,
        }}
      >
        <path d="M14.828 14.828a4 4 0 1 0 -5.656 -5.656a4 4 0 0 0 5.656 5.656z" />
        <path d="M6.343 17.657l-1.414 1.414" />
        <path d="M6.343 6.343l-1.414 -1.414" />
        <path d="M17.657 6.343l1.414 -1.414" />
        <path d="M17.657 17.657l1.414 1.414" />
        <path d="M4 12h-2" />
        <path d="M12 4v-2" />
        <path d="M20 12h2" />
        <path d="M12 20v2" />
      </motion.g>
    </motion.svg>
  );
}
