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
  inFeeNtd: number;
}

export interface CalculationInput {
  audAmount: number;
  audFeeNtd: number;
  audToUsdRate: number;
}

export interface CalculationResult {
  audNetAmount: number;
  usdAmount: number;
  usdFeeNtd: number;
  usdNetAmount: number;
  bankComparisons: BankComparison[];
  bestBank: BankComparison | null;
  worstBank: BankComparison | null;
}

export interface BankComparison {
  bankName: string;
  usdToTwdRate: number;
  audToTwdRate: number;
  inFeeNtd: number;
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
 * 1. AUD Net = AUD Amount - AUD Fee
 * 2. USD Amount = AUD Net × AUD to USD Rate
 * 3. USD Fee = AUD Fee × AUD to USD Rate
 * 4. USD Net = USD Amount - USD Fee
 * 5. For each bank:
 *    - USD to TWD = USD Net × USD to TWD Rate + In Fee
 *    - AUD to TWD = AUD Net × AUD to TWD Rate + In Fee
 *    - Difference = USD to TWD - AUD to TWD
 */
export function calculateExchange(
  input: CalculationInput,
  banks: BankRate[]
): CalculationResult {
  // Step 1: Calculate net AUD amount
  const audNetAmount = input.audAmount - input.audFeeNtd;

  // Step 2: Convert AUD to USD
  const usdAmount = audNetAmount * input.audToUsdRate;

  // Step 3: Calculate USD fee (proportional to AUD fee)
  const usdFeeNtd = input.audFeeNtd * input.audToUsdRate;

  // Step 4: Calculate net USD amount
  const usdNetAmount = usdAmount - usdFeeNtd;

  // Step 5: Compare banks
  const bankComparisons = banks.map((bank) => {
    const usdToTwdAmount = usdNetAmount * bank.usdToTwdRate + bank.inFeeNtd;
    const audToTwdAmount = audNetAmount * bank.audToTwdRate + bank.inFeeNtd;
    const difference = usdToTwdAmount - audToTwdAmount;

    return {
      bankName: bank.name,
      usdToTwdRate: bank.usdToTwdRate,
      audToTwdRate: bank.audToTwdRate,
      inFeeNtd: bank.inFeeNtd,
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
    usdFeeNtd: Math.round(usdFeeNtd * 100) / 100,
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
