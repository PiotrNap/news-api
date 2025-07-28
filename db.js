/**
 * Least Recently Accessed Database - stores the most accessed results while deleting the least
 * accessed ones.
 */

class LRACache {
  constructor() {
    this.db = new Map();
    this.maxLength = 100;
  }

  set(key, value) {
    // check if it already exists
    if (this.db.has(key)) {
      // if it does then remove the current one,
      this.db.delete(key);
    } else {
      const currLength = this.db.size;
      if (currLength === 100) {
        const lastKey = this.db.keys().next().value;
        this.db.delete(lastKey);
      }
    }

    // and add the fresh one.
    this.db.set(key, value);
  }

  get(key) {
    // check if it exists, if not return null
    if (!this.db.get(key)) {
      return null;
    }

    const val = this.db.get(key);

    //delete it, and put it at the top of the stack
    delete this.db.delete(key);
    this.set(key, val);

    return val;
  }
}

export const db = new LRACache();
