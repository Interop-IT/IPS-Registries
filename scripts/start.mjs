// Production startup must not require tsx, Vite, or other devDependencies.
process.env.NODE_ENV = "production";
await import("../dist/index.js");
