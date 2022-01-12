import { useState, useEffect } from 'react';

// ----------------------------------------------------------------------

export default function useOffSetTop(top) {
  const [offsetTop, setOffSetTop] = useState(false);
  const isTop = top || 100;

  useEffect(() => {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > isTop) {
          setOffSetTop(true);
        } else {
          setOffSetTop(false);
        }
      }
    );
  }, [isTop]);

  return offsetTop;
}

// Usage
// const offset = useOffSetTop(100);
