type Props = { errors: unknown[] };

export default function FieldError({ errors }: Props) {
	if (!errors[0]) return null;
	return <p role="alert">{String(errors[0])}</p>;
}
