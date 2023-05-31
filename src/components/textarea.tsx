import { ReactElement } from 'react';

import { textareaChangeEvent } from '../types';

const Textarea = ({
   onTextareaChangeValue,
}: {
   onTextareaChangeValue: (e: textareaChangeEvent) => void;
}): ReactElement => {
   return (
      <div className="input-container">
         <textarea
            placeholder="Insert function to compare"
            onChange={onTextareaChangeValue}
         ></textarea>
      </div>
   );
};

export default Textarea;
