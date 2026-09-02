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

`admin` · `teacher` · `student` — бір `User` моделі + `role` өрісі.
Тіркелгенде әдепкі рөл — `student`.

## Auth

- `POST /api/auth/register` · `login` · `forgot-password` · `reset-password` · `GET /me`
- Пароль — bcrypt. Токен — JWT (HS256), `Authorization: Bearer <token>`.
- Токен payload-ында `ph` — ағымдағы пароль хэшінің саусақ ізі. Пароль ауысқанда
  барлық ескі токендер (сессиялар да, сброс сілтемелері де) автоматты түрде жарамсыз болады.
- Frontend токенді `localStorage`-та сақтайды (`src/lib/auth.ts`), оны
  `src/lib/api.ts` әр сұранысқа өзі қосады.
- **Пошта жіберу әлі жоқ.** `DEBUG=true` болғанда `forgot-password` сброс токенін
  жауапта қайтарады, frontend сол арқылы `/reset-password` бетіне өтеді.
  Прод үшін SMTP қосып, `reset_token`-ды жауаптан алып тастау керек.

## Roadmap (ТЗ бойынша)

1. ~~Auth: тіркелу/кіру (JWT), пароль сбросы~~ ✅
2. Топтар мен студенттер
3. Дисциплиналар → тақырыптар → тапсырмалар
4. Тапсырма тапсыру (файл жүктеу, мәтін, сілтеме), нұсқалар тарихы
5. Тексеру: балл, комментарий, «доработкаға» қайтару
6. Тестілер: сұрақ түрлері, таймер, әрекет саны, автотексеру
7. Бағалар журналы + орташа балл
8. Уведомлениялар
9. Статистика мен графиктер
10. Excel экспорт

## Ескертпелер

- `.env` файлдары git-ке кірмейді, үлгісі — `.env.example`.
- Docker қолданылмайды — Postgres машинада локалды орнатылған.
