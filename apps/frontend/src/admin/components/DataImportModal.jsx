import React, { useState, useRef } from 'react';
import {
  CloseIcon,
  UploadIcon,
  DownloadIcon,
  AlertCircleIcon,
  CheckIcon,
} from '../AdminIcons';
import {
  parseFile,
  generateSampleTemplate,
} from '../utils/excelDataUtils';

const DataImportModal = ({
  isOpen,
  onClose,
  title = 'Import Data',
  subtitle = 'Upload an Excel (.xlsx, .xls) or CSV file to bulk import records.',
  columns = [],
  templateFilename = 'import_template',
  onImportSuccess,
  apiImportFn,
  entityName = 'records',
  showUpdateToggle = false,
}) => {
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [parseResult, setParseResult] = useState(null);
  const [parseError, setParseError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Options
  const [skipInvalid, setSkipInvalid] = useState(true);
  const [updateExisting, setUpdateExisting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = async (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setParseError('');
    setSubmitError('');
    setParseResult(null);
    setParsing(true);

    try {
      const result = await parseFile(selectedFile, columns);
      setParseResult(result);
    } catch (err) {
      setParseError(err.message || 'Failed to parse file.');
    } finally {
      setParsing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer?.files?.[0];
    if (droppedFile) {
      handleFileChange(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDownloadTemplate = (format = 'xlsx') => {
    try {
      generateSampleTemplate({
        columns,
        filename: templateFilename,
        format,
      });
    } catch (err) {
      setParseError(`Failed to generate template: ${err.message}`);
    }
  };

  const handleReset = () => {
    setFile(null);
    setParseResult(null);
    setParseError('');
    setSubmitError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!parseResult || parseResult.validRows.length === 0) {
      setSubmitError('There are no valid rows to import.');
      return;
    }

    if (!skipInvalid && parseResult.errorCount > 0) {
      setSubmitError(
        'Please resolve the invalid rows in your spreadsheet or enable "Skip invalid rows" to proceed.'
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const result = await apiImportFn(parseResult.validRows, {
        updateExisting,
      });
      if (onImportSuccess) {
        onImportSuccess(result);
      }
      onClose();
    } catch (err) {
      setSubmitError(err.message || 'Import failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const rowsToImportCount = parseResult
    ? skipInvalid
      ? parseResult.validCount
      : parseResult.errorCount === 0
        ? parseResult.validCount
        : 0
    : 0;

  return (
    <div className="tw-modal-overlay">
      <div
        className="tw-modal"
        style={{
          maxWidth: '860px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div className="tw-modal-header">
          <div>
            <h2 className="tw-modal-title">{title}</h2>
            <p
              style={{
                fontSize: '0.82rem',
                color: '#64748B',
                marginTop: '0.2rem',
              }}
            >
              {subtitle}
            </p>
          </div>
          <button
            className="tw-modal-close-btn"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Body */}
        <div
          className="tw-modal-body"
          style={{ overflowY: 'auto', flex: 1, padding: '1.25rem 1.5rem' }}
        >
          {submitError && (
            <div
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
              }}
            >
              <AlertCircleIcon size={18} color="#DC2626" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Sample Template Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <div style={{ fontSize: '0.82rem', color: '#334155' }}>
              <strong>Need the correct column structure?</strong>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                Download a ready-to-fill sample template with sample rows and guidelines.
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className="tw-btn-secondary"
                onClick={() => handleDownloadTemplate('xlsx')}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.35rem 0.75rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <DownloadIcon size={14} />
                <span>Excel (.xlsx)</span>
              </button>
              <button
                type="button"
                className="tw-btn-secondary"
                onClick={() => handleDownloadTemplate('csv')}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.35rem 0.75rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <DownloadIcon size={14} />
                <span>CSV (.csv)</span>
              </button>
            </div>
          </div>

          {/* Drag & Drop File Zone */}
          {!file ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${isDragging ? '#7C3AED' : '#CBD5E1'}`,
                backgroundColor: isDragging ? '#F5F3FF' : '#FAFAFA',
                borderRadius: '10px',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                style={{ display: 'none' }}
                onChange={(e) => handleFileChange(e.target.files?.[0])}
              />
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#EDE9FE',
                  color: '#7C3AED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.85rem auto',
                }}
              >
                <UploadIcon size={24} />
              </div>
              <div
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#1E293B',
                  marginBottom: '0.25rem',
                }}
              >
                Click to browse or drag & drop spreadsheet here
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                Supports Microsoft Excel (.xlsx, .xls) and CSV (.csv) files up to 10MB
              </div>
            </div>
          ) : (
            <div>
              {/* Selected File Bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#F1F5F9',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      backgroundColor: '#E0E7FF',
                      color: '#4F46E5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                    }}
                  >
                    FILE
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0F172A' }}>
                      {file.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      {(file.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="tw-btn-secondary"
                  onClick={handleReset}
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                  disabled={isSubmitting}
                >
                  Change File
                </button>
              </div>

              {parsing && (
                <div
                  style={{
                    padding: '2rem',
                    textAlign: 'center',
                    color: '#64748B',
                    fontSize: '0.9rem',
                  }}
                >
                  Parsing and validating spreadsheet rows...
                </div>
              )}

              {parseError && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: '#FEE2E2',
                    color: '#DC2626',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                  }}
                >
                  <AlertCircleIcon size={18} color="#DC2626" />
                  <span>{parseError}</span>
                </div>
              )}

              {parseResult && (
                <div>
                  {/* Metric Badges */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.75rem',
                      marginBottom: '1rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div
                      style={{
                        padding: '0.5rem 0.85rem',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '6px',
                        border: '1px solid #E2E8F0',
                        fontSize: '0.8rem',
                        color: '#475569',
                      }}
                    >
                      Total Rows: <strong>{parseResult.totalCount}</strong>
                    </div>
                    <div
                      style={{
                        padding: '0.5rem 0.85rem',
                        backgroundColor: '#ECFDF5',
                        borderRadius: '6px',
                        border: '1px solid #A7F3D0',
                        fontSize: '0.8rem',
                        color: '#065F46',
                      }}
                    >
                      Valid Rows: <strong>{parseResult.validCount}</strong>
                    </div>
                    {parseResult.errorCount > 0 && (
                      <div
                        style={{
                          padding: '0.5rem 0.85rem',
                          backgroundColor: '#FEF2F2',
                          borderRadius: '6px',
                          border: '1px solid #FECACA',
                          fontSize: '0.8rem',
                          color: '#991B1B',
                        }}
                      >
                        Rows with Issues: <strong>{parseResult.errorCount}</strong>
                      </div>
                    )}
                  </div>

                  {/* Options */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      marginBottom: '1rem',
                    }}
                  >
                    {parseResult.errorCount > 0 && (
                      <label
                        style={{
                          fontSize: '0.82rem',
                          color: '#334155',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={skipInvalid}
                          onChange={(e) => setSkipInvalid(e.target.checked)}
                        />
                        <span>
                          Skip invalid rows and import only the{' '}
                          <strong>{parseResult.validCount}</strong> valid row(s)
                        </span>
                      </label>
                    )}

                    {showUpdateToggle && (
                      <label
                        style={{
                          fontSize: '0.82rem',
                          color: '#334155',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={updateExisting}
                          onChange={(e) => setUpdateExisting(e.target.checked)}
                        />
                        <span>
                          Update existing candidate records if email already exists in database
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Invalid Rows Alert */}
                  {parseResult.invalidRows.length > 0 && (
                    <div
                      style={{
                        backgroundColor: '#FFFBEB',
                        border: '1px solid #FDE68A',
                        borderRadius: '8px',
                        padding: '0.75rem 1rem',
                        marginBottom: '1rem',
                        maxHeight: '140px',
                        overflowY: 'auto',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          color: '#B45309',
                          marginBottom: '0.35rem',
                        }}
                      >
                        Validation Issues Detected ({parseResult.invalidRows.length} rows):
                      </div>
                      {parseResult.invalidRows.slice(0, 5).map((inv, idx) => (
                        <div
                          key={idx}
                          style={{
                            fontSize: '0.75rem',
                            color: '#92400E',
                            marginBottom: '0.2rem',
                          }}
                        >
                          • Row #{inv.rowNumber}: {inv.errors.join(', ')}
                        </div>
                      ))}
                      {parseResult.invalidRows.length > 5 && (
                        <div style={{ fontSize: '0.72rem', color: '#B45309', fontStyle: 'italic' }}>
                          ...and {parseResult.invalidRows.length - 5} more row(s) with issues.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Preview Table */}
                  <div style={{ marginTop: '1rem' }}>
                    <div
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: '#475569',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Parsed Preview (Showing up to 6 valid rows):
                    </div>
                    <div
                      style={{
                        overflowX: 'auto',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        maxHeight: '220px',
                      }}
                    >
                      <table className="tw-table" style={{ fontSize: '0.78rem' }}>
                        <thead>
                          <tr>
                            {columns.slice(0, 6).map((col, idx) => (
                              <th key={idx}>{col.header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {parseResult.validRows.slice(0, 6).map((row, idx) => (
                            <tr key={idx}>
                              {columns.slice(0, 6).map((col, cIdx) => (
                                <td key={cIdx}>
                                  {Array.isArray(row[col.key])
                                    ? row[col.key].join(', ')
                                    : String(row[col.key] || '—')}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="tw-modal-footer">
          <button
            type="button"
            className="tw-btn-secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="tw-btn-primary"
            onClick={handleSubmit}
            disabled={!parseResult || rowsToImportCount === 0 || isSubmitting}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}
          >
            {isSubmitting ? (
              <span>Importing {rowsToImportCount} {entityName}...</span>
            ) : (
              <>
                <CheckIcon size={15} />
                <span>Import {rowsToImportCount} {entityName}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataImportModal;
