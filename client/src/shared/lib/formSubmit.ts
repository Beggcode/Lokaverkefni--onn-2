export function handleFormSubmit(
	e: React.SyntheticEvent<HTMLFormElement>,
	submit: () => void,
) {
	e.preventDefault();
	e.stopPropagation();
	submit();
}
