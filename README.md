# WeShare

A cross-platform mobile social media application built with React Native and Expo, featuring authentication, rich text editing, post sharing, and media support.

## Tech Stack

* **Framework:** [React Native](https://reactnative.dev/), [Expo](https://expo.dev/)
* **Language:** JavaScript
* **Styling & Components:** StyleSheet, Expo SDK utilities
* **Backend Integration:** Supabase (Auth, database, and storage)

---

## Project Structure

```text
weshare/
├── app/                   # File-based routing views and screens
├── assets/                # Static assets (images, icons)
├── components/            # Reusable UI components (PostCard, etc.)
├── constants/             # App constants and configuration variables
├── context/               # Global state contexts (Authentication and user management)
├── helpers/               # Utility functions and helper modules
├── lib/                   # External client setups and integrations (Supabase, etc.)
├── patches/               # Custom code patches or rich text editor modules
├── services/              # API and backend service integrations
└── app.json               # Expo configuration
