"use strict";
// import app from './app';
// import { config } from './app/config';
// const PORT = config.app.port || 5000;
// const server = app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`📍 Environment: ${config.app.nodeEnv}`);
//   console.log(`🌐 Local URL: http://localhost:${PORT}`);
// });
// // Graceful shutdown for SIGTERM
// process.on('SIGTERM', () => {
//   console.log('SIGTERM received, shutting down gracefully...');
//   server.close(() => {
//     console.log('✅ Process terminated gracefully');
//     process.exit(0);
//   });
// });
// // Graceful shutdown for SIGINT (Ctrl+C)
// process.on('SIGINT', () => {
//   console.log('SIGINT received, shutting down gracefully...');
//   server.close(() => {
//     console.log('✅ Process terminated gracefully');
//     process.exit(0);
//   });
// });
// // Handle uncaught exceptions
// process.on('uncaughtException', (err) => {
//   console.error('❌ Uncaught Exception:', err);
//   console.error('Stack:', err.stack);
//   process.exit(1);
// });
// // Handle unhandled promise rejections
// process.on('unhandledRejection', (reason, promise) => {
//   console.error('❌ Unhandled Rejection at:', promise);
//   console.error('Reason:', reason);
//   server.close(() => {
//     process.exit(1);
//   });
// });
// export default app;
