const SELECTED_BRANCH_STORAGE_KEY = 'selectedBranch';

interface StoredBranch {
  id?: string | number;
}

export function getSelectedBranchFromStorage<T extends StoredBranch>(): T | null {
  const storedBranch = localStorage.getItem(SELECTED_BRANCH_STORAGE_KEY);
  if (!storedBranch) {
    return null;
  }

  try {
    return JSON.parse(storedBranch) as T;
  } catch {
    return null;
  }
}

export function getSelectedBranchIdFromStorage(): string | null {
  const parsedBranch = getSelectedBranchFromStorage<StoredBranch>();
  if (!parsedBranch || parsedBranch.id === undefined || parsedBranch.id === null) {
    return null;
  }

  return String(parsedBranch.id);
}
