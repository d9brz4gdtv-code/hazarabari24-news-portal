import React from 'react';
import { ChevronRight, FileCheck, CheckCircle2, AlertTriangle, BookOpen } from 'lucide-react';

interface EditorialPolicyPageProps {
  onNavigateHome: () => void;
}

export const EditorialPolicyPage: React.FC<EditorialPolicyPageProps> = ({ onNavigateHome }) => {
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
          <span className="text-red-600 font-bold">সম্পাদকীয় নীতিমালা</span>
        </nav>

        {/* Title */}
        <div className="border-b-2 border-red-600 pb-4 mb-8">
          <div className="flex items-center gap-2 text-red-600 mb-1">
            <BookOpen className="w-6 h-6" />
            <span className="text-xs uppercase tracking-widest font-bold">সাংবাদিকতার নীতি ও দায়বদ্ধতা</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 font-serif-bn">
            সম্পাদকীয় নীতিমালা (Editorial Policy)
          </h1>
          <p className="text-sm text-slate-600 mt-2 font-serif-bn">
            হাজরাবাড়ী ২৪. কম সত্যনিষ্ঠ, নির্ভীক ও দায়িত্বশীল সাংবাদিকতার আন্তর্জাতিক মানদণ্ডে পরিচালিত।
          </p>
        </div>

        <div className="space-y-6 text-slate-800 text-sm sm:text-base leading-relaxed font-sans-bn">
          <section className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 font-serif-bn">১. সত্যনিষ্ঠতা ও তথ্য যাচাই (Fact-Checking)</h2>
            <p>
              আমাদের প্রথম ও প্রধান দায়বদ্ধতা সত্যের প্রতি। যেকোনো সংবাদ প্রকাশের পূর্বে নির্ভরযোগ্য ও প্রত্যক্ষ সূত্রে তা যাচাই করা হয়। কোনো সংবাদের তথ্যে বিন্দুমাত্র অনিশ্চয়তা থাকলে আমরা তা নিশ্চিত না হওয়া পর্যন্ত প্রকাশ করি না।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 font-serif-bn">২. পক্ষপাতহীনতা ও উভয় পক্ষের বক্তব্য</h2>
            <p>
              কোনো ব্যক্তি, প্রতিষ্ঠান বা গোষ্ঠীর বিরুদ্ধে অভিযোগসংক্রান্ত প্রতিবেদন তৈরির ক্ষেত্রে অভিযুক্ত পক্ষের বক্তব্য গ্রহণ করা বাধ্যতামূলক। যদি কোনো পক্ষ বক্তব্য দিতে অস্বীকৃতি জানায়, তবে তা প্রতিবেদনে স্পষ্টভাবে উল্লেখ করা হয়।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 font-serif-bn">৩. ভুল সংশোধন ও সংশোধনী নীতি (Correction Policy)</h2>
            <p>
              অনিচ্ছাকৃত কোনো ভুল তথ্য বা ত্রুটি দৃষ্টিগোচর হওয়া মাত্রই হাজরাবাড়ী ২৪ তা দ্রুত সংশোধন করে। সংশোধিত প্রতিবেদনের পাদটীকায় স্পষ্টাক্ষরে তারিখ ও সংশোধনের বিবরণ যুক্ত করা হয়।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 font-serif-bn">৪. সংবেদনশীলতা ও অপরাধ বিষয়ক প্রতিবেদন</h2>
            <p>
              শিশু, ভিকটিম বা যৌন সহিংসতার শিকার কোনো ব্যক্তির পরিচয় বা ছবি কোনো অবস্থাতেই প্রকাশ করা হয় না। অপরাধের ক্ষেত্রে আদালতের চূড়ান্ত রায় ঘোষণার পূর্বে কাউকে নিশ্চিত অপরাধী হিসেবে চিহ্নিত করা পরিহার করা হয়।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 font-serif-bn">৫. সম্পাদকীয় স্বাধীনতা ও বাণিজ্যিক নিরপেক্ষতা</h2>
            <p>
              হাজরাবাড়ী ২৪-এর সংবাদ নীতি ও বিজ্ঞাপন বিভাগের মধ্যে সুস্পষ্ট সীমারেখা বজায় রাখা হয়। কোনো বিজ্ঞাপনদাতা বা বাণিজ্যিক অংশীদার সম্পাদকীয় সিদ্ধান্তের ওপর প্রভাব বিস্তার করতে পারে না। স্পন্সরকৃত কনটেন্ট হলে তা স্পষ্টভাবে চিহ্নিত করা হয়।
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
