document.addEventListener('DOMContentLoaded', function () {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.worker.min.js';

    var canvas = document.getElementById('pdf-canvas');
    var ctx = canvas.getContext('2d');
    var pdfDoc = null,
        pageNum = 1,
        pageRendering = false;

    function renderPage(num) {
        pageRendering = true;
        pdfDoc.getPage(num).then(function (page) {
            var viewport = page.getViewport({ scale: 1.5 });
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            var renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };
            var renderTask = page.render(renderContext);

            renderTask.promise.then(function () {
                pageRendering = false;
                document.getElementById('page-num').value = num;  // Update current page in text field
            });
        });
    }

    function onPrevPage() {
        if (pageNum <= 1) {
            return;
        }
        pageNum--;
        renderPage(pageNum);
    }

    function onNextPage() {
        if (pageNum >= pdfDoc.numPages) {
            return;
        }
        pageNum++;
        renderPage(pageNum);
    }

    function gotoPage() {
        var pageNumber = parseInt(document.getElementById('page-num').value);
        if (pageNumber > 0 && pageNumber <= pdfDoc.numPages) {
            pageNum = pageNumber;
            renderPage(pageNum);
        }
    }

    function downloadPDF() {
        var link = document.createElement('a');
        link.href = './path/to/your-pdf-file.pdf';
        link.download = 'downloaded-file.pdf';
        link.click();
    }

    var url = './ajahn_munindo_books/dhammapada-for-contemplation-5th-LARGE-WEB-2017-02-05.pdf';
    pdfjsLib.getDocument(url).promise.then(function (pdfDoc_) {
        pdfDoc = pdfDoc_;
        renderPage(pageNum);
    });
});