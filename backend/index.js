import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { nanoid } from 'nanoid';
import QRCode from 'qrcode'; // Change this line to import QRCode
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("db connected"))
    .catch((err) => console.log("failed to connect database", err));

const urlSchema = new mongoose.Schema({
    originalUrl: String,
    shortUrl: String,
    clicks: { type: Number, default: 0 },
});

const Url = mongoose.model('Url', urlSchema);

app.post('/api/short', async (req, res) => {
    try {
        const { originalUrl } = req.body;
        if (!originalUrl) return res.status(500).json({ error: 'originalUrl error' });

        const shortUrl = nanoid(8);
        const url = new Url({ originalUrl, shortUrl });
        const myUrl = `http://localhost:3000/${shortUrl}`;

        const qrCodeImg = await QRCode.toDataURL(myUrl); // Use toDataURL instead of toDataUrl
        await url.save();
        return res.status(200).json({ message: "URL Generated", shortUrl: myUrl, qrCodeImg });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/:shortUrl', async (req, res) => {
    try {
        const { shortUrl } = req.params;
        const url = await Url.findOne({ shortUrl });
        if (url) {
            url.clicks++;
            await url.save();
            return res.redirect(url.originalUrl);
        } else {
            return res.status(404).json({ error: 'url not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(3000, () => console.log("server is running on 3000"));
