import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { StudentDocument, DOCUMENT_CATEGORIES } from '../types';
import { getStudentDocuments, addStudentDocument, updateStudentDocument, deleteStudentDocument } from '../services/firestoreService';

export const AdminStudentDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<StudentDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDoc, setEditingDoc] = useState<StudentDocument | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    setLoading(true);
    try {
      const docs = await getStudentDocuments();
      setDocuments(docs);
    } catch (err) {
      console.error('Error loading documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this document service?')) {
      await deleteStudentDocument(id);
      loadDocs();
    }
  };

  const handleEdit = (doc: StudentDocument) => {
    setEditingDoc(doc);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingDoc({
      id: '',
      title: '',
      slug: '',
      category: DOCUMENT_CATEGORIES[0].id,
      description: '',
      shortDescription: '',
      icon: '📄',
      officialAuthority: '',
      officialWebsite: '',
      applyUrl: '',
      downloadUrl: '',
      verificationUrl: '',
      eligibility: '',
      requiredDocuments: [],
      applicationProcess: '',
      applicationFee: '',
      processingTime: '',
      importantNotes: '',
      tags: [],
      isPopular: false,
      isFeatured: false,
      isActive: true,
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString()
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc) return;
    
    try {
      if (editingDoc.id) {
        await updateStudentDocument(editingDoc.id, { ...editingDoc, lastUpdated: new Date().toISOString() });
      } else {
        const newDoc = {
          ...editingDoc,
          slug: editingDoc.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          lastUpdated: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };
        await addStudentDocument(newDoc);
      }
      setIsModalOpen(false);
      loadDocs();
    } catch (err) {
      console.error('Error saving document:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Document Center Management</h2>
          <p className="text-sm text-slate-500">Manage student document services, verification links, and tools.</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Service Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">Loading documents...</td></tr>
              ) : documents.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">No documents found. Add one!</td></tr>
              ) : (
                documents.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="text-xl">{doc.icon}</span> {doc.title}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                      {DOCUMENT_CATEGORIES.find(c => c.id === doc.category)?.label || doc.category}
                    </td>
                    <td className="px-4 py-3">
                      {doc.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-medium">
                          <CheckCircle className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 text-xs font-medium">
                          <XCircle className="w-3 h-3" /> Disabled
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(doc)} className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(doc.id)} className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal would go here, simplified for now */}
      {isModalOpen && editingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800">
            <div className="sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center z-10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingDoc.id ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                  <input required type="text" value={editingDoc.title} onChange={e => setEditingDoc({...editingDoc, title: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select value={editingDoc.category} onChange={e => setEditingDoc({...editingDoc, category: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white">
                    {DOCUMENT_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Icon (Emoji)</label>
                  <input type="text" value={editingDoc.icon} onChange={e => setEditingDoc({...editingDoc, icon: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Official Authority</label>
                  <input type="text" value={editingDoc.officialAuthority} onChange={e => setEditingDoc({...editingDoc, officialAuthority: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Short Description</label>
                  <input required type="text" value={editingDoc.shortDescription} onChange={e => setEditingDoc({...editingDoc, shortDescription: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white" />
                </div>
                
                {/* URLs */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Official Website URL</label>
                  <input type="url" value={editingDoc.officialWebsite} onChange={e => setEditingDoc({...editingDoc, officialWebsite: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Apply URL</label>
                  <input type="url" value={editingDoc.applyUrl} onChange={e => setEditingDoc({...editingDoc, applyUrl: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Download URL</label>
                  <input type="url" value={editingDoc.downloadUrl} onChange={e => setEditingDoc({...editingDoc, downloadUrl: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Verification URL</label>
                  <input type="url" value={editingDoc.verificationUrl} onChange={e => setEditingDoc({...editingDoc, verificationUrl: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white" />
                </div>
                
                {/* Toggles */}
                <div className="md:col-span-2 flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input type="checkbox" checked={editingDoc.isActive} onChange={e => setEditingDoc({...editingDoc, isActive: e.target.checked})} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
                    Active
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input type="checkbox" checked={editingDoc.isPopular} onChange={e => setEditingDoc({...editingDoc, isPopular: e.target.checked})} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
                    Popular
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input type="checkbox" checked={editingDoc.isFeatured} onChange={e => setEditingDoc({...editingDoc, isFeatured: e.target.checked})} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
                    Featured
                  </label>
                </div>
              </div>
              
              <div className="sticky bottom-0 bg-white dark:bg-slate-900 pt-4 pb-2 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
                  Save Document Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
