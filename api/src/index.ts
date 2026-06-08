import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express, {
	type Application,
	type NextFunction,
	type Request,
	type Response,
} from "express";
import { env } from "./lib/env.js";
import authRoutes from "./routes/auth.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/orders.routes.js";
import productRoutes from "./routes/products.routes.js";

const app: Application = express();

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/api", (_req, res) => {
	res.json({ message: "API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
	console.error(err);
	res.status(500).json({ error: "Internal server error" });
});

app.listen(env.PORT, () => {
	console.log(`Server running on port ${env.PORT}`);
});
