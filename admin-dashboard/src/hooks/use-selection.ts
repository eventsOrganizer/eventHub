import { useState, useCallback } from 'react';

export function useSelection(initialSelectedIds: string[] = []) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelectedIds));

  const selectAll = useCallback(() => {
    setSelected(new Set(initialSelectedIds));
  }, [initialSelectedIds]);

  const deselectAll = useCallback(() => {
    setSelected(new Set());
  }, []);

  const selectOne = useCallback((id: string) => {
    setSelected((prevSelected) => new Set(prevSelected).add(id));
  }, []);

  const deselectOne = useCallback((id: string) => {
    setSelected((prevSelected) => {
      const newSelected = new Set(prevSelected);
      newSelected.delete(id);
      return newSelected;
    });
  }, []);

  return { selectAll, deselectAll, selectOne, deselectOne, selected };
}
