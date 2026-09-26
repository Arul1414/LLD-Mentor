import React from 'react';
import { ClassDesign, RelationshipDesign } from '../types/index.js';
import { Network, ArrowRight, Box } from 'lucide-react';

interface DiagramPreviewProps {
  classes: ClassDesign[];
  relationships: RelationshipDesign[];
}

export const DiagramPreview: React.FC<DiagramPreviewProps> = ({ classes, relationships }) => {
  if (classes.length === 0) {
    return (
      <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
        <Box className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-xs text-slate-500 font-medium">Add classes and relationships to see your diagram preview</p>
      </div>
    );
  }

  // Class Type color badge
  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'Interface':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Abstract Class':
        return 'bg-violet-50 text-violet-700 border-violet-200';
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  const getRelationshipColor = (relType: string) => {
    switch (relType?.toUpperCase()) {
      case 'COMPOSITION':
        return {
          badge: 'bg-purple-50 text-purple-700 border-purple-200',
          arrow: 'text-purple-600',
          line: 'border-purple-300',
        };
      case 'AGGREGATION':
        return {
          badge: 'bg-blue-50 text-blue-700 border-blue-200',
          arrow: 'text-blue-600',
          line: 'border-blue-300',
        };
      case 'INHERITANCE':
        return {
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
          arrow: 'text-amber-600',
          line: 'border-amber-300',
        };
      case 'IMPLEMENTATION':
        return {
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          arrow: 'text-emerald-600',
          line: 'border-emerald-300',
        };
      case 'DEPENDENCY':
        return {
          badge: 'bg-rose-50 text-rose-700 border-rose-200',
          arrow: 'text-rose-600',
          line: 'border-rose-300',
        };
      default:
        return {
          badge: 'bg-cyan-50 text-cyan-700 border-cyan-200',
          arrow: 'text-cyan-600',
          line: 'border-cyan-300',
        };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-cyan-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Lightweight Visual Relationship Preview
          </h4>
        </div>
        <span className="text-[11px] font-mono text-slate-500">
          {classes.length} Nodes • {relationships.length} Connectors
        </span>
      </div>

      {relationships.length === 0 ? (
        <div className="p-4 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50 space-y-1">
          <p className="text-xs text-slate-600 font-medium">Classes are defined, but no relationships connected yet.</p>
          <p className="text-[11px] text-slate-400">
            Connect classes above (e.g. ParkingLot ➔ contains ➔ ParkingFloor) to view the graph.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Visual flow graph list */}
          <div className="grid grid-cols-1 gap-2.5">
            {relationships.map((rel, idx) => {
              const colors = getRelationshipColor(rel.relationship);
              const sourceClassObj = classes.find(c => c.name.toLowerCase() === rel.sourceClass?.toLowerCase());
              const targetClassObj = classes.find(c => c.name.toLowerCase() === rel.targetClass?.toLowerCase());

              return (
                <div
                  key={rel.id || idx}
                  className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2 flex-wrap flex-1">
                    {/* Source Node */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 shadow-2xs">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {rel.sourceClass || 'Source'}
                      </span>
                      {sourceClassObj?.type && sourceClassObj.type !== 'Class' && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded border font-medium ${getTypeColor(sourceClassObj.type)}`}>
                          {sourceClassObj.type === 'Interface' ? '«interface»' : '«abstract»'}
                        </span>
                      )}
                    </div>

                    {/* Arrow with Relationship type */}
                    <div className="flex items-center gap-1.5 px-2">
                      <div className={`h-0.5 w-4 sm:w-6 ${colors.line} border-t-2`} />
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${colors.badge}`}>
                        {rel.relationship}
                      </span>
                      <ArrowRight className={`w-3.5 h-3.5 ${colors.arrow}`} />
                    </div>

                    {/* Target Node */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 shadow-2xs">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {rel.targetClass || 'Target'}
                      </span>
                      {targetClassObj?.type && targetClassObj.type !== 'Class' && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded border font-medium ${getTypeColor(targetClassObj.type)}`}>
                          {targetClassObj.type === 'Interface' ? '«interface»' : '«abstract»'}
                        </span>
                      )}
                    </div>
                  </div>

                  {rel.reason && (
                    <div className="text-[11px] text-slate-500 font-sans italic sm:max-w-xs truncate" title={rel.reason}>
                      "{rel.reason}"
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Class Nodes Summary Bar */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 mr-1">Nodes:</span>
            {classes.map(c => (
              <span
                key={c.id}
                className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700"
              >
                {c.name || 'Unnamed'}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
