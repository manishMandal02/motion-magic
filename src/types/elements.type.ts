export interface IElementSize {
  width: number;
  height: number;
}
export interface IElementPosition {
  x: number;
  y: number;
}
export interface IElementFrameDuration {
  startFrame: number;
  endFrame: number;
}

export type IUpdateElSize = (size: IElementSize) => void;

export type IUpdateElPosition = (pos: IElementPosition) => void;

export enum IElementType {
  TEXT = 'TEXT',
  SHAPE = 'SHAPE',
}

export interface IElement<T extends IElementType> {
  type: T;
  id: string;
  position: IElementPosition;
  size: IElementSize;
}

export interface ITextElement extends IElement<IElementType.TEXT> {
  type: IElementType.TEXT;
  value: string;
  fontSize: number;
}

export interface IShapeElement extends IElement<IElementType.SHAPE> {
  type: IElementType.SHAPE;
  borderRadius?: number;
}

export type IAddElement = <T extends IElementType, P extends Extract<IElements, { type: T }>>(
  elType: T,
  element: P & IElementFrameDuration
) => void;

export type IUpdateElement = <T extends IElementType, P extends Partial<Extract<IElements, { type: T }>>>(
  id: string,
  elType: T,
  element: P
) => void;

export type IElements = ITextElement | IShapeElement;
