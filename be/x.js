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
const r = k + n + o + "_" + p + o + n + "_" + q;

// const c = id.getDate();

// console.log(k, "<----------------", r);
const b = true;
const c = [
  { name: "abj" },
  { name: "love" },
  { name: "sad" },
  { name: "sail" },
  { name: "sword" },
  { name: "snare" },
  { name: "soak" },
];

if (b) {
  c.filter((s) => s.name === "abj").map((f) => (f["amount"] = 100));
}
console.log(c, "amount");
