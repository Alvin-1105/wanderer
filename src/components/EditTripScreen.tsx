import React, { useState } from 'react';
import { Trip, TripStatus } from '../types';
import { Layout } from '../components/Layout';
import { Header } from '../components/Header';
import { Save, X } from 'lucide-react';

interface EditTripScreenProps {
  trip?: Trip;
  onBack: () => void;
  onSave: (tripData: Partial<Trip>) => void;
}

export const EditTripScreen: React.FC<EditTripScreenProps> = ({ trip, onBack, onSave }) => {
  const [formData, setFormData] = useState<Partial<Trip>>(trip || {
    title: '',
    description: '',
    coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1000',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    status: TripStatus.Planning,
    budget: 0,
    duration: 0,
    destinations: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="min-h-screen bg-surface">
      <Header 
        title={trip ? 'Edit Trip' : 'New Trip'} 
        onBack={onBack}
        actions={
          <button 
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-full hover:bg-accent/90 transition-all font-medium text-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Trip</span>
          </button>
        }
      />
      
      <Layout className="max-w-3xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-primary uppercase tracking-widest">Trip Title</label>
            <input 
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Summer in Tuscany"
              className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-lg font-display font-semibold"
              required
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-primary uppercase tracking-widest">Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What's the vibe of this trip?"
              className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all min-h-[120px] text-sm leading-relaxed"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-primary uppercase tracking-widest">Start Date</label>
              <input 
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-primary uppercase tracking-widest">End Date</label>
              <input 
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-primary uppercase tracking-widest">Total Budget ($)</label>
              <input 
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-primary uppercase tracking-widest">Cover Image URL</label>
            <input 
              type="url"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm"
            />
            {formData.coverImage && (
              <div className="mt-2 h-40 w-full rounded-xl overflow-hidden border border-border">
                <img 
                  src={formData.coverImage} 
                  alt="Preview" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 mt-4">
            <button 
              type="submit"
              className="flex-grow py-4 bg-primary text-white rounded-xl font-display font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              {trip ? 'Update Trip' : 'Create Trip'}
            </button>
            <button 
              type="button"
              onClick={onBack}
              className="px-6 py-4 bg-white border border-border text-primary rounded-xl font-display font-bold text-lg hover:bg-surface-variant transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </Layout>
    </div>
  );
};
