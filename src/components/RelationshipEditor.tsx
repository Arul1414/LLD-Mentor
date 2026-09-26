import React, { useState } from 'react';
import { RelationshipDesign, ClassDesign, RelationshipType, Problem } from '../types/index.js';
import { getProblemConfig } from '../config/problemConfigs.js';
import { GitFork, Plus, Trash2, ArrowRight, Edit2, Check, HelpCircle } from 'lucide-react';
import { DiagramPreview } from './DiagramPreview.js';

interface RelationshipEditorProps {
  relationships: RelationshipDesign[];
  classes: ClassDesign[];
  onChange: (relationships: RelationshipDesign[]) => void;
  problem?: Problem;
}

const RELATIONSHIP_TYPES: { value: RelationshipType; label: string; desc: string }[] = [
  { value: 'ASSOCIATION', label: 'Association (uses-a)', desc: 'General peer relationship between components' },
  { value: 'AGGREGATION', label: 'Aggregation (has-a, loose)', desc: 'Container reference; part can exist independently' },
  { value: 'COMPOSITION', label: 'Composition (part-of, strict)', desc: 'Whole owns lifecycle of part; part dies if whole dies' },
  { value: 'INHERITANCE', label: 'Inheritance (is-a)', desc: 'Specialization of an existing base class' },
  { value: 'IMPLEMENTATION', label: 'Implementation (realizes)', desc: 'Implements interface/contract abstraction' },
  { value: 'DEPENDENCY', label: 'Dependency (transient)', desc: 'Used temporarily as method parameter or return value' },
];

