/**
 * Generate a new UUID v4 without libs.
 * @returns A new UUIDv4
 */
export default function newUUIDv4(): string {
  const hexDigits = '0123456789abcdef';
  
  const randomHex = (length: number): string => {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += hexDigits[Math.floor(Math.random() * 16)];
    }
    return result;
  };

  // Generate four random hexadecimal segments
  const segment1 = randomHex(8);
  const segment2 = randomHex(4);
  const segment3 = '4' + randomHex(3);  // UUID version 4
  const segment4 = hexDigits[(Math.floor(Math.random() * 4) + 8)] + randomHex(3);  // Set the high bits for the variant

  const segment5 = randomHex(12);

  // Concatenate the segments with hyphens to form the final UUID
  const uuid = `${segment1}-${segment2}-${segment3}-${segment4}-${segment5}`;

  return uuid;
}