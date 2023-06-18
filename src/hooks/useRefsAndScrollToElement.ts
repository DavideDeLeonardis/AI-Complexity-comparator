import { useEffect, useRef } from 'react';

import { FinalResponse } from '../types-interfaces';

interface useRefsProps {
   isLoading: boolean;
   finalResponse: FinalResponse;
}

const useRefsAndScrollToElement = ({
   isLoading,
   finalResponse,
}: useRefsProps) => {
   const textAreaRef = useRef<HTMLTextAreaElement>(null);
   const loadingRef = useRef<HTMLDivElement>(null);
   const outputsRef = useRef<HTMLDivElement>(null);

   useEffect(() => loadingRef.current?.scrollIntoView(), [isLoading]);
   useEffect(() => outputsRef.current?.scrollIntoView(), [finalResponse]);

   return {
      textAreaRef,
      loadingRef,
      outputsRef,
   };
};

export default useRefsAndScrollToElement;
