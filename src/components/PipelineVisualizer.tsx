import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  Layers, 
  Shield, 
  ArrowRight,
  Code2,
  Database,
  Search,
  Archive,
  Cpu,
  Zap,
  Sparkles,
  FileText
} from 'lucide-react';
import { PIPELINE_NODES } from '../data/mockDocuments';

export const PipelineVisualizer: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('s3-upload');
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeSimulationStep, setActiveSimulationStep] = useState<number>(-1);
  const [copiedPolicy, setCopiedPolicy] = useState(false);
  const [simLogs, setSimLogs] = useState<string[]>([]);

  const selectedNode = PIPELINE_NODES.find(n => n.id === selectedNodeId) || PIPELINE_NODES[0];

  const nodeIcon = (name: string) => {
    switch (name) {
      case 'Archive': return <Archive className="w-4 h-4" />;
      case 'Zap': return <Zap className="w-4 h-4" />;
      case 'Cpu': return <Cpu className="w-4 h-4" />;
      case 'FileSearch': return <FileText className="w-4 h-4" />;
      case 'Tag': return <Sparkles className="w-4 h-4" />;
      case 'Database': return <Database className="w-4 h-4" />;
      case 'Search': return <Search className="w-4 h-4" />;
      default: return <Layers className="w-4 h-4" />;
    }
  };

  const handleStartSimulation = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimLogs([]);

    const log = (msg: string) => {
      const ts = new Date().toISOString().substring(11, 19);
      setSimLogs(prev => [...prev, `[${ts}] ${msg}`]);
    };

    log('Triggered execution trace via S3 PutObject...');

    for (let i = 0; i < PIPELINE_NODES.length; i++) {
      setActiveSimulationStep(i);
      const node = PIPELINE_NODES[i];
      setSelectedNodeId(node.id);
      log(`Node [${node.awsService}]: '${node.name}' executed (${node.latencyAvgMs} ms)`);
      await new Promise(resolve => setTimeout(resolve, 400));
    }

    log('Trace execution finished. Data persisted to DynamoDB and OpenSearch cluster.');
    setIsSimulating(false);
    setActiveSimulationStep(-1);
  };

  const handleCopyPolicy = () => {
    navigator.clipboard.writeText(selectedNode.iamPolicy);
    setCopiedPolicy(true);
    setTimeout(() => setCopiedPolicy(false), 2000);
  };

  return (
    <div className="space-y-4">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-lg border border-slate-800">
        <div>
          <h2 className="text-sm font-semibold text-white">AWS Serverless Document Pipeline</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Architecture topology from browser presigned PUT to Textract OCR extraction and OpenSearch index.
          </p>
        </div>

        <button
          onClick={handleStartSimulation}
          disabled={isSimulating}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            isSimulating
              ? 'bg-slate-800 text-slate-400 cursor-wait'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          {isSimulating ? (
            <>
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
              <span>Tracing ({activeSimulationStep + 1}/{PIPELINE_NODES.length})...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>Simulate Pipeline Trace</span>
            </>
          )}
        </button>
      </div>

      {/* Architecture Track */}
      <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 overflow-x-auto">
        <div className="min-w-[840px]">
          
          <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
            <span className="text-[11px] font-medium text-slate-400">
              Pipeline Stages (Select stage to view IAM policy, specifications & contract)
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              Region: us-east-1
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 relative py-2">
            {PIPELINE_NODES.map((node, index) => {
              const isSelected = selectedNodeId === node.id;
              const isStepActive = activeSimulationStep === index;

              return (
                <div key={node.id} className="relative flex flex-col items-center">
                  
                  {/* Arrow to next node */}
                  {index < PIPELINE_NODES.length - 1 && (
                    <div className="absolute top-7 left-[65%] w-full flex items-center z-0 pointer-events-none">
                      <div className="h-px flex-1 bg-slate-800" />
                      <ArrowRight className="w-3 h-3 -ml-1 text-slate-600" />
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`relative z-10 w-full rounded-lg p-3 flex flex-col items-center text-center transition-colors border ${
                      isSelected 
                        ? 'bg-slate-800 border-blue-500 text-white' 
                        : isStepActive
                        ? 'bg-slate-800 border-amber-500 text-white'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 mb-2">
                      {nodeIcon(node.iconName)}
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 block truncate max-w-full">
                      {node.awsService.split(' ')[0]}
                    </span>
                    <span className="text-xs font-semibold block mt-0.5 truncate max-w-full">
                      {node.name}
                    </span>

                    <span className="text-[10px] font-mono text-slate-400 mt-2 tabular-nums">
                      ~{node.latencyAvgMs} ms
                    </span>
                  </button>

                  <span className="text-[10px] text-slate-400 mt-1.5 font-mono">
                    Step {index + 1}
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Node Inspector Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left 7 Cols: IAM Policy & Architecture Details */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-lg p-4 space-y-4">
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">{selectedNode.name}</h3>
                <span className="text-xs font-mono text-slate-400">
                  [{selectedNode.awsService}]
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{selectedNode.role}</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Avg Latency</span>
              <span className="text-xs font-mono tabular-nums text-slate-200">{selectedNode.latencyAvgMs} ms</span>
            </div>
          </div>

          {/* Operational Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950 p-3 rounded border border-slate-800 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block">Daily Invocations</span>
              <span className="font-mono tabular-nums text-slate-200 mt-0.5 block">{selectedNode.metrics.invocations}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">P95 Latency</span>
              <span className="font-mono tabular-nums text-slate-200 mt-0.5 block">{selectedNode.metrics.p95Latency}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Error Rate</span>
              <span className="font-mono tabular-nums text-slate-200 mt-0.5 block">{selectedNode.metrics.errorRate}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Throughput</span>
              <span className="font-mono tabular-nums text-slate-200 mt-0.5 block">{selectedNode.metrics.throughput}</span>
            </div>
          </div>

          {/* IAM Policy */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span>AWS IAM Role: {selectedNode.iamRoleName}</span>
              </span>
              <button
                onClick={handleCopyPolicy}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedPolicy ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPolicy ? 'Copied' : 'Copy Policy'}</span>
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-48 select-text">
              <pre>{selectedNode.iamPolicy}</pre>
            </div>
          </div>

        </div>

        {/* Right 5 Cols: Sample Payload & Simulation Log */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300">
                Payload Contract (Event / Record Schema)
              </span>
              <span className="text-[10px] font-mono text-slate-500">JSON</span>
            </div>

            <div className="bg-slate-950 p-3 rounded border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-48 select-text">
              <pre>{JSON.stringify(selectedNode.samplePayload, null, 2)}</pre>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 space-y-1.5">
            <span className="text-xs font-medium text-slate-300 block">
              Trace Execution Output
            </span>

            <div className="bg-black/90 p-2.5 rounded border border-slate-800 font-mono text-[10px] text-slate-300 max-h-36 overflow-y-auto space-y-0.5 select-text">
              {simLogs.length === 0 ? (
                <div className="text-slate-500 py-1">
                  Click "Simulate Pipeline Trace" to execute a walkthrough of all pipeline stages.
                </div>
              ) : (
                simLogs.map((l, i) => (
                  <div key={i}>
                    <span className="text-slate-400">{l.slice(0, 10)}</span>
                    <span className="text-slate-200">{l.slice(10)}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
