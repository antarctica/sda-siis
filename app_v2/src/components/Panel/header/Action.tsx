import { IconButton } from '@/components/Button';

type HeaderActionProps = {
  icon: React.ReactElement;
  title: string;
  onClick: () => void;
  autoFocus?: boolean;
};

export function HeaderAction({ icon, title, onClick, autoFocus = false }: HeaderActionProps) {
  return (
    <IconButton
      autoFocus={autoFocus}
      size="md"
      variant="surface"
      icon={icon}
      aria-label={title}
      onPress={onClick}
    />
  );
}
