/**
 * Currency Exchange Calculator
 * 
 * Design Philosophy: Modern Financial Dashboard
 * - Precise calculations with clear data flow
 * - Support multiple bank comparisons
 * - Transparent formula display
 */

export interface BankRate {
  name: string;
  usdToTwdRate: number;
  audToTwdRate: number;
  usdInFeeAud: number;  // 匯美金手續費 (AUD)
  audInFeeAud: number;  // 匯澳幣手續費 (AUD)
  receivingFeeNtd: number;  // 收款銀行解款手續費 (NTD)
}

export interface CalculationInput {
  audAmount: number;
  usdFeeAud: number;    // 匯美金手續費 (AUD)
  audFeeAud: number;    // 匯澳幣手續費 (AUD)
  audToUsdRate: number;
}

export interface CalculationResult {
  audNetAmount: number;
  usdAmount: number;
  usdFeeAud: number;
  usdNetAmount: number;
  bankComparisons: BankComparison[];
  bestBank: BankComparison | null;
  worstBank: BankComparison | null;
}

export interface BankComparison {
  bankName: string;
  usdToTwdRate: number;
  audToTwdRate: number;
  usdInFeeAud: number;
  audInFeeAud: number;
  usdToTwdAmount: number;
  audToTwdAmount: number;
  difference: number;
  isBest: boolean;
  isWorst: boolean;
}

/**
 * Calculate currency exchange with bank comparisons
 * 
 * Formula Logic:
 * 1. USD Net (AUD) = AUD Amount - USD Fee (AUD)
 * 2. USD Amount = USD Net (AUD) × AUD to USD Rate
 * 3. AUD Net = AUD Amount - AUD Fee (AUD)
 * 4. For each bank:
 *    - USD to TWD = (AUD Amount - USD Fee) × AUD to USD Rate × USD to TWD Rate
 *    - AUD to TWD = (AUD Amount - AUD Fee) × AUD to TWD Rate
 *    - Difference = USD to TWD - AUD to TWD
 */
export function calculateExchange(
  input: CalculationInput,
  banks: BankRate[]
): CalculationResult {
  // Step 1: Calculate USD net amount in AUD
  const usdNetAud = input.audAmount - input.usdFeeAud;
  
  // Step 2: Convert to USD amount
  const usdAmount = usdNetAud * input.audToUsdRate;

  // Step 3: Calculate AUD net amount
  const audNetAmount = input.audAmount - input.audFeeAud;

  // Step 4: Calculate net USD amount (for display)
  const usdNetAmount = usdAmount;

  // Step 5: Compare banks
  const bankComparisons = banks.map((bank) => {
    // 美金台幣 = (匯出澳幣 - 匯美金手續費) × AUD to USD Rate × USD to TWD Rate
    const usdToTwdAmount = usdNetAud * input.audToUsdRate * bank.usdToTwdRate;
    // 澳幣台幣 = (匯出澳幣 - 匯澳幣手續費) × AUD to TWD Rate
    const audToTwdAmount = audNetAmount * bank.audToTwdRate;
    const difference = usdToTwdAmount - audToTwdAmount;

    return {
      bankName: bank.name,
      usdToTwdRate: bank.usdToTwdRate,
      audToTwdRate: bank.audToTwdRate,
      usdInFeeAud: bank.usdInFeeAud,
      audInFeeAud: bank.audInFeeAud,
      usdToTwdAmount: Math.round(usdToTwdAmount * 100) / 100,
      audToTwdAmount: Math.round(audToTwdAmount * 100) / 100,
      difference: Math.round(difference * 100) / 100,
      isBest: false,
      isWorst: false,
    };
  });

  // Find best and worst banks
  if (bankComparisons.length > 0) {
    let bestIdx = 0;
    let worstIdx = 0;
    
    for (let i = 1; i < bankComparisons.length; i++) {
      if (bankComparisons[i].audToTwdAmount > bankComparisons[bestIdx].audToTwdAmount) {
        bestIdx = i;
      }
      if (bankComparisons[i].audToTwdAmount < bankComparisons[worstIdx].audToTwdAmount) {
        worstIdx = i;
      }
    }

    bankComparisons[bestIdx].isBest = true;
    bankComparisons[worstIdx].isWorst = true;
  }

  return {
    audNetAmount: Math.round(audNetAmount * 100) / 100,
    usdAmount: Math.round(usdAmount * 100) / 100,
    usdFeeAud: input.usdFeeAud,
    usdNetAmount: Math.round(usdNetAmount * 100) / 100,
    bankComparisons,
    bestBank: bankComparisons.find((b) => b.isBest) || null,
    worstBank: bankComparisons.find((b) => b.isWorst) || null,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(value: number, decimals = 2): string {
  return value.toLocaleString("zh-TW", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format exchange rate for display
 */
export function formatRate(value: number, decimals = 4): string {
  return value.toLocaleString("zh-TW", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
