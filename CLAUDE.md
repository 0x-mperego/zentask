# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ZenTask is a multi-tenant webapp for time tracking of customer interventions. The application is built with Next.js 15, React 19, and TypeScript, designed to integrate with Supabase for backend services.

## Development Commands

- `pnpm dev`: Start development server with Turbopack
- `pnpm build`: Build for production
- `pnpm start`: Start production server
- `pnpm lint`: Run Next.js linter

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Runtime**: React 19
- **Language**: TypeScript with strict settings
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui with "new-york" style
- **Icons**: Lucide React
- **Linting**: Biome with ultracite configuration
- **Build**: Turbopack for development

## Project Structure

This is a standard Next.js 15 App Router project with:
- `src/app/`: App Router pages and layouts
- `src/lib/`: Utility functions and shared code
- `components.json`: shadcn/ui configuration
- `biome.jsonc`: Biome configuration extending ultracite

## Code Organization

- **Path aliases**: `@/*` maps to `src/*`
- **Component aliases**: 
  - `@/components` for components
  - `@/lib` for utilities
  - `@/components/ui` for UI components
  - `@/hooks` for custom hooks
- **Utility function**: `cn()` in `src/lib/utils.ts` for className merging with clsx and tailwind-merge

## Architecture Notes

This project is set up as a foundation for a multi-tenant time tracking application. The specifications indicate:
- Multi-tenant architecture with company isolation
- Supabase integration for backend services
- Role-based access control (super_admin, admin, operator)
- Data models for companies, users, clients, activities, states, and interventions
- File upload capabilities for attachments

## Development Guidelines

- Use TypeScript strict mode
- Follow shadcn/ui component patterns
- Utilize Tailwind CSS v4 features
- Implement proper error handling with TypeScript strict null checks
- Use the `cn()` utility for conditional className logic