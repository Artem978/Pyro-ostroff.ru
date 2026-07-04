<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 1. Сбор и базовая фильтрация данных из формы
    $name = isset($_POST['name']) ? trim(htmlspecialchars($_POST['name'])) : 'Не указано';
    $phone = isset($_POST['phone']) ? trim(htmlspecialchars($_POST['phone'])) : 'Не указано';
    $date = isset($_POST['date']) ? trim(htmlspecialchars($_POST['date'])) : 'Не указана';
    $service = isset($_POST['service']) ? trim(htmlspecialchars($_POST['service'])) : 'Не выбрана';
    $message = isset($_POST['message']) ? trim(htmlspecialchars($_POST['message'])) : 'Нет комментариев';

    // Маппинг категорий на понятный русский язык
    $services_map = [
        'all' => 'Общая заявка / Не определено',
        'salutes' => 'Высотные фейерверки / Салюты',
        'fountains' => 'Холодные фонтаны на сцену',
        'figures' => 'Огненные буквы и надписи',
        'effects' => 'Спецэффекты (Тяжелый дым / Пузыри)',
        'custom' => 'Индивидуальный спецпроект'
    ];
    $service_title = isset($services_map[$service]) ? $services_map[$service] : $service;

    // 2. Настройка адресата (Сейчас стоит твоя экспериментальная почта)
    $to = 'kireevartem1998@gmail.com'; 
    
    // Тема письма
    $subject = "Новая заявка с сайта Пиро-Острофф от " . $name;

    // 3. Формирование HTML-тела письма
    $email_content = "
    <h2>Новая заявка на расчет пиротехнического шоу</h2>
    <p><b>Имя клиента:</b> {$name}</p>
    <p><b>Телефон:</b> {$phone}</p>
    <p><b>Дата мероприятия:</b> {$date}</p>
    <p><b>Интересующая программа:</b> {$service_title}</p>
    <p><b>Детали проекта:</b><br>{$message}</p>
    <hr>
    <p><small>Письмо отправлено автоматически техническим модулем Timeweb.</small></p>
    ";

    // 4. Заголовки письма (Защита от попадания в спам на Timeweb)
    // Важно: На Timeweb в поле 'From' лучше указывать существующий ящик на твоем домене, например no-reply@твойдомен.ru
    $hostname = $_SERVER['HTTP_HOST'];
    $from_email = "no-reply@" . $hostname;

    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-Type: text/html; charset=utf-8" . "\r\n";
    $headers .= "From: Пиро-Острофф <{$from_email}>" . "\r\n";
    $headers .= "Reply-To: {$from_email}" . "\r\n";

    // 5. Отправка функции mail()
    if (mail($to, $subject, $email_content, $headers)) {
        echo json_encode(['status' => 'success', 'message' => 'Mail sent successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'PHP mail() function failed. Check hosting mail settings.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>