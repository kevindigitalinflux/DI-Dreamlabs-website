import type { RouteRecord } from 'vite-react-ssg'

/** Placeholder route table — full site map wired in Task 0.4. */
export const routes: RouteRecord[] = [
  {
    path: '/',
    element: (
      <main className="flex min-h-screen items-center justify-center bg-navy-deep">
        <h1 className="font-heading text-4xl font-extrabold text-offwhite">
          DI Dreamlabs
        </h1>
      </main>
    ),
  },
]
