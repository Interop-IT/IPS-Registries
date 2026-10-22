// Set the mode before loading the server; works in Windows and POSIX shells.
process.env.NODE_ENV = "development";
await import("../server/index.ts");
