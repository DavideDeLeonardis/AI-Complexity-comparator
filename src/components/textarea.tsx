import { ReactElement, ChangeEvent, KeyboardEvent } from 'react';

interface TextareaProps {
   onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
   onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void | null;
}

const Textarea = ({ onChange, onKeyDown }: TextareaProps): ReactElement => {
   window.onload = () => document.getElementById('textarea')?.focus();

   return (
      <div className="input-container">
         <textarea
            id="textarea"
            placeholder="Insert function to compare"
            onChange={onChange}
            onKeyDown={onKeyDown}
         ></textarea>
      </div>
   );
};

export default Textarea;
