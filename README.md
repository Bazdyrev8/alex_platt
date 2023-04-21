# Alex Platt bookstore
    Projects bookstore Alex Platt

# Access Settings

    Install dependencies

        npm install

    Create file .env in the root directory and add the DB configuration

        DATABASE_URL="mysql://root:secret@localhost:3306/alex_platt"

    Perform database migration from the ORM Prisma configuration

        npx prisma migrate dev

    Starting the Web server

        npm run dev

# Настройка проекта

    Установка зависимостей

        npm install

    Создать файл .env в корневом каталоге и добавить конфигурацию БД

        DATABASE_URL="mysql://root:secret@localhost:3306/alex_platt"

    Выполнить миграцию БД из конфигурации ORM Prisma

        npx prisma migrate dev
        
    Запуск веб-сервера

        npm run dev
