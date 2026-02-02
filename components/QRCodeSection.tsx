import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Share2 } from 'lucide-react';

export const QRCodeSection: React.FC = () => {
  const currentUrl = window.location.href;

  return (
    <div className="text-center py-12 px-4 border-t border-slate-200 dark:border-slate-800 mt-12 bg-white dark:bg-slate-900">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Share with Friends</h3>
      <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-sm mx-auto">
        Ask others to scan this code to contribute to Yaaro Ka Kaafila.
      </p>
      
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm inline-block">
        <QRCodeSVG value={currentUrl} size={150} level="M" />
      </div>
      
      <div className="mt-6">
        <button 
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Yaaro Ka Kaafila',
                text: 'Join me in supporting Yaaro Ka Kaafila!',
                url: currentUrl,
              }).catch(console.error);
            } else {
              alert('Copy link: ' + currentUrl);
            }
          }}
          className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium text-sm"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Link
        </button>
      </div>
    </div>
  );
};