# NexGrid Digital Solutions

NexGrid Digital Solutions is a premier digital engineering agency platform built with high-performance modern web technologies. The platform provides full-service web development offerings, architectural case studies, transparent retainer plans, a secure Client Maintenance & SLA Portal, and a Master Admin Operations Portal.

## Key Features

- **Enterprise Agency Showcase**:
  - Full service breakdown (Custom Web Apps, High-Performance Sites, E-Commerce Systems, API Integrations).
  - Production architecture showcase with performance benchmarks and live case studies.
  - Transparent retainer plans (Launch, Scale & Performance, Enterprise Grid).
  - Contact and consultation inquiry flows with direct communication channels:
    - Primary Email: `nexgriddigital@gmail.com`
    - Phone: `+251 906697634`

- **High-Security Authentication**:
  - **Single Master Admin Login**: Restricted exclusively to `nexgriddigital@gmail.com` via secure password authentication.
  - **Zero Public Client Signups**: Public self-registration is disabled.
  - **Granular Client Provisioning**: Clients can only log in after being provisioned by the master administrator, who issues a cryptographically secure Access Key (`NXG-XXXX-XXXX`).
  - **Zero Demo Data**: All synthetic demo data has been eradicated for production readiness.

- **Client Maintenance & SLA Portal**:
  - Real-time contract countdown and SLA expiration timer.
  - Maintenance ticket submission (Feature Update, Bug Fix, Performance Optimization, Security Patch).
  - Live client communications chat with NexGrid Lead Operations.
  - Real-time status tracker (Submitted, Accepted, In Progress, Completed).

- **Master Admin Operations Portal**:
  - **Client Provisioning Hub**: Issue new client logins with custom Access Keys, assign retainer tiers, monthly fees, and SLA guarantees.
  - **Active Retainer Agreements**: Monitor active MRR, contracted hours, days remaining, and agreement statuses.
  - **Maintenance Triage Queue**: Review incoming client requests, assign staff engineers, estimate hours, and post technical notes.
  - **Client Communications Desk**: Multi-client chat channels with real-time Firebase Firestore synchronization.

## Tech Stack

- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS v4, Motion, Lucide React
- **Backend**: Node.js, Express, tsx, esbuild
- **Database & Auth**: Firebase Firestore, Firebase Authentication
- **Typography**: Outfit, Work Sans, JetBrains Mono

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
git clone <your-github-repo-url>
cd nexgrid-digital
npm install
```

### Environment Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Set the following variables:

```env
ADMIN_PASSWORD=your_secure_admin_password
MASTER_ADMIN_EMAIL=nexgriddigital@gmail.com
```

### Development

```bash
npm run dev
```

Runs the application at `http://localhost:3000`.

### Production Build

```bash
npm run build
npm start
```

## Security Model

1. **Strict Admin Access**: Only `nexgriddigital@gmail.com` can access `/admin-portal`.
2. **Key-Based Client Authentication**: Client portal requires a pre-provisioned email + issued Access Key verified against the secure database.
3. **Firestore Security Rules**: Hardened in `firestore.rules` to disallow unauthorized writes and reads.

## License

Apache-2.0
