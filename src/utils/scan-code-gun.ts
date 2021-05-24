export function waitingDynamicId(): Promise<string> {
  return new Promise((resolve) => {
    let id = '';
    document.body.addEventListener('keyup', function handler(event) {
      if (event.key === 'Enter') {
        document.body.removeEventListener('keyup', handler);
        resolve(id);
      } else {
        id += event.key;
      }
    });
  });
}