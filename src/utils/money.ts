export function stringToNumber(amount: string | number): number {
  if (typeof amount === 'number') {
    return amount;
  }
  
  const value = Number.parseFloat(amount);
  return Number.isNaN(value) ? 0 : value;
}

export function fenToYuan(amount: number | string): number {
  return stringToNumber(amount) * 0.01;
}

export function yuanToFen(amount: number | string): number {
  return stringToNumber(amount) * 100;
}