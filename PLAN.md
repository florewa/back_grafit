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

- [ ] Установить `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `passport-local`
- [ ] Создать модуль: `nest g module auth`
- [ ] Создать `AuthService`:
  - [ ] `validateUser(email, password)` — проверка credentials
  - [ ] `login(user)` — генерация JWT-токена
  - [ ] `getProfile(userId)` — получение профиля текущего пользователя
- [ ] Создать `AuthController`:
  - [ ] `POST /api/auth/login` — логин, возвращает `{ accessToken }`
  - [ ] `GET /api/auth/profile` — профиль текущего пользователя (защищённый)
- [ ] Создать DTO:
  - [ ] `LoginDto` (`email`, `password`)
- [ ] Создать стратегии Passport:
  - [ ] `LocalStrategy` — валидация email/password
  - [ ] `JwtStrategy` — валидация JWT-токена из заголовка Authorization
- [ ] Создать Guards:
  - [ ] `LocalAuthGuard` — для логина
  - [ ] `JwtAuthGuard` — для защиты роутов
  - [ ] `RolesGuard` — проверка роли пользователя
- [ ] Создать декоратор `@Roles(...roles)` для указания допустимых ролей на эндпоинтах
- [ ] Создать декоратор `@CurrentUser()` для извлечения пользователя из request

---

## Фаза 2. Контент

### 2.1 Модуль категорий (Categories)

- [ ] Создать модуль: `nest g module categories`
- [ ] Создать сущность `Category`:
  - [ ] `id` (UUID, primary)
  - [ ] `name` (string)
  - [ ] `slug` (string, unique) — для URL
  - [ ] `description` (string, nullable)
  - [ ] `sortOrder` (number, default 0)
  - [ ] `isActive` (boolean, default true)
  - [ ] `createdAt`, `updatedAt`
- [ ] Связь: `Category` → `Project[]` (one-to-many)
- [ ] Создать `CategoriesService`:
  - [ ] `findAll()` — все категории
  - [ ] `findBySlug(slug)` — по slug
  - [ ] `create(dto)` — создание
  - [ ] `update(id, dto)` — обновление
  - [ ] `remove(id)` — удаление (проверить, нет ли привязанных проектов)
- [ ] Создать DTO:
  - [ ] `CreateCategoryDto` (`name`, `slug`, `description?`, `sortOrder?`)
  - [ ] `UpdateCategoryDto`
- [ ] Создать контроллер `CategoriesController`:
  - [ ] `GET /api/categories` — публичный список активных категорий
  - [ ] `GET /api/admin/categories` — полный список для админки (защищённый)
  - [ ] `POST /api/admin/categories` — создание (защищённый)
  - [ ] `PATCH /api/admin/categories/:id` — обновление (защищённый)
  - [ ] `DELETE /api/admin/categories/:id` — удаление (защищённый)

### 2.2 Модуль проектов (Projects / Portfolio)

- [ ] Создать модуль: `nest g module projects`
- [ ] Создать сущность `Project`:
  - [ ] `id` (UUID, primary)
  - [ ] `title` (string)
  - [ ] `slug` (string, unique)
  - [ ] `description` (text)
  - [ ] `shortDescription` (string, nullable) — краткое описание для карточек
  - [ ] `client` (string, nullable) — название клиента/заказчика
  - [ ] `year` (number, nullable) — год реализации
  - [ ] `location` (string, nullable) — город / адрес
  - [ ] `area` (string, nullable) — площадь (для проектных компаний часто актуально)
  - [ ] `coverImage` (string, nullable) — путь к обложке
  - [ ] `images` (json/array) — массив путей к изображениям
  - [ ] `isPublished` (boolean, default false)
  - [ ] `publishedAt` (timestamp, nullable)
  - [ ] `sortOrder` (number, default 0)
  - [ ] `categoryId` (FK → Category)
  - [ ] `createdAt`, `updatedAt`
- [ ] Связь: `Project` → `Category` (many-to-one)
- [ ] Создать `ProjectsService`:
  - [ ] `findAllPublished(query)` — публичный список с пагинацией и фильтром по категории
  - [ ] `findAll(query)` — список для админки (включая черновики)
  - [ ] `findBySlug(slug)` — по slug (публичный)
  - [ ] `findById(id)` — по ID (для админки)
  - [ ] `create(dto)` — создание
  - [ ] `update(id, dto)` — обновление
  - [ ] `remove(id)` — удаление
  - [ ] `publish(id)` / `unpublish(id)` — управление публикацией
- [ ] Создать DTO:
  - [ ] `CreateProjectDto`
  - [ ] `UpdateProjectDto`
  - [ ] `ProjectQueryDto` — фильтры: `categoryId?`, `page?`, `limit?`, `search?`
- [ ] Создать контроллер `ProjectsController`:
  - [ ] `GET /api/projects` — публичный список опубликованных (с пагинацией)
  - [ ] `GET /api/projects/:slug` — публичный просмотр проекта
  - [ ] `GET /api/admin/projects` — список для админки (защищённый)
  - [ ] `GET /api/admin/projects/:id` — детали для админки (защищённый)
  - [ ] `POST /api/admin/projects` — создание (защищённый)
  - [ ] `PATCH /api/admin/projects/:id` — обновление (защищённый)
  - [ ] `DELETE /api/admin/projects/:id` — удаление (защищённый)
  - [ ] `PATCH /api/admin/projects/:id/publish` — опубликовать (защищённый)
  - [ ] `PATCH /api/admin/projects/:id/unpublish` — снять с публикации (защищённый)

### 2.3 Модуль загрузки файлов (Upload)

- [ ] Установить `multer`, `@types/multer`
- [ ] Установить `sharp` для обработки изображений
- [ ] Создать модуль: `nest g module upload`
- [ ] Настроить хранение файлов:
  - [ ] Локальное хранилище: директория `uploads/` с поддиректориями по типу (`projects/`, `pages/`)
  - [ ] Опционально: подготовить интерфейс для S3-совместимого хранилища
- [ ] Создать `UploadService`:
  - [ ] `uploadImage(file, folder)` — сохранение файла + генерация thumbnail
  - [ ] `removeFile(filePath)` — удаление файла
  - [ ] `generateThumbnail(filePath, width, height)` — создание превью через sharp
- [ ] Создать контроллер `UploadController`:
  - [ ] `POST /api/admin/upload/image` — загрузка одного изображения (защищённый)
  - [ ] `POST /api/admin/upload/images` — загрузка нескольких изображений (защищённый)
  - [ ] `DELETE /api/admin/upload/:filename` — удаление файла (защищённый)
- [ ] Настроить раздачу статики: `ServeStaticModule` или express.static для `/uploads`
- [ ] Ограничения: максимальный размер файла, допустимые mime-types (jpg, png, webp)

### 2.4 Модуль страниц (Pages)

- [ ] Создать модуль: `nest g module pages`
- [ ] Создать сущность `Page`:
  - [ ] `id` (UUID, primary)
  - [ ] `slug` (string, unique) — идентификатор страницы (`about`, `contacts`, `home`)
  - [ ] `title` (string)
  - [ ] `content` (text) — HTML или Markdown-контент
  - [ ] `metaTitle` (string, nullable) — SEO
  - [ ] `metaDescription` (string, nullable) — SEO
  - [ ] `isActive` (boolean, default true)
  - [ ] `createdAt`, `updatedAt`
- [ ] Создать `PagesService`:
  - [ ] `findAll()` — все страницы
  - [ ] `findBySlug(slug)` — по slug (публичный)
  - [ ] `create(dto)` — создание
  - [ ] `update(id, dto)` — обновление
- [ ] Создать DTO:
  - [ ] `CreatePageDto`
  - [ ] `UpdatePageDto`
- [ ] Создать контроллер `PagesController`:
  - [ ] `GET /api/pages/:slug` — публичное получение страницы
  - [ ] `GET /api/admin/pages` — список для админки (защищённый)
  - [ ] `GET /api/admin/pages/:id` — детали (защищённый)
  - [ ] `POST /api/admin/pages` — создание (защищённый)
  - [ ] `PATCH /api/admin/pages/:id` — обновление (защищённый)
- [ ] Seed: создать начальные страницы (`home`, `about`, `contacts`)

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
