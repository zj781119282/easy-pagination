function hasClass(ele, name) {
  return !!ele.className.match(new RegExp('(\\s|^)' + name + '(\\s|$)'));
}

function addClass(ele, name) {
  if (!hasClass(ele, name)) {
    ele.className += ' ' + name;
  }
}

function removeClass(ele, name) {
  if (hasClass(ele, name)) {
    ele.className = ele.className.replace(new RegExp('(\\s|^)' + name + '(\\s|$)'), ' ');
  }
}

function calculatePage(totalPage, range, currentPage) {
  let leftPage = 1;
  let rightPage = totalPage;

  if (totalPage > range) {
    rightPage = range;
    if (currentPage > range / 2) {
      leftPage = currentPage - Math.floor(range / 2);
      rightPage = leftPage + range - 1;
      if (currentPage > totalPage - Math.ceil(range / 2)) {
        leftPage = totalPage - range + 1;
        rightPage = totalPage;
      }
    }
  }

  return {
    leftPage,
    rightPage,
  };
}

function paginatorElements(totalPage, range) {
  let mainPaginator = '';
  for (let i = 0; i< range; i++) {
    mainPaginator += `<a href="javascript:;" class="page-item main-page-button">${i + 1}</a>`;
  }

  return `<div class="pagination-container">
              <a href="javascript:;" class="page-item first-page-button">1...</a>
              <a href="javascript:;" class="page-item prev-page-button"><</a>
              ${mainPaginator}
              <a href="javascript:;" class="page-item next-page-button">></a>
              <a href="javascript:;" class="page-item last-page-button">...${totalPage}</a>
            </div>`;
}

export default class Pagination {
  constructor(paginatorElement, pageObject) {
    this.paginatorElement = paginatorElement;
    this.totalPage = pageObject.totalPage;
    this.currentPage = pageObject.currentPage || 1;
    this.range = pageObject.range && pageObject.range >= 3 ? pageObject.range : 5;
    this.callback = pageObject.callback;

    this.left = calculatePage(this.totalPage, this.range, this.currentPage).leftPage;
    this.right = calculatePage(this.totalPage, this.range, this.currentPage).rightPage;

    this.renderPaginatorElements();
  }

  clear() {
    this.paginatorElement.innerHTML = '';
  }

  renderPaginatorElements() {
    this.paginatorElement.innerHTML = paginatorElements(this.totalPage, this.range);

    this.renderElementsContent();
    this.bindEvents();
  }

  changeToPage(page) {
    this.callback(page);
    this.currentPage = page;
    this.left = calculatePage(this.totalPage, this.range, this.currentPage).leftPage;
    this.right = calculatePage(this.totalPage, this.range, this.currentPage).rightPage;
    this.renderElementsContent();
  }

  renderElementsContent() {
    const first = document.querySelector('.first-page-button');
    const last = document.querySelector('.last-page-button');
    const prev = document.querySelector('.prev-page-button');
    const next = document.querySelector('.next-page-button');
    const main = document.getElementsByClassName('main-page-button');

    if (this.left <= 1) {
      first.style = 'display: none';
    } else {
      first.style = 'display: inline-block';
    }

    if (this.right >= this.totalPage) {
      last.style = 'display: none';
    } else {
      last.style = 'display: inline-block';
    }

    if (this.currentPage === 1) {
      addClass(prev, 'disabled');
    } else {
      removeClass(prev, 'disabled');
    }

    if (this.currentPage === this.totalPage) {
      addClass(next, 'disabled');
    } else {
      removeClass(next, 'disabled');
    }

    Array.prototype.forEach.call(main, (item, index) => {
      item.innerHTML = this.left + index;
      item.dataset.index = this.left + index;
      if (this.currentPage == item.dataset.index) {
        addClass(item, 'active');
      } else {
        removeClass(item, 'active');
      }
    });
  }

  bindEvents() {
    const first = document.querySelector('.first-page-button');
    const last = document.querySelector('.last-page-button');
    const prev = document.querySelector('.prev-page-button');
    const next = document.querySelector('.next-page-button');
    const main = document.getElementsByClassName('main-page-button');

    first.addEventListener('click', () => {
      this.changeToPage(1);
    });

    last.addEventListener('click', () => {
      this.changeToPage(this.totalPage);
    });

    prev.addEventListener('click', () => {
      if (this.currentPage <= 1) return;
      this.changeToPage(parseInt(this.currentPage) - 1);
    });

    next.addEventListener('click', () => {
      if (this.currentPage >= this.totalPage) return;
      this.changeToPage(parseInt(this.currentPage) + 1);
    });

    Array.prototype.forEach.call(main, item => {
      item.addEventListener('click', () => {
        const page = item.dataset.index;
        if (this.currentPage == page) return;
        this.changeToPage(page);
      });
    });
  }
}