declare module 'modern-screenshot' {
	interface Options {
		scale?: number;
		backgroundColor?: string;
		style?: Record<string, string>;
		width?: number;
		height?: number;
		quality?: number;
		type?: string;
		features?: {
			removeControlCharacter?: boolean;
		};
		font?: {
			cssText?: string;
		};
		debug?: boolean;
		fetch?: {
			placeholderImage?: string;
			requestInit?: RequestInit;
		};
		workerUrl?: string;
		workerNumber?: number;
	}

	export function domToPng(node: Node, options?: Options): Promise<string>;
	export function domToJpeg(node: Node, options?: Options): Promise<string>;
	export function domToSvg(node: Node, options?: Options): Promise<string>;
	export function domToBlob(node: Node, options?: Options): Promise<Blob>;
	export function domToCanvas(node: Node, options?: Options): Promise<HTMLCanvasElement>;
	export function domToDataUrl(node: Node, options?: Options): Promise<string>;
	export function domToPixelData(node: Node, options?: Options): Promise<Uint8ClampedArray>;
}
