"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const db_1 = require("./db");
const routes_1 = __importDefault(require("./routes"));
const PORT = parseInt(process.env.PORT || '4002', 10);
// ─── Ensure data dirs ─────────────────────────────────────────────────────────
const DATA_DIRS = [
    path.join(__dirname, '..', 'data', 'input'),
    path.join(__dirname, '..', 'data', 'db'),
    path.join(__dirname, '..', 'data', 'audit'),
];
for (const dir of DATA_DIRS) {
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir, { recursive: true });
}
// ─── Init DB ──────────────────────────────────────────────────────────────────
(0, db_1.getDb)();
// ─── App ──────────────────────────────────────────────────────────────────────
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json({ limit: '20mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '20mb' }));
// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/', routes_1.default);
// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
    const err = { error: 'Not found', timestamp: new Date().toISOString() };
    res.status(404).json(err);
});
// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
    console.error('[ERROR]', err.message);
    const body = {
        error: 'Internal server error',
        details: err.message,
        timestamp: new Date().toISOString(),
    };
    res.status(500).json(body);
});
// ─── Start ────────────────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
    console.log(`\n✅ Wisdom Extractor running on http://localhost:${PORT}`);
    console.log(`📋 GET  http://localhost:${PORT}/health`);
    console.log(`🧠 POST http://localhost:${PORT}/extract`);
    console.log(`📦 POST http://localhost:${PORT}/extract-batch`);
    console.log(`📚 GET  http://localhost:${PORT}/teachings`);
    console.log(`📖 GET  http://localhost:${PORT}/teachings/:id`);
    console.log(`🔍 GET  http://localhost:${PORT}/audit/:id`);
    console.log(`🔄 POST http://localhost:${PORT}/teachings/sync\n`);
});
// ─── Graceful shutdown ────────────────────────────────────────────────────────
process.on('SIGTERM', () => {
    console.log('[shutdown] SIGTERM received');
    server.close(() => {
        (0, db_1.closeDb)();
        process.exit(0);
    });
});
process.on('SIGINT', () => {
    console.log('[shutdown] SIGINT received');
    server.close(() => {
        (0, db_1.closeDb)();
        process.exit(0);
    });
});
exports.default = app;
//# sourceMappingURL=index.js.map