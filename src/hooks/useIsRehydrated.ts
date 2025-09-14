import { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';

export function useIsRehydrated() {
  const [isRehydrated, setIsRehydrated] = useState(false);
  const { _persist } = useAppSelector((state) => state.app as any);

  useEffect(() => {
    if (_persist?.rehydrated) {
      setIsRehydrated(true);
    }
  }, [_persist?.rehydrated]);

  return isRehydrated;
}
