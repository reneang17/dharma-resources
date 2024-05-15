class CommentsViewer {
    constructor(containerId, pdfUrl, initialPage) {
        this.containerId = containerId;
        this.pdfUrl = pdfUrl;
        this.initialPage = initialPage;
        this.container = document.getElementById(this.containerId);
    }

    async init() {
        this.container.innerHTML = `
            <div class="navigation-controls">
                <button class="prev-page">Prev Page</button>
                <button class="next-page">Next Page</button>
                <input type="number" class="page-num" value="${this.initialPage}" min="1" max="164" size="3">
                <button class="go-page">Go</button>
                <button class="open-in-new-tab">Open in new Tab</button>
            </div>
            <canvas></canvas>
        `;
        // Apply the CSS class to the container
        this.container.className = 'pdf-viewer-comments-container';

        this.canvas = this.container.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.pageNum = parseInt(this.initialPage);

        pdfjsLib.getDocument(this.pdfUrl).promise.then(pdfDoc_ => {
            this.pdfDoc = pdfDoc_;
            this.renderPage(this.pageNum);
        });

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Use event delegation for controls within the dynamically generated content
        this.container.addEventListener('click', event => {
            const target = event.target;
            if (target.classList.contains('prev-page')) {
                this.onPrevPage();
            } else if (target.classList.contains('next-page')) {
                this.onNextPage();
            } else if (target.classList.contains('go-page')) {
                this.gotoPage();
            } else if (target.classList.contains('open-in-new-tab')) {
                this.openInNewTab();
            }
        });
    }

    async renderPage(num) {
        const page = await this.pdfDoc.getPage(num);
        const scale = 3;  // Adjust scale as needed for better viewing
        const viewport = page.getViewport({ scale: scale });

        this.canvas.height = viewport.height;
        this.canvas.width = viewport.width;

        const renderContext = {
            canvasContext: this.ctx,
            viewport: viewport
        };

        await page.render(renderContext).promise;
    }

    onPrevPage() {
        if (this.pageNum > 1) {
            this.pageNum--;
            this.renderPage(this.pageNum);
        }
    }

    onNextPage() {
        if (this.pageNum < this.pdfDoc.numPages) {
            this.pageNum++;
            this.renderPage(this.pageNum);
        }
    }

    gotoPage() {
        const pageNumInput = this.container.querySelector('.page-num');
        const pageNumber = parseInt(pageNumInput.value);
        if (pageNumber >= 1 && pageNumber <= this.pdfDoc.numPages) {
            this.pageNum = pageNumber;
            this.renderPage(this.pageNum);
        }
    }

    openInNewTab() {
        window.open(this.pdfUrl + '#page=' + this.pageNum, '_blank');
    }
}
