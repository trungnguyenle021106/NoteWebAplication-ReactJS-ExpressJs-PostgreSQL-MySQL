const AWS = require('aws-sdk');

// Cấu hình AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Lấy từ .env
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Lấy từ .env
  region: process.env.AWS_REGION, // Vùng bucket (ví dụ: us-east-1)
});

module.exports = s3;
// file: s3-context.js
