const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// إعداد المتصفح (Puppeteer) ليعمل داخل Koyeb
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

let pairingCode = "";

client.on('ready', () => {
    console.log('واتساب جاهز للعمل! ✅');
});

// هنا يحدث السحر: طلب كود الربط
client.on('pairing_code', (code) => {
    pairingCode = code;
    console.log('كود الربط الخاص بك هو: ', code);
});

// واجهة بسيطة لموقعك ليسحب الكود
app.get('/get-code', async (req, res) => {
    const phoneNumber = req.query.phone; // نرسل الرقم من موقعك
    if (!phoneNumber) return res.send("أدخل رقم الهاتف أولاً");

    try {
        const code = await client.requestPairingCode(phoneNumber);
        res.json({ code: code });
    } catch (err) {
        res.json({ error: "فشل توليد الكود" });
    }
});

client.initialize();
app.listen(port, () => console.log(`السيرفر يعمل على منفذ ${port}`));
