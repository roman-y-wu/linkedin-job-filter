const jobBoards = (() => {
  const commonProcessors = {
    trim: {
      process: "replace",
      pattern: "^\\s+|\\s+$",
      flags: "gm",
      replacement: "",
    },
    subtractHnsText: {
      process: "subtract",
      selector: ".hns-container",
    },
    replaceEmptyWith(replacement) {
      return {
        process: "replace",
        pattern: "^\\s*$",
        replacement,
      };
    },
  };

  const commonAttributes = {
    keyword: {
      name: "Keyword",
      id: "keyword",
      removableValues: true,
      match: "pattern",
      processors: [commonProcessors.subtractHnsText],
    },
  };

  return [
    {
      domains: ["linkedin.com"],
      id: "linkedIn",
      name: "LinkedIn",
      listingSelector:
        "li:has(.job-card-container, .job-search-card, .job-card-job-posting-card-wrapper, [data-job-id]), div > [data-view-name='job-card'] > a, div:has(> [data-view-name='job-search-job-card'])",
      locationSelector:
        ".job-card-container__metadata-item, .artdeco-entity-lockup__caption, .job-search-card__location, .job-card-container__metadata-wrapper li, [data-view-name='job-card'] .artdeco-entity-lockup__caption",
      titleSelector:
        ".job-card-list__title, .job-card-container__link, .base-search-card__title, .artdeco-entity-lockup__title, .job-card-job-posting-card-wrapper__title, [data-view-name='job-card'] .artdeco-entity-lockup__title a",
      logo: {
        src: "/assets/images/linkedin-logo.svg",
        alt: "LinkedIn's logo",
        brandColor: "#0a66c2",
      },
      attributes: [
        commonAttributes.keyword,
        {
          name: "Company",
          id: "companyName",
          removableValues: false,
          selector:
            ".job-card-container__primary-description, .job-card-container__company-name, .base-search-card__subtitle, .artdeco-entity-lockup__subtitle > *:not(.visually-hidden), div > [data-view-name='job-card'] figure + div > div:first-child p + div > p:first-child, div > [data-view-name='job-search-job-card'] p + div > p",
          match: "exact",
          processors: [
            commonProcessors.trim,
            {
              process: "replace",
              pattern: "\\s[·•]\\s.*$",
              flags: "gm",
              replacement: "",
            },
            commonProcessors.replaceEmptyWith("Unknown Company"),
          ],
          default: true,
        },
        {
          name: "Status",
          id: "promotionalStatus",
          removableValues: false,
          selector:
            ".job-card-list__footer-wrapper, .job-card-container__footer-wrapper, div > [data-view-name='job-card'] figure + div > div:last-child",
          match: "exact",
          processors: [
            {
              process: "match",
              pattern: [
                "الترويج" /* Arabic */,
                "প্রমোটেড" /* Bangla */,
                "推广" /* Chinese (Simplified) */,
                "已宣傳" /* Chinese (Traditional) */,
                "Propagováno" /* Czech */,
                "Promoveret" /* Danish */,
                "Gepromoot" /* Dutch */,
                "Promoted" /* English */,
                "Mainostettu" /* Finnish */,
                "Promu\\(e\\)" /* French */,
                "Anzeige" /* German */,
                "Προωθημένη" /* Greek */,
                "प्रमोट किया गया" /* Hindi */,
                "Kiemelt" /* Hungarian */,
                "Dipromosikan" /* Indonesian */,
                "Promosso" /* Italian */,
                "プロモーション" /* Japanese */,
                "프로모션" /* Korean */,
                "Dipromosikan" /* Malay */,
                "प्रमोट केले" /* Marathi */,
                "Promotert" /* Norwegian */,
                "Promowana oferta pracy" /* Polish */,
                "Promovida" /* Portuguese */,
                "ਪ੍ਰੋਮੋਟ ਕੀਤਾ" /* Punjabi */,
                "Promovat" /* Romanian */,
                "Продвигается" /* Russian */,
                "Promocionado" /* Spanish */,
                "Marknadsfört" /* Swedish */,
                "Na-promote" /* Tagalog */,
                "ప్రమోట్ చేయబడింది" /* Telugu */,
                "โปรโมทแล้ว" /* Thai */,
                "Tanıtıldı" /* Turkish */,
                "Просувається" /* Ukrainian */,
                "Được quảng bá" /* Vietnamese */,
              ].join("|"),
            },
          ],
        },
      ],
    },
  ].map((jobBoard) => ({
    ...jobBoard,
    origins: jobBoard.domains.map((domain) => `https://*.${domain}/*`),
  }));
})();

const jobBoardIds = jobBoards.map((jobBoard) => jobBoard.id);

const jobBoardOrigins = jobBoards.flatMap((jobBoard) => jobBoard.origins);

const getJobBoardByHostname = (hostname) => {
  for (const jobBoard of jobBoards) {
    for (const domain of jobBoard.domains) {
      if (hostname.endsWith(`.${domain}`) || hostname === domain)
        return jobBoard;
    }
  }
};

const getJobBoardById = (id) =>
  jobBoards.find((jobBoard) => jobBoard.id === id);

const getJobBoardTabs = async (filters = {}) => {
  const urlMatchPatterns = filters.origins || jobBoardOrigins;

  const tabs = await chrome.tabs.query({
    url: urlMatchPatterns,
    windowType: "normal",
  });

  return tabs.filter((tab) =>
    jobBoards.some((jobBoard) =>
      jobBoard.domains.some(
        (domain) =>
          tab.url.includes(domain) &&
          (!filters.jobBoardId || jobBoard.id === filters.jobBoardId)
      )
    )
  );
};

export {
  jobBoardIds,
  jobBoardOrigins,
  getJobBoardByHostname,
  getJobBoardById,
  getJobBoardTabs,
};
