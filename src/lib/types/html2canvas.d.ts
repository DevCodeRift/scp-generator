declare module 'html2canvas' {
	interface Html2CanvasOptions {
		scale?: number;
		useCORS?: boolean;
		backgroundColor?: string | null;
		logging?: boolean;
		width?: number;
		height?: number;
		x?: number;
		y?: number;
		scrollX?: number;
		scrollY?: number;
		windowWidth?: number;
		windowHeight?: number;
		allowTaint?: boolean;
		foreignObjectRendering?: boolean;
		imageTimeout?: number;
		ignoreElements?: (element: Element) => boolean;
		onclone?: (document: Document) => void;
		proxy?: string;
		removeContainer?: boolean;
	}

	function html2canvas(element: HTMLElement, options?: Html2CanvasOptions): Promise<HTMLCanvasElement>;
	export default html2canvas;
}
