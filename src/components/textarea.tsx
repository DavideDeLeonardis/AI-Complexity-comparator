import { ReactElement, ChangeEvent, KeyboardEvent, RefObject } from 'react';

interface TextareaProps {
   onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
   onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void | null;
   innerRef?: RefObject<HTMLTextAreaElement>;
}

const Textarea = ({
   onChange,
   onKeyDown,
   innerRef,
}: TextareaProps): ReactElement => {
   return (
      <textarea
         placeholder="Insert function to compare"
         ref={innerRef}
         onChange={onChange}
         onKeyDown={onKeyDown}
      ></textarea>
   );
};

export default Textarea;
