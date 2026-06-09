# AI Mechanic Assistant Design Spec

## Purpose

AI Mechanic Assistant is a modern Windows desktop application that helps users organize vehicle information, describe car problems, attach photos, and receive AI-assisted diagnostic guidance. The first version must work without paid API access by using a realistic mock AI service, while also supporting a real OpenAI API key through Settings.

The app is an assistant, not a certified mechanic. It must prioritize safety and clearly tell users when symptoms may require stopping the vehicle and contacting a professional.

## First Version Scope

The MVP includes:

- Windows desktop app built with C#, .NET 8, WPF, and MVVM.
- Modern dashboard-style UI with dark theme by default and optional light theme.
- Local SQLite storage.
- Vehicle profile management.
- Text-based diagnosis workflow.
- Photo attachment gallery stored locally by path.
- Diagnosis history with search and filters.
- Maintenance log.
- Simple maintenance reminders by date or mileage.
- Settings page for OpenAI API key, theme, mileage unit, currency, export folder, and local data clearing.
- TXT export for diagnosis reports and maintenance history.
- `IAiDiagnosisService` abstraction with mock and OpenAI implementations.

The MVP excludes:

- Real image-based diagnosis.
- PDF export.
- VIN decoding.
- OBD-II scanner integration.
- Cloud sync.
- User accounts.
- Paid subscription backend.

These excluded features are planned as later phases after the desktop MVP is stable.

## Architecture

The application uses a clean MVVM structure:

- Models hold domain data such as vehicles, diagnosis cases, photos, maintenance entries, reminders, settings, and AI results.
- ViewModels expose page state, commands, validation, loading indicators, and navigation actions.
- Views contain WPF XAML pages and reusable UI controls.
- Services handle AI diagnosis, export, settings protection, file picking, image storage, and navigation.
- Repositories handle SQLite persistence.
- Helpers contain small shared utilities such as validation, formatting, and severity color mapping.

The app must remain runnable without complex manual setup. On first launch it creates the SQLite database locally, initializes required tables, and uses mock AI unless a valid OpenAI API key is configured.

## Project Structure

```text
AiMechanicAssistant/
  Assets/
  Data/
  Helpers/
  Models/
  Repositories/
  Services/
  ViewModels/
  Views/
  App.xaml
  MainWindow.xaml
```

Recommended service interfaces:

```text
IAiDiagnosisService
ISettingsService
IVehicleRepository
IDiagnosisRepository
IMaintenanceRepository
IReminderRepository
IExportService
IFileStorageService
INavigationService
```

## AI Diagnosis Service

The AI layer is accessed only through `IAiDiagnosisService`.

`MockAiDiagnosisService` returns realistic sample results and is the default when no API key is configured. This makes the app free to run and easy to test.

`OpenAiDiagnosisService` sends text-based diagnosis requests to OpenAI when the user has added an API key in Settings. The key is never committed to GitHub and must not be hardcoded. In the desktop MVP, the key is stored locally using Windows-protected storage where possible.

A future `BackendAiDiagnosisService` can replace direct API-key usage. That will allow a production version where normal users do not need to bring their own OpenAI key.

## Data Model

Core models:

```text
Vehicle
DiagnosisCase
DiagnosisPhoto
MaintenanceEntry
MaintenanceReminder
AppSettings
AiDiagnosisResult
```

SQLite tables:

```text
Vehicles
DiagnosisCases
DiagnosisPhotos
MaintenanceEntries
MaintenanceReminders
Settings
```

Vehicle fields:

```text
Id
Make
Model
Year
Engine
Transmission
Mileage
FuelType
Notes
CreatedAt
UpdatedAt
```

Diagnosis case fields:

```text
Id
VehicleId
CreatedAt
ProblemDescription
Symptoms
WhenItHappens
WarningLights
Sounds
Smells
FluidLeaks
TemperatureBehavior
RecentRepairs
DrivingConditions
AiResultJson
UrgencyLevel
Status
UserNotes
UpdatedAt
```

Diagnosis photo fields:

```text
Id
DiagnosisCaseId
FilePath
Caption
ManualNotes
CreatedAt
```

Maintenance entry fields:

```text
Id
VehicleId
Date
Mileage
ServiceType
Cost
Notes
ReceiptPhotoPath
CreatedAt
UpdatedAt
```

Reminder fields:

```text
Id
VehicleId
Title
DueDate
DueMileage
Status
CreatedAt
UpdatedAt
```

## Screens

### Dashboard

