const express = require('express');
const app = express();
const http = require('http').createServer(app);
const fs = require('fs');

// CORS ayarı
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

// Socket.io yapılandırması (cors eklendi)
const io = require('socket.io')(http, {
    cors: { origin: "*" }
});

app.use(express.static('public'));

const sehirler = ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana", "Konya", "Gaziantep", "Şanlıurfa", "Mersin", "Diyarbakır", "Hatay", "Manisa", "Kayseri", "Samsun", "Balıkesir", "Kahramanmaraş", "Van", "Aydın", "Tekirdağ", "Denizli", "Sakarya", "Muğla", "Eskişehir", "Mardin", "Trabzon", "Malatya", "Ordu", "Erzurum", "Afyonkarahisar", "Sivas", "Tokat", "Zonguldak", "Adıyaman", "Kütahya", "Çorum", "Çanakkale", "Ağrı", "Isparta", "Yozgat", "Edirne", "Düzce", "Kırklareli", "Siirt", "Nevşehir", "Niğde", "Kars", "Kırşehir", "Amasya", "Osmaniye", "Kırıkkale", "Artvin", "Bolu", "Bitlis", "Rize", "Hakkari", "Bingöl", "Sinop", "Kastamonu", "Çankırı", "Kilis", "Karaman", "Erzincan", "Gümüşhane", "Bartın", "Iğdır", "Yalova", "Karabük", "Bayburt", "Tunceli"];

const DATA_FILE = 'scores.json';
let scores = {};

if (fs.existsSync(DATA_FILE)) {
    scores = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
} else {
    sehirler.forEach(s => scores[s] = 0);
    fs.writeFileSync(DATA_FILE, JSON.stringify(scores));
}

io.on('connection', (socket) => {
    console.log("Bir cihaz bağlandı.");
    socket.emit('updateScores', scores);
    socket.on('vote', (city) => {
        if (scores.hasOwnProperty(city)) {
            scores[city]++;
            fs.writeFileSync(DATA_FILE, JSON.stringify(scores));
            io.emit('updateScores', scores);
        }
    });
});

http.listen(3000, () => console.log('Sunucu http://localhost:3000 adresinde çalışıyor.'));