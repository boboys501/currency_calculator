/**
 * Currency Calculator Home Page
 * 
 * Design Philosophy: Modern Financial Dashboard
 * - Clean input form at the top
 * - Manual rate update panel
 * - Summary results in the middle
 * - Standalone best result section
 * - Bank comparison table at the bottom
 * - Responsive design with mobile-first approach
 */

import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  calculateExchange,
  formatCurrency,
  formatRate,
  type BankRate,
  type CalculationInput,
} from "@/lib/calculator";
import { TrendingUp, TrendingDown, Copy, Check, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

// Default bank rates (from the image)
const DEFAULT_BANKS: BankRate[] = [
  {
    name: "台新銀行",
    usdToTwdRate: 31.553,
    audToTwdRate: 21.883,
    usdInFeeAud: 8,
    audInFeeAud: 8,
    receivingFeeNtd: 0,
  },
  {
    name: "台灣銀行",
    usdToTwdRate: 31.515,
    audToTwdRate: 21.805,
    usdInFeeAud: 8,
    audInFeeAud: 8,
    receivingFeeNtd: 0,
  },
  {
    name: "永豐銀行",
    usdToTwdRate: 31.563,
    audToTwdRate: 21.8085,
    usdInFeeAud: 8,
    audInFeeAud: 8,
    receivingFeeNtd: 0,
  },
  {
    name: "國泰世華",
    usdToTwdRate: 31.54,
    audToTwdRate: 21.86,
    usdInFeeAud: 8,
    audInFeeAud: 8,
    receivingFeeNtd: 0,
  },
  {
    name: "遠銀銀行",
    usdToTwdRate: 31.54,
    audToTwdRate: 21.805,
    usdInFeeAud: 8,
    audInFeeAud: 8,
    receivingFeeNtd: 0,
  },
];

const STORAGE_KEY = "currencyCalculatorBanks";
const TIMESTAMP_KEY = "currencyCalculatorTimestamp";

export default function Home() {
  // Form inputs
  const [audAmount, setAudAmount] = useState<number>(2000);
  const [usdFeeAud, setUsdFeeAud] = useState<number>(8);
  const [audFeeAud, setAudFeeAud] = useState<number>(8);
  const [audToUsdRate, setAudToUsdRate] = useState<number>(0.6545);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [banks, setBanks] = useState<BankRate[]>(DEFAULT_BANKS);
  const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null);
  const [showRateEditor, setShowRateEditor] = useState(false);
  const [editingBanks, setEditingBanks] = useState<BankRate[]>(DEFAULT_BANKS);

  // Load banks and timestamp from localStorage on mount
  useEffect(() => {
    const savedBanks = localStorage.getItem(STORAGE_KEY);
    const savedTimestamp = localStorage.getItem(TIMESTAMP_KEY);
    
    if (savedBanks) {
      try {
        const parsedBanks = JSON.parse(savedBanks);
        setBanks(parsedBanks);
        setEditingBanks(parsedBanks);
      } catch (e) {
        console.error("Failed to parse saved banks", e);
      }
    }
    
    if (savedTimestamp) {
      setLastUpdateTime(savedTimestamp);
    }
  }, []);

  // Calculate results
  const input: CalculationInput = {
    audAmount,
    usdFeeAud,
    audFeeAud,
    audToUsdRate,
  };

  const result = useMemo(
    () => calculateExchange(input, banks),
    [input, banks]
  );

  // Copy to clipboard handler
  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Handle rate update
  const handleUpdateRates = () => {
    setBanks(editingBanks);
    const now = new Date();
    const timeString = now.toLocaleString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLastUpdateTime(timeString);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(editingBanks));
    localStorage.setItem(TIMESTAMP_KEY, timeString);
    
    setShowRateEditor(false);
  };

  // Handle reset to defaults
  const handleResetRates = () => {
    setEditingBanks(DEFAULT_BANKS);
    setBanks(DEFAULT_BANKS);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TIMESTAMP_KEY);
    setLastUpdateTime(null);
    setShowRateEditor(false);
  };

  // Handle editing bank rate
  const handleEditBank = (index: number, field: keyof BankRate, value: any) => {
    const updated = [...editingBanks];
    if (field === "name") {
      updated[index].name = value;
    } else {
      updated[index][field] = parseFloat(value) || 0;
    }
    setEditingBanks(updated);
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                step="1"
                min="0"
              />
            </div>

            {/* USD Fee */}
            <div className="space-y-2">
              <Label htmlFor="usd-fee" className="text-sm font-medium text-slate-700">
                匯美金手續費 (AUD)
              </Label>
              <Input
                id="usd-fee"
                type="number"
                value={usdFeeAud}
                onChange={(e) => setUsdFeeAud(parseFloat(e.target.value) || 0)}
                className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                step="0.01"
                min="0"
              />
            </div>

            {/* AUD Fee */}
            <div className="space-y-2">
              <Label htmlFor="aud-fee" className="text-sm font-medium text-slate-700">
                匯澳幣手續費 (AUD)
              </Label>
              <Input
                id="aud-fee"
                type="number"
                value={audFeeAud}
                onChange={(e) => setAudFeeAud(parseFloat(e.target.value) || 0)}
                className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                step="0.01"
                min="0"
              />
            </div>

            {/* AUD to USD Rate */}
            <div className="space-y-2">
              <Label htmlFor="aud-usd-rate" className="text-sm font-medium text-slate-700">
                Revolut 澳幣換美金匯率
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

        {/* Results Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* AUD Net */}
          <Card className="p-6 border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleCopy(result.audNetAmount.toString(), 0)}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">澳幣匯出淨額</h3>
              {copiedIndex === 0 ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <p className="text-2xl font-bold text-slate-900 font-mono">
              {formatCurrency(result.audNetAmount)}
            </p>
            <p className="text-xs text-slate-500 mt-1">AUD</p>
          </Card>

          {/* USD Amount */}
          <Card className="p-6 border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleCopy(result.usdAmount.toString(), 1)}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">美金換得金額</h3>
              {copiedIndex === 1 ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <p className="text-2xl font-bold text-slate-900 font-mono">
              {formatCurrency(result.usdAmount)}
            </p>
            <p className="text-xs text-slate-500 mt-1">USD</p>
          </Card>

          {/* USD Net Amount */}
          <Card className="p-6 border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleCopy(result.usdNetAmount.toString(), 2)}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">美金匯出淨額</h3>
              {copiedIndex === 2 ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <p className="text-2xl font-bold text-slate-900 font-mono">
              {formatCurrency(result.usdNetAmount)}
            </p>
            <p className="text-xs text-slate-500 mt-1">USD</p>
            <p className="text-xs text-slate-400 mt-2">= ({formatCurrency(result.audNetAmount)} - {formatCurrency(result.usdFeeAud)}) × {formatRate(input.audToUsdRate)}</p>
          </Card>
        </div>

        {/* Best Option */}
        {result.bestBank && (
          <Card className="mb-8 p-8 border-emerald-200 shadow-md bg-gradient-to-r from-emerald-50 to-emerald-100">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-2xl font-bold text-emerald-900">最優方案</h2>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-emerald-700 font-medium">銀行</p>
                    <p className="text-lg font-semibold text-emerald-900">{result.bestBank.bankName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-emerald-700 font-medium">兌換幣別</p>
                    <p className="text-lg font-semibold text-emerald-900">澳幣 (AUD)</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-emerald-700 font-medium mb-1">換得台幣總額</p>
                <p className="text-4xl font-bold text-emerald-900 font-mono">
                  NT${formatCurrency(result.bestBank.audToTwdAmount)}
                </p>
                <p className="text-xs text-emerald-600 mt-2">= ({formatCurrency(result.audNetAmount)}) × {formatRate(result.bestBank.audToTwdRate)}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Bank Comparison Table */}
        <Card className="mb-8 p-6 border-slate-200 shadow-sm overflow-x-auto">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">銀行比較</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-300">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                    銀行
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                    美金匯率
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                    澳幣匯率
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
                      NT${formatCurrency(bank.usdToTwdAmount)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-slate-700 font-mono">
                      NT${formatCurrency(bank.audToTwdAmount)}
                    </td>
                    <td className={`px-4 py-3 text-right text-sm font-mono ${
                      bank.difference > 0 ? "text-red-600" : "text-emerald-600"
                    }`}>
                      {bank.difference > 0 ? (
                        <span className="flex items-center justify-end gap-1">
                          <TrendingDown className="w-3 h-3" />
                          -NT${formatCurrency(Math.abs(bank.difference))}
                        </span>
                      ) : (
                        <span className="flex items-center justify-end gap-1">
                          <TrendingUp className="w-3 h-3" />
                          +NT${formatCurrency(Math.abs(bank.difference))}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Rate Editor Toggle - Bottom */}
        <div className="mt-8">
          <Button
            onClick={() => setShowRateEditor(!showRateEditor)}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            {showRateEditor ? "隱藏" : "更新"}匯率
            {showRateEditor ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          {lastUpdateTime && (
            <p className="text-sm text-slate-600 mt-3 text-center">
              最後更新時間：<span className="font-semibold">{lastUpdateTime}</span>
            </p>
          )}

          {/* Rate Editor Panel */}
          {showRateEditor && (
            <Card className="mt-6 p-6 border-blue-200 shadow-md bg-blue-50">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">編輯銀行匯率</h2>
              <div className="space-y-4 mb-6">
                {editingBanks.map((bank, idx) => (
                  <div key={`bank-${idx}`}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-white rounded border border-slate-200">
                    <div>
                      <Label className="text-xs text-slate-600">銀行名稱</Label>
                      <Input
                        type="text"
                        value={bank.name}
                        onChange={(e) => handleEditBank(idx, "name", e.target.value)}
                        className="border-slate-300 mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-slate-600">美金買入匯率</Label>
                      <Input
                        type="number"
                        value={bank.usdToTwdRate}
                        onChange={(e) => handleEditBank(idx, "usdToTwdRate", e.target.value)}
                        className="border-slate-300 mt-1"
                        step="0.0001"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-slate-600">澳幣買入匯率</Label>
                      <Input
                        type="number"
                        value={bank.audToTwdRate}
                        onChange={(e) => handleEditBank(idx, "audToTwdRate", e.target.value)}
                        className="border-slate-300 mt-1"
                        step="0.0001"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-3 p-4 bg-white rounded border border-slate-200 md:ml-0">
                    <div>
                      <Label className="text-xs text-slate-600">收款銀行解款手續費 (NTD)</Label>
                      <Input
                        type="number"
                        value={bank.receivingFeeNtd}
                        onChange={(e) => handleEditBank(idx, "receivingFeeNtd", e.target.value)}
                        className="border-slate-300 mt-1"
                        step="1"
                      />
                    </div>
                  </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleUpdateRates}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  保存匯率
                </Button>
                <Button
                  onClick={handleResetRates}
                  variant="outline"
                  className="flex-1"
                >
                  重置為預設值
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
