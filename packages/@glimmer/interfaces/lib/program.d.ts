import { Option } from './core';
import { STDLib, ContainingMetadata, HandleResult } from './template';
import { StdlibOperand, CompileMode, Encoder, Macros, EncoderError } from './compile';
import { Op } from './vm-opcodes';
import { CompileTimeResolverDelegate } from './serialize';

export interface RuntimeOp {
  offset: number;
  type: number;
  op1: number;
  op2: number;
  op3: number;
  size: number;
  isMachine: 0 | 1;
}

export interface SerializedHeap {
  buffer: ArrayBuffer;
  table: number[];
  handle: number;
}

export interface OpcodeHeap {
  getbyaddr(address: number): number;
}

export interface CompileTimeHeap extends OpcodeHeap {
  push(name: Op, op1?: number, op2?: number, op3?: number): void;
  pushPlaceholder(valueFunc: () => HandleResult): void;
  pushStdlib(stdlib: StdlibOperand): void;
  patchStdlibs(stdlib: STDLib): void;
  malloc(): number;
  finishMalloc(handle: number, scopeSize: number): void;
  capture(stdlib: STDLib, offset?: number): SerializedHeap;

  // for debugging
  getaddr(handle: number): number;
  sizeof(handle: number): number;
  getbyaddr(address: number): number;
}

export interface RuntimeHeap extends OpcodeHeap {
  getaddr(handle: number): number;
  sizeof(handle: number): number;
  scopesizeof(handle: number): number;
}

export interface WholeProgramCompilationContext {
  // The offsets to stdlib functions
  readonly stdlib: STDLib;

  // Interned constants
  readonly constants: CompileTimeConstants;

  // The mechanism of resolving names to values at compile-time
  readonly resolverDelegate: CompileTimeResolverDelegate;

  // The heap that the program is serializing into
  readonly heap: CompileTimeHeap;

  // The mode: AOT or JIT
  readonly mode: CompileMode;
}

/**
 * Options for compiling a template for a given "syntax"
 *
 * This allows a single compiled whole program to be composed
 * of templates that use different macros.
 */
export interface SyntaxCompilationContext {
  readonly program: WholeProgramCompilationContext;
  readonly macros: Macros;
}

/**
 * Options for compiling a specific template. This carries
 * along the static information associated with the entire
 * template when compiling blocks nested inside of it.
 */
export interface TemplateCompilationContext {
  readonly syntax: SyntaxCompilationContext;
  readonly encoder: Encoder;
  readonly meta: ContainingMetadata;
}

export type EMPTY_ARRAY = Array<ReadonlyArray<never>>;

export interface ConstantPool {
  strings: string[];
  arrays: number[][] | EMPTY_ARRAY;
  handles: number[];
  numbers: number[];
}

/**
 * Constants are interned values that are referenced as numbers in the program.
 * The constant pool is a part of the program, and is always transmitted
 * together with the program.
 */
export interface CompileTimeConstants {
  string(value: string): number;
  stringArray(strings: string[]): number;
  array(values: number[]): number;
  serializable(value: unknown): number;
  templateMeta(value: unknown): number;
  number(value: number): number;
  other(value: unknown): number;
  toPool(): ConstantPool;
}

/**
 * In JIT mode, the constant pool is allowed to store arbitrary values,
 * which don't need to be serialized or transmitted over the wire.
 */
export interface CompileTimeLazyConstants extends CompileTimeConstants {
  other(value: unknown): number;
}

export interface RuntimeConstants {
  getNumber(value: number): number;
  getString(handle: number): string;
  getStringArray(value: number): string[];
  getArray(value: number): number[];
  getSerializable(handle: number): unknown;
  getTemplateMeta(s: number): unknown;
  getOther(s: number): unknown;
}
