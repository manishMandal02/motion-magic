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
  timeFrame: IElementFrameDuration;
  layer: number; // higher the layer upper the el on z-index
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

export type IElements = ITextElement | IShapeElement;
