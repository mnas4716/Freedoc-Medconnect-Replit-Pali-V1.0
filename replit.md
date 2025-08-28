# Healthcare Platform

## Overview

This is a comprehensive healthcare platform built as a full-stack web application. The system connects patients with Australian Partner Doctors through various telemedicine services including online prescriptions, medical certificates, mental health support, telehealth consultations, and pathology referrals. The platform features a multi-tenant architecture supporting patients, doctors, and administrators with role-based access control.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- Completed comprehensive request management system with automatic doctor assignment in equal rotation (August 11, 2025)
- Added admin requests page (admin-requests.tsx) for viewing all user submissions with reassignment capability
- Developed doctor request details page (doctor-request-details.tsx) with note-taking and document generation features
- Implemented real-time database integration with request tracking and assignment APIs
- Added proper routing for request management pages with authentication checks
- Fixed TypeScript errors and ensured proper API request handling throughout the system

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing with role-based route protection
- **Forms**: React Hook Form with Zod validation for type-safe form handling

### Dashboard System
- **Role-Based Dashboards**: Three distinct dashboard interfaces (Patient, Doctor, Admin)
- **Admin Management Pages**: User management, doctor management, system analytics, and comprehensive request management pages
- **Request Assignment System**: Automatic equal-rotation assignment of all user requests to available doctors
- **Real-time Data**: API-driven dashboards with live data fetching and proper loading states
- **Interactive Features**: Consultation status updates, user filtering, management actions, and request reassignment capabilities

### Backend Architecture
- **Server**: Express.js with TypeScript running on Node.js
- **API Design**: RESTful API with structured error handling and request logging middleware
- **Database ORM**: Drizzle ORM for type-safe database operations
- **File Structure**: Modular architecture with separate routes, services, and storage layers
- **Development**: Hot reload setup with Vite integration for seamless development experience
- **Dashboard APIs**: Dedicated endpoints for admin statistics, consultation management, and doctor workload tracking

### Authentication & Authorization
- **Provider**: Replit Auth integration using OpenID Connect
- **Session Management**: Express session with PostgreSQL session store using connect-pg-simple
- **Authorization**: Role-based access control (patient, doctor, admin) with protected routes
- **Registration Flow**: Email verification via OTP system before account activation

### Database Design
- **Primary Database**: PostgreSQL with Neon serverless hosting
- **Schema Management**: Drizzle migrations with TypeScript schema definitions
- **Key Entities**: Users, Doctors, Consultations, Medical Certificates, Prescriptions, OTP Verifications
- **Relationships**: Proper foreign key relationships between patients, doctors, and consultations
- **Enums**: PostgreSQL enums for user roles, consultation status, service types, and certificate types

### Service Layer Architecture
- **Email Service**: Nodemailer integration for OTP delivery and notifications
- **PDF Generation Service**: HTML-to-PDF generation for medical documents (certificates, prescriptions)
- **Smart Assignment**: Load balancing algorithm for distributing consultations among available doctors
- **Document Storage**: File system-based storage for generated medical documents

### Frontend Component Architecture
- **Design System**: Consistent component library with variant-based styling using class-variance-authority
- **Form Components**: Reusable service request forms with validation for each healthcare service
- **Dashboard Views**: Role-specific dashboards (patient, doctor, admin) with service-specific workflows
- **Modal System**: Dynamic form modals for service requests with type-safe validation
- **Responsive Design**: Mobile-first approach with adaptive layouts

## External Dependencies

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **WebSocket Support**: WebSocket implementation for real-time database connections

### Authentication Services
- **Replit Auth**: OAuth 2.0/OpenID Connect integration for user authentication
- **Session Storage**: PostgreSQL-backed session management for secure authentication state

### Email Services
- **SMTP Provider**: Configurable SMTP integration (Gmail, custom providers) for transactional emails
- **Email Templates**: HTML email templates for OTP verification and notifications

### UI & Styling
- **Radix UI**: Headless component primitives for accessibility-compliant UI components
- **Lucide React**: Icon library for consistent iconography
- **Tailwind CSS**: Utility-first CSS framework with custom configuration

### Development Tools
- **Vite**: Build tool with hot module replacement and development server
- **TypeScript**: Type safety across frontend and backend with shared types
- **ESBuild**: Fast JavaScript bundler for production builds

### Third-party Libraries
- **React Query**: Server state management with caching and synchronization
- **React Hook Form**: Form state management with validation
- **Zod**: Runtime type validation and schema parsing
- **date-fns**: Date manipulation and formatting utilities