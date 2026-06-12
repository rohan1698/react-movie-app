import axios from 'axios';

/* TMDB returns a fixed 20 results per page with no page-size parameter, so to
   show 40/60 cards per view we fetch several consecutive TMDB pages in parallel
   and concatenate them. TMDB caps the `page` param at 500; pages past
   total_pages just return empty arrays, which is harmless. */

// Fetch `count` consecutive pages starting at `basePage`; concat + de-dupe by id.
export async function fetchTmdbPages(buildUrl, basePage, count) {
  const requests = [];
  for (let i = 0; i < count; i++) {
    const p = basePage + i;
    if (p > 500) break; // TMDB rejects page > 500
    requests.push(axios.get(buildUrl(p)));
  }
  // allSettled so one failed page doesn't blank a whole view.
  const settled = await Promise.allSettled(requests);
  const ok = settled.filter((s) => s.status === 'fulfilled').map((s) => s.value);
  const totalPages = ok[0]?.data?.total_pages || 0;

  const seen = new Set();
  const results = [];
  for (const res of ok) {
    for (const item of res.data?.results || []) {
      // trending mixes movie + tv; TMDB ids are only unique within a media type.
      const dedupeKey = `${item.media_type || ''}:${item.id}`;
      if (!seen.has(dedupeKey)) {
        seen.add(dedupeKey);
        results.push(item);
      }
    }
  }
  return { results, totalPages };
}

// How many UI "views" exist, given TMDB's total page count and pages-per-view.
// Also ensures the first TMDB page of the last view stays within the 500 cap.
export function viewCount(totalPages, perTmdbPages) {
  const capped = Math.min(totalPages || 0, 500);
  const byTotal = Math.ceil(capped / perTmdbPages);
  const byCap = Math.floor((500 - 1) / perTmdbPages) + 1;
  return Math.max(1, Math.min(byTotal, byCap));
}
