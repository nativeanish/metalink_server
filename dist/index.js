"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const register_view_1 = __importDefault(require("./routers/register_view"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const register_subdomain_1 = __importDefault(require("./routers/register_subdomain"));
const check_subdomain_1 = __importDefault(require("./routers/check_subdomain"));
const register_click_1 = __importDefault(require("./routers/register_click"));
dotenv_1.default.config();
validateEnv(["NODE_ENV", "KEY", "REDIS_URL", "REDIS_TOKEN"]);
const app = (0, express_1.default)();
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
else if (process.env.NODE_ENV === "production") {
    app.use((0, morgan_1.default)("combined"));
}
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (_req, res) => {
    res.status(200).send("Ping Pong");
});
app.use("/check", check_subdomain_1.default);
app.use("/register", register_subdomain_1.default);
app.use("/register_view", register_view_1.default);
app.use("/register_click", register_click_1.default);
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});
app.listen(process.env.PORT || 4000, () => {
    console.log(`Server is running at ${process.env.PORT || 4000} port`);
});
const server = app;
function validateEnv(requiredEnvVars) {
    const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
    if (missingVars.length > 0) {
        console.error(`Error: Missing required environment variables: ${missingVars.join(", ")}`);
        process.exit(1); // Exit the application with an error code
    }
}
