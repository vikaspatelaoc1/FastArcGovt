import React, { useState, useEffect } from 'react';
import { JobAlert } from '../types';
import { DateInputWithPicker } from './DateInputWithPicker';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (job: JobAlert) => void;
  editingJob: JobAlert | null;
}

const ALL_INDIAN_STATES = [
  'Central',
  'Uttar Pradesh',
  'UP',
  'Bihar',
  'Delhi',
  'Madhya Pradesh',
  'Rajasthan',
  'Haryana',
  'Punjab',
  'Jharkhand',
  'Uttarakhand',
  'Chhattisgarh',
  'West Bengal',
  'Gujarat',
  'Maharashtra',
  'Odisha',
  'Assam',
  'Tamil Nadu',
  'Telangana',
  'Andhra Pradesh',
  'Karnataka',
  'Kerala',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Ladakh',
  'Goa',
  'Tripura',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Chandigarh',
  'Puducherry',
  'Andaman and Nicobar Islands',
  'Arunachal Pradesh',
  'Sikkim',
  'Other'
];

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, onSave, editingJob }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatInitialDate = (dateStr?: string) => {
    if (!dateStr) {
      const today = new Date();
      const d = String(today.getDate()).padStart(2, '0');
      const m = String(today.getMonth() + 1).padStart(2, '0');
      const y = today.getFullYear();
      return `${d}-${m}-${y}`;
    }
    return dateStr;
  };

  const [formData, setFormData] = useState<Partial<JobAlert>>({
    title: '', category: 'latest-jobs', state: 'Central', isNew: true, shortInfo: '', postDate: formatInitialDate()
  });

  useEffect(() => {
    if (editingJob) {
      setFormData({
        ...editingJob,
        postDate: editingJob.postDate || formatInitialDate(),
        links: {
          apply: editingJob.links?.apply || '',
          official: editingJob.links?.official || '',
          notification: editingJob.links?.notification || '',
        }
      });
    } else {
      setFormData({
        title: '', category: 'latest-jobs', state: 'Central', isNew: true, shortInfo: '', postDate: formatInitialDate(),
        fees: { general: '', scSt: '' }, dates: { start: '', last: '' }, 
        links: { apply: '', official: '', notification: '' }
      });
    }
  }, [editingJob, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: string, value: any, nested?: 'fees' | 'dates' | 'links') => {
    if (nested) {
      setFormData(prev => ({ 
        ...prev, 
        [nested]: { 
          ...(prev[nested] || {}), 
          [field]: value 
        } 
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const sanitizeUrl = (url?: string) => {
    if (!url || !url.trim()) return '';
    const trimmed = url.trim();
    if (trimmed === '#') return '';
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  const handleQuickPortalPreset = (portal: 'ssc' | 'rrb' | 'uppbpb' | 'bpsc' | 'ibps' | 'nta' | 'upsc') => {
    const presets: Record<string, { apply: string; official: string; notification: string }> = {
      ssc: {
        apply: 'https://ssc.gov.in',
        official: 'https://ssc.gov.in',
        notification: 'https://ssc.gov.in/notices'
      },
      rrb: {
        apply: 'https://rrbapply.gov.in',
        official: 'https://indianrailways.gov.in',
        notification: 'https://rrbapply.gov.in/#/auth/home'
      },
      uppbpb: {
        apply: 'https://uppbpb.gov.in',
        official: 'https://uppbpb.gov.in',
        notification: 'https://uppbpb.gov.in/Recruitment'
      },
      bpsc: {
        apply: 'https://onlinebpsc.bihar.gov.in',
        official: 'https://bpsc.bih.nic.in',
        notification: 'https://bpsc.bih.nic.in'
      },
      ibps: {
        apply: 'https://ibps.in',
        official: 'https://ibps.in',
        notification: 'https://ibps.in'
      },
      nta: {
        apply: 'https://exams.nta.ac.in',
        official: 'https://nta.ac.in',
        notification: 'https://nta.ac.in'
      },
      upsc: {
        apply: 'https://upsconline.nic.in',
        official: 'https://upsc.gov.in',
        notification: 'https://upsc.gov.in/examinations'
      }
    };

    if (presets[portal]) {
      setFormData(prev => ({
        ...prev,
        links: {
          ...prev.links,
          apply: presets[portal].apply,
          official: presets[portal].official,
          notification: presets[portal].notification,
        }
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    
    const jobData: JobAlert = {
      id: editingJob?.id || `job-${Date.now()}`,
      title: formData.title ? formData.title.trim() : '',
      category: (formData.category as any) || 'latest-jobs',
      postDate: formData.postDate || formatInitialDate(),
      isNew: !!formData.isNew,
      state: formData.state || 'Central',
      shortInfo: formData.shortInfo || '',
      ageLimit: formData.ageLimit || '',
      eligibility: formData.eligibility || '',
      fees: {
        general: formData.fees?.general || '',
        scSt: formData.fees?.scSt || ''
      },
      dates: {
        start: formData.dates?.start || '',
        last: formData.dates?.last || ''
      },
      links: {
        apply: sanitizeUrl(formData.links?.apply) || 'https://india.gov.in',
        official: sanitizeUrl(formData.links?.official) || 'https://india.gov.in',
        notification: sanitizeUrl(formData.links?.notification) || 'https://india.gov.in',
      },
    };

    onSave(jobData);
    setTimeout(() => setIsSubmitting(false), 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-end transition-transform duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col p-6 overflow-y-auto border-l border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center">
              {editingJob ? '✎' : '+'}
            </span>
            <span>{editingJob ? 'Edit Database Entry' : 'Add Job to Database'}</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-2xl">
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <div>
            <label className="block mb-1 text-slate-900 dark:text-slate-100">Post Title/Name *</label>
            <input required type="text" value={formData.title} onChange={e => handleChange('title', e.target.value)} placeholder="e.g. Railway NTPC Online Form" className="w-full border border-slate-300 dark:border-slate-700 bg-transparent rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-red-500 transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-slate-900 dark:text-slate-100">Select Category *</label>
              <select value={formData.category} onChange={e => handleChange('category', e.target.value)} className="w-full border border-slate-300 dark:border-slate-700 bg-transparent rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-red-500 transition-colors">
                <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="latest-jobs">Latest Jobs</option>
                <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="admit-cards">Admit Cards</option>
                <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="results">Results</option>
                <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="answer-key">Answer Key</option>
                <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="syllabus">Syllabus</option>
                <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="admission">Admission</option>
                <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="documents">Certificates & Services</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-slate-900 dark:text-slate-100">Post Date *</label>
              <DateInputWithPicker required value={formData.postDate || ''} onChange={val => handleChange('postDate', val)} placeholder="01-Aug-2026" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-slate-900 dark:text-slate-100 font-medium text-xs">State / Region / Location *</label>
              <select 
                value={ALL_INDIAN_STATES.includes(formData.state || '') ? formData.state : 'Other'} 
                onChange={e => {
                  const val = e.target.value;
                  if (val === 'Other') {
                    handleChange('state', 'Other State');
                  } else {
                    handleChange('state', val);
                  }
                }} 
                className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg p-2.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-red-500 transition-colors"
              >
                {ALL_INDIAN_STATES.map(st => (
                  <option key={st} value={st}>
                    {st === 'Central' ? 'Central (All India Govt)' : st === 'UP' ? 'Uttar Pradesh (UP)' : st}
                  </option>
                ))}
              </select>

              {(!ALL_INDIAN_STATES.includes(formData.state || '') || formData.state === 'Other' || formData.state === 'Other State') && (
                <input
                  type="text"
                  placeholder="Type custom state or location name..."
                  value={formData.state || ''}
                  onChange={e => handleChange('state', e.target.value)}
                  className="mt-2 w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-red-500"
                />
              )}
            </div>
            <div className="flex items-center pt-5 pl-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={formData.isNew} onChange={e => handleChange('isNew', e.target.checked)} className="rounded border-slate-300 dark:border-slate-700 text-red-600 focus:ring-red-500 w-4 h-4" />
                <span className="text-slate-900 dark:text-slate-100 text-xs">Show "NEW" Badge</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block mb-1 text-slate-900 dark:text-slate-100">Brief Info / Description</label>
            <textarea rows={2} value={formData.shortInfo} onChange={e => handleChange('shortInfo', e.target.value)} className="w-full border border-slate-300 dark:border-slate-700 bg-transparent rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-red-500 transition-colors"></textarea>
          </div>

          {/* Age Limit & Eligibility */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Age Limit & Eligibility</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-slate-500 font-medium">Age Limit Info</label>
                <input type="text" placeholder="e.g. 18 - 30 Years" value={formData.ageLimit || ''} onChange={e => handleChange('ageLimit', e.target.value)} className="w-full border border-slate-300 dark:border-slate-700 bg-transparent rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-red-500 transition-colors" />
              </div>
              <div>
                <label className="block mb-1 text-slate-500 font-medium">Eligibility Criteria</label>
                <input type="text" placeholder="e.g. 12th / Graduation" value={formData.eligibility || ''} onChange={e => handleChange('eligibility', e.target.value)} className="w-full border border-slate-300 dark:border-slate-700 bg-transparent rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-red-500 transition-colors" />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Important Dates</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-slate-500 font-medium">Start Date</label>
                <DateInputWithPicker value={formData.dates?.start || ''} onChange={val => handleChange('start', val, 'dates')} placeholder="Start Date" />
              </div>
              <div>
                <label className="block mb-1 text-slate-500 font-medium">Last Date</label>
                <DateInputWithPicker value={formData.dates?.last || ''} onChange={val => handleChange('last', val, 'dates')} placeholder="Last Date" />
              </div>
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Application Fees</h4>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="General/OBC" value={formData.fees?.general || ''} onChange={e => handleChange('general', e.target.value, 'fees')} className="w-full border border-slate-300 dark:border-slate-700 bg-transparent rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:outline-none transition-colors" />
              <input type="text" placeholder="SC/ST" value={formData.fees?.scSt || ''} onChange={e => handleChange('scSt', e.target.value, 'fees')} className="w-full border border-slate-300 dark:border-slate-700 bg-transparent rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:outline-none transition-colors" />
            </div>
          </div>

          {/* Important Links */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>🔗</span> Important Web Links
              </h4>
            </div>
            
            {/* Quick 1-Click Board Presets */}
            <div className="mb-3">
              <p className="text-[11px] text-slate-500 mb-1.5 font-medium">Quick Auto-Fill Official Links:</p>
              <div className="flex flex-wrap gap-1.5">
                <button type="button" onClick={() => handleQuickPortalPreset('ssc')} className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-red-400 cursor-pointer">
                  SSC
                </button>
                <button type="button" onClick={() => handleQuickPortalPreset('rrb')} className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-red-400 cursor-pointer">
                  Railway RRB
                </button>
                <button type="button" onClick={() => handleQuickPortalPreset('uppbpb')} className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-red-400 cursor-pointer">
                  UP Police
                </button>
                <button type="button" onClick={() => handleQuickPortalPreset('bpsc')} className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-red-400 cursor-pointer">
                  BPSC Bihar
                </button>
                <button type="button" onClick={() => handleQuickPortalPreset('ibps')} className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-red-400 cursor-pointer">
                  IBPS Bank
                </button>
                <button type="button" onClick={() => handleQuickPortalPreset('nta')} className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-red-400 cursor-pointer">
                  NTA Exam
                </button>
                <button type="button" onClick={() => handleQuickPortalPreset('upsc')} className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-red-400 cursor-pointer">
                  UPSC
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="block mb-1 text-slate-700 dark:text-slate-200 font-semibold">1. Apply Online / Direct Action URL</label>
                <input 
                  type="text" 
                  placeholder="https://ssc.gov.in or https://rrbapply.gov.in" 
                  value={formData.links?.apply || ''} 
                  onChange={e => handleChange('apply', e.target.value, 'links')} 
                  className="w-full border border-slate-300 dark:border-slate-700 bg-transparent rounded-lg p-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-red-500 transition-colors" 
                />
              </div>
              <div>
                <label className="block mb-1 text-slate-700 dark:text-slate-200 font-semibold">2. Download Official Notification (PDF / Notice URL)</label>
                <input 
                  type="text" 
                  placeholder="https://official-board.gov.in/notice.pdf" 
                  value={formData.links?.notification || ''} 
                  onChange={e => handleChange('notification', e.target.value, 'links')} 
                  className="w-full border border-slate-300 dark:border-slate-700 bg-transparent rounded-lg p-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-red-500 transition-colors" 
                />
              </div>
              <div>
                <label className="block mb-1 text-slate-700 dark:text-slate-200 font-semibold">3. Official Board Website URL</label>
                <input 
                  type="text" 
                  placeholder="https://ssc.gov.in or https://uppbpb.gov.in" 
                  value={formData.links?.official || ''} 
                  onChange={e => handleChange('official', e.target.value, 'links')} 
                  className="w-full border border-slate-300 dark:border-slate-700 bg-transparent rounded-lg p-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-red-500 transition-colors" 
                />
              </div>
            </div>
          </div>
          <div className="flex space-x-2 pt-4">
            <button type="button" onClick={onClose} className="w-1/3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-3 rounded-lg shadow-md transition-all">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className={`w-full font-bold py-3 rounded-lg shadow-md transition-all text-white ${
                isSubmitting ? 'bg-slate-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 cursor-pointer'
              }`}
            >
              {isSubmitting ? 'Saving...' : editingJob ? 'Update Database' : 'Push to Live Database'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
