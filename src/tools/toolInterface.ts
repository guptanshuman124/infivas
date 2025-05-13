import { type Point } from "./point";

export interface ToolInterFace{
    start(pos:Point):void;
    draw(pos:Point):void;
    end(pos:Point):void;
};