# Chat Messenger

Ứng dụng Chat Messenger là một ứng dụng trò chuyện thời gian thực được xây dựng bằng React.js cho frontend, Node.js cho backend và MongoDB cho cơ sở dữ liệu. Ứng dụng cho phép người dùng gửi và nhận tin nhắn trong thời gian thực.

## Nội dung

- [Tổng quan](#tổng-quan)
- [Cài đặt môi trường](#cài-đặt-môi-trường)
- [Cách sử dụng](#cách-sử-dụng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Các tính năng](#các-tính-năng)
- [Liên hệ](#liên-hệ)

## Tổng quan

Ứng dụng này sử dụng:
- **React.js** cho giao diện người dùng.
- **Node.js** với **Express** để xử lý các API.
- **Socket.IO** để gửi và nhận tin nhắn theo thời gian thực.
- **MongoDB** để lưu trữ thông tin người dùng và tin nhắn.

## Cài đặt môi trường

### Yêu cầu
- Node.js (>= 14.x)
- MongoDB

### Cài đặt
1. Clone repository:
   ```bash
   git clone https://github.com/yourusername/chat-messenger.git
   cd chat-messenger
2. Cài đặt backend:
  `
   cd backend
   npm install
  `
3. Cài đặt frontend:
``
cd frontend
npm install
``
4. Khởi Động Server:
``
cd backend
node server.js
``
5. Khởi động ứng dụng frontend:
``
cd frontend
npm start
``
Mở trình duyệt và truy cập http://localhost:3000 để sử dụng ứng dụng.
