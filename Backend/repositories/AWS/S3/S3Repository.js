// file: backend/repositories/S3Repository.js

const s3 = require('../../../aws_context/s3-context');
const BaseRepository = require('../../BaseRepository'); // Đảm bảo đường dẫn chính xác

class S3Repository extends BaseRepository {
    constructor(s3, bucketName) {
        // Gọi constructor của lớp cha
        super(s3);
        this.bucketName = bucketName;
    }

    async uploadFile(key, body, contentType) {
        const params = {
            Bucket: this.bucketName,
            Key: key, // Tên file không thêm .json
            Body: body, // Dữ liệu dạng Buffer
            ContentType: contentType // Lấy từ req.file
        };
        try {
            await this.context.putObject(params).promise();
            console.log(`File đã được tải lên thành công: ${key}`);
            return true;
        } catch (error) {
            console.error(`Lỗi khi tải file ${key}:`, error);
            return false;
        }
    }

    async deleteFile(key) {
        const params = {
            Bucket: this.bucketName,
            Key: key, // Xóa file theo key ban đầu
        };
        try {
            await this.context.deleteObject(params).promise();
            console.log(`File đã được xóa thành công: ${params.Key}`);
            return true;
        } catch (error) {
            console.error(`Lỗi khi xóa file ${params.Key}:`, error);
            return false;
        }
    }
}

module.exports = S3Repository;