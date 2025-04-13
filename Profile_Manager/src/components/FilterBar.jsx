import { useState, useEffect } from 'react';

const FilterBar = ({ users, setFilters }) => {
  const [langOptions, setLangOptions] = useState([]);
  const [educationOptions, setEducationOptions] = useState([]);
  const [specOptions, setSpecOptions] = useState([]);

  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [education, setEducation] = useState('');
  const [specialization, setSpecialization] = useState('');

  useEffect(() => {
    const languages = [...new Set(users.flatMap(u => u.languages))];
    const educations = [...new Set(users.map(u => u.education))];
    const specializations = [...new Set(users.map(u => u.specialization))];

    setLangOptions(languages);
    setEducationOptions(educations);
    setSpecOptions(specializations);
  }, [users]);

  useEffect(() => {
    setFilters({
      languages: selectedLanguages,
      education,
      specialization
    });
  }, [selectedLanguages, education, specialization]);

  const handleLangChange = (lang) => {
    setSelectedLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <div>
        <label className="block mb-1">Languages</label>
        <div className="flex flex-wrap gap-2">
          {langOptions.map(lang => (
            <label key={lang} className="flex items-center gap-1">
              <input
                type="checkbox"
                value={lang}
                checked={selectedLanguages.includes(lang)}
                onChange={() => handleLangChange(lang)}
              />
              {lang}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-1">Education</label>
        <select
          value={education}
          onChange={e => setEducation(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All</option>
          {educationOptions.map(edu => (
            <option key={edu} value={edu}>{edu}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1">Specialization</label>
        <select
          value={specialization}
          onChange={e => setSpecialization(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All</option>
          {specOptions.map(spec => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
