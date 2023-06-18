import { KeyboardEvent } from 'react';

import { CompareValidFunction } from '../types-interfaces';

const useAccessibilty = (
   e: KeyboardEvent,
   compareValidFunctions: CompareValidFunction
): void => {
   if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') compareValidFunctions();
};

export default useAccessibilty;