export const RelationshipEditor: React.FC<RelationshipEditorProps> = ({
  relationships,
  classes,
  onChange,
  problem,
}) => {
  const problemConfig = getProblemConfig(problem);
  const classNames = classes.map(c => c.name).filter(Boolean);

  // Editing state for existing relationships
  const [editingId, setEditingId] = useState<string | null>(null);

  const addRelationship = () => {
    // Default to problem example if matching classes exist, else first two classes
    const defaultSource = classNames[0] || '';
    const defaultTarget = classNames[1] || classNames[0] || '';

    const newRel: RelationshipDesign = {
      id: `rel_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sourceClass: defaultSource,
      targetClass: defaultTarget,
      relationship: 'COMPOSITION',
      reason: '',
    };
    onChange([...relationships, newRel]);
    setEditingId(newRel.id);
  };

  const removeRelationship = (id: string) => {
    onChange(relationships.filter(r => r.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const updateRelationship = (id: string, updates: Partial<RelationshipDesign>) => {
    onChange(relationships.map(r => (r.id === id ? { ...r, ...updates } : r)));
  };

  // Find contextual example reason if user pairs classes similar to domain
  const getContextualPlaceholder = (src: string, tgt: string) => {
    const s = src.toLowerCase().trim();
    const t = tgt.toLowerCase().trim();
    const matched = problemConfig.relationshipExamples.find(
      r => r.sourceClass.toLowerCase() === s && r.targetClass.toLowerCase() === t
    );
    if (matched) {
      return `e.g. ${matched.reason}`;
    }
    const sample = problemConfig.relationshipExamples[0];
    return `e.g. ${sample.sourceClass} manages and delegates to ${sample.targetClass}`;
  };

  return (
    <div className="space-y-6">
      {/* Visual Relationship Preview at top of tab */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
        <DiagramPreview classes={classes} relationships={relationships} />
      </div>

      <div className="flex items-center justify-between pb-1">
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2">
            <GitFork className="w-4 h-4 text-cyan-600" />
            Class Relationships ({relationships.length})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Model how your classes collaborate, transfer ownership, and maintain abstractions.
          </p>
        </div>
        <button
          type="button"
          onClick={addRelationship}
          disabled={classes.length < 1}
          title={classes.length < 1 ? 'Define classes first' : 'Add relationship'}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
            classes.length < 1
              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              : 'btn-primary-glow text-white cursor-pointer'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Relationship</span>
        </button>
      </div>

      {relationships.length === 0 ? (
        <div className="saas-card rounded-2xl p-10 text-center border-dashed border-slate-300 bg-slate-50/50 space-y-3">
          <GitFork className="w-10 h-10 text-slate-400 mx-auto" />
          <div className="space-y-1">
            <p className="text-sm text-slate-800 font-semibold">No relationships defined yet.</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Explicit relationships demonstrate Coupling &amp; Cohesion and Encapsulation design.
            </p>
          </div>
          {classes.length >= 1 ? (
            <button
              type="button"
              onClick={addRelationship}
              className="btn-primary-glow px-4 py-2 rounded-xl text-white text-xs font-medium inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Connect Classes</span>
            </button>
          ) : (
            <p className="text-xs font-mono text-indigo-600 font-semibold">
              Tip: Define classes in the Classes tab first.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {relationships.map(rel => {
            const isEditing = editingId === rel.id;
            const placeholder = getContextualPlaceholder(rel.sourceClass, rel.targetClass);

            return (
              <div
                key={rel.id}
                className="saas-card p-4 sm:p-5 hover:border-slate-300 transition-all space-y-3 bg-white border border-slate-200 shadow-2xs rounded-xl"
              >
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* From Class */}
                  <div className="flex-1">
                    <label className="block text-[10px] uppercase font-mono font-bold text-slate-600 mb-1">
                      From Class
                    </label>
                    {classNames.length > 0 ? (
                      <select
                        value={rel.sourceClass}
                        onChange={e => updateRelationship(rel.id, { sourceClass: e.target.value })}
                        className="w-full saas-input px-3 py-1.5 text-xs font-mono font-bold text-slate-900 bg-slate-50"
                      >
                        <option value="">Select Class...</option>
                        {classNames.map(cn => (
                          <option key={cn} value={cn}>
                            {cn}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder="e.g. SourceClass"
                        value={rel.sourceClass}
                        onChange={e => updateRelationship(rel.id, { sourceClass: e.target.value })}
                        className="w-full saas-input px-3 py-1.5 text-xs font-mono text-slate-900"
                      />
                    )}
                  </div>

                  <div className="flex items-center justify-center pt-4 text-slate-400">
                    <ArrowRight className="w-4 h-4 hidden sm:block text-slate-400" />
                  </div>

                  {/* Relationship Type */}
                  <div className="flex-1">
                    <label className="block text-[10px] uppercase font-mono font-bold text-slate-600 mb-1">
                      Relationship Type
                    </label>
                    <select
                      value={rel.relationship}
                      onChange={e => updateRelationship(rel.id, { relationship: e.target.value as RelationshipType })}
                      className="w-full saas-input px-3 py-1.5 text-xs font-mono font-bold text-cyan-800 bg-cyan-50/60 border border-cyan-200"
                    >
                      {RELATIONSHIP_TYPES.map(rt => (
                        <option key={rt.value} value={rt.value}>
                          {rt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-center pt-4 text-slate-400">
                    <ArrowRight className="w-4 h-4 hidden sm:block text-slate-400" />
                  </div>

                  {/* To Class */}
                  <div className="flex-1">
                    <label className="block text-[10px] uppercase font-mono font-bold text-slate-600 mb-1">
                      To Class
                    </label>
                    {classNames.length > 0 ? (
                      <select
                        value={rel.targetClass}
                        onChange={e => updateRelationship(rel.id, { targetClass: e.target.value })}
                        className="w-full saas-input px-3 py-1.5 text-xs font-mono font-bold text-slate-900 bg-slate-50"
                      >
                        <option value="">Select Class...</option>
                        {classNames.map(cn => (
                          <option key={cn} value={cn}>
                            {cn}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder="e.g. TargetClass"
                        value={rel.targetClass}
                        onChange={e => updateRelationship(rel.id, { targetClass: e.target.value })}
                        className="w-full saas-input px-3 py-1.5 text-xs font-mono text-slate-900"
                      />
                    )}
                  </div>

                  {/* Actions: Done / Edit / Delete */}
                  <div className="flex items-end justify-end sm:pt-4 gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingId(isEditing ? null : rel.id)}
                      title={isEditing ? 'Collapse Details' : 'Edit Details'}
                      className="p-1.5 text-slate-400 hover:text-cyan-700 hover:bg-cyan-50 rounded-lg transition-colors cursor-pointer"
                    >
                      {isEditing ? <Check className="w-4 h-4 text-emerald-600" /> : <Edit2 className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeRelationship(rel.id)}
                      title="Delete Relationship"
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Architectural Reason / Meaning */}
                <div>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={rel.reason || ''}
                    onChange={e => updateRelationship(rel.id, { reason: e.target.value })}
                    className="w-full saas-input px-3 py-1.5 text-xs text-slate-700 placeholder:text-slate-400"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
