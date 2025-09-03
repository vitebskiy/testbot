# 🚀 Варианты хостинга для PHP

## ❌ GitHub Pages
- **Не поддерживает PHP**
- Только статические файлы (HTML, CSS, JS)
- Бесплатный, но ограниченный

## ✅ Альтернативы для PHP:

### 1. **Vercel** (Рекомендуется)
- ✅ Поддержка PHP
- ✅ Бесплатный план
- ✅ Автодеплой из GitHub
- 🔗 [vercel.com](https://vercel.com)

**Как подключить:**
```bash
# 1. Установить Vercel CLI
npm i -g vercel

# 2. В папке проекта
vercel

# 3. Следовать инструкциям
```

### 2. **Railway**
- ✅ Поддержка PHP
- ✅ Бесплатный план (500 часов/месяц)
- ✅ Простое подключение GitHub
- 🔗 [railway.app](https://railway.app)

### 3. **Render**
- ✅ Поддержка PHP
- ✅ Бесплатный план
- ✅ Автодеплой из GitHub
- 🔗 [render.com](https://render.com)

### 4. **Heroku** (Платный)
- ✅ Поддержка PHP
- ❌ Бесплатного плана больше нет
- ✅ Профессиональный
- 🔗 [heroku.com](https://heroku.com)

### 5. **Netlify** (с функциями)
- ✅ Serverless функции (не классический PHP)
- ✅ Бесплатный план
- ✅ Автодеплой из GitHub
- 🔗 [netlify.com](https://netlify.com)

## 📋 Рекомендация:

1. **Попробуйте сначала ultra-simple.html** - он максимально простой и должен работать
2. **Если нужен PHP** - используйте Vercel (самый простой и бесплатный)
3. **Для продакшена** - Railway или Render

## 🔧 Файл для PHP (если понадобится):

```php
<?php
// index.php для определения сети
$userIP = $_SERVER['REMOTE_ADDR'];
$userAgent = $_SERVER['HTTP_USER_AGENT'];

// Простая проверка по IP
$allowedIPs = [
    '192.168.1.',
    '192.168.0.',
    '10.0.0.',
    // Добавьте ваши IP
];

$isAllowed = false;
foreach ($allowedIPs as $allowedIP) {
    if (strpos($userIP, $allowedIP) === 0) {
        $isAllowed = true;
        break;
    }
}

// Или просто всегда разрешить для тестирования
$isAllowed = true;
?>

<!DOCTYPE html>
<html>
<head>
    <title>NPPDOZA - Закрытый канал</title>
</head>
<body>
    <?php if ($isAllowed): ?>
        <h1>✅ Доступ разрешен</h1>
        <p>Добро пожаловать в закрытый канал!</p>
        <p>Ваш IP: <?= htmlspecialchars($userIP) ?></p>
    <?php else: ?>
        <h1>❌ Доступ запрещен</h1>
        <p>Подключитесь к сети NPPDOZA</p>
    <?php endif; ?>
</body>
</html>
```
