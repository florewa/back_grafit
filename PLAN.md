# Grafit — План разработки бэкенда

## Фаза 1. Фундамент

### 1.1 Настройка конфигурации и окружения

- [x] Установить `@nestjs/config`
- [x] Создать `.env` и `.env.example` с переменными: `PORT`, `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `JWT_EXPIRES_IN`
- [x] Зарегистрировать `ConfigModule.forRoot()` в `AppModule` (глобально, `isGlobal: true`)
- [x] Установить `class-validator` и `class-transformer`
- [x] Включить глобальный `ValidationPipe` в `main.ts` (`whitelist: true`, `transform: true`)
- [x] Задать глобальный префикс API: `app.setGlobalPrefix('api')`
- [x] Настроить CORS: `app.enableCors()` с указанием допустимых origins из `.env`

### 1.2 Подключение базы данных (PostgreSQL + TypeORM)

- [x] Установить `@nestjs/typeorm`, `typeorm`, `pg`
- [x] Настроить `TypeOrmModule.forRootAsync()` в `AppModule` с чтением конфига из `ConfigService`
- [x] Включить `synchronize: true` для dev-окружения (в production — `false`)
- [x] Создать `src/database/` директорию для будущих миграций и сидов
- [x] Настроить `typeorm` CLI (файл `data-source.ts`) для запуска миграций вручную
- [x] Написать первый seed-скрипт: создание admin-пользователя

### 1.3 Модуль пользователей (Users)

- [x] Создать модуль: `nest g module users`
- [x] Создать сущность `User` (`id`, `email`, `password`, `name`, `role`, `createdAt`, `updatedAt`)
- [x] Enum для ролей: `UserRole { ADMIN = 'admin', EDITOR = 'editor' }`
- [x] Создать сервис `UsersService` с методами:
  - [x] `findAll()` — получить всех пользователей
  - [x] `findById(id)` — найти по ID
  - [x] `findByEmail(email)` — найти по email (для auth)
  - [x] `create(dto)` — создать пользователя
  - [x] `update(id, dto)` — обновить пользователя
  - [x] `remove(id)` — удалить пользователя
- [x] Создать DTO:
  - [x] `CreateUserDto` (`email`, `password`, `name`, `role`)
  - [x] `UpdateUserDto` (PartialType от CreateUserDto)
- [x] Создать контроллер `UsersController`:
  - [x] `GET /api/users` — список (защищённый, только admin)
  - [x] `GET /api/users/:id` — по ID
  - [x] `POST /api/users` — создание
  - [x] `PATCH /api/users/:id` — обновление
  - [x] `DELETE /api/users/:id` — удаление
- [x] Хеширование паролей через `bcrypt` (установить `bcrypt`, `@types/bcrypt`)

### 1.4 Модуль аутентификации (Auth)

- [x] Установить `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `passport-local`
- [x] Создать модуль: `nest g module auth`
- [x] Создать `AuthService`:
  - [x] `validateUser(email, password)` — проверка credentials
  - [x] `login(user)` — генерация JWT-токена
  - [x] `getProfile(userId)` — получение профиля текущего пользователя
- [x] Создать `AuthController`:
  - [x] `POST /api/auth/login` — логин, возвращает `{ accessToken }`
  - [x] `GET /api/auth/profile` — профиль текущего пользователя (защищённый)
- [x] Создать DTO:
  - [x] `LoginDto` (`email`, `password`)
- [x] Создать стратегии Passport:
  - [x] `LocalStrategy` — валидация email/password
  - [x] `JwtStrategy` — валидация JWT-токена из заголовка Authorization
- [x] Создать Guards:
  - [x] `LocalAuthGuard` — для логина
  - [x] `JwtAuthGuard` — для защиты роутов
  - [x] `RolesGuard` — проверка роли пользователя
- [x] Создать декоратор `@Roles(...roles)` для указания допустимых ролей на эндпоинтах
- [x] Создать декоратор `@CurrentUser()` для извлечения пользователя из request

---

## Фаза 2. Контент

### 2.1 Модуль категорий (Categories)

- [x] Создать модуль: `nest g module categories`
- [x] Создать сущность `Category`:
  - [x] `id` (UUID, primary)
  - [x] `name` (string)
  - [x] `slug` (string, unique) — для URL
  - [x] `description` (string, nullable)
  - [x] `sortOrder` (number, default 0)
  - [x] `isActive` (boolean, default true)
  - [x] `createdAt`, `updatedAt`
