import { useState } from "react";
import axios from "axios";

export default function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState(null); // Initialize as null

  const handleSubmit = () => {
    axios.post('http://localhost:3000/api/short', { originalUrl })
      .then((res) => {
        setShortUrl({
          shortUrl: res.data.shortUrl, // Extract the shortUrl
          qrCodeImg: res.data.qrCodeImg // Extract the qrCodeImg
        });
        console.log("API RESPONSE", res.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="">
      <input
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
        type="text" name="originalUrl" id="" />
      <button onClick={handleSubmit} type="button" className="bg-blue-600">Shorten</button>

      {
        shortUrl && (
          <div className="mt-6 text-center">
            <p className="text-lg font-medium">Shortened URL: </p>

            <a href={shortUrl.shortUrl} target="_blank" rel="noopener noreferrer">
              {shortUrl.shortUrl} {/* Use shortUrl.shortUrl instead of shortUrl */}
            </a>

            {shortUrl.qrCodeImg && <img src={shortUrl.qrCodeImg} alt="QR code" />} {/* Add check for qrCodeImg */}
          </div>
        )
      }
    </div>
  );
}
