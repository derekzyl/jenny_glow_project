"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = void 0;
function generateId(order_type) {
    const id = new Date();
    const i = id.toLocaleString();
    const j = i.split(",")[0];
    const k = j.split("/").join("");
    const l = i.split(",")[1];
    const m = l.split(" ")[1];
    const n = m.split(":")[0];
    const o = m.split(":")[1];
    const p = m.split(":")[2];
    const q = Math.round(Math.random() * 90000 + 10000);
    const r = order_type.toUpperCase() + k + n + o + "_" + p + o + n + "_" + q;
    return r;
}
exports.generateId = generateId;
