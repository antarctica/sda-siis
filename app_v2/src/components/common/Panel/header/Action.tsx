import { IconButton, IconButtonProps } from '@/components/common/Button';

export type HeaderActionProps = Omit<IconButtonProps, 'aria-label'> & {
  selected?: boolean;
  title: string;
};

export function HeaderAction({
  icon,
  title,
  onPress,
  onPressStart,
  autoFocus = false,
  selected = false,
  ...props
}: HeaderActionProps) {
  return (
    <IconButton
      autoFocus={autoFocus}
      size="md"
      variant={selected ? 'outline' : 'surface'}
      icon={icon}
      aria-label={title}
      onPress={onPress}
      onPressStart={onPressStart}
      {...props}
    />
  );
}
