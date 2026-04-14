'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/lib/store';
import { getPersonById } from '@/lib/mock-data';

export function EditPersonDialog() {
  const { isEditPersonDialogOpen, setEditPersonDialogOpen, selectedPersonId } = useAppStore();
  const [formData, setFormData] = useState({
    givenName: '',
    middleName: '',
    familyName: '',
    birthYear: '',
    deathYear: '',
    isLiving: true,
    gender: 'unknown' as 'male' | 'female' | 'other' | 'unknown',
    bio: '',
  });

  useEffect(() => {
    if (isEditPersonDialogOpen && selectedPersonId) {
      const person = getPersonById(selectedPersonId);
      if (person) {
        setFormData({
          givenName: person.givenName,
          middleName: person.middleName || '',
          familyName: person.familyName,
          birthYear: person.birthYear?.toString() || '',
          deathYear: person.deathYear?.toString() || '',
          isLiving: person.isLiving,
          gender: person.gender || 'unknown',
          bio: person.bio || '',
        });
      }
    }
  }, [isEditPersonDialogOpen, selectedPersonId]);

  if (!isEditPersonDialogOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission - in real app would call API
    console.log('Edit person:', selectedPersonId, formData);
    alert('Person updated (mock)');
    setEditPersonDialogOpen(false);
  };

  const handleClose = () => {
    setEditPersonDialogOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg border bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="font-semibold">Edit Person</h2>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="givenName">Given Name *</Label>
              <Input
                id="givenName"
                value={formData.givenName}
                onChange={(e) => setFormData({ ...formData, givenName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="familyName">Family Name *</Label>
              <Input
                id="familyName"
                value={formData.familyName}
                onChange={(e) => setFormData({ ...formData, familyName: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="middleName">Middle Name</Label>
            <Input
              id="middleName"
              value={formData.middleName}
              onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="birthYear">Birth Year</Label>
              <Input
                id="birthYear"
                type="number"
                placeholder="YYYY"
                value={formData.birthYear}
                onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="deathYear">Death Year</Label>
              <Input
                id="deathYear"
                type="number"
                placeholder="YYYY"
                value={formData.deathYear}
                onChange={(e) => setFormData({ ...formData, deathYear: e.target.value })}
                disabled={formData.isLiving}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isLiving"
              checked={formData.isLiving}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isLiving: e.target.checked,
                  deathYear: e.target.checked ? '' : formData.deathYear,
                })
              }
              className="h-4 w-4"
            />
            <Label htmlFor="isLiving" className="cursor-pointer">
              Living
            </Label>
          </div>

          <div>
            <Label htmlFor="gender">Gender</Label>
            <select
              id="gender"
              value={formData.gender}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  gender: e.target.value as 'male' | 'female' | 'other' | 'unknown',
                })
              }
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="unknown">Unknown</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <Label htmlFor="bio">Biography</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              placeholder="Brief biography or notes..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