- [x] Связь: `Category` → `Project[]` (one-to-many) - будет добавлена при создании модуля Projects
- [x] Создать `CategoriesService`:
  - [x] `findAll()` — все активные категории
  - [x] `findAllForAdmin()` — все категории для админки
  - [x] `findBySlug(slug)` — по slug
  - [x] `findById(id)` — по ID
  - [x] `create(dto)` — создание
  - [x] `update(id, dto)` — обновление
  - [x] `remove(id)` — удаление (проверка проектов будет добавлена позже)
- [x] Создать DTO:
  - [x] `CreateCategoryDto` (`name`, `slug`, `description?`, `sortOrder?`)
  - [x] `UpdateCategoryDto`
- [x] Создать контроллер `CategoriesController`:
  - [x] `GET /api/categories` — публичный список активных категорий
  - [x] `GET /api/categories/slug/:slug` — публичное получение по slug
  - [x] `GET /api/categories/admin/all` — полный список для админки (защищённый)
  - [x] `GET /api/categories/admin/:id` — по ID (защищённый)
  - [x] `POST /api/categories/admin` — создание (защищённый)
  - [x] `PATCH /api/categories/admin/:id` — обновление (защищённый)
  - [x] `DELETE /api/categories/admin/:id` — удаление (защищённый)

### 2.2 Модуль проектов (Projects / Portfolio)

- [x] Создать модуль: `nest g module projects`
- [x] Создать сущность `Project`:
  - [x] `id` (UUID, primary)
  - [x] `title` (string)
  - [x] `slug` (string, unique)
  - [x] `description` (text)
  - [x] `shortDescription` (string, nullable) — краткое описание для карточек
  - [x] `client` (string, nullable) — название клиента/заказчика
  - [x] `year` (number, nullable) — год реализации
  - [x] `location` (string, nullable) — город / адрес
  - [x] `area` (string, nullable) — площадь (для проектных компаний часто актуально)
  - [x] `coverImage` (string, nullable) — путь к обложке
  - [x] `images` (json/array) — массив путей к изображениям
  - [x] `isPublished` (boolean, default false)
  - [x] `publishedAt` (timestamp, nullable)
  - [x] `sortOrder` (number, default 0)
  - [x] `categoryId` (FK → Category)
  - [x] `createdAt`, `updatedAt`
- [x] Связь: `Project` → `Category` (many-to-one)
- [x] Создать `ProjectsService`:
  - [x] `findAllPublished(query)` — публичный список с пагинацией и фильтром по категории
  - [x] `findAll(query)` — список для админки (включая черновики)
  - [x] `findBySlug(slug)` — по slug (публичный)
  - [x] `findById(id)` — по ID (для админки)
  - [x] `create(dto)` — создание
  - [x] `update(id, dto)` — обновление
  - [x] `remove(id)` — удаление
  - [x] `publish(id)` / `unpublish(id)` — управление публикацией
- [x] Создать DTO:
  - [x] `CreateProjectDto`
  - [x] `UpdateProjectDto`
  - [x] `ProjectQueryDto` — фильтры: `categoryId?`, `page?`, `limit?`, `search?`
- [x] Создать контроллер `ProjectsController`:
  - [x] `GET /api/projects` — публичный список опубликованных (с пагинацией)
  - [x] `GET /api/projects/slug/:slug` — публичный просмотр проекта
  - [x] `GET /api/projects/admin/all` — список для админки (защищённый)
  - [x] `GET /api/projects/admin/:id` — детали для админки (защищённый)
  - [x] `POST /api/projects/admin` — создание (защищённый)
  - [x] `PATCH /api/projects/admin/:id` — обновление (защищённый)
  - [x] `DELETE /api/projects/admin/:id` — удаление (защищённый)
  - [x] `PATCH /api/projects/admin/:id/publish` — опубликовать (защищённый)
  - [x] `PATCH /api/projects/admin/:id/unpublish` — снять с публикации (защищённый)

### 2.3 Модуль загрузки файлов (Upload)

