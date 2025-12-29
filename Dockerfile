# استخدام صورة تحتوي على Node.js وكروم مثبت مسبقاً
FROM ghcr.io/puppeteer/puppeteer:latest

# تحديد المستخدم والمجلد
USER root
WORKDIR /app

# نسخ ملفات المشروع
COPY package*.json ./
RUN npm install

# نسخ بقية الكود
COPY . .

# تشغيل السيرفر على منفذ 7860
ENV PORT=7860
EXPOSE 7860

CMD ["node", "index.js"]
