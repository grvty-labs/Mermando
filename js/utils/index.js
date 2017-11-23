// @flow

export function hashCode(str: string) { // java String#hashCode
  let hash: number = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

export function intToRGB(i: number) {
  const c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

  return '00000'.substring(0, 6 - c.length) + c;
}

export function getNameInitials(name: string): string {
  const initials = name.match(/\b\w/g);
  return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
}

export function getNameColor(name: string): string {
  return `#${intToRGB(hashCode(name))}`;
}
