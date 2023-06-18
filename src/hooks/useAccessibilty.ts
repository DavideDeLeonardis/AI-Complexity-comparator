import { KeyboardEvent } from 'react';

const useAccessibilty = (
   e: KeyboardEvent,
   compareFunctions: () => void
): void => {
   if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') compareFunctions();
};

export default useAccessibilty;
