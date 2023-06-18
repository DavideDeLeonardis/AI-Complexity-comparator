import { useEffect, useRef } from 'react';

interface useRefsProps {
   isLoading: boolean;
}

const useRefsAndScrollToElement = ({ isLoading }: useRefsProps) => {
   const textAreaRef = useRef<HTMLTextAreaElement>(null);
   const loadingRef = useRef<HTMLDivElement>(null);
   const errorRef = useRef<HTMLDivElement>(null);

   useEffect(() => loadingRef.current?.scrollIntoView(), [isLoading]);

   return {
      textAreaRef,
      loadingRef,
      errorRef,
   };
};

export default useRefsAndScrollToElement;
