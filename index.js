const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const app = express();

// المنفذ الإجباري لمنصة Hugging Face هو 7860
const port = 7860; 

// إعداد المتصفح (Puppeteer) ليعمل بكفاءة عالية في بيئة Docker
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './sessions' // حفظ بيانات الجلسة لعدم تكرار الربط
    }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage', // مهم جداً لتجنب استهلاك الذاكرة المفاجئ
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ],
        executablePath: '/usr/bin/google-chrome-stable' // المسار المتوقع للكروم في Docker
    }
});

client.on('ready', () => {
    console.log('الحساب متصل وجاهز للعمل! ✅');
});

// واجهة برمجية لاستقبال طلبات كود الربط
app.get('/get-code', async (req, res) => {
    const phoneNumber = req.query.phone;
    
    if (!phoneNumber) {
        return res.status(400).json({ error: "الرجاء إرسال رقم الهاتف في الرابط (phone=xxxx)" });
    }

    try {
        console.log(`جاري توليد كود لـ: ${phoneNumber}`);
        // طلب الكود من واتساب
        const code = await client.requestPairingCode(phoneNumber);
        res.json({ 
            status: "success",
            code: code 
        });
    } catch (err) {
        console.error("خطأ أثناء توليد الكود:", err);
        res.status(500).json({ error: "فشل في توليد الكود، تأكد من الرقم" });
    }
});

// صفحة ترحيبية بسيطة للتأكد من عمل السيرفر
app.get('/', (req, res) => {
    res.send('WhatsApp Automation Server is Running on Hugging Face 🚀');
});

client.initialize();

app.listen(port, '0.0.0.0', () => {
    console.log(`السيرفر يعمل الآن على الرابط الخاص بـ Hugging Face والمنفذ ${port}`);
});
