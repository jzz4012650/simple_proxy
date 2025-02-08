import { useRef } from 'react';

type UseImportExportProps = {
  currentList: string[];
  onImport: (newList: string[]) => void;
};

export const useImportExport = ({ currentList, onImport }: UseImportExportProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const content = JSON.stringify(currentList, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'list.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedList = JSON.parse(content) as string[];
        if (Array.isArray(importedList)) {
          const newList = [...new Set([...importedList, ...currentList])];
          onImport(newList);
        }
      } catch (error) {
        console.error('Failed to import list:', error);
        alert(chrome.i18n.getMessage('import_failed') || 'Failed to import list');
      }
    };
    reader.readAsText(file);
  };

  return {
    fileInputRef,
    handleExport,
    handleImport
  };
};