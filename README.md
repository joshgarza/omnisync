# Omnisync Fullstack Web Developer Assessment

This project implements a fullstack card tracking application using the required tech stack: React/TypeScript (Frontend), Node/Express/TypeScript (Backend), and PostgreSQL, orchestrated entirely via Docker Compose.

The application displays eight interactive cards, tracks their clicks, records the first click timestamp, and allows sorting based on this persistent data.

## Getting Started

The application is fully containerized and can be launched using a single command.

### Prerequisites

You must have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### Launch Instructions

1. **Clone the Repository:**

   ```bash
   git clone [https://github.com/joshgarza/omnisync.git](https://github.com/joshgarza/omnisync.git)
   cd omnisync
   ```

2. **Configure Environment Variables:**
   **Copy the provided template file** and rename it to `.env`. This file contains the necessary database credentials and ports used by `docker-compose.yml`.

   ```bash
   cp .env.example .env
   # No changes needed to the default values for local testing.
   ```

3. **Start the Services:**
   Run the following command from the project root directory. This command builds the custom images, installs dependencies inside the containers, starts the PostgreSQL database, and seeds the initial card data.

   ```bash
   docker compose up --build
   ```

4. **Access the Application:**
   Once all services report as healthy and running:
   - **Frontend (Browser):** Open [http://localhost:5173/](https://www.google.com/search?q=http://localhost:5173/)

   - **Backend API:** Running on port 8080 (internal to Docker network, exposed locally for testing).

5. **Stop the Services:**
   To stop and clean up the environment, press `Ctrl+C` in the terminal, followed by:

   ```bash
   docker compose down -v
   ```

   The `-v` flag is crucial as it removes the persistent `db_data` volume, ensuring the database is reset for the next run.

---

## System Architecture and Endpoints

### Data Model (`card_clicks` table)

| Column Name             | Data Type                  | Description                                         |
| :---------------------- | :------------------------- | :-------------------------------------------------- |
| `id`                    | `INTEGER` (PK)             | Card number (1-8).                                  |
| `click_count`           | `INTEGER`                  | Total clicks received.                              |
| `first_click_timestamp` | `TIMESTAMP WITH TIME ZONE` | Timestamp of the first click (`NULL` if unclicked). |

### API Endpoints (Node/Express)

| Endpoint               | Method | Purpose                                     | Implementation Notes                                                                                                                      |
| :--------------------- | :----- | :------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `/api/cards`           | GET    | Reads all card data from the database.      | Returns the full list, ordered by ID (`1` to `8`). Frontend handles runtime sorting.                                                      |
| `/api/cards/:id/click` | POST   | Registers a click.                          | Atomically increments `click_count` and uses `COALESCE(first_click_timestamp, NOW())` to set the timestamp only on the first interaction. |
| `/api/reset`           | POST   | Resets all data in the `card_clicks` table. | Sets `click_count = 0` and `first_click_timestamp = NULL` for all rows.                                                                   |

---

## Design and Implementation Notes

### 1\. Default Card Order Ambiguity Clarification (Required)

The requirements created a subtle ambiguity regarding the default sorting:

1.  **Page Load:** Requires card order to be determined by the `first_click_timestamp`.

2.  **Reset:** Requires card order to revert to the **Original (1 → 8)** state.

**Decision Made:**
To strictly meet the requirement of reading the order from persistent data on load, the application defaults to the **'First Clicked → Last Clicked'** sort order (`TIME_ASC`). The **Clear All Clicks** button is the sole action that explicitly reverts the UI and the state back to the **'Original Order (1 → 8)'** (`ORIGINAL`) mode.

This ensures that the initial display reflects previous persistent activity. In a professional setting, I would confirm this specific behavior with stakeholders.

### 2\. Frontend Sorting Strategy

All sorting logic is handled client-side using a memoized function (`useMemo`) in React. This prevents unnecessary database queries when the user switches between sort modes, making the UI highly responsive.

- The `TIME_ASC` logic uses `Infinity` for unclicked cards (`null` timestamps) to ensure they are consistently placed at the end of the sorted list.

- The `handleCardClick` function updates the state and immediately re-sorts the array based on the currently selected `sortBy` mode.

### 3\. Docker and Development Environment

- **Cross-Platform Stability:** Docker Compose uses named volumes for the database (`db_data`) and relative bind mounts with volume masking for `node_modules`. This guarantees stability and portability across Linux, macOS, and Windows.

- **Hot Reload:** The backend is configured to use `ts-node-dev` via `npm run dev` to enable automatic server restarts upon changes to any TypeScript file, greatly speeding up the development feedback loop.

### 4\. Evaluation Self-Assessment

| Task Area                | Familiar/Easy                                                                                                  | New or Challenging                                                                                                                                                                                                                             |
| :----------------------- | :------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **API Design & CRUD**    | Implementing the basic Express routes and `GET`/`POST` structure was straightforward.                          | N/A                                                                                                                                                                                                                                            |
| **Database Integration** | Using the `pg` library and ensuring transactional integrity (even for the single `UPDATE` query) was standard. | **Coalesce Logic:** Ensuring the `COALESCE(first_click_timestamp, NOW())` query logic was correctly applied to maintain the immutable "first click" rule was key.                                                                              |
| **UI Functionality**     | Setting up the React components and passing state/handlers.                                                    | **Default Sort & Sync:** Ensuring the client-side sorting logic (`TIME_ASC`) correctly handled the persistent `null` vs. non-`null` timestamps and making sure state updates immediately triggered a re-sort (e.g., inside `handleCardClick`). |
| **Dockerization**        | Defining the standard services and ports.                                                                      | **Hot Reload Setup:** Resolving the `ts-node-dev: not found` and `EADDRINUSE` errors within the Docker bind-mount environment required specific configuration tweaks (`--build` and updating the `dev` command).                               |
