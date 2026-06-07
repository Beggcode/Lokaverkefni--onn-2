import * as Form from "@radix-ui/react-form";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import styles from "../styling/Footer.module.css";

export default function Footer() {
	const [submitted, setSubmitted] = useState(false);

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSubmitted(true);
	}

	return (
		<footer className={styles.footer}>
			<div className={styles.inner}>
				<div className={styles.brand}>
					<span className={styles.logo}>ntv</span>
					<p className={styles.tagline}>Gear for those who know better.</p>
				</div>

				<div className={styles.links}>
					<Link to="/products" className={styles.link}>
						Shop
					</Link>
					<Link to="/cart" className={styles.link}>
						Cart
					</Link>
				</div>

				<div className={styles.newsletter}>
					<p className={styles.newsletterLabel}>Join the inner circle</p>
					{submitted ? (
						<p className={styles.successMessage}>
							You're in. Expect transformation.
						</p>
					) : (
						<Form.Root onSubmit={handleSubmit} className={styles.form}>
							<Form.Field name="email" className={styles.field}>
								<Form.Control asChild>
									<input
										type="email"
										placeholder="your@email.com"
										className={styles.input}
										required
									/>
								</Form.Control>
								<Form.Message match="valueMissing" className={styles.error}>
									Email is required.
								</Form.Message>
								<Form.Message match="typeMismatch" className={styles.error}>
									Enter a valid email.
								</Form.Message>
							</Form.Field>
							<Form.Submit className={styles.submit}>Subscribe</Form.Submit>
						</Form.Root>
					)}
				</div>
			</div>

			<div className={styles.bottom}>
				<p>© {new Date().getFullYear()} NTV. All rights reserved.</p>
			</div>
		</footer>
	);
}
