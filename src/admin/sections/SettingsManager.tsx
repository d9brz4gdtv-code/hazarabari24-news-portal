import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle, MapPin, Phone, Mail, Building2, Sparkles } from 'lucide-react';
import {
  saveSiteSettingsToFirestore,
  getSiteSettingsFromFirestore,
  getCachedSiteSettings,
} from '../../services/firestoreNewsService';
import { SiteSettings } from '../../types';

interface SettingsManagerProps {
  onSettingsUpdated?: (settings: SiteSettings) => void;
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({ onSettingsUpdated }) => {
  const initial = getCachedSiteSettings();
  const [siteNameBn, setSiteNameBn] = useState(initial.siteNameBn);
  const [siteNameEn, setSiteNameEn] = useState(initial.siteNameEn);
  const [tagline, setTagline] = useState(initial.tagline);
  const [editorName, setEditorName] = useState(initial.editorName);
  const [executiveEditor, setExecutiveEditor] = useState(initial.executiveEditor);
  const [contactEmail, setContactEmail] = useState(initial.contactEmail);
  const [adsEmail, setAdsEmail] = useState(initial.adsEmail);
  const [phone, setPhone] = useState(initial.phone);
  const [officeHazrabari, setOfficeHazrabari] = useState(
    initial.officeHazrabari.includes('মাদারগঞ্জ')
      ? 'হাজরাবাড়ী পৌরসভা, মেলান্দহ, জামালপুর'
      : initial.officeHazrabari
  );
  const [officeDhaka, setOfficeDhaka] = useState(initial.officeDhaka);
  const [logoUrl, setLogoUrl] = useState(initial.logoUrl || '/images/official_logo.png');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSiteSettingsFromFirestore().then((s) => {
      if (s) {
        setSiteNameBn(s.siteNameBn);
        setSiteNameEn(s.siteNameEn);
        setTagline(s.tagline);
        if (s.logoUrl) setLogoUrl(s.logoUrl);
        setEditorName(s.editorName);
        setExecutiveEditor(s.executiveEditor);
        setContactEmail(s.contactEmail);
        setAdsEmail(s.adsEmail);
        setPhone(s.phone);
        setOfficeHazrabari(
          s.officeHazrabari.includes('মাদারগঞ্জ')
            ? 'হাজরাবাড়ী পৌরসভা, মেলান্দহ, জামালপুর'
            : s.officeHazrabari
        );
        setOfficeDhaka(s.officeDhaka);
      }
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updatedSettings = {
        siteNameBn,
        siteNameEn,
        tagline,
        logoUrl: logoUrl.trim() || '/images/official_logo.png',
        editorName,
        executiveEditor,
        contactEmail,
        adsEmail,
        phone,
        officeHazrabari: officeHazrabari.trim(),
        officeDhaka: officeDhaka.trim(),
        breakingTickerActive: true,
      };
      await saveSiteSettingsToFirestore(updatedSettings);
      if (onSettingsUpdated) {
        onSettingsUpdated({ ...initial, ...updatedSettings, id: 'site-settings' });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const setOfficialAddress = () => {
    setOfficeHazrabari('হাজরাবাড়ী পৌরসভা, মেলান্দহ, জামালপুর');
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-2xl font-black text-slate-900 font-serif-bn flex items-center gap-2">
          <Settings className="w-6 h-6 text-red-600" />
          <span>সাইট ও সম্পাদকীয় সেটিংস</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          পত্রিকার নাম, স্লোগান, প্রধান কার্যালয়ের ঠিকানা এবং সম্পাদকীয় তথ্য ম্যানুয়ালি পরিচালনা করুন। এখানে যেকোনো পরিবর্তন সংরক্ষণ করলে তা সাথে সাথে পুরো ওয়েবসাইটে কার্যকর হবে।
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm rounded-lg flex items-center gap-2.5 shadow-xs animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <strong>সেটিংস সফলভাবে সংরক্ষিত হয়েছে!</strong>
            <p className="text-xs text-emerald-700 mt-0.5">
              প্রধান কার্যালয়ের ঠিকানা ও সাইট সেটিংস তাৎক্ষণিকভাবে ওয়েবসাইটে হালনাগাদ করা হয়েছে।
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
        {/* Masthead Settings */}
        <div className="p-5 sm:p-6 bg-white border border-slate-200 rounded-xl space-y-4 shadow-2xs">
          <h3 className="font-bold text-slate-900 font-serif-bn text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-red-600" />
            <span>মাস্টহেড ও পরিচিতি</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">বাংলা নাম</label>
              <input
                type="text"
                value={siteNameBn}
                onChange={(e) => setSiteNameBn(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm text-slate-900 font-serif-bn font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ইংরেজি নাম</label>
              <input
                type="text"
                value={siteNameEn}
                onChange={(e) => setSiteNameEn(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm text-slate-900 font-semibold"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">স্লোগান (Tagline)</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm text-slate-900 font-serif-bn"
            />
          </div>

          {/* Official Logo Section */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-900">অফিসিয়াল লোগো (Brand Logo)</label>
              <button
                type="button"
                onClick={() => setLogoUrl('/images/official_logo.png')}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-medium underline cursor-pointer"
              >
                ডিফল্ট অফিসিয়াল লোগো সেট করুন
              </button>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row items-center gap-4">
              <div className="bg-white p-2 rounded border border-slate-200 shrink-0 shadow-2xs">
                <img
                  src={logoUrl || '/images/official_logo.png'}
                  alt="বর্তমান লোগো"
                  className="h-10 sm:h-12 w-auto max-w-[200px] object-contain"
                />
              </div>
              <div className="flex-1 w-full min-w-0">
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="/images/official_logo.png"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 font-mono"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  বর্তমান লোগো: হাজরাবাড়ী ২৪.কম-এর গ্লোব ও কলম সম্বলিত অনুমোদিত অফিশিয়াল লোগো।
                </p>
              </div>
            </div>

            {/* Social Share Preview Card */}
            <div className="mt-3 p-3 bg-amber-50/50 border border-amber-200/60 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  লিংক শেয়ার প্রিভিউ (Facebook / WhatsApp / Twitter Large Card)
                </span>
                <span className="text-[10px] font-mono bg-white px-2 py-0.5 border border-slate-200 rounded text-slate-600">1200 × 630 px</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs max-w-md">
                <img
                  src="/images/og-image.png"
                  alt="সোশ্যাল শেয়ার লোগো ব্যানার"
                  className="w-full h-auto aspect-[1.91/1] object-contain bg-white border-b border-slate-100"
                />
                <div className="p-2.5">
                  <div className="text-[10px] uppercase font-bold text-slate-400">hazarabari24.com</div>
                  <div className="text-xs font-bold text-slate-900 font-serif-bn mt-0.5">{siteNameBn} - {siteNameEn}</div>
                  <div className="text-[11px] text-slate-500">{tagline}</div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                ফেসবুক, হোয়াটসঅ্যাপ বা টুইটারে যেকোনো লিংক শেয়ার করলে লিংকটির পাশে এই লোগোটি বড় আকারে (Full Preview Banner) প্রদর্শিত হবে।
              </p>
            </div>
          </div>
        </div>

        {/* Editorial Board */}
        <div className="p-5 sm:p-6 bg-white border border-slate-200 rounded-xl space-y-4 shadow-2xs">
          <h3 className="font-bold text-slate-900 font-serif-bn text-sm pb-2 border-b border-slate-100">
            সম্পাদকীয় পর্ষদ
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">সম্পাদক ও প্রকাশক</label>
              <input
                type="text"
                value={editorName}
                onChange={(e) => setEditorName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm text-slate-900 font-serif-bn"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">নির্বাহী সম্পাদক</label>
              <input
                type="text"
                value={executiveEditor}
                onChange={(e) => setExecutiveEditor(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm text-slate-900 font-serif-bn"
              />
            </div>
          </div>
        </div>

        {/* Offices and Contacts */}
        <div className="p-5 sm:p-6 bg-white border border-slate-200 rounded-xl space-y-4 shadow-2xs">
          <h3 className="font-bold text-slate-900 font-serif-bn text-sm pb-2 border-b border-slate-100 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-600" />
              <span>কার্যালয় ও যোগাযোগ ঠিকানা</span>
            </span>
            <span className="text-[11px] text-slate-500 font-normal hidden sm:inline">
              ফুটার ও যোগাযোগ পেজে প্রদর্শিত হবে
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">সংবাদ ইমেইল</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">বিজ্ঞাপন ইমেইল</label>
              <input
                type="email"
                value={adsEmail}
                onChange={(e) => setAdsEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">টেলিফোন / হটলাইন</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm text-slate-900"
            />
          </div>

          {/* Head Office Input with 1-click set button */}
          <div className="bg-red-50/50 p-3.5 rounded-lg border border-red-200/80 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <label className="block text-xs font-bold text-slate-900">
                প্রধান কার্যালয়ের ঠিকানা (Head Office)
              </label>
              <button
                type="button"
                onClick={setOfficialAddress}
                className="text-[11px] text-red-700 hover:text-red-900 font-semibold bg-white px-2 py-0.5 rounded border border-red-300 shadow-2xs hover:bg-red-50 transition-colors flex items-center gap-1 cursor-pointer"
                title="হাজরাবাড়ী পৌরসভা, মেলান্দহ, জামালপুর সেট করুন"
              >
                <Sparkles className="w-3 h-3 text-red-600" />
                <span>অফিসিয়াল ঠিকানা লিখুন</span>
              </button>
            </div>
            <input
              type="text"
              value={officeHazrabari}
              onChange={(e) => setOfficeHazrabari(e.target.value)}
              placeholder="হাজরাবাড়ী পৌরসভা,মেলান্দহ,জামালপুর"
              className="w-full px-3 py-2.5 bg-white border border-red-300 rounded text-xs sm:text-sm text-slate-900 font-medium focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-hidden"
            />
            <p className="text-[11px] text-slate-600">
              লক্ষ্য করুন: প্রধান কার্যালয় হিসেবে এখানে যা লিখবেন (যেমন: <strong>হাজরাবাড়ী পৌরসভা, মেলান্দহ, জামালপুর</strong>), তা ওয়েবসাইটের নিচে ফুটার ও যোগাযোগ পাতায় অবিলম্বে প্রদর্শিত হবে।
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">ঢাকা ব্যুরো অফিসের ঠিকানা</label>
            <input
              type="text"
              value={officeDhaka}
              onChange={(e) => setOfficeDhaka(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm text-slate-900"
            />
          </div>
        </div>

        {/* Live Preview of Public Footer / Contact */}
        <div className="p-4 sm:p-5 bg-slate-950 text-slate-300 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-white font-serif-bn flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              লাইভ প্রিভিউ: ওয়েবসাইটে যেভাবে দেখা যাবে
            </span>
            <span className="text-[10px] text-slate-500 uppercase font-mono">Footer Preview</span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-300">
            <p className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">প্রধান কার্যালয়:</strong> {officeHazrabari || 'হাজরাবাড়ী পৌরসভা, মেলান্দহ, জামালপুর'}
              </span>
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-400">ঢাকা ব্যুরো:</strong> {officeDhaka || 'পুরানা পল্টন, ঢাকা-১০০০, বাংলাদেশ।'}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>
                <strong className="text-slate-400">বার্তা ও হটলাইন:</strong> {phone}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>
                <strong className="text-slate-400">ইমেইল:</strong> {contactEmail}
              </span>
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto px-7 py-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'সংরক্ষণ করা হচ্ছে...' : 'সেটিংস সংরক্ষণ করুন'}</span>
        </button>
      </form>
    </div>
  );
};
