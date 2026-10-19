import React from 'react';
import { Award, CheckCircle, ChevronRight, Globe, MapPin, Newspaper, Users } from 'lucide-react';

interface AboutPageProps {
  onNavigateHome: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateHome }) => {
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
          <span className="text-red-600 font-bold">আমাদের সম্পর্কে</span>
        </nav>

        {/* Title */}
        <div className="border-b-2 border-red-600 pb-4 mb-8">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 font-serif-bn">
            হাজরাবাড়ী ২৪. কম সম্পর্কে
          </h1>
          <p className="text-base text-red-600 font-serif-bn mt-2 font-semibold">
            সত্যের পথে, সংবাদের সাথে — নিরপেক্ষ ও বস্তুনিষ্ঠ সাংবাদিকতার অগ্রদূত
          </p>
        </div>

        {/* Mission & Background */}
        <div className="prose prose-slate max-w-none space-y-6 text-slate-800 text-base sm:text-lg leading-relaxed font-sans-bn">
          <p>
            <strong>হাজরাবাড়ী ২৪. কম (Hazarabari 24)</strong> বাংলাদেশের একটি আধুনিক, জাতীয় অনলাইন সংবাদপত্র। ঐতিহ্যবাহী জামালপুরের হাজরাবাড়ী অঞ্চল থেকে যাত্রা শুরু করে এটি আজ সমগ্র বাংলাদেশ এবং বিশ্বজুড়ে ছড়িয়ে থাকা বাংলা ভাষাভাষী পাঠকের জন্য একটি নির্ভরযোগ্য ও দায়িত্বশীল সংবাদ উৎস হিসেবে স্থান করে নিয়েছে।
          </p>

          <div className="bg-slate-50 border-l-4 border-red-600 p-5 rounded-r my-6">
            <h3 className="font-bold text-slate-900 font-serif-bn text-lg mb-2">আমাদের মূল উদ্দেশ্য</h3>
            <p className="text-slate-700 text-sm sm:text-base font-sans-bn">
              সবার আগে সঠিক তথ্য তুলে ধরা, গুজবের বিরুদ্ধে সত্যের অতন্দ্র প্রহরী হওয়া এবং তৃণমূল মানুষের সমস্যা, সম্ভাবনা ও অধিকারকে জাতীয় নীতিনির্ধারকদের কাছে পৌঁছে দেওয়া।
            </p>
          </div>

          <h2 className="text-2xl font-bold text-slate-950 font-serif-bn mt-8 mb-4">
            আমাদের সম্পাদকীয় অঙ্গীকার
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose my-6">
            <div className="p-4 bg-white border border-slate-200 rounded-md shadow-2xs">
              <CheckCircle className="w-6 h-6 text-red-600 mb-2" />
              <h4 className="font-bold text-slate-900 font-serif-bn mb-1">তথ্য যাচাই ও বস্তুনিষ্ঠতা</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                কোনো অপ্রমাণিত খবর বা সংবেদনশীল ভিত্তিহীন তথ্য আমরা প্রকাশ করি না। প্রতিটি সংবাদের উৎস একাধিক সূত্রে যাচাইকৃত।
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-md shadow-2xs">
              <CheckCircle className="w-6 h-6 text-red-600 mb-2" />
              <h4 className="font-bold text-slate-900 font-serif-bn mb-1">রাজনৈতিক নিরপেক্ষতা</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                কোনো বিশেষ দল বা মতাদর্শের প্রভাবমুক্ত থেকে গণতান্ত্রিক মূল্যবোধ ও গণমানুষের স্বার্থ রক্ষায় আমরা অবিচল।
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-md shadow-2xs">
              <CheckCircle className="w-6 h-6 text-red-600 mb-2" />
              <h4 className="font-bold text-slate-900 font-serif-bn mb-1">তৃণমূলের উন্নয়ন ও সম্ভাবনা</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                গ্রাম ও চরাঞ্চলের কৃষি, উদ্ভাবন ও সাধারণ খেটে খাওয়া মানুষের সফলতার গল্পকে আমরা বিশেষ গুরুত্বের সাথে প্রচার করি।
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-md shadow-2xs">
              <CheckCircle className="w-6 h-6 text-red-600 mb-2" />
              <h4 className="font-bold text-slate-900 font-serif-bn mb-1">নৈতিক ও দায়বদ্ধ সাংবাদিকতা</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                ব্যক্তির সম্মানহানি, সাম্প্রদায়িক উসকানি কিংবা অশালীন বিষয়বস্তু পরিহার করে পরিচ্ছন্ন সংবাদ পরিবেশন আমাদের রীতি।
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-950 font-serif-bn mt-8 mb-3">
            সাংগঠনিক কাঠামো
          </h2>
          <p>
            হাজরাবাড়ী ২৪ সংবাদ নেটওয়ার্ক অভিজ্ঞ সিনিয়র সাংবাদিক, তরুণ অনুসন্ধানকারী দল এবং ৬৪ জেলার নিজস্ব প্রতিনিধিদের সমন্বয়ে পরিচালিত। আধুনিক প্রযুক্তির সর্বোচ্চ ব্যবহার নিশ্চিত করে আমরা পাঠকদের ২৪ ঘণ্টা বিরতিহীন নিউজফিড উপহার দিচ্ছি।
          </p>
        </div>
      </div>
    </div>
  );
};