- [x] Установить `multer`, `@types/multer`
- [x] Установить `sharp` для обработки изображений
- [x] Создать модуль: `nest g module upload`
- [x] Настроить хранение файлов:
  - [x] Локальное хранилище: директория `uploads/` с поддиректориями по типу (`projects/`, `pages/`, `thumbnails/`)
- [x] Создать `UploadService`:
  - [x] `uploadImage(file, folder)` — сохранение файла + генерация thumbnail
  - [x] `uploadMultipleImages(files, folder)` — сохранение нескольких файлов
  - [x] `removeFile(filePath)` — удаление файла и его thumbnail
  - [x] `generateThumbnail(filePath, width, height)` — создание превью 300x300 через sharp
  - [x] Автоматическое создание директорий при старте
  - [x] Валидация типа файла (jpeg, png, webp)
  - [x] Валидация размера файла (максимум 10MB)
- [x] Создать контроллер `UploadController`:
  - [x] `POST /api/upload/image` — загрузка одного изображения (защищённый)
  - [x] `POST /api/upload/images` — загрузка до 10 изображений (защищённый)
  - [x] `DELETE /api/upload` — удаление файла (защищённый)
- [x] Настроить раздачу статики: `ServeStaticModule` для `/uploads`
- [x] Ограничения: максимальный размер файла 10MB, допустимые mime-types (jpeg, png, webp)

### 2.4 Модуль настроек контактов (Contact Settings)

- [x] Создать модуль: `nest g module contact-settings`
- [x] Создать сущность `ContactSettings`:
  - [x] `id` (UUID, primary)
  - [x] `phone` (string, nullable) — номер телефона
  - [x] `email` (string, nullable) — email
  - [x] `address` (text, nullable) — адрес
  - [x] `createdAt`, `updatedAt`
- [x] Создать `ContactSettingsService`:
  - [x] `get()` — получить настройки (создаёт если не существует)
  - [x] `update(dto)` — обновить настройки
- [x] Создать DTO:
  - [x] `UpdateContactSettingsDto`
- [x] Создать контроллер `ContactSettingsController`:
  - [x] `GET /api/contact-settings` — публичное получение настроек
  - [x] `PATCH /api/contact-settings` — обновление (Admin/Editor)
- [x] Seed: создать начальные настройки контактов

---

## Фаза 3. Дополнительный функционал

### 3.1 Модуль обратной связи (Contacts / Leads)

- [ ] Создать модуль: `nest g module contacts`
- [ ] Создать сущность `ContactRequest`:
  - [ ] `id` (UUID, primary)
  - [ ] `name` (string)
  - [ ] `email` (string)
  - [ ] `phone` (string, nullable)
  - [ ] `message` (text)
  - [ ] `isRead` (boolean, default false)
  - [ ] `createdAt`
- [ ] Создать `ContactsService`:
  - [ ] `create(dto)` — сохранение заявки
  - [ ] `findAll(query)` — список заявок с пагинацией (для админки)
  - [ ] `markAsRead(id)` — отметить как прочитанную
  - [ ] `remove(id)` — удалить заявку
- [ ] Создать DTO:
  - [ ] `CreateContactDto` (`name`, `email`, `phone?`, `message`) с валидацией
- [ ] Создать контроллер `ContactsController`:
  - [ ] `POST /api/contacts` — публичная отправка заявки
  - [ ] `GET /api/admin/contacts` — список заявок (защищённый)
  - [ ] `PATCH /api/admin/contacts/:id/read` — отметить прочитанной (защищённый)
  - [ ] `DELETE /api/admin/contacts/:id` — удалить (защищённый)
- [ ] Опционально: настроить отправку email-уведомлений (nodemailer) при новой заявке

### 3.2 Swagger-документация

- [ ] Установить `@nestjs/swagger`
- [ ] Подключить `SwaggerModule.setup()` в `main.ts` на роут `/api/docs`
- [ ] Добавить `@ApiTags()` ко всем контроллерам
- [ ] Добавить `@ApiProperty()` ко всем DTO
- [ ] Добавить `@ApiBearerAuth()` к защищённым эндпоинтам
- [ ] Добавить `@ApiOperation()` и `@ApiResponse()` к ключевым эндпоинтам

### 3.3 Логирование и обработка ошибок

- [ ] Создать глобальный `HttpExceptionFilter` — единообразный формат ошибок
- [ ] Создать `TransformInterceptor` — единообразный формат ответов `{ data, meta }`
- [ ] Настроить встроенный NestJS Logger
- [ ] Логирование входящих запросов (middleware или interceptor)

