import { IconButton } from '@/components/Button';

type HeaderActionProps = {
  icon: React.ReactElement;
  title: string;
  onClick: () => void;
};

export function HeaderAction({ icon, title, onClick }: HeaderActionProps) {
  return (
    <IconButton size="md" variant="surface" icon={icon} aria-label={title} onPress={onClick} />
  );
}
