import sharp from "sharp";
import { mkdir } from "node:fs/promises";
await mkdir("public/images", { recursive: true });
for (const [id, ext] of [
  ["concept", "png"],
  ["bedroom", "jpg"],
  ["kitchen", "jpg"],
]) {
  for (const width of [640, 1280, 1800]) {
    await Promise.all(
      ["webp", "avif"].map((format) =>
        sharp(`assets/originals/${id}.${ext}`)
          .resize({ width })
          .toFormat(format, { quality: format === "avif" ? 55 : 78 })
          .toFile(`public/images/${id}-${width}.${format}`),
      ),
    );
  }
}
await sharp("assets/originals/social.png")
  .resize(1200, 630, { fit: "cover" })
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile("public/images/social.jpg");
console.log("Responsive images generated");
