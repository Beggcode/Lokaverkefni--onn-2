export function handleFormSubmit(
	e: Event,
	submit: () => void,
) {
	e.preventDefault();
	e.stopPropagation();
	submit();
}
