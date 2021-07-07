export class Storage {
  static getItem(key: string): any {
    let result = null;

    try {
      result = localStorage.getItem(key);
    } catch {}

    try {
      result = JSON.parse(result as string);
    } catch { }

    return result;
  }

  static setItem(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch { }
  }

  static removeItem(key: string) {
    try {
      localStorage.removeItem(key);
    } catch { }
  }

  static clear() {
    try {
      localStorage.clear();
    } catch { }
  }
}