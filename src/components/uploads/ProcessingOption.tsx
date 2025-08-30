// components/ProcessingOptions.tsx
import { ProcessingOptions as ProcessingOptionsType } from '@/lib/types/receipt';

interface ProcessingOptionsProps {
  options: ProcessingOptionsType;
  setOptions: (options: ProcessingOptionsType) => void;
}

const ProcessingOptions = ({ options, setOptions }: ProcessingOptionsProps) => {
  const handleLanguageChange = (lang: string): void => {
    const updatedLanguages = options.languages.includes(lang)
      ? options.languages.filter(l => l !== lang)
      : [...options.languages, lang];
    
    setOptions({ ...options, languages: updatedLanguages });
  };

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Processing Options</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
          <div className="flex flex-wrap gap-3">
            {[
              { code: 'eng', name: 'English' },
              { code: 'fra', name: 'French' },
              { code: 'deu', name: 'German' },
              { code: 'spa', name: 'Spanish' }
            ].map(lang => (
              <div key={lang.code} className="flex items-center">
                <input
                  id={`lang-${lang.code}`}
                  type="checkbox"
                  checked={options.languages.includes(lang.code)}
                  onChange={() => handleLanguageChange(lang.code)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`lang-${lang.code}`} className="ml-2 block text-sm text-gray-700">
                  {lang.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center">
          <input
            id="compress-image"
            type="checkbox"
            checked={options.compressImage}
            onChange={() => setOptions({ ...options, compressImage: !options.compressImage })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="compress-image" className="ml-2 block text-sm text-gray-700">
            Compress images before processing (faster)
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            id="auto-detect"
            type="checkbox"
            checked={options.autoDetectFields}
            onChange={() => setOptions({ ...options, autoDetectFields: !options.autoDetectFields })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="auto-detect" className="ml-2 block text-sm text-gray-700">
            Auto-detect fields (total, date, merchant)
          </label>
        </div>
      </div>
    </div>
  );
};

export default ProcessingOptions;