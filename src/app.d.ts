// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module 'html2pdf.js' {
	interface Html2PdfOptions {
		margin?: number | [number, number, number, number];
		filename?: string;
		image?: { type?: string; quality?: number };
		html2canvas?: {
			scale?: number;
			useCORS?: boolean;
			backgroundColor?: string;
		};
		jsPDF?: {
			unit?: string;
			format?: string;
			orientation?: string;
		};
	}

	interface Html2Pdf {
		set(options: Html2PdfOptions): Html2Pdf;
		from(element: HTMLElement): Html2Pdf;
		save(): Promise<void>;
		outputImg(type: string): Promise<HTMLImageElement>;
	}

	function html2pdf(): Html2Pdf;
	export default html2pdf;
}

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

export {};
