import React from 'react';
import { ChevronRight, ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onNavigateHome: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigateHome }) => {
  return (
    <div className="py-8 sm:py-12 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 font-medium">
          <button
            type="button"
            onClick={onNavigateHome}
            className="hover:text-red-600 transition-colors cursor-pointer"
          >
            প্রচ্ছদ
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-red-600 font-bold">গোপনীয়তা নীতি</span>
        </nav>

        {/* Title */}
        <div className="border-b-2 border-red-600 pb-4 mb-8">
          <div className="flex items-center gap-2 text-red-600 mb-1">
            <ShieldCheck className="w-6 h-6" />
            <span className="text-xs uppercase tracking-widest font-bold">আইনি ও ব্যবহারিক নিরাপত্তা</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 font-serif-bn">
            গোপনীয়তা নীতি (Privacy Policy)
          </h1>
          <p className="text-xs text-slate-400 mt-2">সর্বশেষ হালনাগাদ: অক্টোবর ২০২৬</p>
        </div>

        <div className="space-y-6 text-slate-800 text-sm sm:text-base leading-relaxed font-sans-bn">
          <section className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 font-serif-bn">১. ভূমিকা ও তথ্যের সুরক্ষা</h2>
            <p>
              হাজরাবাড়ী ২৪. কম তার পাঠকদের গোপনীয়তাকে সর্বোচ্চ শ্রদ্ধা করে। এই গোপনীয়তা নীতিতে ব্যাখ্যা করা হয়েছে যে কীভাবে আমরা আপনার ব্যক্তিগত তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষিত রাখি যখন আপনি আমাদের অনলাইন নিউজ পোর্টাল ভিজিট করেন।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 font-serif-bn">২. যেসকল তথ্য আমরা সংগ্রহ করি</h2>
            <p>
              আমাদের পোর্টাল ব্রাউজ করার জন্য কোনো বাধ্যতামূলক রেজিস্ট্রেশন আবশ্যক নয়। তবে নির্দিষ্ট ক্ষেত্রে আমরা নিম্নলিখিত তথ্য সংগ্রহ করতে পারি:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-slate-700">
              <li><strong>মন্তব্য ও ফিডব্যাক:</strong> পাঠকদের মন্তব্য বা যোগাযোগ ফরমে প্রদানকৃত নাম, ইমেইল ও অবস্থান।</li>
              <li><strong>অ্যানালিটিক্স ও কুকিজ:</strong> সাইটের পারফরম্যান্স এবং পাঠকপ্রিয় সংবাদ বিশ্লেষণের জন্য ব্রাউজার টাইপ, আইপি অ্যাড্রেস এবং পেজ ভিউ পরিসংখ্যান।</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 font-serif-bn">৩. তথ্যের ব্যবহার</h2>
            <p>
              সংগৃহীত তথ্য কেবলমাত্র ওয়েবসাইট উন্নয়ন, ব্যবহারকারীর অভিজ্ঞতা উন্নতকরণ এবং কোনো নিরাপত্তা হুমকি মোকাবিলার স্বার্থে ব্যবহৃত হয়। কোনো তৃতীয় পক্ষের কাছে আমরা কোনো বাণিজ্যিক উদ্দেশ্যে পাঠকদের তথ্য বিক্রয় বা বিনিময় করি না।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 font-serif-bn">৪. অনুসন্ধানী তথ্যের সূত্র গোপন রাখা</h2>
            <p>
              সাংবাদিকতার আন্তর্জাতিক নীতি অনুযায়ী, আমাদের বার্তা কক্ষে প্রেরিত অনুসন্ধানী সংবাদের সোর্স ও তথ্যদাতার নিরাপত্তা এবং পরিচয় সম্পূর্ণ সুরক্ষিত রাখা হয়।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 font-serif-bn">৫. নীতিমালার পরিবর্তন</h2>
            <p>
              হাজরাবাড়ী ২৪ কর্তৃপক্ষ সময়ে সময়ে এই নীতিমালা সংশোধন বা হালনাগাদ করার অধিকার সংরক্ষণ করে। যেকোনো পরিবর্তনের পর এই পাতায় তা প্রকাশ করা হবে।
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
