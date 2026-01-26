declare module 'html2pdf.js' {
	interface Html2PdfOptions {
		margin?: number | [number, number, number, number];
		filename?: string;
		image?: { type?: string; quality?: number };
		html2canvas?: {
			scale?: number;
			useCORS?: boolean;
			backgroundColor?: string;
			logging?: boolean;
			onclone?: (document: Document) => void;
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
