import { ReactElement } from 'react';

import { HandleSelectChange } from '../types-interfaces';

interface SelectProps {
   onChange: HandleSelectChange;
}

const Select = ({ onChange }: SelectProps): ReactElement => {
   const optionsList = [
      'JavaScript',
      'TypeScript',
      'Python',
      'Java',
      'PHP',
      'C',
      'C++',
      'C#',
      'SQL',
      'R',
      'Go',
      'Assembly',
      'MATLAB',
      'Swift',
      'Ruby',
      'Perl',
      'Rust',
      'Kotlin',
      'Dart',
      'Scala',
      'SQL',
      'Bash',
      'Powershell',
   ];

   const options = optionsList.map((option, key) => (
      <option key={key}>{option}</option>
   ));

   return (
      <div className="select-container">
         <label>Choose programming language</label>
         <select onChange={onChange} defaultValue={'Select language'}>
            <option disabled>Select language</option>
            {options}
         </select>
      </div>
   );
};

export default Select;
