"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3500;
app.use('/', express_1.default.static(path_1.default.join(__dirname, '/public'))); // To search for assets and css in this folder
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));