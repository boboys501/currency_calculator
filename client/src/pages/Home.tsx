/**
 * Currency Calculator Home Page
 * 
 * Design Philosophy: Modern Financial Dashboard
 * - Clean input form at the top
 * - Summary results in the middle
 * - Bank comparison table at the bottom
 * - Responsive design with mobile-first approach
 */

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  calculateExchange,
  formatCurrency,
  formatRate,
  type BankRate,
  type CalculationInput,
} from "@/lib/calculator";
import { TrendingUp, TrendingDown, Copy, Check } from "lucide-react";

// Default bank rates (from the image)
const DEFAULT_BANKS: BankRate[] = [
  {
    name: "台新銀行",
    usdToTwdRate: 31.553,
    audToTwdRate: 21.883,
    inFeeNtd: 200,
  },
  {
    name: "台灣銀行",
    usdToTwdRate: 31.515,
    audToTwdRate: 21.805,
    inFeeNtd: 200,
  },
  {
    name: "永豐銀行",
    usdToTwdRate: 31.563,
    audToTwdRate: 21.8085,
    inFeeNtd: 200,
  },
  {
    name: "國泰世華",
    usdToTwdRate: 31.54,
    audToTwdRate: 21.86,
    inFeeNtd: 200,
  },
  {
    name: "遠銀銀行",
    usdToTwdRate: 31.54,
    audToTwdRate: 21.805,
    inFeeNtd: 50,
  },
];

