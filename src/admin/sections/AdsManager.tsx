import React, { useState } from 'react';
import { DollarSign, CheckCircle, Save, Sparkles } from 'lucide-react';

export const AdsManager: React.FC = () => {
  const [leaderboardText, setLeaderboardText] = useState(
    'হাজরাবাড়ী ২৪. কম ডিজিটাল বিজ্ঞাপন স্পেস — লক্ষাধিক পাঠকের কাছে পৌঁছান'
  );
  const [rectangleText, setRectangleText] = useState(
    'সংবাদ স্পন্সরশিপ পার্টনার — যোগাযোগের জন্য ads@hazarabari24.com'
  );
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-2xl font-black text-slate-900 font-serif-bn flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-red-600" />
          <span>বিজ্ঞাপন ও স্পন্সরশিপ ব্যানার ব্যবস্থাপনা</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          সংবাদপত্রের নির্দিষ্ট ও সংরক্ষিত বিজ্ঞাপন স্লটের কনটেন্ট পরিচালনা করুন
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>বিজ্ঞাপন সেটিংস সফলভাবে আপডেট করা হয়েছে!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-3">
          <h3 className="font-bold text-slate-900 font-serif-bn text-sm">
            ১. প্রধান লিডারবোর্ড ব্যানার (হোমপেজ ও ক্যাটাগরি পেজ)
          </h3>
          <p className="text-xs text-slate-400">মাপ: 728 x 90 বা রেসপনসিভ অনুভূমিক ব্যানার</p>
          <textarea
            rows={2}
            value={leaderboardText}
            onChange={(e) => setLeaderboardText(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
          ></textarea>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-3">
          <h3 className="font-bold text-slate-900 font-serif-bn text-sm">
            ২. ইন-আর্টিকেল ও সাইডবার রেক্ট্যাঙ্গেল ব্যানার
          </h3>
          <p className="text-xs text-slate-400">মাপ: 300 x 250 বা স্কয়ার স্পন্সর কার্ড</p>
          <textarea
            rows={2}
            value={rectangleText}
            onChange={(e) => setRectangleText(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
          ></textarea>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Save className="w-4 h-4" />
          <span>পরিবর্তন সংরক্ষণ করুন</span>
        </button>
      </form>
    </div>
  );
};
