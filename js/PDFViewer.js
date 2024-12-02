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

    // Variables for touch gesture tracking
    this.touchStartX = 0;
    this.touchEndX = 0;
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

    // Add new event listeners
    this.canvas.addEventListener("click", () => this.onNextPage()); // Click to go to the next page
    this.canvas.addEventListener("touchstart", (event) =>
      this.onTouchStart(event)
    ); // Start of touch
    this.canvas.addEventListener("touchmove", (event) =>
      this.onTouchMove(event)
    ); // During touch
    this.canvas.addEventListener("touchend", () => this.onTouchEnd()); // End of touch
    document.addEventListener("keydown", (event) => this.onKeyPress(event)); // Key press
  }

  onTouchStart(event) {
    this.touchStartX = event.touches[0].clientX; // Capture the X position where touch started
  }

  onTouchMove(event) {
    this.touchEndX = event.touches[0].clientX; // Update the X position as the touch moves
  }

  onTouchEnd() {
    const deltaX = this.touchEndX - this.touchStartX; // Calculate the horizontal movement
    const swipeThreshold = 50; // Minimum distance for swipe to be considered valid

    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX > 0) {
        this.onNextPage(); // Swipe right (next page)
      } else {
        this.onPrevPage(); // Swipe left (previous page)
      }
    }
  }

  onKeyPress(event) {
    if (event.key === "ArrowRight") {
      this.onNextPage(); // Right arrow key for next page
    } else if (event.key === "ArrowLeft") {
      this.onPrevPage(); // Left arrow key for previous page
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
