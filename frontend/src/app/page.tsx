import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="text-2xl font-bold font-serif">Gana</div>
          <nav className="flex items-center gap-6">
            <Link href="/about" className="text-sm hover:underline">
              About
            </Link>
            <Link href="/login" className="text-sm hover:underline">
              Log In
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center">
          <h1 className="font-serif text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            Your Family Story,
            <br />
            <span className="text-primary">Beautifully Preserved</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Build your family tree with confidence. Gana intelligently detects duplicates,
            helps you merge profiles carefully, and keeps a complete history of every change.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/register"
              className="rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90"
            >
              Start Your Tree
            </Link>
            <Link
              href="/about"
              className="rounded-md border border-border px-8 py-3 text-base font-medium hover:bg-accent"
            >
              Learn More
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="border-t bg-muted/40 py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center font-serif text-3xl font-bold">
              Built for Real Families
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="mb-2 font-serif text-xl font-semibold">
                  Smart Duplicate Detection
                </h3>
                <p className="text-muted-foreground">
                  Automatically detects when the same person has been added multiple times,
                  even with slight name variations.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <h3 className="mb-2 font-serif text-xl font-semibold">
                  Careful Merging
                </h3>
                <p className="text-muted-foreground">
                  Side-by-side comparison and conflict resolution ensure you never lose
                  information when combining profiles.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <h3 className="mb-2 font-serif text-xl font-semibold">
                  Complete History
                </h3>
                <p className="text-muted-foreground">
                  Every change is tracked. See who added what, when, and why. Your family
                  story stays accountable.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Gana. Built with care by Yael Dauber.</p>
        </div>
      </footer>
    </div>
  );
}
