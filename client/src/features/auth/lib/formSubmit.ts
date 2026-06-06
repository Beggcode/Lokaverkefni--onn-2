interface FormSubmitEvent {
	preventDefault(): void;
	stopPropagation(): void;
}

export function handleFormSubmit(e: FormSubmitEvent, submit: () => void) {
	e.preventDefault();
	e.stopPropagation();
	submit();
}
