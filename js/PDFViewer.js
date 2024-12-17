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
    this.randomMin = controls.randomMin || 21;
    this.randomMax = controls.randomMax || 172;

    // Variables for touch gesture tracking
    this.touchStartX = 0;
    this.touchEndX = 0;

    // Define chapter ranges
    this.chapters = [
      { name: "Cover", start: 1, end: 6 },
      { name: "Preface", start: 7, end: 16 },
      { name: "Introduction", start: 17, end: 20 },
      { name: "The Pairs", start: 21, end: 26 },
      { name: "Awareness", start: 27, end: 30 },
      { name: "The Mind", start: 31, end: 34 },
      { name: "Flowers", start: 35, end: 40 },
      { name: "The Foolish", start: 41, end: 46 },
      { name: "The Wise", start: 47, end: 50 },
      { name: "The Awakened One", start: 51, end: 54 },
      { name: "The Thousands", start: 55, end: 60 },
      { name: "Evil", start: 61, end: 66 },
      { name: "Aggression", start: 67, end: 72 },
      { name: "Old Age", start: 73, end: 76 },
      { name: "The Self", start: 77, end: 80 },
      { name: "The World", start: 81, end: 84 },
      { name: "The Buddha", start: 85, end: 90 },
      { name: "Happiness", start: 91, end: 94 },
      { name: "Affection", start: 95, end: 100 },
      { name: "Anger", start: 101, end: 106 },
      { name: "Pollution", start: 107, end: 112 },
      { name: "The Just", start: 113, end: 118 },
      { name: "The Path", start: 119, end: 124 },
      { name: "Various", start: 125, end: 130 },
      { name: "Hell", start: 131, end: 136 },
      { name: "The Elephant", start: 137, end: 142 },
      { name: "Craving", start: 143, end: 150 },
      { name: "The Renunciate", start: 151, end: 158 },
      { name: "Great Being", start: 159, end: 172 },
      { name: "A note on the text", start: 173, end: 180 },
      { name: "License", start: 181, end: 182 },
    ];
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

    this.updateChapterSelect(); // Update chapter select
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

    this.canvas.addEventListener("click", () => this.onNextPage());
    this.canvas.addEventListener("touchstart", (event) =>
      this.onTouchStart(event)
    );
    this.canvas.addEventListener("touchmove", (event) =>
      this.onTouchMove(event)
    );
    this.canvas.addEventListener("touchend", () => this.onTouchEnd());
    document.addEventListener("keydown", (event) => this.onKeyPress(event));
  }

  updateChapterSelect() {
    const chapterSelect = document.getElementById("chapter-select");
    for (const chapter of this.chapters) {
      if (this.pageNum >= chapter.start && this.pageNum <= chapter.end) {
        chapterSelect.value = chapter.start; // Set dropdown to match chapter
        break;
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

    this.pageNum = randomNumber;
    this.renderPage(randomNumber);
  }

  onPrevPage() {
    if (this.pageNum <= this.minPageNum) return;
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

  gotoChapter(pageNumber) {
    const num = parseInt(pageNumber);
    this.pageNum = num;
    this.renderPage(num);
  }

  downloadPDF() {
    const url = this.controls.pdfUrl + "#page=" + this.pageNum;
    window.open(url, "_blank");
  }

  onTouchStart(event) {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchMove(event) {
    this.touchEndX = event.touches[0].clientX;
  }

  onTouchEnd() {
    const deltaX = this.touchEndX - this.touchStartX;
    const swipeThreshold = 50;
    if (Math.abs(deltaX) > swipeThreshold) {
      deltaX > 0 ? this.onPrevPage() : this.onNextPage();
    }
  }

  onKeyPress(event) {
    if (event.key === "ArrowRight") this.onNextPage();
    else if (event.key === "ArrowLeft") this.onPrevPage();
  }

  onPageNumFocus() {
    document.getElementById(this.controls.pageNum).select();
  }

  onPageNumKeydown(event) {
    if (event.key === "Enter") this.gotoPage();
  }
}
