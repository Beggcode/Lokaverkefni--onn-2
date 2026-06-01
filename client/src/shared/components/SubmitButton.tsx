type Props = { isSubmitting: boolean; label: string; loadingLabel: string };

export default function SubmitButton({
  isSubmitting,
  label,
  loadingLabel,
}: Props) {
  return (
    <button type="submit" disabled={isSubmitting}>
      {isSubmitting ? loadingLabel : label}
    </button>
  );
}
