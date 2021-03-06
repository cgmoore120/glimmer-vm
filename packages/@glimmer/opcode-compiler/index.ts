export * from './lib/program-context';

export { MacrosImpl } from './lib/syntax/macros';
export { UNHANDLED, NONE } from './lib/syntax/concat';

export { debugCompiler } from './lib/compiler';

export { compileStatements, compilable } from './lib/compilable-template';
export { StaticComponent as staticComponent } from './lib/opcode-builder/helpers/components';

export * from './lib/opcode-builder/context';
export * from './lib/opcode-builder/delegate';

export {
  InvokeStaticBlockWithStack as invokeStaticBlockWithStack,
  InvokeStaticBlock as invokeStaticBlock,
} from './lib/opcode-builder/helpers/blocks';
export { compileStd } from './lib/opcode-builder/helpers/stdlib';
export { meta } from './lib/opcode-builder/helpers/shared';

export { StdLib } from './lib/opcode-builder/stdlib';

export { PartialDefinition } from './lib/partial-template';

export {
  default as templateFactory,
  TemplateFactory,
  Component,
  unwrapTemplate,
  unwrapHandle,
  isOkHandle,
  isErrHandle,
  extractHandle,
} from './lib/template';

export { debug, debugSlice, logOpcode } from './lib/debug';

export { WrappedBuilder } from './lib/wrapped-component';

export { EMPTY_BLOCKS } from './lib/utils';

export { resolveLayoutForTag } from './lib/resolver';
