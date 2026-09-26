import React, { useState } from 'react';
import { ClassDesign, ClassType, Visibility, Problem } from '../types/index.js';
import { getProblemConfig } from '../config/problemConfigs.js';
import {
  Plus,
  Trash2,
  Tag,
  Wrench,
  FileCode,
  Edit2,
  X,
  AlertCircle,
} from 'lucide-react';

interface ClassEditorProps {
  classes: ClassDesign[];
  onChange: (classes: ClassDesign[]) => void;
  problem?: Problem;
}

export const ClassEditor: React.FC<ClassEditorProps> = ({ classes, onChange, problem }) => {
  const problemConfig = getProblemConfig(problem);
  const primaryExample = problemConfig.classExamples[0] || {
    name: 'Class',
    responsibility: 'Coordinates operations and manages domain state.',
    attributes: ['id : String'],
    methods: ['execute() : void'],
  };

  // Find matching class example for the current class being edited (if learner named it like a core concept)
  const getExampleForClass = (className: string) => {
    const clean = className.trim().toLowerCase();
    return problemConfig.classExamples.find(e => e.name.toLowerCase() === clean);
  };

  // Inline attribute adding/editing state
  const [attrForms, setAttrForms] = useState<{
    [classId: string]: {
      name: string;
      type: string;
      visibility: Visibility;
      editIndex?: number;
      error?: string;
    } | null;
  }>({});

  // Inline method adding/editing state
  const [methodForms, setMethodForms] = useState<{
    [classId: string]: {
      name: string;
      returnType: string;
      parameters: string;
      visibility: Visibility;
      editIndex?: number;
      error?: string;
    } | null;
  }>({});

  const addClass = () => {
    const newClass: ClassDesign = {
      id: `cls_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: '',
      type: 'Class',
      responsibility: '',
      attributes: [],
      methods: [],
    };
    onChange([...classes, newClass]);
  };

  const removeClass = (id: string) => {
    onChange(classes.filter(c => c.id !== id));
  };

  const updateClass = (id: string, updates: Partial<ClassDesign>) => {
    onChange(classes.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  // Attribute handlers
  const openAddAttribute = (classId: string) => {
    setAttrForms(prev => ({
      ...prev,
      [classId]: {
        name: '',
        type: 'String',
        visibility: 'private',
        error: undefined,
      },
    }));
  };

  const openEditAttribute = (classId: string, index: number, raw: string) => {
    const parts = raw.trim().split(' ');
    let visibility: Visibility = 'private';
    let type = 'String';
    let name = raw;

    if (parts.length >= 3 && ['public', 'private', 'protected'].includes(parts[0])) {
      visibility = parts[0] as Visibility;
      name = parts[parts.length - 1];
      type = parts.slice(1, parts.length - 1).join(' ');
    } else if (parts.length === 2) {
      type = parts[0];
      name = parts[1];
    }

    setAttrForms(prev => ({
      ...prev,
      [classId]: {
        name,
        type,
        visibility,
        editIndex: index,
        error: undefined,
      },
    }));
  };

  const saveAttribute = (classId: string) => {
    const form = attrForms[classId];
    if (!form) return;

    const name = form.name.trim();
    const type = form.type.trim();
    const visibility = form.visibility;

    if (!name) {
      setAttrForms(prev => ({
        ...prev,
        [classId]: { ...prev[classId]!, error: 'Attribute Name is required.' },
      }));
      return;
    }
    if (!type) {
      setAttrForms(prev => ({
        ...prev,
        [classId]: { ...prev[classId]!, error: 'Attribute Type is required.' },
      }));
      return;
    }
    if (!visibility) {
      setAttrForms(prev => ({
        ...prev,
        [classId]: { ...prev[classId]!, error: 'Visibility is required.' },
      }));
      return;
    }

    const target = classes.find(c => c.id === classId);
    if (!target) return;

    const formatted = `${visibility} ${type} ${name}`;
    const nextAttrs = [...target.attributes];

    if (typeof form.editIndex === 'number' && form.editIndex >= 0) {
      nextAttrs[form.editIndex] = formatted;
    } else {
      nextAttrs.push(formatted);
    }

    updateClass(classId, { attributes: nextAttrs });
    setAttrForms(prev => ({ ...prev, [classId]: null }));
  };

  const removeAttribute = (classId: string, index: number) => {
    const target = classes.find(c => c.id === classId);
    if (!target) return;
    const nextAttrs = [...target.attributes];
    nextAttrs.splice(index, 1);
    updateClass(classId, { attributes: nextAttrs });
  };

  // Method handlers
  const openAddMethod = (classId: string) => {
    setMethodForms(prev => ({
      ...prev,
      [classId]: {
        name: '',
        returnType: 'void',
        parameters: '',
        visibility: 'public',
        error: undefined,
      },
    }));
  };

  const openEditMethod = (classId: string, index: number, raw: string) => {
    const match = raw.match(/^(public|private|protected)?\s*([^\s]+)\s+([a-zA-Z0-9_]+)\((.*)\)$/);
    let visibility: Visibility = 'public';
    let returnType = 'void';
    let name = raw;
    let parameters = '';

    if (match) {
      visibility = (match[1] as Visibility) || 'public';
      returnType = match[2] || 'void';
      name = match[3];
      parameters = match[4] || '';
    }

    setMethodForms(prev => ({
      ...prev,
      [classId]: {
        name,
        returnType,
        parameters,
        visibility,
        editIndex: index,
        error: undefined,
      },
    }));
  };

  const saveMethod = (classId: string) => {
    const form = methodForms[classId];
    if (!form) return;

    const name = form.name.replace(/\(.*?\)/g, '').trim();
    const returnType = form.returnType.trim();
    const visibility = form.visibility;
    const parameters = form.parameters !== undefined ? form.parameters.trim() : '';

    if (!name) {
      setMethodForms(prev => ({
        ...prev,
        [classId]: { ...prev[classId]!, error: 'Method Name is required.' },
      }));
      return;
    }
    if (!returnType) {
      setMethodForms(prev => ({
        ...prev,
        [classId]: { ...prev[classId]!, error: 'Return Type is required.' },
      }));
      return;
    }
    if (!visibility) {
      setMethodForms(prev => ({
        ...prev,
        [classId]: { ...prev[classId]!, error: 'Visibility is required.' },
      }));
      return;
    }

    const target = classes.find(c => c.id === classId);
    if (!target) return;

    const formatted = `${visibility} ${returnType} ${name}(${parameters})`;
    const nextMethods = [...target.methods];

    if (typeof form.editIndex === 'number' && form.editIndex >= 0) {
      nextMethods[form.editIndex] = formatted;
    } else {
      nextMethods.push(formatted);
    }

    updateClass(classId, { methods: nextMethods });
    setMethodForms(prev => ({ ...prev, [classId]: null }));
  };

  const removeMethod = (classId: string, index: number) => {
    const target = classes.find(c => c.id === classId);
    if (!target) return;
    const nextMethods = [...target.methods];
    nextMethods.splice(index, 1);
    updateClass(classId, { methods: nextMethods });
  };

  const classTypeOptions: ClassType[] = ['Class', 'Interface', 'Abstract Class'];

  return (
    <div className="space-y-6">
      {/* Header: Class Definitions (count) and Add Class button */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2">
            <FileCode className="w-4 h-4 text-indigo-600" />
            Class Definitions ({classes.length})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Define your object-oriented domain model with types, responsibilities, attributes, and methods.
          </p>
        </div>
        <button
          type="button"
          onClick={addClass}
          className="btn-primary-glow px-3.5 py-1.5 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Class</span>
        </button>
      </div>

      {/* Empty State */}
      {classes.length === 0 ? (
        <div className="saas-card rounded-2xl p-10 text-center border-dashed border-slate-300 bg-slate-50/50 space-y-3">
          <FileCode className="w-10 h-10 text-slate-400 mx-auto" />
          <div className="space-y-1">
            <p className="text-sm text-slate-800 font-semibold">No classes defined yet.</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Start by creating your first class.
            </p>
          </div>
          <button
            type="button"
            onClick={addClass}
            className="btn-primary-glow px-4 py-2 rounded-xl text-white text-xs font-medium inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Class</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {classes.map((cls, idx) => {
            const classExample = getExampleForClass(cls.name) || primaryExample;
            const dynamicRespPlaceholder = classExample.responsibility || primaryExample.responsibility;
            const dynamicAttrPlaceholder = classExample.attributes[0] || 'e.g. id : String';
            const dynamicMethPlaceholder = classExample.methods[0] || 'e.g. execute() : void';

            return (
              <div
                key={cls.id}
                className="saas-card p-5 space-y-4 bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-2xs rounded-xl"
              >
                {/* Header: Class Type, Name & Action buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-1 rounded-md">
                      #{idx + 1}
                    </span>

                    {/* Class Name */}
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder={`e.g. ${problemConfig.classExamples[idx % problemConfig.classExamples.length]?.name || primaryExample.name}`}
                        value={cls.name}
                        onChange={e => updateClass(cls.id, { name: e.target.value })}
                        className="w-full saas-input px-3 py-1.5 text-sm font-mono font-bold text-slate-900 placeholder:text-slate-400"
                      />
                    </div>

                    {/* Class Type dropdown */}
                    <div className="w-36">
                      <select
                        value={cls.type || 'Class'}
                        onChange={e => updateClass(cls.id, { type: e.target.value as ClassType })}
                        className="w-full saas-input px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50"
                      >
                        {classTypeOptions.map(t => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => removeClass(cls.id)}
                      title="Delete Class"
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="font-sans">Delete</span>
                    </button>
                  </div>
                </div>

                {/* Responsibility */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Responsibility:
                  </label>
                  <textarea
                    rows={2}
                    placeholder={`e.g. ${dynamicRespPlaceholder}`}
                    value={cls.responsibility}
                    onChange={e => updateClass(cls.id, { responsibility: e.target.value })}
                    className="w-full saas-input px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400"
                  />
                </div>

                {/* Attributes & Methods 2-column layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {/* ATTRIBUTES */}
                  <div className="space-y-2 rounded-xl bg-slate-50/80 p-3.5 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-indigo-700 flex items-center gap-1.5">
                        <Tag className="w-3 h-3" />
                        Attributes ({cls.attributes.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => openAddAttribute(cls.id)}
                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 px-2 py-0.5 rounded hover:bg-indigo-50 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>+ Add Attribute</span>
                      </button>
                    </div>

                    {/* Attribute Form (Add / Edit) */}
                    {attrForms[cls.id] && (
                      <div className="p-3 bg-white rounded-lg border border-indigo-200 space-y-2.5 shadow-2xs">
                        <div className="flex items-center justify-between text-[11px] font-bold text-indigo-900">
                          <span>{typeof attrForms[cls.id]?.editIndex === 'number' ? 'Edit Attribute' : 'New Attribute'}</span>
                          <button
                            type="button"
                            onClick={() => setAttrForms(prev => ({ ...prev, [cls.id]: null }))}
                            className="text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {attrForms[cls.id]?.error && (
                          <div className="text-[11px] text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded flex items-center gap-1.5">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>{attrForms[cls.id]?.error}</span>
                          </div>
                        )}

                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-[10px] text-slate-500 font-medium">
                              Visibility <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={attrForms[cls.id]?.visibility}
                              onChange={e =>
                                setAttrForms(prev => ({
                                  ...prev,
                                  [cls.id]: {
                                    ...prev[cls.id]!,
                                    visibility: e.target.value as Visibility,
                                    error: undefined,
                                  },
                                }))
                              }
                              className="w-full text-xs font-mono border border-slate-200 rounded px-2 py-1 bg-slate-50"
                            >
                              <option value="private">private</option>
                              <option value="public">public</option>
                              <option value="protected">protected</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 font-medium">
                              Type <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder={dynamicAttrPlaceholder.includes(':') ? dynamicAttrPlaceholder.split(':')[1]?.trim() : 'e.g. String / int'}
                              value={attrForms[cls.id]?.type}
                              onChange={e =>
                                setAttrForms(prev => ({
                                  ...prev,
                                  [cls.id]: {
                                    ...prev[cls.id]!,
                                    type: e.target.value,
                                    error: undefined,
                                  },
                                }))
                              }
                              className="w-full text-xs font-mono border border-slate-200 rounded px-2 py-1"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 font-medium">
                              Attribute Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder={dynamicAttrPlaceholder.includes(':') ? dynamicAttrPlaceholder.split(':')[0]?.trim() : 'e.g. name'}
                              value={attrForms[cls.id]?.name}
                              onChange={e =>
                                setAttrForms(prev => ({
                                  ...prev,
                                  [cls.id]: {
                                    ...prev[cls.id]!,
                                    name: e.target.value,
                                    error: undefined,
                                  },
                                }))
                              }
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  saveAttribute(cls.id);
                                }
                              }}
                              className="w-full text-xs font-mono border border-slate-200 rounded px-2 py-1"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setAttrForms(prev => ({ ...prev, [cls.id]: null }))}
                            className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => saveAttribute(cls.id)}
                            className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium cursor-pointer"
                          >
                            Save Attribute
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Attributes list */}
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {cls.attributes.length === 0 ? (
                        <p className="text-[11px] text-slate-400 italic py-1">No attributes defined yet.</p>
                      ) : (
                        cls.attributes.map((attr, attrIdx) => (
                          <div
                            key={attrIdx}
                            className="group flex items-center justify-between text-xs font-mono bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-800 shadow-2xs hover:border-slate-300 transition-colors"
                          >
                            <span className="truncate">{attr}</span>
                            <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100">
                              <button
                                type="button"
                                onClick={() => openEditAttribute(cls.id, attrIdx, attr)}
                                className="text-slate-400 hover:text-indigo-600 p-0.5 cursor-pointer"
                                title="Edit attribute"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeAttribute(cls.id, attrIdx)}
                                className="text-slate-400 hover:text-red-500 p-0.5 cursor-pointer"
                                title="Delete attribute"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* METHODS */}
                  <div className="space-y-2 rounded-xl bg-slate-50/80 p-3.5 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-emerald-700 flex items-center gap-1.5">
                        <Wrench className="w-3 h-3" />
                        Methods ({cls.methods.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => openAddMethod(cls.id)}
                        className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-800 px-2 py-0.5 rounded hover:bg-emerald-50 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>+ Add Method</span>
                      </button>
                    </div>

                    {/* Method Form (Add / Edit) */}
                    {methodForms[cls.id] && (
                      <div className="p-3 bg-white rounded-lg border border-emerald-200 space-y-2.5 shadow-2xs">
                        <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900">
                          <span>{typeof methodForms[cls.id]?.editIndex === 'number' ? 'Edit Method' : 'New Method'}</span>
                          <button
                            type="button"
                            onClick={() => setMethodForms(prev => ({ ...prev, [cls.id]: null }))}
                            className="text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {methodForms[cls.id]?.error && (
                          <div className="text-[11px] text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded flex items-center gap-1.5">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>{methodForms[cls.id]?.error}</span>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-slate-500 font-medium">
                              Visibility <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={methodForms[cls.id]?.visibility}
                              onChange={e =>
                                setMethodForms(prev => ({
                                  ...prev,
                                  [cls.id]: {
                                    ...prev[cls.id]!,
                                    visibility: e.target.value as Visibility,
                                    error: undefined,
                                  },
                                }))
                              }
                              className="w-full text-xs font-mono border border-slate-200 rounded px-2 py-1 bg-slate-50"
                            >
                              <option value="public">public</option>
                              <option value="private">private</option>
                              <option value="protected">protected</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 font-medium">
                              Return Type <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder={dynamicMethPlaceholder.includes(') :') ? dynamicMethPlaceholder.split(') :')[1]?.trim() : 'e.g. void'}
                              value={methodForms[cls.id]?.returnType}
                              onChange={e =>
                                setMethodForms(prev => ({
                                  ...prev,
                                  [cls.id]: {
                                    ...prev[cls.id]!,
                                    returnType: e.target.value,
                                    error: undefined,
                                  },
                                }))
                              }
                              className="w-full text-xs font-mono border border-slate-200 rounded px-2 py-1"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 font-medium">
                              Method Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder={dynamicMethPlaceholder.includes('(') ? dynamicMethPlaceholder.split('(')[0]?.trim() : 'e.g. execute'}
                              value={methodForms[cls.id]?.name}
                              onChange={e =>
                                setMethodForms(prev => ({
                                  ...prev,
                                  [cls.id]: {
                                    ...prev[cls.id]!,
                                    name: e.target.value,
                                    error: undefined,
                                  },
                                }))
                              }
                              className="w-full text-xs font-mono border border-slate-200 rounded px-2 py-1"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 font-medium">
                              Parameters <span className="text-slate-400 font-normal">(optional)</span>
                            </label>
                            <input
                              type="text"
                              placeholder={dynamicMethPlaceholder.includes('(') && dynamicMethPlaceholder.includes(')') ? dynamicMethPlaceholder.slice(dynamicMethPlaceholder.indexOf('(') + 1, dynamicMethPlaceholder.indexOf(')')) : 'e.g. Vehicle vehicle'}
                              value={methodForms[cls.id]?.parameters}
                              onChange={e =>
                                setMethodForms(prev => ({
                                  ...prev,
                                  [cls.id]: {
                                    ...prev[cls.id]!,
                                    parameters: e.target.value,
                                    error: undefined,
                                  },
                                }))
                              }
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  saveMethod(cls.id);
                                }
                              }}
                              className="w-full text-xs font-mono border border-slate-200 rounded px-2 py-1"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setMethodForms(prev => ({ ...prev, [cls.id]: null }))}
                            className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => saveMethod(cls.id)}
                            className="px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium cursor-pointer"
                          >
                            Save Method
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Methods list */}
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {cls.methods.length === 0 ? (
                        <p className="text-[11px] text-slate-400 italic py-1">No methods defined yet.</p>
                      ) : (
                        cls.methods.map((meth, methIdx) => (
                          <div
                            key={methIdx}
                            className="group flex items-center justify-between text-xs font-mono bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-800 shadow-2xs hover:border-slate-300 transition-colors"
                          >
                            <span className="truncate">{meth}</span>
                            <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100">
                              <button
                                type="button"
                                onClick={() => openEditMethod(cls.id, methIdx, meth)}
                                className="text-slate-400 hover:text-emerald-600 p-0.5 cursor-pointer"
                                title="Edit method"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeMethod(cls.id, methIdx)}
                                className="text-slate-400 hover:text-red-500 p-0.5 cursor-pointer"
                                title="Delete method"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
