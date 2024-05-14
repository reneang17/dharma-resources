class PDFViewer {
    constructor(canvasId, controls) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.controls = controls;
        this.pdfDoc = null;
        this.pageNum = 1;
        this.pageRendering = false;
    }

    async renderPage(num) {
        this.pageRendering = true;
        const page = await this.pdfDoc.getPage(num);

        // Dynamically calculate the scale based on the maximum height of 672 pixels (7 inches)
        const screenHeight = 672; // Maximum height in pixels
        const viewport = page.getViewport({ scale: 1 });
        const scale = screenHeight / viewport.height;
        const scaledViewport = page.getViewport({ scale: scale });

        this.canvas.height = scaledViewport.height;
        this.canvas.width = scaledViewport.width;

        const renderContext = {
            canvasContext: this.ctx,
            viewport: scaledViewport
        };

        await page.render(renderContext).promise;
        this.pageRendering = false;
        document.getElementById(this.controls.pageNum).value = num;  // Update current page in text field
    }

    loadDocument(url) {
        pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
            this.pdfDoc = pdfDoc_;
            this.renderPage(this.pageNum);
        });
    }

    setupEventListeners() {
        document.getElementById(this.controls.prevPage).addEventListener('click', () => this.onPrevPage());
        document.getElementById(this.controls.nextPage).addEventListener('click', () => this.onNextPage());
        document.getElementById(this.controls.goPage).addEventListener('click', () => this.gotoPage());
        document.getElementById(this.controls.downloadPDF).addEventListener('click', () => this.downloadPDF());
    }

    onPrevPage() {
        if (this.pageNum <= 1) {
            return;
        }
        this.pageNum--;
        this.renderPage(this.pageNum);
    }

    onNextPage() {
        if (this.pageNum >= this.pdfDoc.numPages) {
            return;
        }
        this.pageNum++;
        this.renderPage(this.pageNum);
    }

    gotoPage() {
        const pageNumber = parseInt(document.getElementById(this.controls.pageNum).value);
        if (pageNumber > 0 && pageNumber <= this.pdfDoc.numPages) {
            this.pageNum = pageNumber;
            this.renderPage(this.pageNum);
        }
    }

    downloadPDF() {
        const link = document.createElement('a');
        link.href = this.controls.pdfUrl;  // Link to PDF
        link.download = 'downloaded-file.pdf';  // Download filename
        link.click();
    }
}