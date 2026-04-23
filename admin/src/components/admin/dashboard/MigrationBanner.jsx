import React from 'react';

const MigrationBanner = ({ isApproving, onApprove }) => (
  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-8 shadow-sm">
    <div className="flex items-start gap-4">
      <div className="bg-amber-100 p-3 rounded-full">
        <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-amber-800 mb-2">Database Migration Tool</h3>
        <p className="text-amber-700 mb-4">
          If you have existing doctors who can't login due to pending approval, use this tool to approve all existing doctors at once.
        </p>
        <button
          onClick={onApprove}
          disabled={isApproving}
          className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
        >
          {isApproving ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Approving...
            </div>
          ) : 'Approve Existing Doctors'}
        </button>
      </div>
    </div>
  </div>
);

export default MigrationBanner;
