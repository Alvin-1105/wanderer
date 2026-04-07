import React, { useState } from 'react';
import { Activity } from '../types';
import { Layout } from '../components/Layout';
import { Header } from '../components/Header';
import { Save, X, Trash2 } from 'lucide-react';

interface AddActivityScreenProps {
  activity?: Activity;
  onBack: () => void;
  onSave: (activityData: Partial<Activity>) => void;
  onDelete?: () => void;
}

export const AddActivityScreen: React.FC<AddActivityScreenProps> = ({ activity, onBack, onSave, onDelete }) => {
  const [formData, setFormData] = useState<Partial<Activity>>(activity || {
    type: 'activity',
    title: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1000',
    budget: 0,
    duration: 0,
    category: 'Sightseeing'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="min-h-screen bg-surface">
      <Header 
        title={activity ? 'Edit Activity' : 'Add Activity'} 
        onBack={onBack}
        actions={
          <button 
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-full hover:bg-accent/90 transition-all font-medium text-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Activity</span>
          </button>
        }
      />
      
      <Layout className="max-w-3xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-primary uppercase tracking-widest">Activity Title</label>
            <input 
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Wine Tasting in Chianti"
              className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-lg font-display font-semibold"
              required
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-primary uppercase tracking-widest">Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What will you be doing?"
              className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all min-h-[120px] text-sm leading-relaxed"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-primary uppercase tracking-widest">Duration (Hours)</label>
              <input 
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-primary uppercase tracking-widest">Budget ($)</label>
              <input 
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-primary uppercase tracking-widest">Category</label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm"
            >
              <option value="Sightseeing">Sightseeing</option>
              <option value="Food & Drink">Food & Drink</option>
              <option value="Adventure">Adventure</option>
              <option value="Relaxation">Relaxation</option>
              <option value="Culture">Culture</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-primary uppercase tracking-widest">Image URL</label>
            <input 
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm"
            />
            {formData.image && (
              <div className="mt-2 h-40 w-full rounded-xl overflow-hidden border border-border">
                <img 
                  key={formData.image}
                  src={formData.image} 
                  alt="Preview" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 mt-4">
            {activity && onDelete && (
              <button 
                type="button"
                onClick={onDelete}
                className="px-6 py-4 bg-white border border-red-200 text-red-500 rounded-xl font-display font-bold text-lg hover:bg-red-50 transition-all flex items-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                <span>Delete Activity</span>
              </button>
            )}
            <button 
              type="submit"
              className="flex-grow py-4 bg-primary text-white rounded-xl font-display font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              {activity ? 'Update Activity' : 'Add Activity'}
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
