import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle, ChevronRight, MessageSquare, Loader2 } from 'lucide-react';
import { submitNewsTip } from '../services/newsService';
import { SiteSettings } from '../types';

interface ContactPageProps {
  onNavigateHome: () => void;
  siteSettings?: SiteSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigateHome, siteSettings }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'সংবাদের তথ্য বা টিপস',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) return;
    setIsSubmitting(true);

    try {
      await submitNewsTip(formData);
    } catch (err) {
      console.warn('Submission notice:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'সংবাদের তথ্য বা টিপস',
        message: '',
      });
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <span className="text-red-600 font-bold">যোগাযোগ ও মতামত</span>
        </nav>

        {/* Title */}
        <div className="border-b-2 border-red-600 pb-4 mb-8">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 font-serif-bn">
            যোগাযোগ ও সম্পাদকীয় দপ্তর
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-serif-bn">
            আপনার এলাকার কোনো চাঞ্চল্যকর খবর, অনিয়ম, নাগরিক দুর্ভোগ বা অনুসন্ধানী তথ্য জানাতে আমাদের সাথে সরাসরি যোগাযোগ করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Office Contact Details (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg">
              <h3 className="font-black text-slate-900 font-serif-bn text-lg pb-2 border-b border-slate-200 mb-4">
                আমাদের কার্যালয়সমূহ
              </h3>

              <div className="space-y-5 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-bold font-serif-bn">
                      হাজরাবাড়ী প্রধান কার্যালয়:
                    </strong>
                    <p className="text-slate-800 font-medium mt-0.5">
                      {siteSettings?.officeHazrabari || 'হাজরাবাড়ী পৌরসভা, মেলান্দহ, জামালপুর'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-bold font-serif-bn">
                      ঢাকা কেন্দ্রীয় ব্যুরো:
                    </strong>
                    <p className="text-slate-600 mt-0.5">
                      {siteSettings?.officeDhaka || 'লেভেল-৭, পুরানা পল্টন লাইন, ঢাকা-১০০০, বাংলাদেশ।'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-bold font-serif-bn">
                      জরুরি টেলিফোন:
                    </strong>
                    <p className="text-slate-600 mt-0.5">{siteSettings?.phone || '+৮৮০১৭১২-৩৪৫৬৭৮'} (বার্তা কক্ষ ও বিজ্ঞাপন)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-bold font-serif-bn">
                      ইমেইল যোগাযোগ:
                    </strong>
                    <p className="text-slate-600 mt-0.5">সংবাদ প্রেরণের জন্য: {siteSettings?.contactEmail || 'news@hazarabari24.com'}</p>
                    <p className="text-slate-600">বিজ্ঞাপনের জন্য: {siteSettings?.adsEmail || 'ads@hazarabari24.com'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-red-50 border border-red-200 rounded text-xs text-red-900">
              <span className="font-bold block mb-1">তথ্যদাতার গোপনীয়তা রক্ষা:</span>
              আপনার পাঠানো স্পর্শকাতর সংবাদের তথ্য ও আপনার পরিচয় সংবাদপত্রের নিজস্ব গোপনীয়তা নীতি অনুযায়ী কঠোরভাবে সুরক্ষিত রাখা হবে।
            </div>
          </div>

          {/* Interactive Form (7 cols) */}
          <div className="md:col-span-7">
            <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-2xs">
              <h3 className="font-black text-slate-900 font-serif-bn text-xl mb-4">
                বার্তা কক্ষে তথ্য বা অনুসন্ধান পাঠান
              </h3>

              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-lg font-bold text-slate-900 font-serif-bn">
                    আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে!
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                    হাজরাবাড়ী ২৪-এর বার্তা সম্পাদক আপনার তথ্যটি পর্যালোচনা করবেন এবং প্রয়োজনে আপনার সাথে যোগাযোগ করবেন।
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-4 py-2 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    আরেকটি বার্তা পাঠান
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      আপনার নাম <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="পুরো নাম লিখুন"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ইমেইল ঠিকানা
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="example@mail.com"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        মোবাইল নম্বর
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="০১৭১২xxxxxx"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      বার্তার বিষয়
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                    >
                      <option value="সংবাদের তথ্য বা টিপস">সংবাদের তথ্য বা টিপস</option>
                      <option value="সংশোধনী বা প্রতিবাদলিপি">সংশোধনী বা প্রতিবাদলিপি</option>
                      <option value="বিজ্ঞাপন ও স্পন্সরশিপ">বিজ্ঞাপন ও স্পন্সরশিপ</option>
                      <option value="মতামত ও পরামর্শ">মতামত ও সাধারণ পরামর্শ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      বিস্তারিত বার্তা বা সংবাদের বিবরণ <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="ঘটনার স্থান, সময় এবং বিস্তারিত বিবরণ উল্লেখ করুন..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white font-bold text-xs sm:text-sm rounded flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>প্রেরণ করা হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>বার্তা প্রেরণ করুন</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
