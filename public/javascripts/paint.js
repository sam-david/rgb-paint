var currentRGB = new RGB(255,0,0);
var matrixCollection = new MatrixCollection;
var currentMatrix = new Matrix({
  matrix: pageData.emptyMatrix
});

var pageView = new View(820);
var pageController = new Controller();

pageController.loadAndSaveMatricies(matrixCollection, pageView.buildCollectionGrid);

