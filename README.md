# WeShare

A cross-platform mobile social media application built with React Native and Expo, featuring authentication, rich text editing, post sharing, and media support.

## App Preview

<p align="center">
  <img src="https://res.cloudinary.com/da5ggxk01/image/upload/v1746208810/43b2e80d-b6b5-456a-a87d-9e811d8b8232.png" width="45%" alt="WeShare Preview 1" />
  <img src="https://res.cloudinary.com/da5ggxk01/image/upload/v1746208916/d4f6b935-08f1-402b-a313-8bede3d49965.png" width="45%" alt="WeShare Preview 2" />
</p>

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