### 3.4 Общие утилиты

- [ ] Создать `PaginationDto` — базовый DTO для пагинации (`page`, `limit`)
- [ ] Создать `PaginatedResponseDto<T>` — обёртка ответа с мета-данными (`items`, `total`, `page`, `lastPage`)
- [ ] Создать утилиту `slugify` — генерация slug из строки (транслитерация кириллицы)

---

## Фаза 4. Фронтенд (отдельный репозиторий `front_grafit`)

### 4.1 Инициализация

- [ ] Создать Nuxt 3 проект
- [ ] Настроить структуру: `layouts/`, `pages/`, `components/`, `composables/`, `stores/`
- [ ] Подключить UI-фреймворк (Tailwind CSS / UnoCSS)
- [ ] Настроить API-клиент (`useFetch` / `$fetch` с базовым URL бэкенда)

### 4.2 Публичная часть

- [ ] Главная страница — hero-секция, избранные проекты, краткое описание компании
- [ ] Портфолио — список проектов с фильтрацией по категориям, пагинация
- [ ] Страница проекта — галерея, описание, характеристики
- [ ] О компании — контент из CMS
- [ ] Контакты — форма обратной связи, карта, контактная информация

### 4.3 Админ-панель

- [ ] Страница логина
- [ ] Middleware для проверки авторизации на роутах `/admin/*`
- [ ] Dashboard — количество проектов, непрочитанных заявок
- [ ] CRUD проектов — список, создание, редактирование, удаление
- [ ] CRUD категорий
- [ ] Редактирование страниц
- [ ] Просмотр заявок

### 4.4 SEO и оптимизация

- [ ] `useHead()` / `useSeoMeta()` на каждой странице
- [ ] Open Graph мета-теги
- [ ] Sitemap (`@nuxtjs/sitemap`)
- [ ] Оптимизация изображений (`<NuxtImg>`)

---

## Фаза 5. Деплой и инфраструктура

### 5.1 Docker

- [ ] `Dockerfile` для бэкенда (multi-stage build)
- [ ] `Dockerfile` для фронтенда
- [ ] `docker-compose.yml`: backend + frontend + PostgreSQL + nginx

### 5.2 CI/CD

- [ ] GitHub Actions: lint + test при пуше
- [ ] Автоматический деплой на сервер (при пуше в `main`)

### 5.3 Production

- [ ] Настройка nginx как reverse proxy
- [ ] SSL-сертификат (Let's Encrypt)
- [ ] Настройка бэкапов БД
- [ ] Мониторинг (health-check эндпоинт: `GET /api/health`)

---

## Структура модулей бэкенда (итого)

```
src/
├── main.ts
├── app.module.ts
├── config/                     # Конфигурация
├── database/                   # Миграции, сиды, data-source.ts
├── common/                     # Общие утилиты
│   ├── decorators/             # @Roles, @CurrentUser
│   ├── dto/                    # PaginationDto, PaginatedResponseDto
│   ├── filters/                # HttpExceptionFilter
│   ├── guards/                 # RolesGuard
│   ├── interceptors/           # TransformInterceptor
│   └── utils/                  # slugify и прочее
├── auth/                       # Аутентификация
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── dto/
│   ├── guards/
│   └── strategies/
├── users/                      # Пользователи
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── dto/
│   └── entities/
├── categories/                 # Категории
│   ├── categories.module.ts
│   ├── categories.controller.ts
│   ├── categories.service.ts
│   ├── dto/
│   └── entities/
├── projects/                   # Проекты (портфолио)
│   ├── projects.module.ts
│   ├── projects.controller.ts
│   ├── projects.service.ts
│   ├── dto/
│   └── entities/
├── pages/                      # Страницы (CMS)
│   ├── pages.module.ts
│   ├── pages.controller.ts
│   ├── pages.service.ts
│   ├── dto/
│   └── entities/
├── upload/                     # Загрузка файлов
│   ├── upload.module.ts
│   ├── upload.controller.ts
│   └── upload.service.ts
└── contacts/                   # Заявки / обратная связь
    ├── contacts.module.ts
    ├── contacts.controller.ts
    ├── contacts.service.ts
    ├── dto/
    └── entities/
```
