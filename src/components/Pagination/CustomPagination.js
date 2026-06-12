/* Pager — a windowed page control (prev / 1 … current ± 1 … last / next).
   Replaces MUI Pagination. TMDB caps results at 500 pages. */

function pageWindow(current, total) {
  const range = [];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);
  range.push(1);
  if (left > 2) range.push('…');
  for (let i = left; i <= right; i++) range.push(i);
  if (right < total - 1) range.push('…');
  if (total > 1) range.push(total);
  return range;
}

const CustomPagination = ({ setPage, page = 1, numOfPages = 10 }) => {
  const total = Math.min(numOfPages, 500);

  const handlePageChange = (next) => {
    if (next < 1 || next > total || next === page) return;
    setPage(next);
    const scroller = document.querySelector('.panel-scroll');
    if (scroller) scroller.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const items = pageWindow(page, total);

  return (
    <div className="pager">
      <button disabled={page <= 1} onClick={() => handlePageChange(page - 1)} aria-label="Previous page">‹</button>
      {items.map((it, i) =>
        it === '…' ? (
          <button key={`gap-${i}`} className="gap" disabled>…</button>
        ) : (
          <button
            key={it}
            className={it === page ? 'on' : ''}
            onClick={() => handlePageChange(it)}
            aria-current={it === page ? 'page' : undefined}
          >
            {it}
          </button>
        )
      )}
      <button disabled={page >= total} onClick={() => handlePageChange(page + 1)} aria-label="Next page">›</button>
    </div>
  );
};

export default CustomPagination;
