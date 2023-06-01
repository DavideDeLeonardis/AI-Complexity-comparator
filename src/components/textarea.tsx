import { ReactElement, ChangeEvent, KeyboardEvent } from 'react';

interface TextareaProps {
   onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
   onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void | null;
}

const Textarea = ({ onChange, onKeyDown }: TextareaProps): ReactElement => {
   return (
      <div className="input-container">
         <textarea
            placeholder="Insert function to compare"
            onChange={onChange}
            onKeyDown={onKeyDown}
         ></textarea>
      </div>
   );
};

export default Textarea;