The dashboard is the first screen. It shows:

- Total vehicles.
- Open diagnosis cases.
- Critical warnings.
- Upcoming maintenance.
- Recent diagnosis history.
- Recent maintenance entries.
- Quick actions: New Diagnosis, Add Vehicle, Add Maintenance, Export Report.

### Vehicles

The Vehicles page lists saved vehicles and supports add, edit, and delete. The add and edit form includes make, model, year, engine, transmission, mileage, fuel type, and notes.

### New Diagnosis

The New Diagnosis page is the main AI workflow. The user selects a vehicle, enters problem details, adds optional photos, and starts analysis.

Fields:

- Problem description.
- Symptoms.
- When the problem happens.
- Warning lights.
- Sounds.
- Smells.
- Fluid leaks.
- Temperature behavior.
- Recent repairs.
- Driving conditions.

The page shows a loading indicator while AI analysis is running. The result is displayed in structured sections with badges for safety and urgency.

### Diagnosis History

Diagnosis History lists previous cases. It supports:

- Search by text.
- Filter by vehicle.
- Filter by status.
- Open old diagnosis.
- Change status: Open, In Progress, Fixed, Archived.
- Export a single diagnosis to TXT.

### Maintenance Log

Maintenance Log stores service history. Each entry includes vehicle, date, mileage, service type, cost, notes, and optional receipt/photo path.

### Reminders

Reminders shows upcoming, overdue, and completed maintenance reminders. First version reminders are manually created and based on date or mileage.

### Settings

Settings includes:

- OpenAI API key input.
- AI mode indicator: Mock or OpenAI.
- Theme switcher: dark or light.
- Default mileage unit: km or miles.
- Default currency.
- Export folder.
- Clear local data action with confirmation.

## AI Response Format

AI results are structured as `AiDiagnosisResult` and stored as JSON in each diagnosis case.

Sections:

```text
Summary
LikelyCauses
LessLikelyCauses
SafetyLevel
UrgencyLevel
WhatToCheckFirst
DiagnosticSteps
RecommendedTools
RepairDifficulty
StopDrivingWhen
NextQuestions
MechanicNotes
```

Safety levels:

```text
Normal
Warning
Critical
DoNotDrive
```

The UI displays safety and urgency with clear colored badges. Dangerous states must be visually prominent.

## Safety Rules

The app must display this warning in diagnosis workflows and reports:

```text
This tool provides AI-generated suggestions only. It does not replace a certified mechanic inspection. If the vehicle is unsafe, overheating, leaking fuel, losing brakes, or showing critical warning lights, stop driving and contact a professional.
```

The AI prompt must prioritize safety. If the user describes overheating, fuel leaks, brake loss, steering failure, smoke, fire, severe electrical smell, or critical warning lights, the result must recommend stopping driving and contacting a professional.

## UI Direction

The UI should feel like a premium SaaS dashboard adapted for desktop:

- Dark theme by default.
- Optional light theme.
- Sidebar navigation.
- Dense but readable dashboard cards.
- Status badges.
- Modern typography.
- Clean spacing.
- Professional icons.
- Drag-and-drop image upload area.
- Responsive WPF layout behavior.
- Loading indicators during diagnosis.

The first screen should be the usable dashboard, not a marketing landing page.

## Export

MVP export includes:

- Single diagnosis report to TXT.
- Maintenance history to TXT.
- Maintenance history to CSV if it is low-risk during implementation.

PDF export is deferred to a later phase.

## Error Handling

The app should handle:

- Missing or invalid OpenAI API key.
- OpenAI request failure.
- SQLite initialization errors.
- Invalid forms.
- Missing image files.
- Export folder errors.

Failures should show friendly messages and avoid losing user-entered data.

## Testing Strategy

The implementation should include focused tests for:

- AI result parsing and mock service output.
- Repository CRUD behavior.
- Settings behavior around mock versus OpenAI mode.
- Export formatting.
- Safety-level mapping.

Manual verification should cover:

- First launch creates local database.
- Add vehicle.
- Run mock diagnosis.
- Attach and view photos.
- Save and reopen diagnosis history.
- Add maintenance entry.
- Create reminder.
- Export TXT report.
- Switch theme.

## Later Phases

After the MVP works, planned extensions are:

- Real image-based diagnosis using vision-capable API requests.
- PDF export.
- Advanced maintenance reminder templates.
- VIN decoding.
- OBD-II scanner integration.
- Optional backend mode so users do not need their own OpenAI API key.
- Packaging and installer for Windows.
