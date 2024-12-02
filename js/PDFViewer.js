class PDFViewer {
  constructor(canvasId, controls) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.controls = controls;
    this.pdfDoc = null;
    this.pageNum = 1;
    this.pageRendering = false;
    this.minPageNum = controls.minPage || 1;
    this.maxPageNum = controls.maxPage || 182;
    this.randomMin = controls.randomMin || 21; // Default minimum random page
    this.randomMax = controls.randomMax || 172; // Default maximum random page

    // Touch gesture tracking
    this.touchStartX = 0; // Starting X position of the touch
    this.touchEndX = 0; // Ending X position of the touch
  }

  async renderPage(num) {
    this.pageRendering = true;
    num = Math.max(this.minPageNum, Math.min(num, this.maxPageNum)); // Ensure num is within allowed range
    const page = await this.pdfDoc.getPage(num);
    const scale = 5;
    const viewport = page.getViewport({ scale: scale });

    this.canvas.style.width = "100%";
    this.canvas.style.height = "auto";
    this.canvas.width = viewport.width;
    this.canvas.height = viewport.height;

    const renderContext = {
      canvasContext: this.ctx,
      viewport: viewport,
    };

    await page.render(renderContext).promise;
    this.pageRendering = false;
    document.getElementById(this.controls.pageNum).value = num; // Update current page in text field
  }

  loadDocument(url) {
    pdfjsLib.getDocument(url).promise.then((pdfDoc_) => {
      this.pdfDoc = pdfDoc_;
      this.renderPage(this.pageNum);
    });
  }

  setupEventListeners() {
    document
      .getElementById(this.controls.randomPage)
      .addEventListener("click", () => this.onRandomPage());
    document
      .getElementById(this.controls.prevPage)
      .addEventListener("click", () => this.onPrevPage());
    document
      .getElementById(this.controls.nextPage)
      .addEventListener("click", () => this.onNextPage());
    document
      .getElementById(this.controls.goPage)
      .addEventListener("click", () => this.gotoPage());
    document
      .getElementById(this.controls.pageNum)
      .addEventListener("focus", () => this.onPageNumFocus());
    document
      .getElementById(this.controls.pageNum)
      .addEventListener("keydown", (event) => this.onPageNumKeydown(event));
    document
      .getElementById("chapter-select")
      .addEventListener("change", (e) => this.gotoChapter(e.target.value));
    document
      .getElementById(this.controls.downloadPDF)
      .addEventListener("click", () => this.downloadPDF());

    // Add event listener for the canvas click/tap
    this.canvas.addEventListener("click", () => this.onNextPage());

    // Add touch gesture listeners for swiping
    this.canvas.addEventListener("touchstart", (event) =>
      this.onTouchStart(event)
    );
    this.canvas.addEventListener("touchmove", (event) =>
      this.onTouchMove(event)
    );
    this.canvas.addEventListener("touchend", () => this.onTouchEnd());
  }

  onTouchStart(event) {
    // Capture the starting X position of the touch
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchMove(event) {
    // Optionally, track the current position
    this.touchEndX = event.touches[0].clientX;
  }

  onTouchEnd() {
    // Calculate the difference between the start and end positions
    const deltaX = this.touchEndX - this.touchStartX;

    // Define a threshold for swipe detection (e.g., 50px)
    const swipeThreshold = 50;

    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX > 0) {
        // Swiped to the right (next page)
        this.onNextPage();
      } else {
        // Swiped to the left (previous page)
        this.onPrevPage();
      }
    }
  }

  onRandomPage() {
    const excludedNumbers = [40, 46, 60, 66, 72, 100, 116, 136, 142];
    let randomNumber;

    do {
      randomNumber =
        Math.floor(Math.random() * (this.randomMax - this.randomMin + 1)) +
        this.randomMin;
    } while (excludedNumbers.includes(randomNumber));

    this.pageNum = randomNumber; // Update the current page number
    this.renderPage(randomNumber);
  }

  onPrevPage() {
    if (this.pageNum <= this.minPageNum) {
      return;
    }
    this.pageNum--;
    this.renderPage(this.pageNum);
  }

  onNextPage() {
    if (
      this.pageNum >= this.pdfDoc.numPages ||
      this.pageNum >= this.maxPageNum
    ) {
      return;
    }
    this.pageNum++;
    this.renderPage(this.pageNum);
  }

  gotoPage() {
    const pageNumber = parseInt(
      document.getElementById(this.controls.pageNum).value
    );
    if (
      pageNumber >= this.minPageNum &&
      pageNumber <= Math.min(this.maxPageNum, this.pdfDoc.numPages)
    ) {
      this.pageNum = pageNumber;
      this.renderPage(this.pageNum);
    } else {
      alert("Invalid page number. Valid pages range from 1 to 182.");
    }
  }

  onPageNumFocus() {
    document.getElementById(this.controls.pageNum).select();
  }

  onPageNumKeydown(event) {
    if (event.key === "Enter") {
      this.gotoPage();
    }
  }

  gotoChapter(pageNumber) {
    const num = parseInt(pageNumber);
    this.pageNum = num; // Update the current page number
    this.renderPage(num);
  }

  downloadPDF() {
    const url = this.controls.pdfUrl + "#page=" + this.pageNum;
    window.open(url, "_blank");
  }
}
