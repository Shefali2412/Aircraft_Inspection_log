# Aircraft Inspection Log

A small full-stack app for logging aircraft inspections and defects. Inspectors can record a defect, attach a photo, and see the full inspection history of each aircraft.

I built it to prepare for an interview with Cirrix, inspired by their visual inspection platform for aircraft maintenance.

## Features

- Add an inspection: aircraft registration, part, defect type, severity, inspector, notes
- Upload a photo of the defect
- Dashboard with stats, aircraft fleet overview and high-severity defects
- Aircraft detail page with inspection history, severity breakdown and most affected parts
- Filter by aircraft registration
- Delete inspections
- Responsive layout for desktop, tablet and phone

## Tech stack

| Layer | Technology |
|---|---|
| Backend | C#, ASP.NET Core Web API (.NET 10), controllers |
| Database | Entity Framework Core with SQLite, migrations |
| Frontend | React (Vite), React Router |
| CI | GitHub Actions builds backend and frontend on every push |

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/inspections` | List all inspections (newest first) |
| GET | `/api/inspections?reg=PH-ABC` | Filter by aircraft registration |
| GET | `/api/inspections/{id}` | Get one inspection |
| POST | `/api/inspections` | Create an inspection |
| DELETE | `/api/inspections/{id}` | Delete an inspection |
| POST | `/api/inspections/{id}/photo` | Upload a photo (multipart form, field `file`) |

## Project structure

```
aircraft-inspection-log/
├── InspectionApi/          ASP.NET Core API
│   ├── Controllers/        InspectionsController (REST endpoints)
│   ├── Data/               AppDbContext (EF Core)
│   ├── Models/             Inspection entity
│   └── Migrations/         Database migrations
└── inspection-ui/          React frontend
    └── src/
        ├── pages/          HomePage, AircraftPage
        ├── components/     Layout, InspectionCard, InspectionForm, StatCard
        ├── hooks/          useInspections (data loading)
        └── api.js          All API calls
```

## How to run it locally

**Requirements:** .NET 10 SDK, Node.js 20+, and the EF Core tool (`dotnet tool install --global dotnet-ef`).

**1. Start the API**

```bash
cd InspectionApi
dotnet ef database update
dotnet run
```

The API runs on `http://localhost:5169`.

**2. Start the frontend** (in a second terminal)

```bash
cd inspection-ui
npm install
npm run dev
```

Open `http://localhost:5173`.

## Next steps

- **Authentication** so each inspector logs in and inspections are linked to a user
- **AI photo analysis** to suggest the defect type and severity from an uploaded photo
- **Tests:** xUnit tests for the API and React Testing Library for the frontend
- **Validation:** limit photo file types and size, validate required fields on the server
- **Production setup:** Azure SQL instead of SQLite and Azure Blob Storage for photos
- **Aircraft table** with aircraft type, operator and next scheduled check