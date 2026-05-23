<h1 align="center">Forza Horizon Online Racing Project</h1>

<p align="center">
  <strong>A community-driven tune database for Forza Horizon Games — browse META cars, filter by class, and find share codes instantly.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-Angular-red?style=for-the-badge&logo=angular" alt="Angular">
  <img src="https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge&logo=nodedotjs" alt="Node.js">
  <img src="https://img.shields.io/badge/Database-PostgreSQL-blue?style=for-the-badge&logo=postgresql" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Cloud-AWS-orange?style=for-the-badge&logo=amazonaws" alt="AWS">
  <img src="https://img.shields.io/badge/License-MIT-lightgrey?style=for-the-badge" alt="MIT">
</p>

---

## Overview

<p align="justify">
Forza Horizon Online Racing is a full-stack web application that centralizes community tune data for Forza Horizon 5 (and soon for Forza Horizon 6). Players can browse hundreds of cars organized by performance class, filter by driving style, identify META picks, and copy share codes directly from the site — without having to hunt through spreadsheets or Discord servers.
</p>

> [!NOTE]
> Tune data is sourced from [Johnson Racing Tunes (Forza community spreadsheet)](https://docs.google.com/spreadsheets/d/1F3xqy6yodUmnuua08YU-fet4KDDoIbaoNZRiZ9U8yxk/edit?pli=1&gid=1590093733#gid=1590093733) and expanded manually. The database currently covers over 460 tunes across 304 cars in all 7 classes: X, S2, S1, A, B, C, and D.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 18 (standalone components) |
| Backend | Node.js + Serverless HTTP |
| Database | PostgreSQL (Neon) |
| Hosting | AWS S3 + CloudFront |
| API | AWS API Gateway + Lambda |
| Images | AWS S3 + CloudFront |

---

## Infrastructure

The application is fully deployed on AWS:

- **Frontend** — Built Angular app hosted on an S3 bucket, served globally via CloudFront. A CloudFront Function handles Angular's client-side routing, redirecting all non-asset requests to `index.html`.
- **Backend** — Node.js API deployed as an AWS Lambda function using serverless-http, exposed through API Gateway. CORS is configured to allow requests from the CloudFront distribution.
- **Images** — Car images are stored in S3 and served through the same CloudFront distribution under the `/images/*` path, with a dedicated cache behavior that bypasses the Angular routing function.
- **Database** — PostgreSQL hosted on Neon (serverless Postgres), connected to the Lambda function via `DATABASE_URL`.

---

## Features

### Home — Class Rows

The home page displays a horizontally scrollable row for each performance class (S2 through D). Each row shows 8 randomly selected cars from that class, with the selection algorithm guaranteeing at least one META car per row when available. A "View All" button below each row links to the full class listing.

![Home page showing class rows](https://github.com/user-attachments/assets/e59d0312-ac1d-4228-a3ed-4ee03bdd1d4d)

### Class Detail

Clicking any class badge in the navbar or "View All" opens the full class listing. All cars in that class are displayed in a responsive grid. A filter bar at the top allows narrowing results by tune type (Allround, Speed, Dirt, CC) or by META status. META cars are highlighted with a badge on their card.

![S1 Class detail page](https://github.com/user-attachments/assets/657f88d8-6fac-40db-9990-9fe7101c5e59)

### Tune Modal

Clicking "Check Tunes" on any car opens a modal showing the full tune table for that car in that class. Each row in the table shows the creator, the tune type (with a color-coded tag), the formatted share code, and any additional notes. Cars marked META display a highlighted badge on the image.

![Tune modal for Dodge Viper '13 Anniversary Edition](https://github.com/user-attachments/assets/f8d98cdf-ac78-4b9a-a959-584d312ec863)

### Search

The navbar search bar provides two interaction modes:

- **Live dropdown** — results appear as you type (debounced at 220ms). Each result shows the car image, name, tune count, and class badge. Clicking a result navigates to the search results page and opens that car's modal directly.
- **Full search** — pressing Enter or clicking the magnifying glass navigates to `/fh5/search?q=...`, which renders a dedicated search results page with all matching cars displayed in a grid.

If a car has tunes in multiple classes, it appears as separate entries — one per class.

![Search dropdown showing Ferrari results](https://github.com/user-attachments/assets/61388312-48a8-4fe1-a79c-705601b879c6)

![Search component page showing Ferrari results](https://github.com/user-attachments/assets/bbf30005-4ee2-41d9-a8ab-7270e3c05449)

---

## Pages and Routes

| Route | Component | Description |
|---|---|---|
| `/home` | `HomeComponent` | Class rows with 8 random cars each |
| `/fh5/class/:className` | `ClassDetailComponent` | Full grid for a single class with filters |
| `/fh5/search?q=` | `Fh5SearchResultsComponent` | Search results grid |

---

## Local Development

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Angular CLI (`npm install -g @angular/cli`)

### Frontend

```bash
npm install
ng serve
```

The app will be available at `http://localhost:4200`.

### Backend

```bash
cd backend
npm install
node index.js
```

The API will be available at `http://localhost:3000`.

---

## Project Structure

```
FHOR/
├── backend/
│   ├── index.js                        # Express API (also deployed as Lambda)
│   └── scripts/
│       └── migrate-images.js           # Migrates car images from Fandom wiki to S3
├── src/
│   └── app/
│       ├── home/                       # Home page (class rows)
│       ├── class-detail-component/     # Full class grid + filters
│       ├── fh5-search-results/         # Search results page
│       ├── car-modal/                  # Tune detail modal
│       ├── services/
│       │   └── car.service.ts          # HTTP calls to backend
│       └── interfaces/
│           └── interfaces-car.ts       # Car, Tune, CarDetail types
```

---

## META Classification

META cars are flagged manually in the database. The current META list was compiled from community tier lists and Johnson Racing's recommendations.

---

## Data Source

Tune data was originally sourced from the **Johnson Racing Tunes for Forza** community spreadsheet and parsed into the PostgreSQL database. Car images are fetched from the [Forza Motorsport Fandom Wiki](https://forza.fandom.com) and stored in S3.

---

## License

MIT
