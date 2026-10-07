# TrainSight AI

> **Turn training feedback into actionable insights.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Anthropic Claude](https://img.shields.io/badge/Claude-3.5%20Sonnet-d97706?style=flat)](https://www.anthropic.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

TrainSight AI is an AI-assisted analytics platform prototype built for corporate Learning & Development (L&D) teams, HR business partners, and training facilitators. It transforms raw evaluation forms and unstructured feedback into executive metrics, interactive charts, and grounded AI insights.

---

## 📌 Project Status

> **Disclaimer**: TrainSight AI is currently an **early-stage prototype (v0.1)**. 
> 
> The default public demo operates entirely on **synthetic demonstration data** (500 fictional training evaluation records). This prototype does **not** claim commercial enterprise clients, active revenue, investment, or enterprise contracts.

---

## 🚀 Key Features

- **Executive Overview Dashboard**: Real-time KPI summary cards (Total Sessions, Average Rating, Total Participants, Active Instructors) accompanied by interactive Recharts visualizations:
  - 12-month training sessions trend area chart
  - Departmental average rating comparison
  - Top courses by total participant enrollment
  - 1–5 star rating distribution breakdown
  - Recent training sessions audit log
- **Multi-Dimensional Analytics**: Deep-dive analytics with cross-filtering by Department, Course, Instructor, and Custom Date Range. Includes a sortable Instructor Performance Roster.
- **AI Feedback Analysis**: Evaluates participant comments with automated sentiment tagging (Positive, Neutral, Negative) and common theme extraction. Integrates with Anthropic Claude 3.5 Sonnet to synthesize:
  - Programmatic executive summary
  - Core positive themes
  - Recurring participant complaints & friction points
  - Actionable curriculum improvement recommendations
  - Investigative follow-up questions
- **Conversational "Ask Claude" Interface**: Natural language Q&A engine powered by Anthropic Claude. The platform computes local statistical summaries before calling Claude, strictly preventing hallucinations and instructing Claude to declare when data is insufficient.
- **Dataset Management & CSV Ingestion**:
  - Out-of-the-box 500-record realistic synthetic benchmark.
  - Client-side CSV upload using **Papa Parse** with rigorous column validation.
  - Real-time schema validation, missing value detection, and paginated data preview.
  - One-click dataset export and "Reset to Demo" toggle.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router and React Server Components
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing throughout)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Custom dark navy SaaS aesthetic)
- **Visualizations**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **CSV Engine**: [Papa Parse](https://www.papaparse.com/)
- **AI Foundation**: Official [@anthropic-ai/sdk](https://www.npmjs.com/package/@anthropic-ai/sdk) (Claude 3.5 Sonnet)
- **Architecture Principle**: Zero database required for prototype MVP; in-memory React Context state with server-side API proxy routes ensuring `ANTHROPIC_API_KEY` is never exposed client-side.

```
src/
├── app/
│   ├── api/ai/
│   │   ├── analyze-feedback/route.ts  # Server-side Claude feedback synthesis
│   │   └── ask/route.ts               # Server-side Claude grounded Q&A
│   ├── dashboard/
│   │   ├── layout.tsx                 # Dashboard shell with topnav & responsive sidebar
│   │   ├── page.tsx                   # Overview Dashboard with KPIs & charts
│   │   ├── analytics/page.tsx         # Multi-filter analytics & sortable instructor table
│   │   ├── feedback/page.tsx          # Sentiment breakdown & AI feedback summary
│   │   ├── ask-ai/page.tsx            # Conversational Q&A chat interface
│   │   ├── dataset/page.tsx           # CSV upload, Papa Parse validation, table preview
│   │   └── about/page.tsx             # Prototype mission, architecture, disclosures
│   ├── privacy/page.tsx               # Prototype privacy & data handling policy
│   ├── globals.css                    # Tailwind CSS definitions & custom theme
│   ├── layout.tsx                     # Global RootLayout
│   └── page.tsx                       # SaaS Landing Page with hero, features & preview
├── components/
│   └── dashboard/
│       └── Sidebar.tsx                # Responsive navigation sidebar
└── lib/
    ├── analytics.ts                   # Statistical calculations, sentiment & context builders
    ├── data-generator.ts              # Seeded 500-row synthetic dataset generator
    ├── dataset-context.tsx            # Global dataset state provider
    └── types.ts                       # Shared TypeScript models
```

---

## 📸 Screenshots

| Landing Page | Executive Dashboard |
| :---: | :---: |
| *(Clean SaaS Dark Navy Landing Page with Live Mini Preview)* | *(Interactive KPI Cards & Responsive Recharts Graphs)* |

| Feedback Analysis | Ask TrainSight AI |
| :---: | :---: |
| *(Claude Feedback Synthesis & Sentiment Breakdown)* | *(Grounded Q&A Powered by Anthropic Claude)* |

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js 18.18+ or 20+ (Node.js 22 LTS recommended)
- npm or pnpm

### 1. Clone the repository
```bash
git clone https://github.com/azrielaprieliant/trainsight-ai.git
cd trainsight-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the project root:
```bash
cp .env.example .env.local
```

Add your Anthropic API Key:
```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

> **Note**: If `ANTHROPIC_API_KEY` is omitted, the application runs normally in **Offline Analytics Mode**. All charts, filters, metrics, and dataset management features function completely; a polite banner notifies the user that AI synthesis is unavailable.

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deployment to Vercel

TrainSight AI is built natively for seamless deployment on [Vercel](https://vercel.com):

1. Push your repository to GitHub:
   ```bash
   git remote add origin https://github.com/azrielaprieliant/trainsight-ai.git
   git branch -M main
   git push -u origin main
   ```
2. Import the project in your Vercel Dashboard:
   - Select the `trainsight-ai` repository.
   - Framework preset: **Next.js**.
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. Add Environment Variables in Vercel Project Settings:
   - `ANTHROPIC_API_KEY`: *(Your production Anthropic API key)*
4. Click **Deploy**.

---

## 📄 CSV Schema Specification

When uploading custom evaluation data via the **Dataset** tab, your CSV should include the following header columns (case-insensitive):

| Column | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `training_id` | String | Optional | Unique session identifier (e.g. `TR-0042`) |
| `training_date` | YYYY-MM-DD | Optional | Date session took place |
| `instructor` | String | **Yes** | Facilitator's full name |
| `course` | String | **Yes** | Course title |
| `department` | String | **Yes** | Business unit or department |
| `rating` | Number (1.0–5.0) | **Yes** | Numerical evaluation score |
| `participant_count`| Integer | Optional | Number of employees attending session |
| `feedback` | String | **Yes** | Open-ended attendee comment or feedback |

A pre-packaged sample file is available in the root directory: [`sample_training_data.csv`](./sample_training_data.csv).

---

## 🔒 Security & Privacy

- **Server-Side Security**: All calls to Anthropic Claude are executed exclusively in Next.js Server Route handlers (`app/api/ai/*`). The API key is never exposed to the client browser.
- **In-Memory Volatility**: Uploaded files are parsed within the browser tab session memory. No data is stored in a remote database or shared across sessions.
- **Sanitized Context**: Only aggregated numerical metrics and a representative sample of comments are transmitted to the LLM. Full database dumps are never sent.

---

## 🔗 Repository

- **GitHub**: [https://github.com/azrielaprieliant/trainsight-ai](https://github.com/azrielaprieliant/trainsight-ai)

---

## 📝 License

Distributed under the MIT License.
