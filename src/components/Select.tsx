import { SelectProps } from '../interfaces';

const Select = ({ onChange, innerRef }: SelectProps) => {
   const optionsList = [
      'Python',
      'C',
      'C++',
      'C#',
      'Java',
      'JavaScript',
      'TypeScript',
      'SQL',
      'Assembly language',
      'PHP',
      'R',
      'Go',
      'Classic Visual Basic',
      'MATLAB',
      'Swift',
      'Pascal',
      'Ruby',
      'Perl',
      'Objective-C',
      'Rust',
      'SASS',
      'Kotlin',
      'Fortran',
      'COBOL',
      'Lisp',
      'Dart',
      'Scala',
      'PL/SQL',
      'Bash',
      'Powershell',
   ];

   const options = optionsList.map((option, key) => (
      <option key={key}>{option}</option>
   ));

   return (
      <div className="select-container">
         <label>Choose language</label>
         <select onChange={onChange} defaultValue={'Select language'} ref={innerRef}>
            <option disabled>Select language</option>
            {options}
         </select>
      </div>
   );
};

export default Select;
