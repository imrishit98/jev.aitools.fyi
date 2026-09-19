import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FONT_DIR = path.join(__dirname, "fonts");
const ROOT = path.resolve(__dirname, "../..");
const DM_SANS_DIR = path.join(
  ROOT,
  "node_modules",
  "@fontsource",
  "dm-sans",
  "files",
);

const FACULTY = {
  file: "FacultyGlyphic-Regular.ttf",
  url: "https://raw.githubusercontent.com/google/fonts/main/ofl/facultyglyphic/FacultyGlyphic-Regular.ttf",
};

const DM_SANS_WEIGHTS = [
  { file: "dm-sans-latin-400-normal.woff", weight: 400 },
  { file: "dm-sans-latin-500-normal.woff", weight: 500 },
  { file: "dm-sans-latin-600-normal.woff", weight: 600 },
  { file: "dm-sans-latin-700-normal.woff", weight: 700 },
];

async function ensureFacultyFont() {
  await fs.mkdir(FONT_DIR, { recursive: true });
  const dest = path.join(FONT_DIR, FACULTY.file);
  try {
    await fs.access(dest);
    return dest;
  } catch {
    const res = await fetch(FACULTY.url);
    if (!res.ok) throw new Error(`Font fetch failed ${FACULTY.url}: ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(dest, buf);
    return dest;
  }
}

/** @returns {Promise<import('satori').FontOptions[]>} */
export async function loadOgFonts() {
  const facultyPath = await ensureFacultyFont();
  const facultyData = await fs.readFile(facultyPath);

  const fonts = [
    {
      name: "Faculty Glyphic",
      data: facultyData,
      weight: 400,
      style: "normal",
    },
  ];

  for (const { file, weight } of DM_SANS_WEIGHTS) {
    const filePath = path.join(DM_SANS_DIR, file);
    fonts.push({
      name: "DM Sans",
      data: await fs.readFile(filePath),
      weight,
      style: "normal",
    });
  }

  return fonts;
}
