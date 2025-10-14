import React, { useState, useRef } from 'react';
import { Icon } from './Icon';

interface AdminComposeCampaignPageProps {
  onSendCampaign: (campaignData: { subject: string; content: string }) => void;
  onCancel: () => void;
}

export const AdminComposeCampaignPage: React.FC<AdminComposeCampaignPageProps> = ({ onSendCampaign, onCancel }) => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const applyFormat = (format: 'bold' | 'italic' | 'underline' | 'ul') => {
    if (!contentRef.current) return;
    const { selectionStart, selectionEnd } = contentRef.current;
    const selectedText = content.substring(selectionStart, selectionEnd);
    
    let replacement = '';
    
    switch(format) {
      case 'bold':
        replacement = `<strong>${selectedText}</strong>`;
        break;
      case 'italic':
        replacement = `<em>${selectedText}</em>`;
        break;
      case 'underline':
        replacement = `<u>${selectedText}</u>`;
        break;
      case 'ul':
        const lines = selectedText.split('\n').map(line => `  <li>${line}</li>`).join('\n');
        replacement = `<ul>\n${lines}\n</ul>`;
        break;
    }

    const newContent = content.substring(0, selectionStart) + replacement + content.substring(selectionEnd);
    setContent(newContent);
  };

  const applyLink = () => {
    if (!contentRef.current) return;
    const url = prompt('Enter the URL:');
    if (!url) return;
    const { selectionStart, selectionEnd } = contentRef.current;
    const selectedText = content.substring(selectionStart, selectionEnd);
    const replacement = `<a href="${url}" target="_blank" rel="noopener noreferrer">${selectedText || url}</a>`;
    const newContent = content.substring(0, selectionStart) + replacement + content.substring(selectionEnd);
    setContent(newContent);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subject && content) {
      onSendCampaign({ subject, content });
    }
  };

  const isFormValid = subject.trim() !== '' && content.trim() !== '';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex justify-end items-center mb-6">
        <button
          type="button"
          onClick={onCancel}
          className="bg-white hover:bg-slate-100 text-slate-800 font-semibold py-2.5 px-5 rounded-lg border border-slate-300 transition-colors duration-200 mr-3"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isFormValid}
          className="bg-brand-red hover:bg-brand-red-light text-white font-bold py-2.5 px-5 rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-sm disabled:bg-slate-400"
        >
          <Icon name="rocket" className="w-5 h-5" />
          Send Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* Editor */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex flex-col">
            <div className="space-y-6">
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                    <input
                        id="subject"
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        required
                        className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 focus:ring-brand-red focus:border-brand-red"
                    />
                </div>
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                    <div className="flex items-center gap-1 border border-b-0 border-slate-300 bg-slate-50 p-2 rounded-t-md">
                        <button type="button" title="Bold" onClick={() => applyFormat('bold')} className="p-2 rounded hover:bg-slate-200 text-slate-600"><Icon name="bold" className="w-4 h-4" /></button>
                        <button type="button" title="Italic" onClick={() => applyFormat('italic')} className="p-2 rounded hover:bg-slate-200 text-slate-600"><Icon name="italic" className="w-4 h-4" /></button>
                        <button type="button" title="Underline" onClick={() => applyFormat('underline')} className="p-2 rounded hover:bg-slate-200 text-slate-600"><Icon name="underline" className="w-4 h-4" /></button>
                        <div className="w-px h-5 bg-slate-300 mx-1"></div>
                        <button type="button" title="Link" onClick={applyLink} className="p-2 rounded hover:bg-slate-200 text-slate-600"><Icon name="link" className="w-4 h-4" /></button>
                        <button type="button" title="Bulleted List" onClick={() => applyFormat('ul')} className="p-2 rounded hover:bg-slate-200 text-slate-600"><Icon name="list" className="w-4 h-4" /></button>
                    </div>
                    <textarea
                        ref={contentRef}
                        id="content"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        required
                        rows={15}
                        className="w-full bg-slate-50 border border-slate-300 rounded-b-md px-3 py-2 focus:ring-brand-red focus:border-brand-red focus:z-10 relative font-mono text-sm"
                        placeholder="Write your email content here. You can use HTML for formatting."
                    />
                </div>
            </div>
        </div>
        
        {/* Preview */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
             <div className="p-4 bg-slate-50 border-b border-slate-200">
                <h4 className="text-sm font-semibold text-slate-600">Live Preview</h4>
             </div>
             <div className="p-6">
                <style>{`.prose u { text-decoration: underline; }`}</style>
                 <div className="w-full bg-slate-100 rounded-md p-4 text-sm text-slate-500 mb-4">
                     <p><strong>Subject:</strong> {subject || '(Your subject will appear here)'}</p>
                 </div>
                 <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: content || '<p>Your email content will be previewed here.</p>' }} />
             </div>
        </div>
      </div>
    </form>
  );
};
