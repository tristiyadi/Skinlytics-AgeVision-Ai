/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const https = require('https');
const path = require('path');

const BASE_URL = 'https://raw.githubusercontent.com/vladmandic/face-api/master/model/';
const MODELS = [
  'tiny_face_detector_model-weights_manifest.json',
  'tiny_face_detector_model.bin',
  'ssd_mobilenetv1_model-weights_manifest.json',
  'ssd_mobilenetv1_model.bin',
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model.bin',
  'age_gender_model-weights_manifest.json',
  'age_gender_model.bin'
];

const TARGET_DIR = path.join(__dirname, 'public', 'models');

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

async function downloadFile(file) {
  const url = `${BASE_URL}${file}`;
  const filePath = path.join(TARGET_DIR, file);
  
  return new Promise((resolve, reject) => {
    console.log(`Downloading ${file}...`);
    const fileStream = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${file}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✓ Finished ${file}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
}

async function start() {
  console.log('Starting model downloads to public/models...');
  for (const model of MODELS) {
    try {
      await downloadFile(model);
    } catch (err) {
      console.error(`Error: ${err.message}`);
    }
  }
  console.log('Download process complete.');
}

start();
