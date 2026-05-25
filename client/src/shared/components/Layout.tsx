import { Link } from '@tanstack/react-router'

type Props = { children: React.ReactNode };

export default function Layout({ children }: Props) {
	return (
		<>
			<nav>
				<Link to="/">Home</Link>
				{' | '}
				<Link to="/products">Products</Link>
				{' | '}
				<Link to="/cart">Cart</Link>
			</nav>
			<main>{children}</main>
		</>
	);
}
