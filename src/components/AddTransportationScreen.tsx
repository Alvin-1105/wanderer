import React, { useState } from 'react';
import { Transportation } from '../types';
import { Layout } from '../components/Layout';
import { Header } from '../components/Header';
import { Save, X, Trash2 } from 'lucide-react';

interface AddTransportationScreenProps {
  transportation?: Transportation;
  onBack: () => void;
  onSave: (transportData: Partial<Transportation>) => void;
  onDelete?: () => void;
}

export const AddTransportationScreen: React.FC<AddTransportationScreenProps> = ({ transportation, onBack, onSave, onDelete }) => {
  const [formData, setFormData] = useState<Partial<Transportation>>(transportation || {
    type: 'transportation',
    title: '',
    description: '',
    budget: 0,
    duration: 0,
    durationUnit: 'hours'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="min-h-screen bg-surface">
      <Header 
        title={transportation ? 'Edit Transportation' : 'Add Transportation'} 
        onBack={onBack}
        actions={
          <button 
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-full hover:bg-accent/90 transition-all font-medium text-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Details</span>
          </button>
        }
      />
      
      <Layout className="max-w-3xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-primary uppercase tracking-widest">Transportation Title</label>
            <input 
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., High-speed train to Rome"
              className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-lg font-display font-semibold"
              required
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-primary uppercase tracking-widest">Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Any specific details about the journey?"
              className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all min-h-[120px] text-sm leading-relaxed"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-primary uppercase tracking-widest">Duration</label>
              <div className="flex gap-2">
                <input 
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                  className="flex-grow px-4 py-3 rounded-xl border border-border bg-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm"
                />
                <select 
                  value={formData.durationUnit}
                  onChange={(e) => setFormData({ ...formData, durationUnit: e.target.value as any })}
                  className="w-32 px-4 py-3 rounded-xl border border-border bg-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm"
                >
                  <option value="mins">Mins</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
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
          
          <div className="flex items-center gap-4 mt-4">
            {transportation && onDelete && (
              <button 
                type="button"
                onClick={onDelete}
                className="px-6 py-4 bg-white border border-red-200 text-red-500 rounded-xl font-display font-bold text-lg hover:bg-red-50 transition-all flex items-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                <span>Delete Details</span>
              </button>
            )}
            <button 
              type="submit"
              className="flex-grow py-4 bg-primary text-white rounded-xl font-display font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              {transportation ? 'Update Details' : 'Add Details'}
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
