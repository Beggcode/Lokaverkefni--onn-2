type Props = { errors: unknown[] };

export default function FieldError({ errors }: Props) {
	if (!errors[0]) return null;
	return (
		<p
			role="alert"
			style={{
				margin: 0,
				fontSize: 13,
				color: "red",
				fontFamily: "Inter, sans-serif",
			}}
		>
			{String(errors[0])}
		</p>
	);
}