export default function Home() {
  // Form inputs
  const [audAmount, setAudAmount] = useState<number>(2000);
  const [audFeeNtd, setAudFeeNtd] = useState<number>(8);
  const [audToUsdRate, setAudToUsdRate] = useState<number>(0.6545);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Calculate results
  const input: CalculationInput = {
    audAmount,
    audFeeNtd,
    audToUsdRate,
  };

  const result = useMemo(
    () => calculateExchange(input, DEFAULT_BANKS),
    [input]
  );

  // Copy to clipboard handler
  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">
            匯率試算工具
          </h1>
          <p className="text-lg text-slate-600">
            澳幣到台幣多銀行匯率比較
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-8 p-6 border-slate-200 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">
            計算參數
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* AUD Amount */}
            <div className="space-y-2">
              <Label htmlFor="aud-amount" className="text-sm font-medium text-slate-700">
                預計匯出澳幣金額 (AUD)
              </Label>
              <Input
                id="aud-amount"
                type="number"
                value={audAmount}
                onChange={(e) => setAudAmount(parseFloat(e.target.value) || 0)}
                className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                step="100"
                min="0"
              />
            </div>

            {/* AUD Fee */}
            <div className="space-y-2">
              <Label htmlFor="aud-fee" className="text-sm font-medium text-slate-700">
                匯出手續費 (NTD)
              </Label>
              <Input
                id="aud-fee"
                type="number"
                value={audFeeNtd}
                onChange={(e) => setAudFeeNtd(parseFloat(e.target.value) || 0)}
                className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                step="1"
                min="0"
              />
            </div>

            {/* AUD to USD Rate */}
            <div className="space-y-2">
              <Label htmlFor="aud-usd-rate" className="text-sm font-medium text-slate-700">
                Revolut 澳幣兌美金匯率
              </Label>
              <Input
                id="aud-usd-rate"
                type="number"
                value={audToUsdRate}
                onChange={(e) => setAudToUsdRate(parseFloat(e.target.value) || 0)}
                className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                step="0.0001"
                min="0"
              />
            </div>
          </div>
        </Card>

        {/* Summary Results */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* AUD Net */}
          <Card className="p-4 border-slate-200 shadow-sm bg-white">
            <p className="text-sm text-slate-600 mb-1">澳幣淨額</p>
            <p className="text-2xl font-bold text-slate-900 font-mono">
              {formatCurrency(result.audNetAmount, 0)}
            </p>
            <p className="text-xs text-slate-500 mt-2">AUD</p>
          </Card>

          {/* USD Amount */}
          <Card className="p-4 border-slate-200 shadow-sm bg-white">
            <p className="text-sm text-slate-600 mb-1">美金金額</p>
            <p className="text-2xl font-bold text-slate-900 font-mono">
              {formatCurrency(result.usdAmount, 2)}
            </p>
            <p className="text-xs text-slate-500 mt-2">USD</p>
          </Card>

          {/* USD Net */}
          <Card className="p-4 border-slate-200 shadow-sm bg-white">
            <p className="text-sm text-slate-600 mb-1">美金淨額</p>
            <p className="text-2xl font-bold text-slate-900 font-mono">
              {formatCurrency(result.usdNetAmount, 2)}
            </p>
            <p className="text-xs text-slate-500 mt-2">USD</p>
          </Card>

          {/* Best Result */}
          {result.bestBank && (
            <Card className="p-4 border-emerald-200 shadow-sm bg-emerald-50">
              <p className="text-sm text-emerald-700 mb-1 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                最優方案
              </p>
              <p className="text-2xl font-bold text-emerald-900 font-mono">
                {formatCurrency(result.bestBank.audToTwdAmount, 0)}
              </p>
              <p className="text-xs text-emerald-700 mt-2">
                {result.bestBank.bankName}
              </p>
            </Card>
          )}
        </div>

        {/* Bank Comparison Table */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                    銀行
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                    美金買入匯率
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                    澳幣買入匯率
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                    匯入手續費
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                    美金台幣
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                    澳幣台幣
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                    差額
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.bankComparisons.map((bank, idx) => (
                  <tr
                    key={idx}
                    className={`border-b border-slate-200 transition-colors ${
                      bank.isBest
                        ? "bg-emerald-50 hover:bg-emerald-100"
                        : bank.isWorst
                          ? "bg-red-50 hover:bg-red-100"
                          : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
                      {bank.bankName}
                      {bank.isBest && (
                        <span className="ml-2 inline-block px-2 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100 rounded">
                          最優
                        </span>
                      )}
                      {bank.isWorst && (
                        <span className="ml-2 inline-block px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded">
                          最差
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-slate-700 font-mono">
                      {formatRate(bank.usdToTwdRate)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-slate-700 font-mono">
                      {formatRate(bank.audToTwdRate)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-slate-700 font-mono">
                      NT${formatCurrency(bank.inFeeNtd, 0)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-slate-700 font-mono">
                      <button
                        onClick={() =>
                          handleCopy(
                            bank.usdToTwdAmount.toString(),
                            idx * 2
                          )
                        }
                        className="hover:text-blue-600 transition-colors flex items-center justify-end gap-1 group"
                      >
                        NT${formatCurrency(bank.usdToTwdAmount, 0)}
                        {copiedIndex === idx * 2 ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </button>
                    </td>
                    <td
                      className={`px-4 py-3 text-right text-sm font-semibold font-mono ${
                        bank.isBest ? "text-emerald-700" : "text-slate-900"
                      }`}
                    >
                      <button
                        onClick={() =>
                          handleCopy(
                            bank.audToTwdAmount.toString(),
                            idx * 2 + 1
                          )
                        }
                        className="hover:text-blue-600 transition-colors flex items-center justify-end gap-1 group"
                      >
                        NT${formatCurrency(bank.audToTwdAmount, 0)}
                        {copiedIndex === idx * 2 + 1 ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </button>
                    </td>
                    <td
                      className={`px-4 py-3 text-right text-sm font-semibold font-mono flex items-center justify-end gap-2 ${
                        bank.difference < 0
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {bank.difference < 0 ? (
                        <TrendingDown className="w-4 h-4" />
                      ) : (
                        <TrendingUp className="w-4 h-4" />
                      )}
                      NT${formatCurrency(Math.abs(bank.difference), 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-slate-600">
          <p>
            💡 提示：澳幣台幣金額越高越好。點擊金額可複製到剪貼板。
          </p>
        </div>
      </div>
    </div>
  );
}
