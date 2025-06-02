

# ArchiveFlix

### A Simplified Streaming Experience for Archive.org Videos

**ArchiveFlix** is a web application that provides a refreshed and user-friendly interface for browsing and watching movies, videos, documentaries, and cartoons hosted on [Archive.org](https://archive.org). By leveraging the Archive.org API, this app transforms the vast library of public domain content into an experience similar to modern streaming platforms.

---

## Features

*  **Search Functionality**
  Easily search for videos and movies from the Archive.org collection.

* **User Interactions**
  Save videos to **Liked**, **Watched**, or **Not Interested** lists.

* **Local Profile**
  All user preferences and saved data are stored locally in the browser, with no account or login required.

*  **Profile Management**
  Access a profile page to review and manage your saved content.

---

## Tech Stack

* **React**
* **Next.js**
* **HeroUI**
* **Tailwind CSS**
* **Heroicons UI**

---

## Running the Project Locally

To get started with ArchiveFlix on your local machine:

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the development server:**

   ```bash
   npm run dev
   ```

3. **Environment Variables:**

   Create a `.env` file in the project root and add the following variables using your Archive.org credentials:

   ```
   S3=your-access-key
   S3_SECRET=your-secret-key
   ```

   You can obtain your credentials from:
   [https://archive.org/account/s3.php](https://archive.org/account/s3.php)

---

## Contribution

ArchiveFlix is an open-source project, and contributions are welcome!
Feel free to fork the repository, submit pull requests, or suggest improvements.

This project is licensed under the [MIT License](LICENSE), so you're free to use, modify, and distribute it as you wish.
