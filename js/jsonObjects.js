// @flow

export function getNestedByString(dictionary: { [key: string]: any }, keyNesting: string): any {
  let tempStr = keyNesting.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  tempStr = tempStr.replace(/^\./, ''); // strip a leading dot
  const nested = tempStr.split('.');
  for (let i = 0, n = nested.length; i < n; i += 1) {
    const k = nested[i];
    if (dictionary && k in dictionary) {
      dictionary = dictionary[k];
    } else {
      return;
    }
  }

  return dictionary;
}
