FROM node:20-alpine

WORKDIR /app

# คัดลอกไฟล์จัดการแพ็กเกจ
COPY package*.json ./
RUN npm install

# คัดลอกโค้ดทั้งหมด
COPY . .

# React โดยปกติจะใช้พอร์ต 3000
EXPOSE 3000

# ใช้ npm start สำหรับโหมด Development
CMD ["npm", "start"]