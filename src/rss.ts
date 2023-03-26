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
    {
        title: "npm/statusboard Issues",
        query: "repo:npm/statusboard is:issue",
        TYPE: "ISSUE",
        link: `${BASE_URL}/npm-statusboard.json`
    },
    {
        title: "github/roadmap Issues",
        query: "repo:github/roadmap is:issue",
        TYPE: "ISSUE",
        link: `${BASE_URL}/github-roadmap.json`
    },
    {
        title: "mozilla/standards-positions Issues",
        query: "repo:mozilla/standards-positions is:issue",
        TYPE: "ISSUE",
        link: `${BASE_URL}/mozilla-standards-positions.json`
    },
    {
        title: "WebKit/standards-positions Issues",
        query: "repo:WebKit/standards-positions is:issue",
        TYPE: "ISSUE",
        link: `${BASE_URL}/WebKit-standards-positions.json`
    },
    {
        title: "Fyrd/caniuse Issues",
        query: 'repo:Fyrd/caniuse label:"Support data suggestion"',
        TYPE: "ISSUE",
        link: `${BASE_URL}/caniuse.json`
    },
    {
        title: "org:wintercg Issues",
        query: "org:wintercg is:open is:issue -repo:wintercg/admin",
        TYPE: "ISSUE",
        link: `${BASE_URL}/wintercg.json`
    },
    {
        title: "repo:babel/proposals Issues",
        query: "repo:babel/proposals is:issue",
        TYPE: "ISSUE",
        link: `${BASE_URL}/babel-proposals.json`
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
    {
        title: "Node.js notable changes",
        query: "repo:nodejs/node label:notable-change is:pr is:closed -label:doc",
        TYPE: "ISSUE",
        link: `${BASE_URL}/nodejs-notable.json`
    },
    {
        title: "whatwg/html changes",
        query: 'repo:whatwg/html is:pr label:"impacts documentation"',
        TYPE: "ISSUE",
        link: `${BASE_URL}/whatwg-html.json`
    },
    // Repository
    {
        title: "LightWeight JavaScript repositories",
        query: "lightweight language:javascript language:typescript sort:updated-desc",
        TYPE: "REPOSITORY",
        link: `${BASE_URL}/lightweight-javascript-repo.json`
    }
];
