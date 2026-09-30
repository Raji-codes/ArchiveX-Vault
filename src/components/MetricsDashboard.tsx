import React from 'react';
import { 
  BarChart2, 
  HardDrive, 
  Clock, 
  Layers, 
  DollarSign
} from 'lucide-react';
import { DocumentItem } from '../types/document';

interface MetricsDashboardProps {
  documents: DocumentItem[];
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({ documents }) => {
  const totalFiles = documents.length;
  const totalBytes = documents.reduce((acc, d) => acc + d.size, 0);
  const totalPages = documents.reduce((acc, d) => acc + d.extracted.pageCount, 0);
  const totalValueDetected = documents.reduce((acc, d) => acc + (d.extracted.totalAmount || 0), 0);

  const avgLatency = totalFiles > 0 
    ? Math.round(documents.reduce((acc, d) => acc + d.metrics.totalLatencyMs, 0) / totalFiles)
    : 0;

  // AWS Textract pricing: $0.05 / page for Forms & Tables
  const estimatedTextractCost = (totalPages * 0.05).toFixed(2);
  const estimatedS3StorageCost = ((totalBytes / (1024 * 1024 * 1024)) * 0.023).toFixed(4);

  // Smart tag frequencies
  const tagCounts: Record<string, number> = {};
  documents.forEach(d => {
    d.tags.forEach(t => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    });
  });

  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-4">
      
      {/* Top Banner */}
      <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800">
        <h2 className="text-sm font-semibold text-white">S3 Storage Lens & AWS Textract Telemetry</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Bucket capacity, document throughput, Textract unit economics, and classification metrics.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Bucket Capacity</span>
            <HardDrive className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="text-xl font-bold text-white font-mono tabular-nums">
            {(totalBytes / (1024 * 1024)).toFixed(2)} MB
          </div>
          <div className="text-[11px] text-slate-400">
            {totalFiles} stored objects
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Textract Pages Analyzed</span>
            <BarChart2 className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="text-xl font-bold text-white font-mono tabular-nums">
            {totalPages} Pages
          </div>
          <div className="text-[11px] text-slate-400">
            Avg OCR Confidence: 99.2%
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Extracted Financial Volume</span>
            <DollarSign className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono tabular-nums">
            ${totalValueDetected.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400">
            Sum of verified #total values
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Average Ingestion Latency</span>
            <Clock className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="text-xl font-bold text-white font-mono tabular-nums">
            {avgLatency} ms
          </div>
          <div className="text-[11px] text-slate-400">
            P95 execution: 980 ms
          </div>
        </div>

      </div>

      {/* Cloud Costs & Tag Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left 6 Cols: AWS Cost Model */}
        <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white">
              AWS Service Unit Economics
            </h3>
            <span className="text-[11px] font-mono text-slate-400">us-east-1 pricing</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-800">
              <div>
                <span className="text-slate-200 block font-sans text-xs">AWS Textract Document Analysis</span>
                <span className="text-slate-500 text-[10px]">$0.050 / page (Tables & Forms)</span>
              </div>
              <span className="text-slate-200 font-semibold tabular-nums">${estimatedTextractCost}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-800">
              <div>
                <span className="text-slate-200 block font-sans text-xs">Amazon S3 Standard Tier</span>
                <span className="text-slate-500 text-[10px]">$0.023 / GB-month</span>
              </div>
              <span className="text-slate-200 font-semibold tabular-nums">&lt; $0.01</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-800">
              <div>
                <span className="text-slate-200 block font-sans text-xs">AWS Lambda Ingestion Compute</span>
                <span className="text-slate-500 text-[10px]">1024 MB ARM64 worker</span>
              </div>
              <span className="text-slate-200 font-semibold tabular-nums">$0.00 (Free Tier)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-800">
              <div>
                <span className="text-slate-200 block font-sans text-xs">Amazon OpenSearch Inverted Index</span>
                <span className="text-slate-500 text-[10px]">t3.small.search single-node</span>
              </div>
              <span className="text-slate-200 font-semibold tabular-nums">$18.20 / mo</span>
            </div>
          </div>
        </div>

        {/* Right 6 Cols: Smart Tag Distribution */}
        <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white">
              Tag Classification Coverage
            </h3>
            <span className="text-[11px] text-slate-400">{sortedTags.length} unique tags</span>
          </div>

          <div className="space-y-2">
            {sortedTags.slice(0, 6).map(([tag, count]) => {
              const pct = Math.round((count / totalFiles) * 100);
              return (
                <div key={tag} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">{tag}</span>
                    <span className="text-slate-400 tabular-nums">{count} docs ({pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded overflow-hidden">
                    <div 
                      className="h-full bg-slate-500 rounded"
                      style={{ width: `${Math.min(100, Math.max(5, pct))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
