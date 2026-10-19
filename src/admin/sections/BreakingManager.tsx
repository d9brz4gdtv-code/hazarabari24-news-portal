import React, { useState, useEffect } from 'react';
import { Flame, Plus, Trash2, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { BreakingNewsItem } from '../../types';
import {
  subscribeToBreakingNews,
  addBreakingNewsToFirestore,
  toggleBreakingNewsInFirestore,
  deleteBreakingNewsFromFirestore,
} from '../../services/firestoreNewsService';

export const BreakingManager: React.FC = () => {
  const [items, setItems] = useState<BreakingNewsItem[]>([]);
  const [newHeadline, setNewHeadline] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToBreakingNews((data) => {
      setItems(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHeadline.trim()) return;
    setAdding(true);
    try {
      await addBreakingNewsToFirestore(newHeadline.trim());
      setNewHeadline('');
    } catch (err) {
      console.error('Error adding breaking news:', err);
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (item: BreakingNewsItem) => {
    const nextActive = !item.active;
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, active: nextActive } : i))
    );
    try {
      await toggleBreakingNewsInFirestore(item.id, nextActive);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    try {
      await deleteBreakingNewsFromFirestore(id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-2xl font-black text-slate-900 font-serif-bn flex items-center gap-2">
          <Flame className="w-6 h-6 text-red-600" />
          <span>জরুরি ও ব্রেকিং সংবাদ টিকার ব্যবস্থাপনা</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          এখানে যুক্ত করা শিরোনামগুলো ওয়েবসাইটের শীর্ষ টিকার বারে লাইভ স্ক্রোল করবে।
        </p>
      </div>

      {/* Add new form */}
      <form onSubmit={handleAdd} className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          required
          value={newHeadline}
          onChange={(e) => setNewHeadline(e.target.value)}
          placeholder="নতুন জরুরি সংবাদ বা ব্রেকিং শিরোনাম লিখুন..."
          className="flex-1 px-3.5 py-2.5 bg-white border border-slate-300 rounded-md text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
        />
        <button
          type="submit"
          disabled={adding}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          <span>টিকার-এ যোগ করুন</span>
        </button>
      </form>

      {/* List */}
      <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100 overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">লোড হচ্ছে...</div>
        ) : items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => handleToggle(item)}
                  className={`p-1 rounded cursor-pointer transition-colors ${
                    item.active ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                  title={item.active ? 'সক্রিয় আছে (ক্লিক করে নিষ্ক্রিয় করুন)' : 'নিষ্ক্রিয় আছে'}
                >
                  {item.active ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </button>
                <span className={`text-xs sm:text-sm font-serif-bn ${item.active ? 'font-bold text-slate-900' : 'text-slate-400 line-through'}`}>
                  {item.headline}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${item.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {item.active ? 'লাইভ টিকার' : 'বন্ধ'}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-xs text-slate-400">কোনো ব্রেকিং সংবাদ নেই।</div>
        )}
      </div>
    </div>
  );
};
