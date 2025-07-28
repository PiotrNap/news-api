/**
 * Least Recently Accessed Database - stores the most accessed results while deleting the least
 * accessed ones.
 */

class LRACache {
  constructor() {
    this.db = [];
  }
}

export const db = new LRACache();
