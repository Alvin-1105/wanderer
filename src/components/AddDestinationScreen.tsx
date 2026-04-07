import React, { useState } from 'react';
import { Destination } from '../types';
import { Layout } from '../components/Layout';
import { Header } from '../components/Header';
import { Save, X, Trash2 } from 'lucide-react';

interface AddDestinationScreenProps {
  destination?: Destination;
  onBack: () => void;
  onSave: (destData: Partial<Destination>) => void;
  onDelete?: () => void;
}

export const AddDestinationScreen: React.FC<AddDestinationScreenProps> = ({ destination, onBack, onSave, onDelete }) => {
  const [formData, setFormData] = useState<Partial<Destination>>(destination || {
    city: '',
    country: '',
    description: '',
    coverImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=1000',
    budget: 0,
    duration: 0,
    items: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="min-h-screen bg-surface">
      <Header 
        title={destination ? 'Edit City' : 'Add Destination'} 
        onBack={onBack}
        actions={
          <button 
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-full hover:bg-accent/90 transition-all font-medium text-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save City</span>
          </button>
        }
      />
      
      <Layout className="max-w-3xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-primary uppercase tracking-widest">City Name</label>
            <input 
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="e.g., Florence"
              className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-lg font-display font-semibold"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-primary uppercase tracking-widest">Duration (Days)</label>
              <input 
                type="number"
                value={formData.duration || ''}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value as unknown as number })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-primary uppercase tracking-widest">Planned Budget ($)</label>
              <input 
                type="number"
                value={formData.budget || ''}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value as unknown as number })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-primary uppercase tracking-widest">Cover Image URL</label>
            <input 
              type="text"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm"
            />
            {formData.coverImage && (
              <div className="mt-2 h-40 w-full rounded-xl overflow-hidden border border-border">
                <img 
                  key={formData.coverImage}
                  src={formData.coverImage} 
                  alt="Preview" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 mt-4">
            {destination && onDelete && (
              <button 
                type="button"
                onClick={onDelete}
                className="px-6 py-4 bg-white border border-red-200 text-red-500 rounded-xl font-display font-bold text-lg hover:bg-red-50 transition-all flex items-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                <span>Delete City</span>
              </button>
            )}
            <button 
              type="submit"
              className="flex-grow py-4 bg-primary text-white rounded-xl font-display font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              {destination ? 'Update City' : 'Add City'}
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
