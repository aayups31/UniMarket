import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const sourceDir = path.join(root, 'Waterloo Pics');
const outputDir = path.join(root, 'public', 'waterloo');

const jobs = [
  {
    input: 'slc_outside.webp',
    output: 'slc-exterior.webp',
    width: 2400,
  },
  {
    input: 'slc_inside.avif',
    output: 'slc-interior.webp',
    width: 1600,
  },
  {
    input: 'uwaterloo-sign-dp-winter.avif',
    output: 'waterloo-sign-winter.webp',
    width: 1920,
  },
  {
    input: 'dp-library.jpg',
    output: 'dp-library-autumn.webp',
    width: 1200,
  },
  {
    input: 'uwaterloo-board.avif',
    output: 'waterloo-board.webp',
    width: 960,
  },
  {
    input: 'waterloo-city-aerial-view.jpg',
    output: 'waterloo-city-dusk.webp',
    width: 1200,
  },
  {
    input: 'UniversityOfWaterloo_logo_horiz_rgb.png',
    output: 'waterloo-wordmark.webp',
    width: 1400,
    alpha: true,
  },
  {
    input: 'Waterloo-warriors-logo',
    output: 'warriors-lockup.webp',
    width: 1400,
    alpha: true,
  },
  {
    input: 'warriors-head.avif',
    output: 'warriors-head.webp',
    width: 1640,
    alpha: true,
  },
  {
    input: 'uwaterloo-circle-badge.webp',
    output: 'waterloo-circle-badge.webp',
    width: 800,
  },
];

await fs.mkdir(outputDir, { recursive: true });

for (const job of jobs) {
  const inputPath = path.join(sourceDir, job.input);
  const outputPath = path.join(outputDir, job.output);

  await sharp(inputPath)
    .rotate()
    .resize({
      width: job.width,
      fit: 'inside',
      withoutEnlargement: false,
      kernel: sharp.kernel.lanczos3,
    })
    .webp({
      quality: job.alpha ? 96 : 92,
      alphaQuality: 100,
      effort: 6,
      smartSubsample: true,
    })
    .toFile(outputPath);

  const metadata = await sharp(outputPath).metadata();
  console.log(`${job.output}: ${metadata.width}x${metadata.height}`);
}
