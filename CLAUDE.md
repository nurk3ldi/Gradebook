# Gradebook

Оқытушыға арналған LMS: топтар, дисциплиналар, тапсырмалар, тестілеу,
тексеру, бағалар журналы, статистика.

## Стек

| Қабат    | Технология                                             |
| -------- | ------------------------------------------------------ |
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS v4         |
| Backend  | FastAPI + SQLAlchemy 2.0 (async) + Pydantic v2         |
| БД       | PostgreSQL 18 (asyncpg), миграциялар — Alembic         |

## Құрылым

```
backend/
  app/
    main.py          # FastAPI app, CORS, /health
    config.py        # Settings (.env)
    db.py            # engine, SessionLocal, Base, get_db
    api/router.py    # барлық роутерлер осында тіркеледі
    models/          # SQLAlchemy модельдері
    schemas/         # Pydantic сұраныс/жауап схемалары
    services/        # бизнес-логика (роутерлер жұқа болуы керек)
  migrations/        # Alembic
frontend/
  src/
    App.tsx
    lib/api.ts       # fetch wrapper
    components/      # қайта қолданылатын UI
    pages/           # экрандар
```

## Командалар

```bash
# БД: локалды PostgreSQL 18 (Windows сервисі, әрқашан қосулы)
# psql PATH-та жоқ, толық жолы:
#   "C:/Program Files/PostgreSQL/18/bin/psql.exe" -U postgres

# Backend (backend/ ішінен)
.venv/Scripts/python.exe -m uvicorn app.main:app --reload   # http://localhost:8000
.venv/Scripts/python.exe -m alembic revision --autogenerate -m "atauy"
.venv/Scripts/python.exe -m alembic upgrade head

# Frontend (frontend/ ішінен)
npm run dev      # http://localhost:5173
npm run build
```

## Конвенциялар

- **Backend**: роутер → сервис → модель. Роутерде тек валидация мен шақыру.
  Барлық DB қатынасы `async`, сессия `Depends(get_db)` арқылы.
- Жаңа модель қосқан соң `app/models/__init__.py` ішіне импорттау керек —
  әйтпесе Alembic autogenerate оны көрмейді.
- **Frontend**: барлық HTTP `src/lib/api.ts` арқылы. Компонент — функционалды,
  `default export` тек `pages/` ішінде.
- **Тіл**: UI мәтіні — орысша, код пен коммит — ағылшынша, түсініктемелер — қазақша.
- **Стиль**: минимализм. Ақшыл фон, neutral палитра, аз көлеңке, аз түс.
  Акцент түсі — бір ғана. Артық анимация жоқ.

## Рөлдер

`admin` · `teacher` · `student` — бір `User` моделі + `role` өрісі
(`app/roles.py` ішіндегі `Role` литералы).

- Тіркелгенде әдепкі рөл — `student`.
- Бірінші admin `.env` арқылы беріледі: `ADMIN_EMAILS=["..."]` — сервер іске
  қосылғанда (`lifespan`) сол пошталарға admin рөлі қойылады.
- Роутерді рөлмен қорғау: `Depends(require_role(ADMIN, TEACHER))` (`app/api/deps.py`).
- Admin эндпоинттері: `GET/POST /api/users`, `PATCH /api/users/{id}/role`,
  `DELETE /api/users/{id}`. Admin өз рөлін өзгерте де, өзін өшіре де алмайды.
- `GET /api/users/me` — кез келген аутентификацияланған пайдаланушы.

## Топтар

- `GET/POST /api/groups`, `GET/PATCH/DELETE /api/groups/{id}`,
  `POST /api/groups/{id}/students`, `DELETE /api/groups/{id}/students/{student_id}`
- Admin барлық топты көреді, преподаватель — тек өзінікін (`Group.teacher_id`).
- Топ жасағанда преподавательді admin таңдайды; teacher өзіне ғана топ аша алады.
- Топқа тек `student` рөліндегі, бұрыннан тіркелген пайдаланушы қосылады.
  Аккаунттар admin-нің «Пользователи» бетінде ғана құрылады.
- `GET /api/users?role=student` — преподавательге де ашық (топқа қосу үшін);
  фильтрсіз немесе басқа рөлмен сұрау тек admin-ге рұқсат.
- `group_members` — Table (composite PK), `Group.students` — `secondary` relationship
  (`lazy="selectin"`), сондықтан жауапта студенттер бірден келеді.

## Auth

- `POST /api/auth/register` · `login` · `forgot-password` · `reset-password` · `GET /me`
- Пароль — bcrypt. Токен — JWT (HS256), `Authorization: Bearer <token>`.
- Токен payload-ында `ph` — ағымдағы пароль хэшінің саусақ ізі. Пароль ауысқанда
  барлық ескі токендер (сессиялар да, сброс сілтемелері де) автоматты түрде жарамсыз болады.
- Frontend токенді `localStorage`-та сақтайды (`src/lib/auth.ts`), оны
  `src/lib/api.ts` әр сұранысқа өзі қосады.
- **Пароль сбросы — поштаға 6 цифрлы код.** Код `password_reset_codes` кестесінде
  sha256 хэшімен сақталады: 15 минут жарамды, 5 әрекет, бір реттік, жаңа код
  сұралса ескісі бірден жойылады.
- Пошта `app/services/email.py` арқылы (stdlib `smtplib`). `.env` ішінде
  `SMTP_HOST` бос болса, хат жіберілмей, код серверлогына жазылады — дев режимі.

## Roadmap (ТЗ бойынша)

1. ~~Auth: тіркелу/кіру (JWT), пароль сбросы~~ ✅
2. ~~Үш рөл: admin/teacher/student, пайдаланушыларды басқару~~ ✅
3. ~~Топтар мен студенттер~~ ✅
4. Дисциплиналар → тақырыптар → тапсырмалар
5. Тапсырма тапсыру (файл жүктеу, мәтін, сілтеме), нұсқалар тарихы
6. Тексеру: балл, комментарий, «доработкаға» қайтару
7. Тестілер: сұрақ түрлері, таймер, әрекет саны, автотексеру
8. Бағалар журналы + орташа балл
9. Уведомлениялар
10. Статистика мен графиктер
11. Excel экспорт

## Ескертпелер

- `.env` файлдары git-ке кірмейді, үлгісі — `.env.example`.
- Docker қолданылмайды — Postgres машинада локалды орнатылған.
