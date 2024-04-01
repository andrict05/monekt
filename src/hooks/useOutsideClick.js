import { useEffect, useRef } from 'react';

export function useOutsideClick(
  handler,
  detectOutside = true,
  listenCapturing = true
) {
  const ref = useRef();

  useEffect(
    function () {
      function handleClick(e) {
        if (detectOutside && ref.current && !ref.current.contains(e.target)) {
          handler();
        }
      }

      document.addEventListener('click', handleClick, listenCapturing);

      return () =>
        document.removeEventListener('click', handleClick, listenCapturing);
    },
    [handler, detectOutside, listenCapturing]
  );

  return ref;
}
