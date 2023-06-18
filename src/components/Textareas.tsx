import {
   ReactElement,
   Dispatch,
   SetStateAction,
   KeyboardEvent,
   RefObject,
} from 'react';

import Textarea from './SingleTextarea';

import useAccessibilty from '../hooks/useAccessibilty';

import { InputFunctionsInserted } from '../types-interfaces';

interface TextareasProps {
   inputFunctionsInserted: InputFunctionsInserted;
   setInputFunctionsInserted: Dispatch<SetStateAction<InputFunctionsInserted>>;
   isLoading: boolean;
   textAreaRef: RefObject<HTMLTextAreaElement>;
   compareValidFunctions: () => Promise<void>;
}

const Textareas = ({
   inputFunctionsInserted,
   setInputFunctionsInserted,
   isLoading,
   textAreaRef,
   compareValidFunctions,
}: TextareasProps): ReactElement => {
   // Execute compareValidFunctions() on pressing {{ Command / Control + Enter }} keys
   const handleKeyPress = (e: KeyboardEvent): void => {
      useAccessibilty(e, compareValidFunctions);
   };

   return (
      <section className="inputs">
         <Textarea
            onChange={(e) =>
               setInputFunctionsInserted({
                  ...inputFunctionsInserted,
                  inputFuncOne: e.target.value,
               })
            }
            onKeyDown={handleKeyPress}
            isLoading={isLoading}
            innerRef={textAreaRef}
         />
         <Textarea
            onChange={(e) =>
               setInputFunctionsInserted({
                  ...inputFunctionsInserted,
                  inputFuncTwo: e.target.value,
               })
            }
            onKeyDown={handleKeyPress}
            isLoading={isLoading}
         />
      </section>
   );
};

export default Textareas;
