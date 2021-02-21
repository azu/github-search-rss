/**
 * IT IS DEFINITION FOR RSS FEED
 * If you want to get more feed, please add it
 **/
import { RSSItem } from "./index";

const BASE_URL = "https://azu.github.io/github-search-rss";
export const SEARCH_ITEMS: RSSItem[] = [
    {
        title: "microsoft/TypeScript Iteration Plan",
        query: "repo:microsoft/TypeScript is:issue label:Planning",
        TYPE: "ISSUE",
        link: `${BASE_URL}/typescript-iterator-plan.json`
    }
];
