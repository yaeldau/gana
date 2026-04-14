'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { authApi } from '@/lib/auth';
import { apiClient } from '@/lib/api';
import type { User, Person } from '@/types';
import { formatDate, calculateAge } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!authApi.isAuthenticated()) {
          router.push('/login');
          return;
        }

        const [userData, personsData] = await Promise.all([
          authApi.getCurrentUser(),
          apiClient.get<{ persons: Person[]; total: number }>('/api/persons'),
        ]);

        setUser(userData);
        setPersons(personsData.persons);
      } catch (error) {
        console.error('Failed to load data:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleLogout = async () => {
    await authApi.logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="font-serif text-2xl font-bold">
            Gana
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold">Your Family Tree</h1>
            <p className="mt-1 text-muted-foreground">
              {persons.length} {persons.length === 1 ? 'person' : 'people'} in your tree
            </p>
          </div>
          <Link href="/dashboard/persons/new">
            <Button>Add Person</Button>
          </Link>
        </div>

        {/* Persons List */}
        {persons.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <h2 className="font-serif text-xl font-semibold">No people yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Get started by adding your first family member
            </p>
            <Link href="/dashboard/persons/new">
              <Button className="mt-4">Add Your First Person</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {persons.map((person) => (
              <Link
                key={person.id}
                href={`/dashboard/persons/${person.id}` as any}
                className="group"
              >
                <div className="rounded-lg border bg-card p-6 transition-all hover:border-primary hover:shadow-md">
                  <h3 className="font-serif text-xl font-semibold group-hover:text-primary">
                    {person.givenName} {person.familyName}
                  </h3>
                  {person.birthDate && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Born: {formatDate(person.birthDate)}
                      {person.isLiving && (
                        <span className="ml-2">
                          (Age {calculateAge(person.birthDate, person.deathDate)})
                        </span>
                      )}
                    </p>
                  )}
                  {person.deathDate && (
                    <p className="text-sm text-muted-foreground">
                      Died: {formatDate(person.deathDate)}
                    </p>
                  )}
                  {person.bio && (
                    <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                      {person.bio}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-2">
                    {!person.isLiving && (
                      <span className="rounded-full bg-muted px-2 py-1 text-xs">
                        Deceased
                      </span>
                    )}
                    {person.gender && (
                      <span className="rounded-full bg-muted px-2 py-1 text-xs capitalize">
                        {person.gender.toLowerCase()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
