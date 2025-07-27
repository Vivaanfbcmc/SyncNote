import { Operation } from '../types';

export function applyOperation(content: string, operation: Operation): string {
  switch (operation.type) {
    case 'insert':
      return content.slice(0, operation.position) + 
             (operation.content || '') + 
             content.slice(operation.position);
    
    case 'delete':
      return content.slice(0, operation.position) + 
             content.slice(operation.position + (operation.length || 0));
    
    case 'retain':
      return content;
    
    default:
      return content;
  }
}

export function transformOperation(op1: Operation, op2: Operation): Operation {
  // Simple operational transformation
  if (op1.type === 'insert' && op2.type === 'insert') {
    if (op1.position <= op2.position) {
      return {
        ...op2,
        position: op2.position + (op1.content?.length || 0)
      };
    }
    return op2;
  }
  
  if (op1.type === 'delete' && op2.type === 'insert') {
    if (op1.position < op2.position) {
      return {
        ...op2,
        position: op2.position - (op1.length || 0)
      };
    }
    return op2;
  }
  
  if (op1.type === 'insert' && op2.type === 'delete') {
    if (op1.position <= op2.position) {
      return {
        ...op2,
        position: op2.position + (op1.content?.length || 0)
      };
    }
    return op2;
  }
  
  if (op1.type === 'delete' && op2.type === 'delete') {
    if (op1.position < op2.position) {
      return {
        ...op2,
        position: op2.position - (op1.length || 0)
      };
    }
    return op2;
  }
  
  return op2;
}