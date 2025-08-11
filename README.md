# Web quản lý ghi chú
Web được thiết kế để quản lý ghi chú, công việc cần làm. 

## Mục lục
- [Tính năng](#tính-năng)
- [Kiến trúc](#kiến-trúc)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Các bước cài đặt](#các-bước-cài-đặt)
- [Một số hình ảnh web](#một-số-hình-ảnh-web)
- [API](#API)

## Tính năng
+ Quản lý ghi chú:
  + Các thao tác CRUD (Tạo, Đọc, Cập nhật, Xóa) đầy đủ cho các ghi chú
+ Quản lý thông tin cá nhân:
  + Thay đổi thông tin người dùng.
+ Quản lý tài khoản người dùng:
  + Chức năng đăng ký và đăng nhập an toàn sử dụng JWT (JSON Web Tokens) để xác thực.

## Kiến trúc
+ Backend dựa trên kiến trúc MVC
+ Mẫu thiết kế (Design Patterns): Hệ thống sử dụng Repository để tương tác với cơ sở dữ liệu đồng thời để dễ dàng chuyển đổi giữa database PostgreSQL và MySQL. 
+ Rest API
  
## Công nghệ sử dụng
+ Backend (ExpressJS):
  + Rest API
  + JWT (JSON Web Tokens): Để xác thực người dùng an toàn.
  + AWS S3 : Sử dụng để lưu hình ảnh người dùng
+ Frontend (ReactJS)
+ Cơ sở dữ liệu:
  + PostgreSQL
  + MySQL
+ Swagger UI (để kiểm thử và tài liệu hóa API)

## Các bước cài đặt
1. Clone Repository
2. Cấu hình:
  + Tạo cơ sở dữ liệu trên MySQL hoặc PostgreSQL với các thực thể sau :
    + users(id, name, imageUrl)
    + accounts(id, userId, email, password)
    + notes(id, userId, title, content, isCompleted, tags, dueDate, priority, createdAt, updatedAt)
  + Cấu hình cho JWT trong file env
  + Đăng ký AWS S3 và tạo bucket, sử dụng Shared AWS credentials file và cấu hình tại file env
3. Build : Chạy lệnh npm start cho fronend và backend

## Một số hình ảnh web
<img width="1907" height="865" alt="image" src="https://github.com/user-attachments/assets/bc916966-6d2e-4d77-9b04-a3139fc20702" />
<img width="1874" height="621" alt="image" src="https://github.com/user-attachments/assets/a1f82492-dbdf-4525-9e99-49784f1bf305" />
<img width="1908" height="553" alt="image" src="https://github.com/user-attachments/assets/fe79a4be-59dc-45b0-9bc4-771053096fee" />
<img width="1914" height="414" alt="image" src="https://github.com/user-attachments/assets/34054268-0951-4779-8f08-3fce8942319f" />
<img width="1920" height="436" alt="image" src="https://github.com/user-attachments/assets/d5827309-81be-41ae-91f9-7fe8b51b3340" />
<img width="465" height="435" alt="image" src="https://github.com/user-attachments/assets/4a50fe02-313e-41c4-aa0e-e346f35d881f" />

## API 
<img width="1111" height="903" alt="image" src="https://github.com/user-attachments/assets/7b370c60-9dc2-4b7b-bee0-575f57d963fa" />









