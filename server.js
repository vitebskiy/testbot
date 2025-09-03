const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// КОНФИГУРАЦИЯ - список разрешенных Wi-Fi сетей
const ALLOWED_NETWORKS = [
    'ВАШ_WIFI_НАЗВАНИЕ',      // Замените на название вашей Wi-Fi сети
    'BACKUP_WIFI_NAME',       // Резервная сеть
    // Добавьте другие разрешенные сети
];

// Список разрешенных IP-адресов роутеров
const ALLOWED_ROUTER_IPS = [
    '192.168.1.1',
    '192.168.0.1', 
    '10.0.0.1',
    '172.16.0.1'
];

// API endpoint для проверки сетевого доступа
app.post('/api/verify-network', async (req, res) => {
    try {
        const { userAgent, timestamp, telegramData } = req.body;
        const clientIP = req.ip || req.connection.remoteAddress;
        
        console.log('Запрос проверки доступа:', {
            ip: clientIP,
            userAgent,
            timestamp: new Date(timestamp),
            hasTelegramData: !!telegramData
        });
        
        // Проверка временной метки (защита от replay-атак)
        const requestTime = new Date(timestamp);
        const now = new Date();
        const timeDiff = Math.abs(now - requestTime);
        
        if (timeDiff > 300000) { // 5 минут
            return res.status(401).json({
                accessGranted: false,
                reason: 'Устаревший запрос'
            });
        }
        
        // Проверка IP-адреса клиента (должен быть из локальной сети)
        const isLocalNetwork = isLocalIP(clientIP);
        
        if (!isLocalNetwork) {
            return res.status(401).json({
                accessGranted: false,
                reason: 'Доступ только из локальной сети'
            });
        }
        
        // Дополнительная проверка Telegram данных (если требуется)
        if (telegramData) {
            // Здесь можно добавить проверку валидности Telegram данных
            // const isValidTelegram = validateTelegramData(telegramData);
        }
        
        // Если все проверки пройдены
        res.json({
            accessGranted: true,
            message: 'Доступ разрешен',
            network: 'authorized'
        });
        
    } catch (error) {
        console.error('Ошибка проверки доступа:', error);
        res.status(500).json({
            accessGranted: false,
            reason: 'Ошибка сервера'
        });
    }
});

// Функция проверки локального IP
function isLocalIP(ip) {
    // Удаляем IPv6 префикс если есть
    ip = ip.replace('::ffff:', '');
    
    const localRanges = [
        /^192\.168\./,          // 192.168.0.0/16
        /^10\./,                // 10.0.0.0/8
        /^172\.(1[6-9]|2[0-9]|3[01])\./,  // 172.16.0.0/12
        /^127\./,               // 127.0.0.0/8 (localhost)
        /^::1$/,                // IPv6 localhost
        /^localhost$/           // localhost
    ];
    
    return localRanges.some(range => range.test(ip));
}

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint для проверки доступности роутера (альтернативный способ)
app.get('/check-router', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Локальная сеть доступна',
        timestamp: Date.now()
    });
});

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`📱 Для Telegram WebApp используйте: https://your-domain.com`);
    console.log(`🏠 Локальный доступ: http://localhost:${PORT}`);
    console.log(`🔒 Разрешенные сети: ${ALLOWED_NETWORKS.join(', ')}`);
});

// Обработка ошибок
process.on('uncaughtException', (error) => {
    console.error('Необработанная ошибка:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Необработанное отклонение промиса:', reason);
});
