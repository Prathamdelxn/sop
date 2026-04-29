/**
 * Batch Number Generator
 * 
 * Format: {CompanyCode}{DDMMYYYY}{Suffix}
 * Example: KR27042026A → Company "KR", date 27/04/2026, first batch = "A"
 * 
 * Suffix cycles: A, B, C... Z, AA, AB... AZ, BA, BB...
 */

/**
 * Generate the next batch number for a company on a given date.
 * @param {string} companyCode - Short company code (e.g., "KR")
 * @param {Date} date - The date for the batch
 * @param {Model} ElogbookBatch - Mongoose model to query existing batches
 * @returns {Promise<string>} The generated batch number
 */
export async function generateBatchNumber(companyCode, date, ElogbookBatch) {
  const code = (companyCode || "XX").toUpperCase();

  const dateStr = [
    String(date.getDate()).padStart(2, '0'),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getFullYear()),
  ].join('');

  const prefix = `${code}${dateStr}`;

  // Find the last batch created with this prefix (sorted desc to get latest suffix)
  const lastBatch = await ElogbookBatch.findOne({
    batchNumber: { $regex: `^${prefix}` }
  }).sort({ batchNumber: -1 });

  if (!lastBatch) {
    return `${prefix}A`;
  }

  // Extract suffix and increment
  const lastSuffix = lastBatch.batchNumber.replace(prefix, '');
  const nextSuffix = incrementSuffix(lastSuffix);
  return `${prefix}${nextSuffix}`;
}

/**
 * Increment an alphabetical suffix.
 * A → B, Z → AA, AZ → BA, ZZ → AAA
 */
function incrementSuffix(suffix) {
  if (!suffix) return 'A';

  const chars = suffix.split('');
  let carry = true;

  for (let i = chars.length - 1; i >= 0 && carry; i--) {
    if (chars[i] === 'Z') {
      chars[i] = 'A';
    } else {
      chars[i] = String.fromCharCode(chars[i].charCodeAt(0) + 1);
      carry = false;
    }
  }

  if (carry) {
    return 'A' + chars.join(''); // Z → AA, ZZ → AAA
  }

  return chars.join('');
}
