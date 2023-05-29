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

type ICommonElProps = {
  id: string;
  position: IElementPosition;
  size: IElementSize;
  timeFrame: IElementFrameDuration;
};

export enum IElementTypes {
  TEXT = 'TEXT',
  SHAPE = 'SHAPE',
}

export type IElementTypes1 = 'SHAPE' | 'TEXT';

export interface ITextElement extends ICommonElProps {
  type: IElementTypes.TEXT;
  value: string;
  fontSize: number;
}

export interface IShapeElement extends ICommonElProps {
  type: IElementTypes.SHAPE;
  borderRadius?: number;
}

export type IElement = ITextElement | IShapeElement;