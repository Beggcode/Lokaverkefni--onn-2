import { Link } from "@tanstack/react-router";
import { useState } from "react";
import styles from "../styling/Footer.module.css";

export default function Footer() {
	const [submitted, setSubmitted] = useState(false);

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
						<form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className={styles.form}>
							<input
								type="email"
								placeholder="your@email.com"
								className={styles.input}
								required
							/>
							<button type="submit" className={styles.submit}>Subscribe</button>
						</form>
					)}
				</div>
			</div>

			<div className={styles.bottom}>
				<p>© {new Date().getFullYear()} NTV. All rights reserved.</p>
			</div>
		</footer>
	);
}
