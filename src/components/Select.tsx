import { SelectProps } from '../interfaces';

const Select = ({ onChange }: SelectProps) => {
   const options = [
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
      'Ada',
      'Dart',
      'Scala',
      'PL/SQL',
      'Bash',
      'Powershell',
   ];

   return (
      <div className="select-container">
         <label>Choose language</label>
         <select onChange={onChange}>
            <option selected>Select language</option>
            {options.map((option, key) => (
               <option key={key}>{option}</option>
            ))}
         </select>
      </div>
   );
};

export default Select;
