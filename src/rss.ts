/**
 * IT IS DEFINITION FOR RSS FEED
 * If you want to get more feed, please add it
 **/
import { RSSItem } from "./index";

const BASE_URL = "https://azu.github.io/github-search-rss";
// Query references
// https://docs.github.com/en/github/searching-for-information-on-github/understanding-the-search-syntax
// https://docs.github.com/en/github/searching-for-information-on-github/about-searching-on-github
// TYPE references
// https://docs.github.com/en/graphql/reference/queries#searchresultitemconnection
export const SEARCH_ITEMS: RSSItem[] = [
    // Issue
    {
        title: "microsoft/TypeScript Iteration Plan",
        query: "repo:microsoft/TypeScript is:issue label:Planning",
        TYPE: "ISSUE",
        link: `${BASE_URL}/typescript-iterator-plan.json`,
        homepage: "https://github.com/search?q=repo%3Amicrosoft%2FTypeScript+is%3Aissue+label%3APlanning"
    },
    {
        title: "w3ctag/design-reviews Design Issues",
        query: "repo:w3ctag/design-reviews is:issue",
        TYPE: "ISSUE",
        link: `${BASE_URL}/w3ctag-design-reviews.json`
    },
    {
        title: "npm/rfcs Issues",
        query: "repo:npm/rfcs is:issue",
        TYPE: "ISSUE",
        link: `${BASE_URL}/npm-rfcs.json`
    },
    // Pull Request
    {
        // label:data:
        title: "mdn/browser-compat-data update data",
        query: "repo:mdn/browser-compat-data is:pr is:open",
        TYPE: "ISSUE",
        link: `${BASE_URL}/mdn-browser-compat-data.json`,
        filter: (item) => {
            return item.labels.some((label) => label.startsWith("data:"));
        }
    },
    {
        title: "mdn/content update content",
        query: "repo:mdn/content is:pr is:open",
        TYPE: "ISSUE",
        link: `${BASE_URL}/mdn-content.json`
    },
    // Repository
    {
        title: "LightWeight JavaScript repositories",
        query: "lightweight language:javascript language:typescript sort:updated-desc",
        TYPE: "REPOSITORY",
        link: `${BASE_URL}/lightweight-javascript-repo.json`
    }
];
