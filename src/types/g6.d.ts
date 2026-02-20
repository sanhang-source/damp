declare module '@antv/g6' {
  export interface NodeData {
    id: string;
    data?: any;
    style?: any;
    states?: string[];
  }

  export interface EdgeData {
    id?: string;
    source: string;
    target: string;
    data?: any;
    style?: any;
  }

  export interface GraphData {
    nodes?: NodeData[];
    edges?: EdgeData[];
    combos?: any[];
  }

  export interface NodeStyle {
    size?: number | number[] | ((d: any) => number | number[]);
    radius?: number | ((d: any) => number);
    fill?: string | ((d: any) => string);
    stroke?: string | ((d: any) => string);
    lineWidth?: number | ((d: any) => number);
    labelText?: string | ((d: any) => string);
    labelFill?: string;
    labelFontSize?: number;
    labelLineHeight?: number;
    cursor?: string;
    shadowColor?: string;
    shadowBlur?: number;
    [key: string]: any;
  }

  export interface NodeOptions {
    type?: string | ((d: any) => string);
    style?: NodeStyle | ((d: any) => NodeStyle) | { [K in keyof NodeStyle]?: NodeStyle[K] | ((d: any) => NodeStyle[K]) };
    state?: Record<string, NodeStyle | ((d: any) => NodeStyle)>;
    animation?: any;
    palette?: any;
  }

  export interface EdgeStyle {
    stroke?: string;
    lineWidth?: number;
    endArrow?: boolean;
    [key: string]: any;
  }

  export interface EdgeOptions {
    type?: string;
    style?: EdgeStyle;
    state?: Record<string, EdgeStyle>;
    animation?: any;
  }

  export interface LayoutConfig {
    type: string;
    rankdir?: string;
    nodesep?: number;
    ranksep?: number;
    [key: string]: any;
  }

  export interface GraphOptions {
    container: string | HTMLElement;
    width: number;
    height: number;
    data?: GraphData;
    node?: NodeOptions;
    edge?: EdgeOptions;
    layout?: LayoutConfig;
    behaviors?: string[];
    animation?: boolean | any;
    [key: string]: any;
  }

  export class Graph {
    constructor(config: GraphOptions);
    render(): void;
    resize(width: number, height: number): void;
    on(event: string, callback: (evt: any) => void): void;
    destroy(): void;
    fitView(): void;
    getNodeData(id: string): NodeData | undefined;
    updateNodeData(nodes: Partial<NodeData>[]): void;
    getEdgeData(id: string): EdgeData | undefined;
    updateEdgeData(edges: Partial<EdgeData>[]): void;
    setElementState(id: string, state: string, value: boolean): void;
    getElementData(id: string): any;
    getSize(): [number, number];
    getOptions(): GraphOptions;
    [key: string]: any;
  }
}
